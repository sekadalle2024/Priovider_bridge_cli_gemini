import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement en premier
dotenv.config();

// Import des services et routes (conditionnels)
import { getEnabledProviders, getProviderConfig, getOpenAIEndpoints } from './config/providers.js';

const app: Express = express();
const PORT = process.env.PORT || 25808;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: getEnabledProviders().map(p => ({
      name: p.name,
      displayName: p.displayName,
      type: p.type,
      features: p.features
    }))
  });
});

// Liste des providers disponibles
app.get('/api/providers', (req: Request, res: Response) => {
  const providers = getEnabledProviders();
  res.json({
    providers: providers.map(p => ({
      name: p.name,
      displayName: p.displayName,
      type: p.type,
      endpoints: p.endpoints,
      features: p.features,
      rateLimit: p.rateLimit
    })),
    openaiEndpoints: getOpenAIEndpoints()
  });
});

// Initialisation des services
async function initializeServices() {
  console.log('🚀 Initialisation des services...');

  // Initialiser Kiro CLI si activé
  if (process.env.KIRO_CLI_ENABLED === 'true') {
    try {
      // Import dynamique de Kiro CLI
      const { initializeKiroCliService } = await import('./services/KiroCliService');
      
      const kiroCliPath = process.env.KIRO_CLI_PATH || '/usr/local/bin/kiro';
      const workspace = process.env.KIRO_CLI_WORKSPACE || process.cwd();
      const model = process.env.KIRO_CLI_MODEL || 'claude-3-5-sonnet';
      const timeout = parseInt(process.env.KIRO_CLI_TIMEOUT || '300000');

      const kiroService = initializeKiroCliService({
        cliPath: kiroCliPath,
        workspace,
        model,
        timeout
      });

      const available = await kiroService.checkAvailability();
      if (available) {
        console.log('✅ Kiro CLI initialisé avec succès');
        const status = await kiroService.getStatus();
        console.log(`   Version: ${status.version}`);
        console.log(`   Model: ${status.model}`);
        console.log(`   Workspace: ${status.workspace}`);
      } else {
        console.warn('⚠️  Kiro CLI non disponible - vérifier l\'installation');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de Kiro CLI:', error.message);
    }
  }

  console.log('✅ Services initialisés');
}

// Routes des providers (import dynamique si Kiro CLI est activé)
if (process.env.KIRO_CLI_ENABLED === 'true') {
  import('./routes/kiroCliRoutes').then(module => {
    app.use('/api/kiro-cli', module.default);
    app.use('/v1/kiro-cli', module.default);
    console.log('✅ Routes Kiro CLI chargées');
  }).catch(error => {
    console.warn('⚠️  Routes Kiro CLI non disponibles:', error.message);
  });
}

// Routes multi-provider (si elles existent)
import('./routes/multiProviderRoutes').then(module => {
  app.use('/api', module.default);
  console.log('✅ Routes multi-provider chargées');
}).catch(error => {
  console.log('ℹ️  Routes multi-provider non disponibles');
});

// Documentation
app.get('/', (req: Request, res: Response) => {
  const providers = getEnabledProviders();
  
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
        .providers {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .provider-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s;
        }
        .provider-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
        .provider-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        .provider-type {
          display: inline-block;
          background: #f3f4f6;
          color: #6b7280;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        .features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .feature {
          background: #ede9fe;
          color: #7c3aed;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
        }
        .endpoints {
          margin-top: 2rem;
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
        .links {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        .link {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }
        .link:hover {
          background: #5568d3;
          transform: translateY(-2px);
        }
        .footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 AionUI Multi-Provider API</h1>
        <p class="subtitle">Serveur unifié pour Gemini CLI, Kiro CLI, et Gemini API Key</p>
        <div class="status">✅ Serveur actif</div>

        <h2 style="margin-top: 2rem; margin-bottom: 1rem; color: #1f2937;">Providers disponibles</h2>
        <div class="providers">
          ${providers.map(p => `
            <div class="provider-card">
              <div class="provider-name">${p.displayName}</div>
              <span class="provider-type">${p.type.toUpperCase()}</span>
              <div class="features">
                ${p.features.map(f => `<span class="feature">${f}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <h2 style="margin-top: 2rem; margin-bottom: 1rem; color: #1f2937;">Endpoints principaux</h2>
        <div class="endpoints">
          <div class="endpoint">
            <span class="method">GET</span> /health - Health check
          </div>
          <div class="endpoint">
            <span class="method">GET</span> /api/providers - Liste des providers
          </div>
          ${providers.map(p => `
            <div class="endpoint">
              <span class="method">POST</span> ${p.endpoints.chat} - Chat ${p.displayName}
            </div>
            <div class="endpoint">
              <span class="method">POST</span> ${p.endpoints.openai} - OpenAI compatible
            </div>
          `).join('')}
        </div>

        <div class="links">
          <a href="/api/providers" class="link">📋 API Providers</a>
          <a href="/health" class="link">💚 Health Check</a>
        </div>

        <div class="footer">
          <p>AionUI Multi-Provider Server v1.0.0</p>
          <p style="margin-top: 0.5rem;">Port: ${PORT}</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Gestion des erreurs 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: {
      health: '/health',
      providers: '/api/providers',
      kiro_cli: {
        chat: '/api/kiro-cli/chat',
        generate: '/api/kiro-cli/generate',
        status: '/api/kiro-cli/status',
        openai: '/v1/kiro-cli/chat/completions'
      }
    }
  });
});

// Gestion des erreurs globales
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    await initializeServices();

    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('🚀 AionUI Multi-Provider API Server');
      console.log('='.repeat(60));
      console.log(`📡 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`🌐 Documentation: http://localhost:${PORT}`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Providers: http://localhost:${PORT}/api/providers`);
      console.log('='.repeat(60));
      console.log('\n✅ Providers activés:');
      
      const providers = getEnabledProviders();
      providers.forEach(p => {
        console.log(`   • ${p.displayName} (${p.type})`);
        console.log(`     Chat: ${p.endpoints.chat}`);
        console.log(`     OpenAI: ${p.endpoints.openai}`);
      });
      
      console.log('\n' + '='.repeat(60) + '\n');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  process.exit(0);
});

// Démarrer le serveur
startServer();

export default app;
