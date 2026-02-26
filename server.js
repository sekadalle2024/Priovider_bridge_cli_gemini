#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Serveur Web Standalone pour l'API Gemini CLI
 * Standalone Web Server for Gemini CLI API
 * 
 * Usage:
 *   node server.js
 *   node server.js --port 8080
 *   node server.js --remote
 *   GEMINI_API_KEY=your_key node server.js
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Configuration
const PORT = parseInt(process.env.AIONUI_PORT || process.env.PORT || '25808', 10);
const ALLOW_REMOTE = process.argv.includes('--remote') || process.env.AIONUI_ALLOW_REMOTE === 'true';
const HOST = ALLOW_REMOTE ? '0.0.0.0' : '127.0.0.1';

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
  // Ajouter l'IP locale
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

// Routes de l'API Gemini (avec support multi-provider intégré)
const geminiApiRoutes = require('./dist/gemini-api-routes');
app.use('/api', geminiApiRoutes);

// Documentation API
const { openApiSpec, getSwaggerHTML } = require('./dist/api-docs');

app.get('/docs', (req, res) => {
  res.send(getSwaggerHTML());
});

app.get('/openapi.json', (req, res) => {
  res.json(openApiSpec);
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    name: 'AionUi Multi-Provider API Server',
    version: '1.9.0',
    providers: {
      gemini_cli: {
        description: 'Gemini CLI with Google OAuth',
        endpoints: {
          chat: 'POST /api/gemini_cli/chat',
          generate: 'POST /api/gemini_cli/generate',
        }
      },
      gemini_api_key_rotative: {
        description: 'Gemini API with automatic key rotation',
        endpoints: {
          chat: 'POST /api/gemini_api_key_rotative/chat',
          generate: 'POST /api/gemini_api_key_rotative/generate',
          stats: 'GET /api/gemini_api_key_rotative/stats',
        }
      },
      kiro_cli: {
        description: 'Kiro CLI (coming soon)',
        endpoints: {
          chat: 'POST /api/kiro_cli/chat',
          generate: 'POST /api/kiro_cli/generate',
        }
      }
    },
    common_endpoints: {
      providers: 'GET /api/providers',
      tags: 'GET /api/tags',
      version: 'GET /api/version',
      health: 'GET /health',
    },
    legacy_endpoints: {
      chat: 'POST /api/chat (uses Gemini CLI)',
      generate: 'POST /api/generate (uses Gemini CLI)',
    },
    documentation: {
      interactive: `http://localhost:${PORT}/docs`,
      openapi: `http://localhost:${PORT}/openapi.json`,
      github: 'https://github.com/iOfficeAI/AionUi'
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
  });
});

// Démarrer le serveur
const server = app.listen(PORT, HOST, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 AionUi Multi-Provider API Server Started!');
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
  
  console.log(`\n🤖 Available Providers:`);
  console.log(`   1. Gemini CLI (Google OAuth)`);
  console.log(`      - POST /api/gemini_cli/chat`);
  console.log(`      - POST /api/gemini_cli/generate`);
  console.log(`   2. Gemini API Key Rotative (${process.env.GEMINI_API_KEY_OHADA_FINANCE_A ? '✓' : '✗'} Configured)`);
  console.log(`      - POST /api/gemini_api_key_rotative/chat`);
  console.log(`      - POST /api/gemini_api_key_rotative/generate`);
  console.log(`      - GET  /api/gemini_api_key_rotative/stats`);
  console.log(`   3. Kiro CLI (Coming Soon)`);
  console.log(`      - POST /api/kiro_cli/chat`);
  console.log(`      - POST /api/kiro_cli/generate`);
  
  console.log(`\n🔗 Common Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/providers`);
  console.log(`   GET  http://localhost:${PORT}/api/tags`);
  console.log(`   GET  http://localhost:${PORT}/api/version`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  
  console.log(`\n⚙️  Configuration:`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Remote Access: ${ALLOW_REMOTE ? 'Enabled' : 'Disabled'}`);
  console.log(`   Model: ${process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'}`);
  console.log(`   Gemini CLI OAuth: ${fs.existsSync(path.join(os.homedir(), '.gemini', 'oauth_creds.json')) ? '✓' : '✗'}`);
  console.log(`   API Keys Loaded: ${Object.keys(process.env).filter(k => k.startsWith('GEMINI_API_KEY_')).length}`);
  
  console.log(`\n💡 Tips:`);
  console.log(`   - Documentation: http://localhost:${PORT}/docs`);
  console.log(`   - OpenAPI Spec: http://localhost:${PORT}/openapi.json`);
  console.log(`   - Providers List: http://localhost:${PORT}/api/providers`);
  console.log(`   - Test: curl http://localhost:${PORT}/api/version`);
  console.log(`   - Docs: See src/webserver/gemini-api-docs/README.md`);
  console.log(`   - Stop: Press Ctrl+C`);
  console.log('\n' + '='.repeat(70) + '\n');
});

// Gestion de l'arrêt propre
const shutdown = () => {
  console.log('\n\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
  
  // Force l'arrêt après 5 secondes
  setTimeout(() => {
    console.log('⚠️  Forcing shutdown...');
    process.exit(1);
  }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
