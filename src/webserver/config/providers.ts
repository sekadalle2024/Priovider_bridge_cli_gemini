/**
 * Configuration centralisée des providers
 */

export interface ProviderConfig {
  name: string;
  displayName: string;
  enabled: boolean;
  type: 'cli' | 'api' | 'hybrid';
  endpoints: {
    chat?: string;
    generate?: string;
    status?: string;
    openai?: string;
  };
  features: string[];
  rateLimit?: {
    perMinute?: number;
    perDay?: number;
  };
}

export const PROVIDERS: Record<string, ProviderConfig> = {
  gemini_cli: {
    name: 'gemini_cli',
    displayName: 'Gemini CLI',
    enabled: true,
    type: 'cli',
    endpoints: {
      chat: '/api/gemini-cli/chat',
      generate: '/api/gemini-cli/generate',
      status: '/api/gemini-cli/status',
      openai: '/v1/gemini-cli/chat/completions'
    },
    features: [
      'chat',
      'code-generation',
      'streaming',
      'context-aware',
      'google-auth'
    ]
  },

  gemini_api_key: {
    name: 'gemini_api_key',
    displayName: 'Gemini API Key (Rotative)',
    enabled: true,
    type: 'api',
    endpoints: {
      chat: '/api/gemini-api-key/chat',
      generate: '/api/gemini-api-key/generate',
      status: '/api/gemini-api-key/status',
      openai: '/v1/gemini-api-key/chat/completions'
    },
    features: [
      'chat',
      'code-generation',
      'streaming',
      'key-rotation',
      'rate-limiting'
    ],
    rateLimit: {
      perMinute: 5,
      perDay: 250000
    }
  },

  kiro_cli: {
    name: 'kiro_cli',
    displayName: 'Kiro CLI',
    enabled: process.env.KIRO_CLI_ENABLED === 'true',
    type: 'cli',
    endpoints: {
      chat: '/api/kiro-cli/chat',
      generate: '/api/kiro-cli/generate',
      status: '/api/kiro-cli/status',
      openai: '/v1/kiro-cli/chat/completions'
    },
    features: [
      'chat',
      'code-generation',
      'code-analysis',
      'refactoring',
      'streaming',
      'context-aware',
      'mcp-support'
    ]
  }
};

/**
 * Obtient la configuration d'un provider
 */
export function getProviderConfig(providerName: string): ProviderConfig | null {
  return PROVIDERS[providerName] || null;
}

/**
 * Liste tous les providers activés
 */
export function getEnabledProviders(): ProviderConfig[] {
  return Object.values(PROVIDERS).filter(p => p.enabled);
}

/**
 * Vérifie si un provider est activé
 */
export function isProviderEnabled(providerName: string): boolean {
  const provider = PROVIDERS[providerName];
  return provider ? provider.enabled : false;
}

/**
 * Obtient tous les endpoints OpenAI
 */
export function getOpenAIEndpoints(): Record<string, string> {
  const endpoints: Record<string, string> = {};
  
  Object.values(PROVIDERS).forEach(provider => {
    if (provider.enabled && provider.endpoints.openai) {
      endpoints[provider.name] = provider.endpoints.openai;
    }
  });

  return endpoints;
}

/**
 * Configuration des modèles disponibles par provider
 */
export const PROVIDER_MODELS: Record<string, string[]> = {
  gemini_cli: [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ],
  gemini_api_key: [
    'gemini-2.5-flash',
    'gemini-1.5-flash'
  ],
  kiro_cli: [
    'claude-3-5-sonnet',
    'claude-3-opus',
    'gpt-4',
    'gpt-4-turbo'
  ]
};

/**
 * Obtient les modèles disponibles pour un provider
 */
export function getProviderModels(providerName: string): string[] {
  return PROVIDER_MODELS[providerName] || [];
}
