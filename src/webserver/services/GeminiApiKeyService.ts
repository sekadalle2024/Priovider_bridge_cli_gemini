/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { getApiKeyRotationService } from './ApiKeyRotationService';

/**
 * Service pour utiliser Gemini via API Key avec rotation automatique
 */
export class GeminiApiKeyService {
  private rotationService = getApiKeyRotationService();
  private currentClient: GoogleGenAI | null = null;
  private currentApiKey: string | null = null;

  /**
   * Obtenir un client Gemini avec une clé API disponible
   */
  private getClient(): { client: GoogleGenAI; apiKey: string } {
    const apiKey = this.rotationService.getNextAvailableKey();
    
    // Réutiliser le client si c'est la même clé
    if (this.currentApiKey === apiKey && this.currentClient) {
      return { client: this.currentClient, apiKey };
    }

    // Créer un nouveau client
    this.currentApiKey = apiKey;
    this.currentClient = new GoogleGenAI(apiKey);
    
    return { client: this.currentClient, apiKey };
  }

  /**
   * Envoyer un message et obtenir une réponse en streaming
   */
  async *chat(
    messages: Array<{ role: string; content: string }>,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): AsyncGenerator<string, void, unknown> {
    const { client, apiKey } = this.getClient();
    const modelName = options?.model || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
    
    try {
      const model = client.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: options?.temperature,
          maxOutputTokens: options?.maxTokens,
        },
      });

      // Convertir les messages au format Gemini
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // Créer le chat
      const chat = model.startChat({
        history: contents.slice(0, -1),
      });

      // Envoyer le dernier message
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessageStream(lastMessage.content);

      let totalTokens = 0;

      // Streamer la réponse
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          totalTokens += text.length / 4; // Estimation approximative
          yield text;
        }
      }

      // Enregistrer l'utilisation
      this.rotationService.recordUsage(apiKey, Math.ceil(totalTokens));

    } catch (error) {
      console.error('[GeminiApiKey] Error:', error);
      throw error;
    }
  }

  /**
   * Générer une complétion
   */
  async *generate(
    prompt: string,
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): AsyncGenerator<string, void, unknown> {
    yield* this.chat([{ role: 'user', content: prompt }], options);
  }

  /**
   * Obtenir les statistiques d'utilisation des clés
   */
  getUsageStats() {
    return this.rotationService.getUsageStats();
  }
}

// Instance singleton
let geminiApiKeyServiceInstance: GeminiApiKeyService | null = null;

/**
 * Obtenir l'instance singleton du service
 */
export function getGeminiApiKeyService(): GeminiApiKeyService {
  if (!geminiApiKeyServiceInstance) {
    geminiApiKeyServiceInstance = new GeminiApiKeyService();
  }
  return geminiApiKeyServiceInstance;
}
