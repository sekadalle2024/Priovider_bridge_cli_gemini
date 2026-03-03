import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export interface KiroCliConfig {
  cliPath: string;
  workspace: string;
  model?: string;
  timeout?: number;
  availableModels?: string[];
}

export interface KiroChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface KiroChatRequest {
  messages: KiroChatMessage[];
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface KiroChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: KiroChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class KiroCliService extends EventEmitter {
  private config: KiroCliConfig;
  private currentProcess: ChildProcess | null = null;
  private sessionId: string;

  constructor(config: KiroCliConfig) {
    super();
    this.config = {
      timeout: 300000, // 5 minutes par défaut
      model: 'claude-sonnet-4-5',
      availableModels: [
        'claude-sonnet-4-5',
        'claude-opus-4-5',
        'claude-sonnet-3-5',
        'claude-haiku-3-5'
      ],
      ...config
    };
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `kiro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Vérifie si Kiro CLI est installé et accessible
   */
  async checkAvailability(): Promise<boolean> {
    return new Promise((resolve) => {
      const process = spawn(this.config.cliPath, ['--version'], {
        cwd: this.config.workspace
      });

      let output = '';
      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        resolve(code === 0 && output.length > 0);
      });

      process.on('error', () => {
        resolve(false);
      });

      // Timeout de 5 secondes
      setTimeout(() => {
        process.kill();
        resolve(false);
      }, 5000);
    });
  }

  /**
   * Exécute une commande Kiro CLI
   */
  private async executeCommand(
    args: string[],
    input?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(this.config.cliPath, args, {
        cwd: this.config.workspace,
        env: {
          ...process.env,
          KIRO_MODEL: this.config.model || 'claude-3-5-sonnet'
        }
      });

      let output = '';
      let errorOutput = '';

      process.stdout?.on('data', (data) => {
        output += data.toString();
      });

      process.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      // Envoyer l'input si fourni
      if (input && process.stdin) {
        process.stdin.write(input);
        process.stdin.end();
      }

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Kiro CLI error: ${errorOutput || output}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });

      // Timeout
      const timeout = setTimeout(() => {
        process.kill();
        reject(new Error('Kiro CLI timeout'));
      }, this.config.timeout);

      process.on('close', () => {
        clearTimeout(timeout);
      });
    });
  }

  /**
   * Envoie un message de chat à Kiro CLI
   */
  async chat(request: KiroChatRequest): Promise<KiroChatResponse> {
    try {
      // Construire le prompt à partir des messages
      const prompt = this.buildPromptFromMessages(request.messages);

      // Exécuter Kiro CLI en mode non-interactif
      // Note: Kiro CLI est principalement interactif, donc nous simulons une interaction
      const response = await this.executeCommand(
        ['chat', '--non-interactive'],
        prompt
      );

      // Parser la réponse
      const assistantMessage = this.parseKiroResponse(response);

      return {
        id: `chatcmpl-${this.generateSessionId()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: 'kiro-cli',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: assistantMessage
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: this.estimateTokens(prompt),
          completion_tokens: this.estimateTokens(assistantMessage),
          total_tokens: this.estimateTokens(prompt + assistantMessage)
        }
      };
    } catch (error) {
      throw new Error(`Kiro CLI chat error: ${error.message}`);
    }
  }

  /**
   * Génère du code avec Kiro CLI
   */
  async generate(prompt: string, options?: {
    language?: string;
    context?: Record<string, any>;
  }): Promise<string> {
    try {
      const fullPrompt = options?.language
        ? `Generate ${options.language} code: ${prompt}`
        : prompt;

      const response = await this.executeCommand(
        ['chat', '--non-interactive'],
        fullPrompt
      );

      return this.parseKiroResponse(response);
    } catch (error) {
      throw new Error(`Kiro CLI generate error: ${error.message}`);
    }
  }

  /**
   * Exécute une commande Kiro CLI personnalisée
   */
  async execute(command: string, args: string[] = []): Promise<string> {
    try {
      return await this.executeCommand([command, ...args]);
    } catch (error) {
      throw new Error(`Kiro CLI execute error: ${error.message}`);
    }
  }

  /**
   * Stream une réponse de chat
   */
  async *chatStream(request: KiroChatRequest): AsyncGenerator<string> {
    const prompt = this.buildPromptFromMessages(request.messages);

    const process = spawn(
      this.config.cliPath,
      ['chat', '--non-interactive'],
      {
        cwd: this.config.workspace,
        env: {
          ...process.env,
          KIRO_MODEL: this.config.model || 'claude-3-5-sonnet'
        }
      }
    );

    // Envoyer le prompt
    if (process.stdin) {
      process.stdin.write(prompt);
      process.stdin.end();
    }

    // Stream la sortie
    if (process.stdout) {
      for await (const chunk of process.stdout) {
        yield chunk.toString();
      }
    }

    // Attendre la fin du processus
    await new Promise((resolve, reject) => {
      process.on('close', resolve);
      process.on('error', reject);
    });
  }

  /**
   * Construit un prompt à partir des messages
   */
  private buildPromptFromMessages(messages: KiroChatMessage[]): string {
    return messages
      .map((msg) => {
        if (msg.role === 'system') {
          return `System: ${msg.content}`;
        } else if (msg.role === 'user') {
          return `User: ${msg.content}`;
        } else {
          return `Assistant: ${msg.content}`;
        }
      })
      .join('\n\n');
  }

  /**
   * Parse la réponse de Kiro CLI
   */
  private parseKiroResponse(response: string): string {
    // Nettoyer la réponse des artefacts de terminal
    let cleaned = response
      .replace(/\x1b\[[0-9;]*m/g, '') // Supprimer les codes ANSI
      .replace(/^[\s\n]+|[\s\n]+$/g, '') // Trim
      .trim();

    // Si la réponse contient des marqueurs de code, les extraire
    const codeBlockMatch = cleaned.match(/```[\s\S]*?```/);
    if (codeBlockMatch) {
      return cleaned;
    }

    return cleaned;
  }

  /**
   * Estime le nombre de tokens (approximation)
   */
  private estimateTokens(text: string): number {
    // Approximation: ~4 caractères par token
    return Math.ceil(text.length / 4);
  }

  /**
   * Obtient la liste des modèles disponibles
   */
  getAvailableModels(): Array<{
    id: string;
    object: string;
    created: number;
    owned_by: string;
  }> {
    const models = this.config.availableModels || [
      'claude-sonnet-4-5',
      'claude-opus-4-5',
      'claude-sonnet-3-5',
      'claude-haiku-3-5'
    ];

    return models.map((modelId) => ({
      id: modelId,
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'anthropic'
    }));
  }

  /**
   * Obtient le statut du service
   */
  async getStatus(): Promise<{
    available: boolean;
    version?: string;
    model?: string;
    workspace: string;
  }> {
    const available = await this.checkAvailability();

    if (!available) {
      return {
        available: false,
        workspace: this.config.workspace
      };
    }

    try {
      const version = await this.executeCommand(['--version']);
      return {
        available: true,
        version: version.trim(),
        model: this.config.model,
        workspace: this.config.workspace
      };
    } catch (error) {
      return {
        available: false,
        workspace: this.config.workspace
      };
    }
  }

  /**
   * Nettoie les ressources
   */
  cleanup(): void {
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }
  }
}

// Export singleton instance
let kiroCliServiceInstance: KiroCliService | null = null;

export function getKiroCliService(config?: KiroCliConfig): KiroCliService {
  if (!kiroCliServiceInstance && config) {
    kiroCliServiceInstance = new KiroCliService(config);
  }

  if (!kiroCliServiceInstance) {
    throw new Error('KiroCliService not initialized. Provide config first.');
  }

  return kiroCliServiceInstance;
}

export function initializeKiroCliService(config: KiroCliConfig): KiroCliService {
  kiroCliServiceInstance = new KiroCliService(config);
  return kiroCliServiceInstance;
}
