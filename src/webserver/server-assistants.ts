/**
 * Serveur Express pour les assistants comme microservices
 * Démarre automatiquement avec l'application Electron ou en mode standalone
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { initializeAssistantService, getAssistantService } from './services/AssistantService';
import assistantRoutes from './routes/assistantRoutes';
import { assistantSwaggerConfig } from './swagger/assistantSwagger';

// Charger les variables d'environnement
dotenv.config();

const app: Express = express();
const PORT = process.env.ASSISTANT_PORT || 25809;

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

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(assistantSwaggerConfig, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AionUI Assistants API'
}));

// Routes des assistants
app.use('/api', assistantRoutes);

// Page d'accueil avec liste des assistants
app.get('/', async (req: Request, res: Response) => {
  try {
    const service = getAssistantService();
    const assistants = await service.discoverAssistants();
    const geminiAvailable = await service.checkGeminiCli();

    res.send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AionUI Assistants API</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
          }
          .container {
            max-width: 1400px;
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
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: ${geminiAvailable ? '#10b981' : '#ef4444'};
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            margin-bottom: 2rem;
          }
          .assistants-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
          }
          .assistant-card {
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s;
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          }
          .assistant-card:hover {
            border-color: #667eea;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
            transform: translateY(-4px);
          }
          .assistant-name {
            font-size: 1.3rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }
          .assistant-desc {
            color: #6b7280;
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 1rem;
          }
          .assistant-endpoint {
            background: #f3f4f6;
            padding: 0.5rem;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            color: #4b5563;
            margin-bottom: 1rem;
          }
          .capabilities {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .capability {
            background: #ede9fe;
            color: #7c3aed;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
          }
          .links {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            flex-wrap: wrap;
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
          .link.secondary {
            background: #10b981;
          }
          .link.secondary:hover {
            background: #059669;
          }
          .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
          }
          .example {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 2rem 0;
          }
          .example h3 {
            color: #1f2937;
            margin-bottom: 1rem;
          }
          .code {
            background: #1f2937;
            color: #10b981;
            padding: 1rem;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 AionUI Assistants API</h1>
          <p class="subtitle">Microservices pour tous les assistants avec Gemini CLI</p>
          <div class="status">
            ${geminiAvailable ? '✅' : '❌'} Gemini CLI ${geminiAvailable ? 'disponible' : 'non disponible'}
          </div>

          <h2 style="margin-top: 2rem; margin-bottom: 1rem; color: #1f2937;">
            ${assistants.length} Assistants disponibles
          </h2>

          <div class="assistants-grid">
            ${assistants.map(a => `
              <div class="assistant-card">
                <div class="assistant-name">${a.displayName}</div>
                <div class="assistant-desc">${a.description || 'Aucune description'}</div>
                <div class="assistant-endpoint">POST ${a.endpoint}</div>
                ${a.capabilities.length > 0 ? `
                  <div class="capabilities">
                    ${a.capabilities.slice(0, 5).map(c => `<span class="capability">${c}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <div class="example">
            <h3>📝 Exemple d'utilisation</h3>
            <div class="code">
curl -X POST http://localhost:${PORT}/api/assistant/cowork \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Organise les fichiers de mon dossier Downloads",
    "model": "gemini-2.0-flash-exp",
    "context": {
      "workspace": "/Users/me/Downloads"
    }
  }'
            </div>
          </div>

          <div class="links">
            <a href="/api-docs" class="link">📚 Documentation Swagger</a>
            <a href="/api/assistants" class="link secondary">📋 API JSON</a>
            <a href="/api/assistant/health" class="link secondary">💚 Health Check</a>
          </div>

          <div class="footer">
            <p>AionUI Assistants Microservices v1.0.0</p>
            <p style="margin-top: 0.5rem;">Port: ${PORT} | Assistants: ${assistants.length}</p>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Erreur lors du chargement des assistants');
  }
});

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    const service = getAssistantService();
    const geminiAvailable = await service.checkGeminiCli();
    const assistants = await service.discoverAssistants();

    res.json({
      status: 'ok',
      geminiCli: geminiAvailable ? 'available' : 'unavailable',
      assistantsCount: assistants.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Gestion des erreurs 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: {
      home: '/',
      docs: '/api-docs',
      assistants: '/api/assistants',
      health: '/health'
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

// Initialisation et démarrage
async function startServer() {
  try {
    // Initialiser le service des assistants
    const assistantsPath = process.env.ASSISTANTS_PATH || path.join(process.cwd(), 'assistant');
    const geminiCliPath = process.env.GEMINI_CLI_PATH || 'gemini';
    const defaultModel = process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash-exp';

    initializeAssistantService(assistantsPath, geminiCliPath, defaultModel);

    const service = getAssistantService();
    const assistants = await service.discoverAssistants();
    const geminiAvailable = await service.checkGeminiCli();

    console.log('\n' + '='.repeat(60));
    console.log('🤖 AionUI Assistants Microservices API');
    console.log('='.repeat(60));
    console.log(`📡 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log('='.repeat(60));
    console.log(`\n✅ Gemini CLI: ${geminiAvailable ? 'Disponible' : 'Non disponible'}`);
    console.log(`📦 ${assistants.length} assistants découverts:\n`);

    assistants.forEach(a => {
      console.log(`   • ${a.displayName}`);
      console.log(`     Endpoint: POST ${a.endpoint}`);
      if (a.capabilities.length > 0) {
        console.log(`     Capacités: ${a.capabilities.slice(0, 3).join(', ')}${a.capabilities.length > 3 ? '...' : ''}`);
      }
      console.log('');
    });

    console.log('='.repeat(60) + '\n');

    app.listen(PORT, () => {
      console.log(`✅ Serveur prêt à recevoir des requêtes\n`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur des assistants...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur des assistants...');
  process.exit(0);
});

// Démarrer le serveur si exécuté directement
if (require.main === module) {
  startServer();
}

export default app;
export { startServer };
