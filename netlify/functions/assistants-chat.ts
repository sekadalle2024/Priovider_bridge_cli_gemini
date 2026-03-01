/**
 * Netlify Function - Assistants Chat Endpoint
 * Compatible OpenAI API avec Gemini API REST (API Keys)
 * Déployable sur Netlify sans Gemini CLI
 */

import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY_OHADA_FINANCE_A,
  process.env.GEMINI_API_KEY_OHADA_FINANCE_B,
  process.env.GEMINI_API_KEY_OHADA_FINANCE_C,
  process.env.GEMINI_API_KEY_OHADA_FINANCE_D,
  process.env.GEMINI_API_KEY_OHADA_FINANCE_E,
  process.env.GEMINI_API_KEY_OHADA_FINANCE_F,
  process.env.GEMINI_API_KEY_OHADA_FINANCE_G,
  process.env.GEMINI_API_KEY_OHADA_FINANCE_H,
  process.env.GEMINI_API_KEY_OHADA_SAVE_A,
  process.env.GEMINI_API_KEY_OHADA_SAVE_B,
  process.env.GEMINI_API_KEY_OHADA_SAVE_C,
  process.env.GEMINI_API_KEY_OHADA_SAVE_D,
  process.env.GEMINI_API_KEY_OHADA_SAVE_E,
  process.env.GEMINI_API_KEY_OHADA_SAVE_F,
  process.env.GEMINI_API_KEY_OHADA_SAVE_G,
  process.env.GEMINI_API_KEY_OHADA_SAVE_H,
].filter(Boolean) as string[];

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Mapping des alias vers les modèles réels
const MODEL_ALIASES: Record<string, string> = {
  'auto': 'gemini-2.5-flash',  // Sur Netlify, on utilise flash par défaut
  'pro': 'gemini-2.5-pro',
  'flash': 'gemini-2.5-flash',
  'flash-lite': 'gemini-2.5-flash-lite',
};

// Modèles disponibles
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

// Rotation simple des API keys
let currentKeyIndex = 0;

function getNextApiKey(): string {
  if (GEMINI_API_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured');
  }
  const key = GEMINI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
  return key;
}

function resolveModel(model: string): string {
  return MODEL_ALIASES[model] || model;
}

// Charger un assistant depuis le dossier assistant/
function loadAssistant(assistantName: string): string | null {
  try {
    const assistantPath = path.join(process.cwd(), 'assistant', assistantName, `${assistantName}.md`);
    if (fs.existsSync(assistantPath)) {
      return fs.readFileSync(assistantPath, 'utf-8');
    }
  } catch (error) {
    console.error(`Error loading assistant ${assistantName}:`, error);
  }
  return null;
}

// Appeler l'API Gemini
async function callGeminiApi(
  prompt: string,
  model: string,
  temperature: number = 0.7,
  maxTokens: number = 2048
): Promise<string> {
  const apiKey = getNextApiKey();
  const resolvedModel = resolveModel(model);
  
  const url = `${GEMINI_API_BASE}/${resolvedModel}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text;
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

  // Handle OPTIONS for CORS
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
    const body = JSON.parse(event.body || '{}');
    const {
      messages,
      model = 'auto',
      temperature = 0.7,
      max_tokens = 2048,
      assistant,
    } = body;

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: {
            message: 'Missing required field: messages',
            type: 'invalid_request_error',
            code: 'missing_messages',
          },
        }),
      };
    }

    // Vérifier que le modèle est disponible
    if (!AVAILABLE_MODELS.includes(model)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: {
            message: `Model '${model}' is not available`,
            type: 'invalid_request_error',
            code: 'invalid_model',
          },
        }),
      };
    }

    // Construire le prompt
    let prompt = '';

    // Ajouter le contexte de l'assistant si spécifié
    if (assistant) {
      const assistantContent = loadAssistant(assistant);
      if (assistantContent) {
        prompt += `# Assistant Context: ${assistant}\n\n${assistantContent}\n\n---\n\n`;
      }
    }

    // Ajouter les messages
    prompt += messages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n');

    // Appeler l'API Gemini
    const content = await callGeminiApi(prompt, model, temperature, max_tokens);

    // Format de réponse compatible OpenAI
    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: resolveModel(model),
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: Math.ceil(prompt.length / 4),
        completion_tokens: Math.ceil(content.length / 4),
        total_tokens: Math.ceil((prompt.length + content.length) / 4),
      },
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error: any) {
    console.error('Error in assistants-chat:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: {
          message: error.message || 'Internal server error',
          type: 'api_error',
          code: 'internal_error',
        },
      }),
    };
  }
};
