/**
 * Service pour gérer les assistants comme microservices
 * Chaque assistant du dossier assistant/ devient un endpoint API
 */

import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface AssistantConfig {
  name: string;
  displayName: string;
  description: string;
  endpoint: string;
  capabilities: string[];
  model?: string;
}

export interface AssistantRequest {
  prompt: string;
  context?: Record<string, any>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AssistantResponse {
  success: boolean;
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
}

// Liste des modèles Gemini disponibles
export const AVAILABLE_GEMINI_MODELS = [
  'gemini-3-flash',
  'gemini-3-pro',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-exp-1206'
];

export class AssistantService {
  private assistantsPath: string;
  private geminiCliPath: string;
  private defaultModel: string;

  constructor(
    assistantsPath: string = path.join(process.cwd(), 'assistant'),
    geminiCliPath: string = 'gemini',
    defaultModel: string = 'gemini-2.0-flash-exp'
  ) {
    this.assistantsPath = assistantsPath;
    this.geminiCliPath = geminiCliPath;
    this.defaultModel = defaultModel;
  }

  /**
   * Découvre tous les assistants disponibles
   */
  async discoverAssistants(): Promise<AssistantConfig[]> {
    const assistants: AssistantConfig[] = [];

    try {
      const dirs = fs.readdirSync(this.assistantsPath, { withFileTypes: true });

      for (const dir of dirs) {
        if (dir.isDirectory()) {
          const assistantPath = path.join(this.assistantsPath, dir.name);
          const mdFile = path.join(assistantPath, `${dir.name}.md`);

          if (fs.existsSync(mdFile)) {
            const content = fs.readFileSync(mdFile, 'utf-8');
            const config = this.parseAssistantConfig(dir.name, content);
            assistants.push(config);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la découverte des assistants:', error);
    }

    return assistants;
  }

  /**
   * Parse la configuration d'un assistant depuis son fichier markdown
   */
  private parseAssistantConfig(name: string, content: string): AssistantConfig {
    const lines = content.split('\n');
    let displayName = name;
    let description = '';
    const capabilities: string[] = [];

    // Extraire le titre (première ligne avec #)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      displayName = titleMatch[1].trim();
    }

    // Extraire la description (premier paragraphe après le titre)
    const descMatch = content.match(/^#.+\n\n(.+?)(?:\n\n|$)/s);
    if (descMatch) {
      description = descMatch[1].trim();
    }

    // Extraire les capacités (sections avec ##)
    const capabilityMatches = content.matchAll(/^##\s+(.+)$/gm);
    for (const match of capabilityMatches) {
      capabilities.push(match[1].trim());
    }

    return {
      name,
      displayName,
      description,
      endpoint: `/api/assistant/${name}`,
      capabilities
    };
  }

  /**
   * Exécute un assistant avec Gemini CLI
   */
  async executeAssistant(
    assistantName: string,
    request: AssistantRequest
  ): Promise<AssistantResponse> {
    try {
      const assistantPath = path.join(this.assistantsPath, assistantName);
      const mdFile = path.join(assistantPath, `${assistantName}.md`);

      if (!fs.existsSync(mdFile)) {
        return {
          success: false,
          error: `Assistant '${assistantName}' not found`
        };
      }

      // Lire les instructions de l'assistant
      const instructions = fs.readFileSync(mdFile, 'utf-8');

      // Construire le prompt complet
      const fullPrompt = this.buildPrompt(instructions, request);

      // Exécuter avec Gemini CLI
      const result = await this.runGeminiCli(fullPrompt, request.model || this.defaultModel);

      return {
        success: true,
        result,
        metadata: {
          assistant: assistantName,
          model: request.model || this.defaultModel,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Construit le prompt complet pour l'assistant
   */
  private buildPrompt(instructions: string, request: AssistantRequest): string {
    let prompt = `${instructions}\n\n---\n\n`;

    if (request.context) {
      prompt += `Context:\n${JSON.stringify(request.context, null, 2)}\n\n`;
    }

    prompt += `User Request:\n${request.prompt}`;

    return prompt;
  }

  /**
   * Exécute Gemini CLI
   */
  private async runGeminiCli(prompt: string, model: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = ['--model', model, '--prompt', prompt];
      const process = spawn(this.geminiCliPath, args);

      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`Gemini CLI error: ${errorOutput}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Obtient la liste des modèles Gemini disponibles
   */
  getAvailableModels(): string[] {
    const envModels = process.env.GEMINI_AVAILABLE_MODELS;
    if (envModels) {
      return envModels.split(',').map(m => m.trim()).filter(m => m.length > 0);
    }
    return AVAILABLE_GEMINI_MODELS;
  }

  /**
   * Vérifie si un modèle est disponible
   */
  isModelAvailable(model: string): boolean {
    const availableModels = this.getAvailableModels();
    return availableModels.includes(model);
  }
  async checkGeminiCli(): Promise<boolean> {
    return new Promise((resolve) => {
      const process = spawn(this.geminiCliPath, ['--version']);
      
      process.on('close', (code) => {
        resolve(code === 0);
      });

      process.on('error', () => {
        resolve(false);
      });
    });
  }
}

// Instance singleton
let assistantServiceInstance: AssistantService | null = null;

export function getAssistantService(): AssistantService {
  if (!assistantServiceInstance) {
    assistantServiceInstance = new AssistantService();
  }
  return assistantServiceInstance;
}

export function initializeAssistantService(
  assistantsPath?: string,
  geminiCliPath?: string,
  defaultModel?: string
): AssistantService {
  assistantServiceInstance = new AssistantService(
    assistantsPath,
    geminiCliPath,
    defaultModel
  );
  return assistantServiceInstance;
}
