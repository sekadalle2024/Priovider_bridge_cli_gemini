/**
 * Netlify Function - Assistants Models Endpoint
 * Liste tous les modèles disponibles (compatible OpenAI)
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const AVAILABLE_MODELS = [
  'auto',
  'pro',
  'flash',
  'flash-lite',
  'gemini-3-flash',
  'gemini-3-pro',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-exp-1206',
];

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

  const response = {
    object: 'list',
    data: AVAILABLE_MODELS.map((model) => ({
      id: model,
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'gemini-api',
    })),
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(response),
  };
};
