/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Netlify Function: Gemini API Key Chat (avec rotation)
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

// Charger les clés API depuis les variables d'environnement
function loadApiKeys(): string[] {
  const keys: string[] = [];
  const envKeys = Object.keys(process.env).filter(key => 
    key.startsWith('GEMINI_API_KEY_')
  );

  for (const envKey of envKeys) {
    const apiKey = process.env[envKey];
    if (apiKey && apiKey.trim()) {
      keys.push(apiKey.trim());
    }
  }

  return keys;
}

// Rotation simple des clés (stateless pour Netlify)
let currentKeyIndex = 0;
function getNextApiKey(keys: string[]): string {
  if (keys.length === 0) {
    throw new Error('No API keys configured');
  }
  const key = keys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;
  return key;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { messages, stream = false, model, options } = body;

    if (!messages || messages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No messages provided' }),
      };
    }

    // Get API key
    const apiKeys = loadApiKeys();
    const apiKey = getNextApiKey(apiKeys);

    // Create Gemini client
    const client = new GoogleGenAI(apiKey);
    const modelName = model || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
    const genModel = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: options?.temperature,
        maxOutputTokens: options?.max_tokens,
      },
    });

    // Convert messages to Gemini format
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Create chat
    const chat = genModel.startChat({
      history: contents.slice(0, -1),
    });

    // Send message
    const lastMessage = messages[messages.length - 1];
    
    if (stream) {
      // Streaming not supported in Netlify functions
      // Return non-streaming response
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          model: modelName,
          provider: 'gemini_api_key_rotative',
          created_at: new Date().toISOString(),
          message: {
            role: 'assistant',
            content: text,
          },
          done: true,
        }),
      };
    } else {
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          model: modelName,
          provider: 'gemini_api_key_rotative',
          created_at: new Date().toISOString(),
          message: {
            role: 'assistant',
            content: text,
          },
          done: true,
        }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    };
  }
};
