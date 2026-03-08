import { spawn } from 'child_process';
import * as path from 'path';
import * as os from 'os';

export interface GeminiCliProfile {
  id: string;
  name: string;
  home: string;
  port: number;
  account: string;
  enabled: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ProfileStats {
  requests: number;
  errors: number;
  avgResponseTime: number;
  lastUsed: Date | null;
  isAvailable: boolean;
}

export class MultiGeminiCliService {
  private profiles: Map<string, GeminiCliProfile> = new Map();
  private stats: Map<string, ProfileStats> = new Map();
  private currentProfileIndex: number = 0;

  constructor() {
    this.loadProfiles();
    this.initializeStats();
  }

  private loadProfiles(): void {
    const profilesEnv = process.env.MULTI_CLI_PROFILES || 'profile1';
    const profileIds = profilesEnv.split(',').map(p => p.trim());

    for (const profileId of profileIds) {
      const homeEnv = process.env[`CLI_${profileId.toUpperCase()}_HOME`];
      const portEnv = process.env[`CLI_${profileId.toUpperCase()}_PORT`];
      const accountEnv = process.env[`CLI_${profileId.toUpperCase()}_ACCOUNT`];
      const enabledEnv = process.env[`CLI_${profileId.toUpperCase()}_ENABLED`];

      if (!homeEnv) {
        console.warn(`Profile ${profileId}: HOME not configured, skipping`);
        continue;
      }

      const profile: GeminiCliProfile = {
        id: profileId,
        name: `Gemini CLI ${profileId}`,
        home: homeEnv.replace('~', os.homedir()),
        port: portEnv ? parseInt(portEnv) : 25811,
        account: accountEnv || 'unknown',
        enabled: enabledEnv !== 'false'
      };

      if (profile.enabled) {
        this.profiles.set(profileId, profile);
        console.log(`✅ Profile ${profileId} loaded: ${profile.account}`);
      } else {
        console.log(`⏸️  Profile ${profileId} disabled`);
      }
    }

    if (this.profiles.size === 0) {
      console.warn('⚠️  No profiles configured, using default');
      this.profiles.set('default', {
        id: 'default',
        name: 'Gemini CLI Default',
        home: path.join(os.homedir(), '.gemini'),
        port: 25811,
        account: 'default',
        enabled: true
      });
    }
  }

  private initializeStats(): void {
    this.profiles.forEach((profile, profileId) => {
      this.stats.set(profileId, {
        requests: 0,
        errors: 0,
        avgResponseTime: 0,
        lastUsed: null,
        isAvailable: true
      });
    });
  }

  public getProfiles(): GeminiCliProfile[] {
    return Array.from(this.profiles.values());
  }

  public getProfile(profileId: string): GeminiCliProfile | undefined {
    return this.profiles.get(profileId);
  }

  public getProfileStats(profileId: string): ProfileStats | undefined {
    return this.stats.get(profileId);
  }

  public getAllStats(): Map<string, ProfileStats> {
    return this.stats;
  }

  public getNextProfile(strategy: string = 'round-robin'): GeminiCliProfile | null {
    const availableProfiles = Array.from(this.profiles.values()).filter(p => {
      const stats = this.stats.get(p.id);
      return stats?.isAvailable !== false;
    });

    if (availableProfiles.length === 0) {
      return null;
    }

    switch (strategy) {
      case 'round-robin':
        return this.roundRobinSelection(availableProfiles);
      case 'least-loaded':
        return this.leastLoadedSelection(availableProfiles);
      case 'random':
        return this.randomSelection(availableProfiles);
      default:
        return this.roundRobinSelection(availableProfiles);
    }
  }

  private roundRobinSelection(profiles: GeminiCliProfile[]): GeminiCliProfile {
    const profile = profiles[this.currentProfileIndex % profiles.length];
    this.currentProfileIndex++;
    return profile;
  }

  private leastLoadedSelection(profiles: GeminiCliProfile[]): GeminiCliProfile {
    return profiles.reduce((least, current) => {
      const leastStats = this.stats.get(least.id)!;
      const currentStats = this.stats.get(current.id)!;
      return currentStats.requests < leastStats.requests ? current : least;
    });
  }

  private randomSelection(profiles: GeminiCliProfile[]): GeminiCliProfile {
    return profiles[Math.floor(Math.random() * profiles.length)];
  }

  public async chat(
    request: ChatRequest,
    profileId?: string
  ): Promise<ChatResponse> {
    const profile = profileId
      ? this.getProfile(profileId)
      : this.getNextProfile(process.env.CLI_LOAD_BALANCER_STRATEGY);

    if (!profile) {
      throw new Error('No available profiles');
    }

    const stats = this.stats.get(profile.id)!;
    const startTime = Date.now();

    try {
      stats.requests++;
      stats.lastUsed = new Date();

      const response = await this.executeGeminiCli(profile, request);

      const responseTime = Date.now() - startTime;
      stats.avgResponseTime =
        (stats.avgResponseTime * (stats.requests - 1) + responseTime) /
        stats.requests;

      return response;
    } catch (error) {
      stats.errors++;
      stats.isAvailable = false;

      // Réessayer avec un autre profil si disponible
      if (!profileId && this.profiles.size > 1) {
        console.warn(`Profile ${profile.id} failed, trying another...`);
        return this.chat(request);
      }

      throw error;
    }
  }

  private async executeGeminiCli(
    profile: GeminiCliProfile,
    request: ChatRequest
  ): Promise<ChatResponse> {
    return new Promise((resolve, reject) => {
      const model = request.model || 'gemini-2.5-flash';
      const lastMessage = request.messages[request.messages.length - 1];
      const prompt = lastMessage.content;

      // Préparer l'environnement
      const env = {
        ...process.env,
        GEMINI_CLI_HOME: profile.home
      };

      // ✅ CORRECTION PROMPTS LONGS
      // Utiliser stdin au lieu de --prompt pour contourner la limite Windows de 8191 caractères
      // Cette méthode fonctionne avec des prompts de n'importe quelle longueur
      const args = ['--model', model];
      const gemini = spawn('gemini', args, {
        env,
        shell: true
      });

      // Écrire le prompt dans stdin au lieu de le passer comme argument
      if (gemini.stdin) {
        gemini.stdin.write(prompt);
        gemini.stdin.end();
      }

      let stdout = '';
      let stderr = '';

      gemini.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      gemini.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      gemini.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Gemini CLI failed: ${stderr}`));
          return;
        }

        // Construire la réponse au format OpenAI
        const response: ChatResponse = {
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: model,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: stdout.trim()
              },
              finish_reason: 'stop'
            }
          ],
          usage: {
            prompt_tokens: this.estimateTokens(prompt),
            completion_tokens: this.estimateTokens(stdout),
            total_tokens: this.estimateTokens(prompt + stdout)
          }
        };

        resolve(response);
      });

      gemini.on('error', (error) => {
        reject(error);
      });

      // Timeout après 3000 secondes (50 minutes)
      setTimeout(() => {
        gemini.kill();
        reject(new Error('Gemini CLI timeout'));
      }, 3000000);
    });
  }

  private estimateTokens(text: string): number {
    // Estimation simple: ~4 caractères par token
    return Math.ceil(text.length / 4);
  }

  public markProfileAvailable(profileId: string): void {
    const stats = this.stats.get(profileId);
    if (stats) {
      stats.isAvailable = true;
    }
  }

  public markProfileUnavailable(profileId: string): void {
    const stats = this.stats.get(profileId);
    if (stats) {
      stats.isAvailable = false;
    }
  }
}

// Singleton
export const multiGeminiCliService = new MultiGeminiCliService();
