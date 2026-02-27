#!/usr/bin/env node

/**
 * Client API Gemini avec rotation automatique des clés
 */

const https = require('https');

class GeminiApiClient {
  constructor() {
    // Charger toutes les clés API depuis les variables d'environnement
    this.apiKeys = this.loadApiKeys();
    this.currentKeyIndex = 0;
    this.keyUsage = new Map(); // Suivi de l'utilisation par clé
    
    console.log(`✅ ${this.apiKeys.length} clés API Gemini chargées`);
  }

  loadApiKeys() {
    const keys = [];
    const prefixes = [
      'GEMINI_API_KEY_OHADA_FINANCE_',
      'GEMINI_API_KEY_OHADA_SAVE_',
      'GEMINI_API_KEY_OHADA_SAVE2_'
    ];

    // Charger toutes les clés depuis process.env
    for (const prefix of prefixes) {
      for (const key in process.env) {
        if (key.startsWith(prefix)) {
          const apiKey = process.env[key];
          if (apiKey && apiKey.length > 0) {
            keys.push({
              name: key,
              key: apiKey,
              requestCount: 0,
              lastUsed: null
            });
          }
        }
      }
    }

    return keys;
  }

  getNextKey() {
    // Rotation simple : passer à la clé suivante
    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    
    // Mettre à jour les stats
    key.requestCount++;
    key.lastUsed = new Date();
    
    return key;
  }

  async chat(model, messages, options = {}) {
    const keyInfo = this.getNextKey();
    const apiKey = keyInfo.key;

    console.log(`🔑 Utilisation de la clé: ${keyInfo.name} (${keyInfo.requestCount} requêtes)`);

    // Convertir les messages au format Gemini
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.max_tokens || 2048,
        topP: options.top_p || 0.95,
        topK: options.top_k || 40
      }
    };

    return new Promise((resolve, reject) => {
      const data = JSON.stringify(requestBody);

      const requestOptions = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };

      const req = https.request(requestOptions, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(responseData);
            
            if (json.error) {
              console.error(`❌ Erreur API Gemini: ${json.error.message}`);
              reject(new Error(json.error.message));
              return;
            }

            // Convertir la réponse Gemini au format OpenAI
            const openAiResponse = this.convertToOpenAiFormat(json, model);
            resolve(openAiResponse);
          } catch (error) {
            console.error('❌ Erreur de parsing:', error.message);
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Erreur de connexion:', error.message);
        reject(error);
      });

      req.write(data);
      req.end();
    });
  }

  convertToOpenAiFormat(geminiResponse, model) {
    const candidate = geminiResponse.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text || '';

    return {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: content
          },
          finish_reason: this.mapFinishReason(candidate?.finishReason)
        }
      ],
      usage: {
        prompt_tokens: geminiResponse.usageMetadata?.promptTokenCount || 0,
        completion_tokens: geminiResponse.usageMetadata?.candidatesTokenCount || 0,
        total_tokens: geminiResponse.usageMetadata?.totalTokenCount || 0
      }
    };
  }

  mapFinishReason(geminiReason) {
    const mapping = {
      'STOP': 'stop',
      'MAX_TOKENS': 'length',
      'SAFETY': 'content_filter',
      'RECITATION': 'content_filter',
      'OTHER': 'stop'
    };
    return mapping[geminiReason] || 'stop';
  }

  getStats() {
    return {
      totalKeys: this.apiKeys.length,
      currentKeyIndex: this.currentKeyIndex,
      keys: this.apiKeys.map(k => ({
        name: k.name,
        requestCount: k.requestCount,
        lastUsed: k.lastUsed
      }))
    };
  }
}

// Export singleton
let clientInstance = null;

function getGeminiClient() {
  if (!clientInstance) {
    clientInstance = new GeminiApiClient();
  }
  return clientInstance;
}

module.exports = { GeminiApiClient, getGeminiClient };
