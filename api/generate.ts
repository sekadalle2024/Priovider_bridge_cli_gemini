/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vercel Serverless Function pour /api/generate compatible Ollama
 * Vercel Serverless Function for Ollama-compatible /api/generate
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

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
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vérifier la méthode HTTP
  // Check HTTP method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body as GenerateRequest;

    if (!body.prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Vérifier l'authentification (Bearer token)
    // Check authentication (Bearer token)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Importer dynamiquement le service Gemini
    // Dynamically import Gemini service
    const { GeminiApiService } = await import('../src/webserver/services/GeminiApiService');
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
    return res.status(200).json({
      model: body.model || 'gemini-2.0-flash-exp',
      created_at: new Date().toISOString(),
      response: fullResponse,
      done: true,
    });
  } catch (error) {
    console.error('[Vercel Function] Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
