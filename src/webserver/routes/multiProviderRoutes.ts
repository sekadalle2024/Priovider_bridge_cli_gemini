/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Express, Request, Response } from 'express';
import { TokenMiddleware } from '@/webserver/auth/middleware/TokenMiddleware';
import { apiRateLimiter } from '../middleware/security';
import { getGeminiApiService } from '../services/GeminiApiService';
import { getGeminiApiKeyService } from '../services/GeminiApiKeyService';
import type { TProviderWithModel } from '@/common/storage';
import path from 'path';
import os from 'os';

/**
 * Interface pour les requêtes de chat compatibles Ollama
 */
interface OllamaChatRequest {
  model?: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

/**
 * Interface pour les requêtes de génération compatibles Ollama
 */
interface OllamaGenerateRequest {
  model?: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

/**
 * Vérifier si les credentials Google OAuth existent
 */
function checkGoogleOAuthCredentials(): boolean {
  try {
    const fs = require('fs');
    const credentialsPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');
    if (!fs.existsSync(credentialsPath)) {
      return false;
    }
    const content = fs.readFileSync(credentialsPath, 'utf-8');
    const creds = JSON.parse(content);
    return !!(creds && (creds.access_token || creds.refresh_token));
  } catch {
    return false;
  }
}

/**
 * Initialiser le service Gemini CLI
 */
async function initializeGeminiCliService(): Promise<void> {
  const service = getGeminiApiService();
  
  const modelConfig: TProviderWithModel = {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    platform: 'google',
    useModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    apiKey: '',
    baseUrl: process.env.GOOGLE_GEMINI_BASE_URL || '',
  };

  await service.initialize({
    workspace: process.env.WORKSPACE_PATH || process.cwd(),
    model: modelConfig,
    proxy: process.env.HTTP_PROXY || process.env.HTTPS_PROXY,
    yoloMode: process.env.GEMINI_YOLO_MODE === 'true',
    mcpServers: {},
  });
}

/**
 * Enregistrer les routes multi-provider
 */
export function registerMultiProviderRoutes(app: Express): void {
  const validateApiAccess = TokenMiddleware.validateToken({ responseType: 'json' });

  // =============================================================================
  // GEMINI CLI ROUTES - Utilise l'authentification Google OAuth
  // =============================================================================

  /**
   * POST /api/gemini_cli/chat
   */
  app.post('/api/gemini_cli/chat', apiRateLimiter, validateApiAccess, async (req: Request, res: Response) => {
    try {
      const body = req.body as OllamaChatRequest;

      if (!body.messages || body.messages.length === 0) {
        res.status(400).json({ error: 'No messages provided' });
        return;
      }

      // Vérifier OAuth
      if (!checkGoogleOAuthCredentials()) {
        res.status(401).json({ 
          error: 'Google OAuth not configured. Please run: gemini auth login' 
        });
        return;
      }

      await initializeGeminiCliService();
      const service = getGeminiApiService();
      const stream = await service.chat(body.messages, {
        stream: body.stream ?? true,
        model: body.model,
        temperature: body.options?.temperature,
      });

      if (body.stream !== false) {
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');

        try {
          for await (const chunk of stream) {
            const response = {
              model: body.model || 'gemini-cli',
              provider: 'gemini_cli',
              created_at: new Date().toISOString(),
              message: { role: 'assistant', content: chunk },
              done: false,
            };
            res.write(JSON.stringify(response) + '\n');
          }

          res.write(JSON.stringify({
            model: body.model || 'gemini-cli',
            provider: 'gemini_cli',
            created_at: new Date().toISOString(),
            message: { role: 'assistant', content: '' },
            done: true,
          }) + '\n');
          res.end();
        } catch (error) {
          console.error('[GeminiCLI] Streaming error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Streaming failed' });
          }
        }
      } else {
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
        }

        res.json({
          model: body.model || 'gemini-cli',
          provider: 'gemini_cli',
          created_at: new Date().toISOString(),
          message: { role: 'assistant', content: fullResponse },
          done: true,
        });
      }
    } catch (error) {
      console.error('[GeminiCLI] Chat error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/gemini_cli/generate
   */
  app.post('/api/gemini_cli/generate', apiRateLimiter, validateApiAccess, async (req: Request, res: Response) => {
    try {
      const body = req.body as OllamaGenerateRequest;

      if (!body.prompt) {
        res.status(400).json({ error: 'No prompt provided' });
        return;
      }

      if (!checkGoogleOAuthCredentials()) {
        res.status(401).json({ 
          error: 'Google OAuth not configured. Please run: gemini auth login' 
        });
        return;
      }

      await initializeGeminiCliService();
      const service = getGeminiApiService();
      const stream = await service.generate(body.prompt, {
        stream: body.stream ?? true,
        model: body.model,
        temperature: body.options?.temperature,
      });

      if (body.stream !== false) {
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');

        try {
          for await (const chunk of stream) {
            res.write(JSON.stringify({
              model: body.model || 'gemini-cli',
              provider: 'gemini_cli',
              created_at: new Date().toISOString(),
              response: chunk,
              done: false,
            }) + '\n');
          }

          res.write(JSON.stringify({
            model: body.model || 'gemini-cli',
            provider: 'gemini_cli',
            created_at: new Date().toISOString(),
            response: '',
            done: true,
          }) + '\n');
          res.end();
        } catch (error) {
          console.error('[GeminiCLI] Streaming error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Streaming failed' });
          }
        }
      } else {
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
        }

        res.json({
          model: body.model || 'gemini-cli',
          provider: 'gemini_cli',
          created_at: new Date().toISOString(),
          response: fullResponse,
          done: true,
        });
      }
    } catch (error) {
      console.error('[GeminiCLI] Generate error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  // =============================================================================
  // GEMINI API KEY ROTATIVE ROUTES - Utilise les clés API avec rotation
  // =============================================================================

  /**
   * POST /api/gemini_api_key_rotative/chat
   */
  app.post('/api/gemini_api_key_rotative/chat', apiRateLimiter, validateApiAccess, async (req: Request, res: Response) => {
    try {
      const body = req.body as OllamaChatRequest;

      if (!body.messages || body.messages.length === 0) {
        res.status(400).json({ error: 'No messages provided' });
        return;
      }

      const service = getGeminiApiKeyService();
      const stream = service.chat(body.messages, {
        model: body.model,
        temperature: body.options?.temperature,
        maxTokens: body.options?.max_tokens,
      });

      if (body.stream !== false) {
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');

        try {
          for await (const chunk of stream) {
            res.write(JSON.stringify({
              model: body.model || 'gemini-2.0-flash-exp',
              provider: 'gemini_api_key_rotative',
              created_at: new Date().toISOString(),
              message: { role: 'assistant', content: chunk },
              done: false,
            }) + '\n');
          }

          res.write(JSON.stringify({
            model: body.model || 'gemini-2.0-flash-exp',
            provider: 'gemini_api_key_rotative',
            created_at: new Date().toISOString(),
            message: { role: 'assistant', content: '' },
            done: true,
          }) + '\n');
          res.end();
        } catch (error) {
          console.error('[GeminiAPIKey] Streaming error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Streaming failed' });
          }
        }
      } else {
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
        }

        res.json({
          model: body.model || 'gemini-2.0-flash-exp',
          provider: 'gemini_api_key_rotative',
          created_at: new Date().toISOString(),
          message: { role: 'assistant', content: fullResponse },
          done: true,
        });
      }
    } catch (error) {
      console.error('[GeminiAPIKey] Chat error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/gemini_api_key_rotative/generate
   */
  app.post('/api/gemini_api_key_rotative/generate', apiRateLimiter, validateApiAccess, async (req: Request, res: Response) => {
    try {
      const body = req.body as OllamaGenerateRequest;

      if (!body.prompt) {
        res.status(400).json({ error: 'No prompt provided' });
        return;
      }

      const service = getGeminiApiKeyService();
      const stream = service.generate(body.prompt, {
        model: body.model,
        temperature: body.options?.temperature,
        maxTokens: body.options?.max_tokens,
      });

      if (body.stream !== false) {
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');

        try {
          for await (const chunk of stream) {
            res.write(JSON.stringify({
              model: body.model || 'gemini-2.0-flash-exp',
              provider: 'gemini_api_key_rotative',
              created_at: new Date().toISOString(),
              response: chunk,
              done: false,
            }) + '\n');
          }

          res.write(JSON.stringify({
            model: body.model || 'gemini-2.0-flash-exp',
            provider: 'gemini_api_key_rotative',
            created_at: new Date().toISOString(),
            response: '',
            done: true,
          }) + '\n');
          res.end();
        } catch (error) {
          console.error('[GeminiAPIKey] Streaming error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Streaming failed' });
          }
        }
      } else {
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
        }

        res.json({
          model: body.model || 'gemini-2.0-flash-exp',
          provider: 'gemini_api_key_rotative',
          created_at: new Date().toISOString(),
          response: fullResponse,
          done: true,
        });
      }
    } catch (error) {
      console.error('[GeminiAPIKey] Generate error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/gemini_api_key_rotative/stats - Statistiques d'utilisation des clés
   */
  app.get('/api/gemini_api_key_rotative/stats', apiRateLimiter, validateApiAccess, (_req: Request, res: Response) => {
    try {
      const service = getGeminiApiKeyService();
      const stats = service.getUsageStats();
      res.json(stats);
    } catch (error) {
      console.error('[GeminiAPIKey] Stats error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  // =============================================================================
  // KIRO CLI ROUTES - À implémenter
  // =============================================================================

  /**
   * POST /api/kiro_cli/chat - À implémenter
   */
  app.post('/api/kiro_cli/chat', apiRateLimiter, validateApiAccess, async (_req: Request, res: Response) => {
    res.status(501).json({
      error: 'Kiro CLI provider not yet implemented',
      message: 'This endpoint will be available in a future update',
    });
  });

  /**
   * POST /api/kiro_cli/generate - À implémenter
   */
  app.post('/api/kiro_cli/generate', apiRateLimiter, validateApiAccess, async (_req: Request, res: Response) => {
    res.status(501).json({
      error: 'Kiro CLI provider not yet implemented',
      message: 'This endpoint will be available in a future update',
    });
  });

  // =============================================================================
  // ROUTES COMMUNES
  // =============================================================================

  /**
   * GET /api/providers - Liste des providers disponibles
   */
  app.get('/api/providers', apiRateLimiter, validateApiAccess, (_req: Request, res: Response) => {
    const hasOAuth = checkGoogleOAuthCredentials();
    
    res.json({
      providers: [
        {
          name: 'gemini_cli',
          description: 'Gemini CLI with Google OAuth authentication',
          status: hasOAuth ? 'available' : 'not_configured',
          endpoints: {
            chat: '/api/gemini_cli/chat',
            generate: '/api/gemini_cli/generate',
          },
          authentication: 'Google OAuth',
          setup: hasOAuth ? null : 'Run: gemini auth login',
        },
        {
          name: 'gemini_api_key_rotative',
          description: 'Gemini API with automatic key rotation (5 req/min, 250k tokens/day per key)',
          status: 'available',
          endpoints: {
            chat: '/api/gemini_api_key_rotative/chat',
            generate: '/api/gemini_api_key_rotative/generate',
            stats: '/api/gemini_api_key_rotative/stats',
          },
          authentication: 'API Key (rotative)',
          models: ['gemini-2.0-flash-exp', 'gemini-1.5-flash'],
        },
        {
          name: 'kiro_cli',
          description: 'Kiro CLI integration',
          status: 'not_implemented',
          endpoints: {
            chat: '/api/kiro_cli/chat',
            generate: '/api/kiro_cli/generate',
          },
          authentication: 'TBD',
        },
      ],
    });
  });

  console.log('[MultiProvider] Routes registered:');
  console.log('  - Gemini CLI: /api/gemini_cli/*');
  console.log('  - Gemini API Key: /api/gemini_api_key_rotative/*');
  console.log('  - Kiro CLI: /api/kiro_cli/* (not implemented)');
  console.log('  - Providers list: /api/providers');
}

export default registerMultiProviderRoutes;
