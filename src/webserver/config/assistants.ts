/**
 * Configuration pour le serveur des assistants
 */

export interface AssistantsServerConfig {
  enabled: boolean;
  port: number;
  assistantsPath: string;
  geminiCliPath: string;
  defaultModel: string;
  autoStart: boolean;
  cors: {
    enabled: boolean;
    origins: string[];
  };
  rateLimit: {
    enabled: boolean;
    windowMs: number;
    max: number;
  };
}

export const defaultAssistantsConfig: AssistantsServerConfig = {
  enabled: true,
  port: parseInt(process.env.ASSISTANT_PORT || '25809'),
  assistantsPath: process.env.ASSISTANTS_PATH || './assistant',
  geminiCliPath: process.env.GEMINI_CLI_PATH || 'gemini',
  defaultModel: process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash-exp',
  autoStart: process.env.ASSISTANTS_AUTO_START !== 'false',
  cors: {
    enabled: true,
    origins: ['http://localhost:*', 'http://127.0.0.1:*']
  },
  rateLimit: {
    enabled: false,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite par IP
  }
};

export function getAssistantsConfig(): AssistantsServerConfig {
  return {
    ...defaultAssistantsConfig,
    enabled: process.env.ASSISTANTS_ENABLED !== 'false',
    port: parseInt(process.env.ASSISTANT_PORT || '25809'),
    assistantsPath: process.env.ASSISTANTS_PATH || defaultAssistantsConfig.assistantsPath,
    geminiCliPath: process.env.GEMINI_CLI_PATH || defaultAssistantsConfig.geminiCliPath,
    defaultModel: process.env.GEMINI_DEFAULT_MODEL || defaultAssistantsConfig.defaultModel,
    autoStart: process.env.ASSISTANTS_AUTO_START !== 'false'
  };
}
