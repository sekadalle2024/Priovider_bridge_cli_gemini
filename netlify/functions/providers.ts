/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Netlify Function: Liste des providers disponibles
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Count API keys
  const apiKeyCount = Object.keys(process.env).filter(key => 
    key.startsWith('GEMINI_API_KEY_')
  ).length;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      providers: [
        {
          name: 'gemini_api_key_rotative',
          description: 'Gemini API with automatic key rotation (5 req/min, 250k tokens/day per key)',
          status: apiKeyCount > 0 ? 'available' : 'not_configured',
          endpoints: {
            chat: '/api/gemini_api_key_rotative/chat',
            generate: '/api/gemini_api_key_rotative/generate',
            stats: '/api/gemini_api_key_rotative/stats',
          },
          authentication: 'API Key (rotative)',
          models: ['gemini-2.0-flash-exp', 'gemini-1.5-flash'],
          keysConfigured: apiKeyCount,
        },
        {
          name: 'gemini_cli',
          description: 'Gemini CLI with Google OAuth authentication',
          status: 'not_available_on_netlify',
          endpoints: {
            chat: '/api/gemini_cli/chat',
            generate: '/api/gemini_cli/generate',
          },
          authentication: 'Google OAuth',
          note: 'OAuth not supported in serverless environment',
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
      environment: 'netlify',
      timestamp: new Date().toISOString(),
    }),
  };
};
