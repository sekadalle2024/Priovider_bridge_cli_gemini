#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Serveur dédié pour Gemini API Key avec rotation
 * Ce serveur utilise UNIQUEMENT les clés API (pas OAuth)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const os = require('os');

// Configuration
const PORT = parseInt(process.env.AIONUI_PORT || process.env.PORT || '25808', 10);
const ALLOW_REMOTE = process.argv.includes('--remote') || process.env.AIONUI_ALLOW_REMOTE === 'true';
// Écouter sur 0.0.0.0 pour supporter IPv4 et IPv6 (fix pour n8n)
const HOST = '0.0.0.0';

// Créer l'application Express
const app = express();

// Middleware de base
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS
const allowedOrigins = [
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`,
];

if (ALLOW_REMOTE) {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const netInfo = nets[name];
    if (!netInfo) continue;
    for (const net of netInfo) {
      if (net.family === 'IPv4' && !net.internal) {
        allowedOrigins.push(`http://${net.address}:${PORT}`);
      }
    }
  }
}

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  }
}));

// Charger les clés API depuis .env
function loadApiKeys() {
  const keys = [];
  const envKeys = Object.keys(process.env).filter(key => 
    key.startsWith('GEMINI_API_KEY_')
  );

  for (const envKey of envKeys) {
    const apiKey = process.env[envKey];
    if (apiKey && apiKey.trim()) {
      keys.push(apiKey.trim());
    }
  }

  return keys;
}

// Service de rotation simple
class SimpleRotationService {
  constructor(keys) {
    this.keys = keys;
    this.currentIndex = 0;
    this.usage = keys.map(() => ({
      requestsThisMinute: 0,
      lastReset: Date.now()
    }));
  }

  getNextKey() {
    const now = Date.now();
    
    // Réinitialiser les compteurs si nécessaire
    this.usage.forEach((u, i) => {
      if (now - u.lastReset >= 60000) {
        u.requestsThisMinute = 0;
        u.lastReset = now;
      }
    });

    // Trouver une clé disponible
    let attempts = 0;
    while (attempts < this.keys.length * 2) {
      const usage = this.usage[this.currentIndex];
      
      if (usage.requestsThisMinute < 5) {
        const key = this.keys[this.currentIndex];
        usage.requestsThisMinute++;
        
        console.log(`[Rotation] Using key ${this.currentIndex + 1}/${this.keys.length} (${usage.requestsThisMinute}/5 req/min)`);
        
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        return key;
      }
      
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      attempts++;
    }
    
    throw new Error('All API keys have reached their rate limits. Please wait 1 minute.');
  }

  getStats() {
    const now = Date.now();
    return {
      totalKeys: this.keys.length,
      usage: this.usage.map((u, i) => {
        if (now - u.lastReset >= 60000) {
          return { index: i, requestsThisMinute: 0, available: true };
        }
        return {
          index: i,
          requestsThisMinute: u.requestsThisMinute,
          available: u.requestsThisMinute < 5
        };
      })
    };
  }
}

// Initialiser le service de rotation
const apiKeys = loadApiKeys();
if (apiKeys.length === 0) {
  console.error('❌ No API keys found in .env file!');
  console.error('   Please add GEMINI_API_KEY_* variables to .env');
  process.exit(1);
}

const rotationService = new SimpleRotationService(apiKeys);

// Charger la documentation Swagger
const { swaggerSpec, getSwaggerHTML } = require('./swagger-api-key');

// Routes de documentation
app.get('/docs', (req, res) => {
  res.send(getSwaggerHTML());
});

app.get('/openapi.json', (req, res) => {
  res.json(swaggerSpec);
});

// Routes API

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    provider: 'gemini_api_key_rotative',
    keysLoaded: apiKeys.length
  });
});

// Stats
app.get('/api/stats', (req, res) => {
  const stats = rotationService.getStats();
  res.json({
    ...stats,
    availableKeys: stats.usage.filter(u => u.available).length
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, stream = false, model, options } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    // Obtenir une clé API
    const apiKey = rotationService.getNextKey();
    
    // Utiliser l'API Gemini directement
    const { GoogleGenAI } = require('@google/genai');
    const client = new GoogleGenAI({ apiKey });
    const modelName = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    
    // Préparer le contenu
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    // Générer la réponse
    const result = await client.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: options?.temperature || 0.7,
        maxOutputTokens: options?.max_tokens,
      },
    });

    // Extraire le texte de la réponse
    let text = '';
    if (result && result.response) {
      text = result.response.text();
    } else if (result && result.candidates && result.candidates[0]) {
      // Fallback pour une structure différente
      const candidate = result.candidates[0];
      if (candidate.content && candidate.content.parts) {
        text = candidate.content.parts.map(p => p.text).join('');
      }
    } else {
      throw new Error('Invalid response structure from Gemini API');
    }

    res.json({
      model: modelName,
      provider: 'gemini_api_key_rotative',
      created_at: new Date().toISOString(),
      message: {
        role: 'assistant',
        content: text,
      },
      done: true,
      keyUsed: `Key ${rotationService.currentIndex}/${apiKeys.length}`
    });

  } catch (error) {
    console.error('[API] Error:', error);
    console.error('[API] Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({
      error: error.message || 'Internal server error',
      provider: 'gemini_api_key_rotative'
    });
  }
});

// Generate endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, stream = false, model, options } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Convertir en format chat
    req.body.messages = [{ role: 'user', content: prompt }];
    
    // Réutiliser le endpoint chat
    return app._router.handle(req, res);

  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
      provider: 'gemini_api_key_rotative'
    });
  }
});

// OpenAI compatible endpoint - pour LangChain/n8n
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens, stream } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ 
        error: { 
          message: 'No messages provided', 
          type: 'invalid_request_error' 
        }
      });
    }

    // Obtenir une clé API
    const apiKey = rotationService.getNextKey();
    
    // Utiliser l'API Gemini
    const { GoogleGenAI } = require('@google/genai');
    const client = new GoogleGenAI({ apiKey });
    const modelName = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    
    // Préparer le contenu
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    // Générer la réponse
    const result = await client.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: temperature || 0.7,
        maxOutputTokens: max_tokens,
      },
    });

    // Extraire le texte
    let text = '';
    if (result && result.response) {
      text = result.response.text();
    } else if (result && result.candidates && result.candidates[0]) {
      const candidate = result.candidates[0];
      if (candidate.content && candidate.content.parts) {
        text = candidate.content.parts.map(p => p.text).join('');
      }
    } else {
      throw new Error('Invalid response structure from Gemini API');
    }

    // Format OpenAI
    res.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: modelName,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: text
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      },
      provider: 'gemini_api_key_rotative',
      keyUsed: `Key ${rotationService.currentIndex}/${apiKeys.length}`
    });

  } catch (error) {
    console.error('[OpenAI API] Error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Internal server error',
        type: 'api_error',
        provider: 'gemini_api_key_rotative'
      }
    });
  }
});

// Liste des modèles (OpenAI compatible)
app.get('/v1/models', (req, res) => {
  res.json({
    object: 'list',
    data: [
      {
        id: 'gemini-2.5-flash',
        object: 'model',
        created: 1677610602,
        owned_by: 'google',
        permission: [],
        root: 'gemini-2.5-flash',
        parent: null
      },
      {
        id: 'gemini-1.5-flash',
        object: 'model',
        created: 1677610602,
        owned_by: 'google',
        permission: [],
        root: 'gemini-1.5-flash',
        parent: null
      },
      {
        id: 'gemini-1.5-pro',
        object: 'model',
        created: 1677610602,
        owned_by: 'google',
        permission: [],
        root: 'gemini-1.5-pro',
        parent: null
      }
    ]
  });
});

// Version
app.get('/api/version', (req, res) => {
  res.json({
    version: '1.9.0',
    api: 'gemini-api-key-rotative',
    provider: 'gemini_api_key_rotative',
    keysLoaded: apiKeys.length
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'Gemini API Key Rotative Server',
    version: '1.9.0',
    provider: 'gemini_api_key_rotative',
    keysLoaded: apiKeys.length,
    endpoints: {
      chat: 'POST /api/chat',
      generate: 'POST /api/generate',
      stats: 'GET /api/stats',
      version: 'GET /api/version',
      health: 'GET /health',
      openai_chat: 'POST /v1/chat/completions',
      openai_models: 'GET /v1/models'
    },
    compatibility: {
      ollama: 'Use /api/chat or /api/generate',
      openai: 'Use /v1/chat/completions',
      langchain: 'Use /v1/chat/completions with OpenAI credentials',
      n8n: 'Use /v1/chat/completions with OpenAI Chat Model node'
    },
    note: 'This server uses ONLY API keys with rotation (no OAuth)'
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    provider: 'gemini_api_key_rotative'
  });
});

// Démarrer le serveur
const server = app.listen(PORT, HOST, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Gemini API Key Rotative Server Started!');
  console.log('='.repeat(70));
  console.log(`\n📍 Server listening on:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  
  if (ALLOW_REMOTE) {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      const netInfo = nets[name];
      if (!netInfo) continue;
      for (const net of netInfo) {
        if (net.family === 'IPv4' && !net.internal) {
          console.log(`   Network: http://${net.address}:${PORT}`);
        }
      }
    }
  }
  
  console.log(`\n🔑 API Keys Configuration:`);
  console.log(`   Total Keys: ${apiKeys.length}`);
  console.log(`   Capacity: ${apiKeys.length * 5} requests/minute`);
  console.log(`   Provider: gemini_api_key_rotative (ONLY)`);
  
  console.log(`\n🔗 API Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/chat`);
  console.log(`   POST http://localhost:${PORT}/api/generate`);
  console.log(`   GET  http://localhost:${PORT}/api/stats`);
  console.log(`   GET  http://localhost:${PORT}/api/version`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  
  console.log(`\n🤖 OpenAI Compatible Endpoints (for LangChain/n8n):`);
  console.log(`   POST http://localhost:${PORT}/v1/chat/completions`);
  console.log(`   GET  http://localhost:${PORT}/v1/models`);
  
  console.log(`\n💡 Tips:`);
  console.log(`   - Documentation Swagger: http://localhost:${PORT}/docs`);
  console.log(`   - OpenAPI Spec: http://localhost:${PORT}/openapi.json`);
  console.log(`   - Test: curl http://localhost:${PORT}/health`);
  console.log(`   - Stats: curl http://localhost:${PORT}/api/stats`);
  console.log(`   - Stop: Press Ctrl+C`);
  console.log(`\n⚠️  Note: This server uses ONLY API keys (no OAuth)`);
  console.log('='.repeat(70) + '\n');
});

// Gestion de l'arrêt propre
const shutdown = () => {
  console.log('\n\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.log('⚠️  Forcing shutdown...');
    process.exit(1);
  }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
