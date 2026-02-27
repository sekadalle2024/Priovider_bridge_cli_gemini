#!/usr/bin/env node

/**
 * Serveur multi-provider simplifié (JavaScript pur)
 * Fonctionne avec Gemini CLI et Gemini API Key
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { getGeminiClient } = require('./gemini-api-client');

// Charger les variables d'environnement
dotenv.config();

// Initialiser le client Gemini
const geminiClient = getGeminiClient();

const app = express();
const PORT = process.env.PORT || 25808;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: [
      {
        name: 'gemini_api_key',
        displayName: 'Gemini API Key (Rotative)',
        enabled: true,
        type: 'api'
      }
    ]
  });
});

// Liste des providers disponibles
app.get('/api/providers', (req, res) => {
  const availableModels = (process.env.GEMINI_AVAILABLE_MODELS || 'gemini-2.5-flash,gemini-2.5-pro,gemini-1.5-flash,gemini-1.5-pro').split(',');
  
  res.json({
    providers: [
      {
        name: 'gemini_api_key',
        displayName: 'Gemini API Key (Rotative)',
        type: 'api',
        endpoints: {
          chat: '/api/gemini-api-key/chat',
          generate: '/api/gemini-api-key/generate',
          status: '/api/gemini-api-key/status',
          openai: '/v1/gemini-api-key/chat/completions'
        },
        features: ['chat', 'code-generation', 'streaming', 'key-rotation'],
        models: availableModels,
        defaultModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        rateLimit: {
          perMinute: parseInt(process.env.GEMINI_RATE_LIMIT_PER_MINUTE || '5'),
          perDay: parseInt(process.env.GEMINI_RATE_LIMIT_PER_DAY || '250000')
        }
      }
    ],
    openaiEndpoints: {
      gemini_api_key: '/v1/gemini-api-key/chat/completions'
    }
  });
});

// Endpoint OpenAI compatible pour lister les modèles (pour n8n)
app.get('/v1/models', (req, res) => {
  const availableModels = (process.env.GEMINI_AVAILABLE_MODELS || 'gemini-2.5-flash,gemini-2.5-pro,gemini-1.5-flash,gemini-1.5-pro').split(',');
  const timestamp = Math.floor(Date.now() / 1000);
  
  const models = availableModels.map(modelId => ({
    id: modelId,
    object: 'model',
    created: timestamp,
    owned_by: 'google',
    permission: [],
    root: modelId,
    parent: null
  }));

  res.json({
    object: 'list',
    data: models
  });
});

// Endpoint pour récupérer un modèle spécifique (pour n8n)
app.get('/v1/models/:model', (req, res) => {
  const modelId = req.params.model;
  const availableModels = (process.env.GEMINI_AVAILABLE_MODELS || 'gemini-2.5-flash,gemini-2.5-pro,gemini-1.5-flash,gemini-1.5-pro').split(',');
  
  if (!availableModels.includes(modelId)) {
    return res.status(404).json({
      error: {
        message: `Model '${modelId}' not found`,
        type: 'invalid_request_error',
        code: 'model_not_found'
      }
    });
  }

  res.json({
    id: modelId,
    object: 'model',
    created: Math.floor(Date.now() / 1000),
    owned_by: 'google',
    permission: [],
    root: modelId,
    parent: null
  });
});

// Endpoint OpenAI compatible pour le chat (pour n8n)
app.post('/v1/chat/completions', async (req, res) => {
  const { model, messages, temperature, max_tokens, stream } = req.body;

  // Log de la requête
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] POST /v1/chat/completions - Model: ${model}`);

  try {
    // Appeler l'API Gemini réelle avec rotation des clés
    const response = await geminiClient.chat(model || 'gemini-2.5-flash', messages, {
      temperature,
      max_tokens
    });

    res.json(response);
  } catch (error) {
    console.error('❌ Erreur lors de l\'appel à l\'API Gemini:', error.message);
    
    res.status(500).json({
      error: {
        message: error.message,
        type: 'api_error',
        code: 'gemini_api_error'
      }
    });
  }
});

// Page d'accueil
app.get('/', (req, res) => {
  const availableModels = (process.env.GEMINI_AVAILABLE_MODELS || 'gemini-2.5-flash,gemini-2.5-pro,gemini-1.5-flash,gemini-1.5-pro').split(',');
  const defaultModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AionUI Multi-Provider API Server</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 2rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
          color: #667eea;
          margin-bottom: 0.5rem;
          font-size: 2.5rem;
        }
        .subtitle {
          color: #666;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        .status {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 2rem;
        }
        .provider-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .provider-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        .models-section {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
        }
        .model-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          margin: 0.25rem;
        }
        .model-badge.default {
          background: #10b981;
        }
        .endpoint {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }
        .method {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
          margin-right: 0.5rem;
        }
        .link {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin-right: 1rem;
          margin-top: 1rem;
        }
        .link:hover {
          background: #5568d3;
        }
        .info-box {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 AionUI Multi-Provider API</h1>
        <p class="subtitle">Serveur API pour Gemini avec rotation automatique de clés</p>
        <div class="status">✅ Serveur actif</div>

        <h2 style="margin-top: 2rem; margin-bottom: 1rem; color: #1f2937;">Provider disponible</h2>
        
        <div class="provider-card">
          <div class="provider-name">Gemini API Key (Rotative)</div>
          <p style="color: #666; margin-bottom: 1rem;">27 clés API avec rotation automatique</p>
          
          <div class="models-section">
            <h3 style="margin-bottom: 0.5rem; font-size: 1rem;">Modèles disponibles :</h3>
            ${availableModels.map(model => 
              `<span class="model-badge ${model === defaultModel ? 'default' : ''}">${model}${model === defaultModel ? ' (défaut)' : ''}</span>`
            ).join('')}
          </div>

          <div class="info-box">
            <strong>💡 Comment utiliser un modèle spécifique :</strong><br>
            Ajoutez le paramètre <code>"model": "gemini-2.5-pro"</code> dans votre requête
          </div>
          
          <h3 style="margin-top: 1rem; margin-bottom: 0.5rem;">Endpoints</h3>
          <div class="endpoint">
            <span class="method">POST</span> /api/gemini-api-key/chat
          </div>
          <div class="endpoint">
            <span class="method">POST</span> /v1/gemini-api-key/chat/completions (OpenAI compatible)
          </div>
          <div class="endpoint">
            <span class="method">GET</span> /api/gemini-api-key/status
          </div>

          <h3 style="margin-top: 1.5rem; margin-bottom: 0.5rem;">Exemple de requête :</h3>
          <div class="endpoint" style="white-space: pre-wrap;">POST /v1/gemini-api-key/chat/completions
{
  "model": "gemini-2.5-pro",
  "messages": [
    {"role": "user", "content": "Hello"}
  ]
}</div>
        </div>

        <div>
          <a href="/api/providers" class="link">📋 API Providers</a>
          <a href="/health" class="link">💚 Health Check</a>
        </div>

        <div style="margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280;">
          <p>AionUI Multi-Provider Server v1.0.0</p>
          <p style="margin-top: 0.5rem;">Port: ${PORT}</p>
          <p style="margin-top: 0.5rem;">Modèles: ${availableModels.length} disponibles</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: {
      health: '/health',
      providers: '/api/providers'
    }
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 AionUI Multi-Provider API Server');
  console.log('='.repeat(60));
  console.log(`📡 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🌐 Documentation: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 Providers: http://localhost:${PORT}/api/providers`);
  console.log('='.repeat(60));
  console.log('\n✅ Serveur prêt à recevoir des requêtes\n');
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});
