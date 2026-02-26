/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Netlify Function pour /api/generate compatible Ollama
 * Netlify Function for Ollama-compatible /api/generate
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface GenerateRequest {
  model?: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
  };
}

/**
 * Handler pour /api/generate compatible Ollama
 * Handler for Ollama-compatible /api/generate
 */
export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Vérifier la méthode HTTP
  // Check HTTP method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parser le body
    // Parse body
    const body: GenerateRequest = JSON.parse(event.body || '{}');

    if (!body.prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No prompt provided' }),
      };
    }

    // Vérifier l'authentification (Bearer token)
    // Check authentication (Bearer token)
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Importer dynamiquement le service Gemini
    // Dynamically import Gemini service
    const { GeminiApiService } = await import('../../src/webserver/services/GeminiApiService');
    const service = new GeminiApiService();

    // Configuration du modèle
    // Model configuration
    const modelConfig = {
      platform: 'google' as const,
      useModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
      apiKey: process.env.GEMINI_API_KEY || '',
      baseUrl: process.env.GOOGLE_GEMINI_BASE_URL || '',
    };

    // Initialiser le service
    // Initialize service
    await service.initialize({
      workspace: '/tmp/gemini-workspace',
      model: modelConfig,
      yoloMode: false,
    });

    // Obtenir la réponse
    // Get response
    const stream = await service.generate(body.prompt, {
      stream: body.stream ?? false,
      model: body.model,
      temperature: body.options?.temperature,
    });

    // Collecter la réponse complète
    // Collect full response
    let fullResponse = '';
    for await (const chunk of stream) {
      fullResponse += chunk;
    }

    // Nettoyer
    // Cleanup
    service.cleanup();

    // Retourner la réponse au format Ollama
    // Return response in Ollama format
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: body.model || 'gemini-2.0-flash-exp',
        created_at: new Date().toISOString(),
        response: fullResponse,
        done: true,
      }),
    };
  } catch (error) {
    console.error('[Netlify Function] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    };
  }
};
