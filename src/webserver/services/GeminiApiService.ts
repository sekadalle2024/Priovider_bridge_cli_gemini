/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeminiAgent } from '@/agent/gemini';
import type { TProviderWithModel } from '@/common/storage';
import { uuid } from '@/common/utils';
import { EventEmitter } from 'events';

/**
 * Service pour exposer Gemini CLI comme API compatible Ollama
 * Service to expose Gemini CLI as Ollama-compatible API
 */
export class GeminiApiService {
  private agent: GeminiAgent | null = null;
  private eventEmitter: EventEmitter = new EventEmitter();
  private isInitialized = false;

  /**
   * Initialiser l'agent Gemini avec la configuration
   * Initialize Gemini agent with configuration
   */
  async initialize(config: {
    workspace: string;
    model: TProviderWithModel;
    proxy?: string;
    yoloMode?: boolean;
    mcpServers?: Record<string, unknown>;
  }): Promise<void> {
    if (this.isInitialized && this.agent) {
      return;
    }

    this.agent = new GeminiAgent({
      workspace: config.workspace,
      model: config.model,
      proxy: config.proxy,
      yoloMode: config.yoloMode ?? false,
      mcpServers: config.mcpServers ?? {},
      onStreamEvent: (event) => {
        this.eventEmitter.emit('stream', event);
      },
    });

    await this.agent.bootstrap;
    this.isInitialized = true;
  }

  /**
   * Envoyer un message et obtenir une réponse en streaming
   * Send a message and get streaming response
   */
  async chat(
    messages: Array<{ role: string; content: string }>,
    options?: {
      stream?: boolean;
      model?: string;
      temperature?: number;
    }
  ): Promise<AsyncGenerator<string, void, unknown>> {
    if (!this.agent) {
      throw new Error('GeminiApiService not initialized');
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      throw new Error('No message content provided');
    }

    const msg_id = uuid();
    const responseChunks: string[] = [];
    let isComplete = false;
    let error: Error | null = null;

    // Écouter les événements de stream
    // Listen to stream events
    const streamHandler = (event: { type: string; data: unknown; msg_id: string }) => {
      if (event.msg_id !== msg_id) return;

      if (event.type === 'text') {
        responseChunks.push(event.data as string);
      } else if (event.type === 'error') {
        error = new Error(event.data as string);
        isComplete = true;
      } else if (event.type === 'finish') {
        isComplete = true;
      }
    };

    this.eventEmitter.on('stream', streamHandler);

    // Envoyer le message
    // Send the message
    try {
      await this.agent.send(lastMessage.content, msg_id);
    } catch (e) {
      this.eventEmitter.off('stream', streamHandler);
      throw e;
    }

    // Générateur asynchrone pour le streaming
    // Async generator for streaming
    const self = this;
    async function* streamGenerator(): AsyncGenerator<string, void, unknown> {
      try {
        while (!isComplete) {
          if (error) {
            throw error;
          }

          if (responseChunks.length > 0) {
            const chunk = responseChunks.shift();
            if (chunk) {
              yield chunk;
            }
          } else {
            // Attendre un peu avant de vérifier à nouveau
            // Wait a bit before checking again
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }

        // Vider les chunks restants
        // Flush remaining chunks
        while (responseChunks.length > 0) {
          const chunk = responseChunks.shift();
          if (chunk) {
            yield chunk;
          }
        }
      } finally {
        self.eventEmitter.off('stream', streamHandler);
      }
    }

    return streamGenerator();
  }

  /**
   * Générer une complétion (compatible Ollama /api/generate)
   * Generate completion (Ollama /api/generate compatible)
   */
  async generate(
    prompt: string,
    options?: {
      stream?: boolean;
      model?: string;
      temperature?: number;
    }
  ): Promise<AsyncGenerator<string, void, unknown>> {
    return this.chat([{ role: 'user', content: prompt }], options);
  }

  /**
   * Arrêter l'agent en cours
   * Stop current agent
   */
  stop(): void {
    if (this.agent) {
      this.agent.stop();
    }
  }

  /**
   * Nettoyer les ressources
   * Cleanup resources
   */
  cleanup(): void {
    this.stop();
    this.eventEmitter.removeAllListeners();
    this.agent = null;
    this.isInitialized = false;
  }
}

// Instance singleton
let geminiApiServiceInstance: GeminiApiService | null = null;

/**
 * Obtenir l'instance singleton du service
 * Get singleton service instance
 */
export function getGeminiApiService(): GeminiApiService {
  if (!geminiApiServiceInstance) {
    geminiApiServiceInstance = new GeminiApiService();
  }
  return geminiApiServiceInstance;
}
