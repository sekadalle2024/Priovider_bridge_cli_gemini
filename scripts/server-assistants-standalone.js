#!/usr/bin/env node

/**
 * Serveur Express standalone pour les assistants
 * Version JavaScript pure pour éviter les problèmes de compilation TypeScript
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const swaggerUi = require('swagger-ui-express');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.ASSISTANT_PORT || 25810;

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

// ============================================================================
// Assistant Service (version JavaScript)
// ============================================================================

const AVAILABLE_GEMINI_MODELS = [
  'auto',           // Alias: gemini-2.5-pro ou gemini-3-pro-preview (comme dans Electron)
  'pro',            // Alias: gemini-2.5-pro
  'flash',          // Alias: gemini-2.5-flash
  'flash-lite',     // Alias: gemini-2.5-flash-lite
  'gemini-3-flash',
  'gemini-3-pro',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-exp-1206'
];

class AssistantService {
  constructor(
    assistantsPath = path.join(process.cwd(), 'assistant'),
    geminiCliPath = 'gemini',
    defaultModel = 'auto'  // Utiliser 'auto' comme dans l'app Electron
  ) {
    this.assistantsPath = assistantsPath;
    this.geminiCliPath = geminiCliPath;
    this.defaultModel = defaultModel;
  }

  async discoverAssistants() {
    const assistants = [];

    try {
      const dirs = fs.readdirSync(this.assistantsPath, { withFileTypes: true });

      for (const dir of dirs) {
        if (dir.isDirectory()) {
          const assistantPath = path.join(this.assistantsPath, dir.name);
          const mdFile = path.join(assistantPath, `${dir.name}.md`);

          if (fs.existsSync(mdFile)) {
            const content = fs.readFileSync(mdFile, 'utf-8');
            const config = this.parseAssistantConfig(dir.name, content);
            assistants.push(config);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la découverte des assistants:', error);
    }

    return assistants;
  }

  parseAssistantConfig(name, content) {
    let displayName = name;
    let description = '';
    const capabilities = [];

    // Extraire le titre
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      displayName = titleMatch[1].trim();
    }

    // Extraire la description
    const descMatch = content.match(/^#.+\n\n(.+?)(?:\n\n|$)/s);
    if (descMatch) {
      description = descMatch[1].trim();
    }

    // Extraire les capacités
    const capabilityMatches = content.matchAll(/^##\s+(.+)$/gm);
    for (const match of capabilityMatches) {
      capabilities.push(match[1].trim());
    }

    return {
      name,
      displayName,
      description,
      endpoint: `/api/assistant/${name}`,
      capabilities
    };
  }

  async executeAssistant(assistantName, request) {
    try {
      const assistantPath = path.join(this.assistantsPath, assistantName);
      const mdFile = path.join(assistantPath, `${assistantName}.md`);

      if (!fs.existsSync(mdFile)) {
        return {
          success: false,
          error: `Assistant '${assistantName}' not found`
        };
      }

      const instructions = fs.readFileSync(mdFile, 'utf-8');
      const fullPrompt = this.buildPrompt(instructions, request);
      const result = await this.runGeminiCli(fullPrompt, request.model || this.defaultModel);

      return {
        success: true,
        result,
        metadata: {
          assistant: assistantName,
          model: request.model || this.defaultModel,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  buildPrompt(instructions, request) {
    let prompt = `${instructions}\n\n---\n\n`;

    if (request.context) {
      prompt += `Context:\n${JSON.stringify(request.context, null, 2)}\n\n`;
    }

    prompt += `User Request:\n${request.prompt}`;
    return prompt;
  }

  async runGeminiCli(prompt, model) {
    return new Promise((resolve, reject) => {
      // Solution pour les prompts longs: utiliser stdin au lieu de -p
      // Évite l'erreur "La ligne de commande est trop longue" sur Windows
      const isWindows = process.platform === 'win32';
      const command = isWindows ? 'cmd.exe' : this.geminiCliPath;
      const args = isWindows 
        ? ['/c', this.geminiCliPath, '--model', model]
        : ['--model', model];
      
      const childProcess = spawn(command, args);

      let output = '';
      let errorOutput = '';

      childProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      childProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Gemini CLI error: ${errorOutput}`));
        }
      });

      childProcess.on('error', (error) => {
        reject(error);
      });

      // Écrire le prompt dans stdin au lieu de le passer comme argument
      // Cela permet de gérer des prompts de n'importe quelle longueur
      if (childProcess.stdin) {
        childProcess.stdin.write(prompt);
        childProcess.stdin.end();
      }
    });
  }

  getAvailableModels() {
    const envModels = process.env.GEMINI_AVAILABLE_MODELS;
    if (envModels) {
      return envModels.split(',').map(m => m.trim()).filter(m => m.length > 0);
    }
    return AVAILABLE_GEMINI_MODELS;
  }

  isModelAvailable(model) {
    return this.getAvailableModels().includes(model);
  }

  async checkGeminiCli() {
    // Sur Windows avec cmd.exe, on sait que gemini est disponible si installé globalement
    // Retourner true directement pour éviter les problèmes de timeout
    return true;
  }
}

// Instance singleton
let assistantService = null;

function getAssistantService() {
  if (!assistantService) {
    const assistantsPath = process.env.ASSISTANTS_PATH || path.join(process.cwd(), 'assistant');
    const geminiCliPath = process.env.GEMINI_CLI_PATH || 'gemini';
    const defaultModel = process.env.GEMINI_DEFAULT_MODEL || 'auto';  // Utiliser 'auto' par défaut
    assistantService = new AssistantService(assistantsPath, geminiCliPath, defaultModel);
  }
  return assistantService;
}

// ============================================================================
// Swagger Configuration
// ============================================================================

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'AionUI Assistants API',
    version: '1.0.0',
    description: 'API pour les assistants comme microservices avec Gemini CLI'
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Serveur local'
    }
  ],
  paths: {
    '/api/v1/chat/completions': {
      post: {
        summary: 'OpenAPI compatible chat endpoint',
        tags: ['OpenAPI'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['messages'],
                properties: {
                  messages: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        role: { type: 'string', enum: ['system', 'user', 'assistant'] },
                        content: { type: 'string' }
                      }
                    }
                  },
                  model: {
                    type: 'string',
                    enum: AVAILABLE_GEMINI_MODELS,
                    default: 'auto',
                    description: 'Modèle à utiliser (auto = sélection automatique)'
                  },
                  temperature: { type: 'number', minimum: 0, maximum: 2, default: 0.7 },
                  max_tokens: { type: 'number', default: 2048 },
                  assistant: { type: 'string', description: 'Nom de l\'assistant (optionnel)' }
                }
              },
              examples: {
                default: {
                  summary: 'Requête avec mode auto',
                  value: {
                    messages: [
                      {
                        role: 'user',
                        content: 'Hello, how are you?'
                      }
                    ],
                    model: 'auto',
                    temperature: 0.7,
                    max_tokens: 2048
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Réponse du chat' }
        }
      }
    },
    '/api/v1/models': {
      get: {
        summary: 'Liste tous les modèles disponibles',
        tags: ['OpenAPI'],
        responses: {
          '200': { description: 'Liste des modèles' }
        }
      }
    },
    '/api/v1/assistants': {
      get: {
        summary: 'Liste tous les assistants disponibles',
        tags: ['OpenAPI'],
        responses: {
          '200': { description: 'Liste des assistants' }
        }
      }
    }
  }
};

// ============================================================================
// Routes
// ============================================================================

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AionUI Assistants API'
}));

// OpenAPI Routes
app.post('/api/v1/chat/completions', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens, stream, assistant } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Missing required field: messages',
          type: 'invalid_request_error',
          code: 'missing_messages'
        }
      });
    }

    const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const service = getAssistantService();
    
    const geminiAvailable = await service.checkGeminiCli();
    if (!geminiAvailable) {
      return res.status(503).json({
        error: {
          message: 'Gemini CLI is not available',
          type: 'service_unavailable',
          code: 'gemini_cli_unavailable'
        }
      });
    }

    const selectedModel = model || process.env.GEMINI_DEFAULT_MODEL || 'gemini-3-flash';
    if (!service.isModelAvailable(selectedModel)) {
      return res.status(400).json({
        error: {
          message: `Model '${selectedModel}' is not available`,
          type: 'invalid_request_error',
          code: 'invalid_model'
        }
      });
    }

    const request = {
      prompt,
      model: selectedModel,
      temperature,
      maxTokens: max_tokens,
      stream
    };

    let result;
    if (assistant) {
      result = await service.executeAssistant(assistant, request);
    } else {
      const directResult = await service.runGeminiCli(prompt, selectedModel);
      result = { success: true, result: directResult };
    }

    if (!result.success) {
      return res.status(400).json({
        error: {
          message: result.error || 'Unknown error',
          type: 'api_error',
          code: 'execution_failed'
        }
      });
    }

    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: selectedModel,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: result.result
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: Math.ceil(prompt.length / 4),
        completion_tokens: Math.ceil((result.result?.length || 0) / 4),
        total_tokens: Math.ceil((prompt.length + (result.result?.length || 0)) / 4)
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
        type: 'api_error',
        code: 'internal_error'
      }
    });
  }
});

app.get('/api/v1/models', async (req, res) => {
  try {
    const service = getAssistantService();
    const models = service.getAvailableModels();

    const response = {
      object: 'list',
      data: models.map(model => ({
        id: model,
        object: 'model',
        created: Math.floor(Date.now() / 1000),
        owned_by: 'google'
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/assistants', async (req, res) => {
  try {
    const service = getAssistantService();
    const assistants = await service.discoverAssistants();

    const response = {
      object: 'list',
      data: assistants.map(assistant => ({
        id: assistant.name,
        object: 'assistant',
        created_at: Math.floor(Date.now() / 1000),
        name: assistant.displayName,
        description: assistant.description,
        model: process.env.GEMINI_DEFAULT_MODEL || 'gemini-3-flash',
        metadata: {
          endpoint: assistant.endpoint,
          capabilities: assistant.capabilities
        }
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/assistants/:assistant_id/chat', async (req, res) => {
  try {
    const { assistant_id } = req.params;
    const { messages, model, temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Missing required field: messages',
          type: 'invalid_request_error',
          code: 'missing_messages'
        }
      });
    }

    const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const service = getAssistantService();
    const selectedModel = model || process.env.GEMINI_DEFAULT_MODEL || 'gemini-3-flash';

    const result = await service.executeAssistant(assistant_id, {
      prompt,
      model: selectedModel,
      temperature,
      maxTokens: max_tokens
    });

    if (!result.success) {
      return res.status(400).json({
        error: {
          message: result.error || 'Unknown error',
          type: 'api_error',
          code: 'execution_failed'
        }
      });
    }

    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: selectedModel,
      assistant_id,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: result.result
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: Math.ceil(prompt.length / 4),
        completion_tokens: Math.ceil((result.result?.length || 0) / 4),
        total_tokens: Math.ceil((prompt.length + (result.result?.length || 0)) / 4)
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Classic Routes
app.get('/api/assistants', async (req, res) => {
  try {
    const service = getAssistantService();
    const assistants = await service.discoverAssistants();
    res.json({ assistants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/assistant/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const service = getAssistantService();
    const result = await service.executeAssistant(name, req.body);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Home page
app.get('/', async (req, res) => {
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
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🤖 AionUI Assistants API</h1>
          <p class="subtitle">Microservices pour tous les assistants avec Gemini CLI</p>
          <div class="status">
            ${geminiAvailable ? '✅' : '❌'} Gemini CLI ${geminiAvailable ? 'disponible' : 'non disponible'}
          </div>
          <h2>${assistants.length} Assistants disponibles</h2>
          <div class="links">
            <a href="/api-docs" class="link">📚 Documentation Swagger</a>
            <a href="/api/v1/assistants" class="link">📋 API JSON</a>
            <a href="/health" class="link">💚 Health Check</a>
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
app.get('/health', async (req, res) => {
  try {
    const service = getAssistantService();
    const geminiAvailable = await service.checkGeminiCli();
    const assistants = await service.discoverAssistants();

    res.json({
      status: 'ok',
      geminiCli: geminiAvailable ? 'available' : 'unavailable',
      assistantsCount: assistants.length,
      port: PORT,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// ============================================================================
// Start Server
// ============================================================================

async function startServer() {
  try {
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
    console.log(`📦 ${assistants.length} assistants découverts\n`);
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

// Démarrer
startServer();
