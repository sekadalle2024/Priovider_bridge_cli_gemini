/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Service de rotation des clés API Gemini
 * Gère automatiquement la rotation entre plusieurs clés API pour respecter les limites
 * 
 * Limites par clé:
 * - 5 requêtes par minute
 * - 250,000 tokens par jour
 */

interface ApiKeyUsage {
  key: string;
  requestsThisMinute: number;
  tokensToday: number;
  lastRequestTime: number;
  lastResetMinute: number;
  lastResetDay: string;
}

export class ApiKeyRotationService {
  private keys: ApiKeyUsage[] = [];
  private currentIndex = 0;
  private readonly maxRequestsPerMinute = 5;
  private readonly maxTokensPerDay = 250000;

  constructor(apiKeys: string[]) {
    if (!apiKeys || apiKeys.length === 0) {
      throw new Error('Au moins une clé API est requise');
    }

    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    this.keys = apiKeys.map(key => ({
      key,
      requestsThisMinute: 0,
      tokensToday: 0,
      lastRequestTime: now,
      lastResetMinute: now,
      lastResetDay: today,
    }));

    console.log(`[ApiKeyRotation] Initialized with ${this.keys.length} API keys`);
  }

  /**
   * Obtenir la prochaine clé API disponible
   */
  getNextAvailableKey(): string {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    // Réinitialiser les compteurs si nécessaire
    this.resetCountersIfNeeded(now, today);

    // Chercher une clé disponible
    let attempts = 0;
    const maxAttempts = this.keys.length * 2;

    while (attempts < maxAttempts) {
      const keyUsage = this.keys[this.currentIndex];

      // Vérifier si la clé est disponible
      if (this.isKeyAvailable(keyUsage)) {
        const selectedKey = keyUsage.key;
        console.log(`[ApiKeyRotation] Selected key index ${this.currentIndex} (${attempts + 1} attempts)`);
        
        // Passer à la clé suivante pour la prochaine fois
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        
        return selectedKey;
      }

      // Passer à la clé suivante
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      attempts++;
    }

    // Aucune clé disponible
    throw new Error('Toutes les clés API ont atteint leurs limites. Veuillez réessayer plus tard.');
  }

  /**
   * Enregistrer l'utilisation d'une clé
   */
  recordUsage(apiKey: string, tokensUsed: number = 0): void {
    const keyUsage = this.keys.find(k => k.key === apiKey);
    if (!keyUsage) {
      console.warn(`[ApiKeyRotation] Key not found for recording usage`);
      return;
    }

    const now = Date.now();
    keyUsage.requestsThisMinute++;
    keyUsage.tokensToday += tokensUsed;
    keyUsage.lastRequestTime = now;

    console.log(`[ApiKeyRotation] Usage recorded: ${keyUsage.requestsThisMinute}/${this.maxRequestsPerMinute} req/min, ${keyUsage.tokensToday}/${this.maxTokensPerDay} tokens/day`);
  }

  /**
   * Vérifier si une clé est disponible
   */
  private isKeyAvailable(keyUsage: ApiKeyUsage): boolean {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    // Réinitialiser le compteur de minute si nécessaire
    if (now - keyUsage.lastResetMinute >= 60000) {
      keyUsage.requestsThisMinute = 0;
      keyUsage.lastResetMinute = now;
    }

    // Réinitialiser le compteur de jour si nécessaire
    if (keyUsage.lastResetDay !== today) {
      keyUsage.tokensToday = 0;
      keyUsage.lastResetDay = today;
    }

    // Vérifier les limites
    const hasMinuteCapacity = keyUsage.requestsThisMinute < this.maxRequestsPerMinute;
    const hasDayCapacity = keyUsage.tokensToday < this.maxTokensPerDay;

    return hasMinuteCapacity && hasDayCapacity;
  }

  /**
   * Réinitialiser les compteurs si nécessaire
   */
  private resetCountersIfNeeded(now: number, today: string): void {
    for (const keyUsage of this.keys) {
      // Réinitialiser le compteur de minute
      if (now - keyUsage.lastResetMinute >= 60000) {
        keyUsage.requestsThisMinute = 0;
        keyUsage.lastResetMinute = now;
      }

      // Réinitialiser le compteur de jour
      if (keyUsage.lastResetDay !== today) {
        keyUsage.tokensToday = 0;
        keyUsage.lastResetDay = today;
      }
    }
  }

  /**
   * Obtenir les statistiques d'utilisation
   */
  getUsageStats(): {
    totalKeys: number;
    availableKeys: number;
    usage: Array<{
      index: number;
      requestsThisMinute: number;
      tokensToday: number;
      available: boolean;
    }>;
  } {
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];
    this.resetCountersIfNeeded(now, today);

    const usage = this.keys.map((keyUsage, index) => ({
      index,
      requestsThisMinute: keyUsage.requestsThisMinute,
      tokensToday: keyUsage.tokensToday,
      available: this.isKeyAvailable(keyUsage),
    }));

    return {
      totalKeys: this.keys.length,
      availableKeys: usage.filter(u => u.available).length,
      usage,
    };
  }
}

/**
 * Charger les clés API depuis les variables d'environnement
 */
export function loadApiKeysFromEnv(): string[] {
  const keys: string[] = [];

  // Charger toutes les clés API depuis les variables d'environnement
  const envKeys = Object.keys(process.env).filter(key => 
    key.startsWith('GEMINI_API_KEY_')
  );

  for (const envKey of envKeys) {
    const apiKey = process.env[envKey];
    if (apiKey && apiKey.trim()) {
      keys.push(apiKey.trim());
    }
  }

  console.log(`[ApiKeyRotation] Loaded ${keys.length} API keys from environment`);
  return keys;
}

// Instance singleton
let rotationServiceInstance: ApiKeyRotationService | null = null;

/**
 * Obtenir l'instance singleton du service de rotation
 */
export function getApiKeyRotationService(): ApiKeyRotationService {
  if (!rotationServiceInstance) {
    const keys = loadApiKeysFromEnv();
    if (keys.length === 0) {
      throw new Error('Aucune clé API trouvée dans les variables d\'environnement');
    }
    rotationServiceInstance = new ApiKeyRotationService(keys);
  }
  return rotationServiceInstance;
}
