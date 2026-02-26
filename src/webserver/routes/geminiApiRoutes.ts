/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Express, Request, Response } from 'express';
import { TokenMiddleware } from '@/webserver/auth/middleware/TokenMiddleware';
import { apiRateLimiter } from '../middleware/security';
import { getGeminiApiService } from '../services/GeminiApiService';
import type { TProviderWithModel } from '@/common/storage';
import path from 'path';
import os from 'os';

/**
 * Interface pour les requêtes de chat compatibles Ollama
 * Interface for Ollama-compatible chat requests
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
 * Interface for Ollama-compatible generation requests
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
 * Obtenir la configuration du modèle depuis les variables d'environnement ou la config par défaut
 * Get model configuration from environment variables or default config
 */
function getModelConfig(): TProviderWithModel {
  // Vérifier si l'authentification Google OAuth est configurée
  // Check if Google OAuth authentication is configured
  const hasOAuth = checkGoogleOAuthCredentials();

  // Configuration par défaut avec Google OAuth si disponible
  // Default configuration with Google OAuth if available
  const defaultConfig: TProviderWithModel = {
    platform: 'google',
    useModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
    apiKey: process.env.GEMINI_API_KEY || '',
    baseUrl: process.env.GOOGLE_GEMINI_BASE_URL || '',
  };

  // Si OAuth est configuré, utiliser LOGIN_WITH_GOOGLE
  // If OAuth is configured, use LOGIN_WITH_GOOGLE
  if (hasOAuth && !defaultConfig.apiKey) {
    console.log('[GeminiAPI] Using Google OAuth authentication');
  } else if (defaultConfig.apiKey) {
    console.log('[GeminiAPI] Using API Key authentication');
  } else {
    console.warn('[GeminiAPI] No authentication configured. Please set GEMINI_API_KEY or configure Google OAuth via Gemini CLI');
  }

  return defaultConfig;
}

/**
 * Vérifier si les credentials Google OAuth existent
 * Check if Google OAuth credentials exist
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
 * Initialiser le service Gemini API
 * Initialize Gemini API service
 */
async function initializeGeminiService(): Promise<void> {
  const service = getGeminiApiService();
  const modelConfig = getModelConfig();

  await service.initialize({
    workspace: process.env.WORKSPACE_PATH || process.cwd(),
    model: modelConfig,
    proxy: process.env.HTTP_PROXY || process.env.HTTPS_PROXY,
    yoloMode: process.env.GEMINI_YOLO_MODE === 'true',
    mcpServers: {},
  });
}

/**
 * Enregistrer les routes API Gemini compatibles Ollama
 * Register Ollama-compatible Gemini API routes
 */
export function registerGeminiApiRoutes(app: Express): void {
  const validateApiAccess = TokenMiddleware.validateToken({ responseType: 'json' });

  /**
   * POST /api/chat - Compatible avec Ollama chat API
   * POST /api/chat - Ollama chat API compatible
   *
   * Exemple de requête / Request example:
   * {
   *   "model": "gemini-2.0-flash-exp",
   *   "messages": [
   *     { "role": "user", "content": "Hello!" }
   *   ],
   *   "stream": true
   * }
   */
  app.post('/api/chat', apiRateLimiter, validateApiAccess, async (req: Request, res: Response) => {
    try {
      const body = req.body as OllamaChatRequest;

      if (!body.messages || body.messages.length === 0) {
        res.status(400).json({ error: 'No messages provided' });
        return;
      }

      // Initialiser le service si nécessaire
      // Initialize service if needed
      await initializeGeminiService();

      const service = getGeminiApiService();
      const stream = await service.chat(body.messages, {
        stream: body.stream ?? true,
        model: body.model,
        temperature: body.options?.temperature,
      });

      if (body.stream !== false) {
        // Mode streaming - Compatible Ollama
        // Streaming mode - Ollama compatible
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');

        try {
          for await (const chunk of stream) {
            const response = {
              model: body.model || 'gemini-2.0-flash-exp',
              created_at: new Date().toISOString(),
              message: {
                role: 'assistant',
                content: chunk,
              },
              done: false,
            };
            res.write(JSON.stringify(response) + '\n');
          }

          // Message final
          // Final message
          const finalResponse = {
            model: body.model || 'gemini-2.0-flash-exp',
            created_at: new Date().toISOString(),
            message: {
              role: 'assistant',
              content: '',
            },
            done: true,
          };
          res.write(JSON.stringify(finalResponse) + '\n');
          res.end();
        } catch (error) {
          console.error('[GeminiAPI] Streaming error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Streaming failed' });
          }
        }
      } else {
        // Mode non-streaming
        // Non-streaming mode
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
        }

        res.json({
          model: body.model || 'gemini-2.0-flash-exp',
          created_at: new Date().toISOString(),
          message: {
            role: 'assistant',
            content: fullResponse,
          },
          done: true,
        });
      }
    } catch (error) {
      console.error('[GeminiAPI] Chat error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * POST /api/generate - Compatible avec Ollama generate API
   * POST /api/generate - Ollama generate API compatible
   *
   * Exemple de requête / Request example:
   * {
   *   "model": "gemini-2.0-flash-exp",
   *   "prompt": "Hello!",
   *   "stream": true
   * }
   */
  app.post('/api/generate', apiRateLimiter, validateApiAccess, async (req: Request, res: Response) => {
    try {
      const body = req.body as OllamaGenerateRequest;

      if (!body.prompt) {
        res.status(400).json({ error: 'No prompt provided' });
        return;
      }

      // Initialiser le service si nécessaire
      // Initialize service if needed
      await initializeGeminiService();

      const service = getGeminiApiService();
      const stream = await service.generate(body.prompt, {
        stream: body.stream ?? true,
        model: body.model,
        temperature: body.options?.temperature,
      });

      if (body.stream !== false) {
        // Mode streaming - Compatible Ollama
        // Streaming mode - Ollama compatible
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');

        try {
          for await (const chunk of stream) {
            const response = {
              model: body.model || 'gemini-2.0-flash-exp',
              created_at: new Date().toISOString(),
              response: chunk,
              done: false,
            };
            res.write(JSON.stringify(response) + '\n');
          }

          // Message final
          // Final message
          const finalResponse = {
            model: body.model || 'gemini-2.0-flash-exp',
            created_at: new Date().toISOString(),
            response: '',
            done: true,
          };
          res.write(JSON.stringify(finalResponse) + '\n');
          res.end();
        } catch (error) {
          console.error('[GeminiAPI] Streaming error:', error);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Streaming failed' });
          }
        }
      } else {
        // Mode non-streaming
        // Non-streaming mode
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk;
        }

        res.json({
          model: body.model || 'gemini-2.0-flash-exp',
          created_at: new Date().toISOString(),
          response: fullResponse,
          done: true,
        });
      }
    } catch (error) {
      console.error('[GeminiAPI] Generate error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  });

  /**
   * GET /api/tags - Liste des modèles disponibles (compatible Ollama)
   * GET /api/tags - List available models (Ollama compatible)
   */
  app.get('/api/tags', apiRateLimiter, validateApiAccess, (_req: Request, res: Response) => {
    const modelConfig = getModelConfig();
    res.json({
      models: [
        {
          name: modelConfig.useModel,
          modified_at: new Date().toISOString(),
          size: 0,
          digest: 'gemini-cli-adapter',
          details: {
            format: 'gemini',
            family: 'google',
            parameter_size: 'unknown',
          },
        },
      ],
    });
  });

  /**
   * GET /api/version - Version de l'API
   * GET /api/version - API version
   */
  app.get('/api/version', apiRateLimiter, (_req: Request, res: Response) => {
    res.json({
      version: '1.0.0',
      api: 'gemini-cli-adapter',
      compatible: 'ollama',
    });
  });

  console.log('[GeminiAPI] Routes registered: /api/chat, /api/generate, /api/tags, /api/version');
}

export default registerGeminiApiRoutes;
