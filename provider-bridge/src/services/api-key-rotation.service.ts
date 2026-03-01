/**
 * Provider Bridge — API Key Rotation Service
 * Manages up to 40 Gemini API keys with round-robin rotation,
 * per-minute rate limiting and per-day token tracking.
 *
 * Keys are loaded from environment variables:
 *   GEMINI_API_KEY_1, GEMINI_API_KEY_2, … GEMINI_API_KEY_40
 *
 * Limits (configurable via env):
 *   API_KEY_MAX_REQUESTS_PER_MINUTE  (default: 5)
 *   API_KEY_MAX_TOKENS_PER_DAY       (default: 250 000)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  /** Override the automatically selected key index */
  forceKeyIndex?: number;
}

export interface ChatResult {
  text: string;
  model: string;
  keyIndex: number;
  maskedKey: string;
  tokensUsed: number;
}

interface KeySlot {
  key: string;
  maskedKey: string;
  /** requests fired during the current minute window */
  requestsThisMinute: number;
  /** tokens consumed today */
  tokensToday: number;
  /** total requests since server start */
  totalRequests: number;
  /** total tokens since server start */
  totalTokens: number;
  /** timestamp (ms) when requestsThisMinute was last reset */
  minuteWindowStart: number;
  /** YYYY-MM-DD string for the current daily window */
  dayWindow: string;
  /** number of consecutive errors on this key */
  errorStreak: number;
  /** false when the key has been explicitly disabled */
  enabled: boolean;
  /** ISO timestamp of last successful request */
  lastUsedAt: string | null;
}

export interface KeyStatEntry {
  index: number;
  maskedKey: string;
  enabled: boolean;
  available: boolean;
  requestsThisMinute: number;
  maxRequestsPerMinute: number;
  tokensToday: number;
  maxTokensPerDay: number;
  totalRequests: number;
  totalTokens: number;
  errorStreak: number;
  lastUsedAt: string | null;
}

export interface RotationStats {
  keysConfigured: number;
  keysEnabled: number;
  keysAvailable: number;
  capacityPerMinute: number;
  totalRequestsSinceStart: number;
  totalTokensSinceStart: number;
  maxRequestsPerMinute: number;
  maxTokensPerDay: number;
  keys: KeyStatEntry[];
}

// ─── Supported models ─────────────────────────────────────────────────────────

export const GEMINI_MODELS = [
  // Gemini 2.5 series
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash-preview-05-20',
  // Gemini 2.0 series
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  // Gemini 1.5 series (legacy, still usable)
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  // Experimental / preview
  'gemini-exp-1206',
  'gemini-exp-1121',
] as const;

export type GeminiModelId = (typeof GEMINI_MODELS)[number];

export const DEFAULT_MODEL: GeminiModelId = 'gemini-2.5-flash';

// ─── Helper: current day string ───────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function maskKey(key: string): string {
  if (key.length <= 12) return key.slice(0, 4) + '…';
  return key.slice(0, 8) + '…' + key.slice(-4);
}

// ─── Service ─────────────────────────────────────────────────────────────────

export class ApiKeyRotationService {
  private readonly slots: KeySlot[];
  private readonly maxReqPerMinute: number;
  private readonly maxTokensPerDay: number;
  private currentIndex = 0;

  constructor(keys: string[]) {
    this.maxReqPerMinute = parseInt(process.env.API_KEY_MAX_REQUESTS_PER_MINUTE || '5', 10);
    this.maxTokensPerDay = parseInt(process.env.API_KEY_MAX_TOKENS_PER_DAY || '250000', 10);

    if (!keys || keys.length === 0) {
      console.warn('[ApiKeyRotation] No API keys configured. Add GEMINI_API_KEY_1=... to your .env file.');
      this.slots = [];
      return;
    }

    const day = todayStr();
    const now = Date.now();

    this.slots = keys.map((key) => ({
      key,
      maskedKey: maskKey(key),
      requestsThisMinute: 0,
      tokensToday: 0,
      totalRequests: 0,
      totalTokens: 0,
      minuteWindowStart: now,
      dayWindow: day,
      errorStreak: 0,
      enabled: true,
      lastUsedAt: null,
    }));

    console.log(`[ApiKeyRotation] Initialized — ${this.slots.length} keys, ` + `${this.maxReqPerMinute} req/min per key, ` + `${this.maxTokensPerDay.toLocaleString()} tokens/day per key`);
  }

  // ── Internal: reset counters ──────────────────────────────────────────────

  private refreshSlot(slot: KeySlot): void {
    const now = Date.now();
    const day = todayStr();

    if (now - slot.minuteWindowStart >= 60_000) {
      slot.requestsThisMinute = 0;
      slot.minuteWindowStart = now;
    }

    if (slot.dayWindow !== day) {
      slot.tokensToday = 0;
      slot.dayWindow = day;
    }
  }

  private isAvailable(slot: KeySlot): boolean {
    if (!slot.enabled) return false;
    this.refreshSlot(slot);
    return slot.requestsThisMinute < this.maxReqPerMinute && slot.tokensToday < this.maxTokensPerDay;
  }

  // ── Public: get key count ─────────────────────────────────────────────────

  get keyCount(): number {
    return this.slots.length;
  }

  // ── Public: get next available key ────────────────────────────────────────

  /**
   * Round-robin key selection with rate-limit awareness.
   * Returns { key, index } or null when every key is exhausted.
   */
  getNextKey(): { key: string; index: number } | null {
    // Scan all slots starting from currentIndex
    for (let attempt = 0; attempt < this.slots.length; attempt++) {
      const idx = (this.currentIndex + attempt) % this.slots.length;
      const slot = this.slots[idx];
      if (this.isAvailable(slot)) {
        slot.requestsThisMinute++;
        slot.totalRequests++;
        slot.lastUsedAt = new Date().toISOString();
        // Advance for next call
        this.currentIndex = (idx + 1) % this.slots.length;
        console.log(`[ApiKeyRotation] Key ${idx + 1}/${this.slots.length} — ` + `${slot.requestsThisMinute}/${this.maxReqPerMinute} req/min`);
        return { key: slot.key, index: idx };
      }
    }

    console.warn('[ApiKeyRotation] All keys exhausted — wait for rate-limit window to reset.');
    return null;
  }

  // ── Public: record token usage ────────────────────────────────────────────

  recordTokens(keyIndex: number, tokens: number): void {
    const slot = this.slots[keyIndex];
    if (!slot) return;
    slot.tokensToday += tokens;
    slot.totalTokens += tokens;
  }

  // ── Public: record error ──────────────────────────────────────────────────

  recordError(keyIndex: number): void {
    const slot = this.slots[keyIndex];
    if (!slot) return;
    slot.errorStreak++;
    // Auto-disable after 5 consecutive errors (quota exhausted / invalid key)
    if (slot.errorStreak >= 5) {
      slot.enabled = false;
      console.error(`[ApiKeyRotation] Key ${keyIndex + 1} disabled after ${slot.errorStreak} consecutive errors.`);
    }
  }

  recordSuccess(keyIndex: number): void {
    const slot = this.slots[keyIndex];
    if (!slot) return;
    slot.errorStreak = 0;
  }

  // ── Public: enable / disable ──────────────────────────────────────────────

  enableKey(index: number): void {
    const slot = this.slots[index];
    if (slot) {
      slot.enabled = true;
      slot.errorStreak = 0;
    }
  }

  disableKey(index: number): void {
    const slot = this.slots[index];
    if (slot) slot.enabled = false;
  }

  // ── Public: chat ──────────────────────────────────────────────────────────

  /**
   * Send messages to the Gemini API using the next available key.
   * Automatically falls back to the next key on rate-limit / invalid-key errors.
   */
  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResult> {
    if (this.slots.length === 0) {
      throw new Error('No Gemini API keys configured. ' + 'Add GEMINI_API_KEY_1=your_key to provider-bridge/.env and restart the server.');
    }

    const modelName = options.model || DEFAULT_MODEL;

    // Validate model name (warn but do not block custom model IDs)
    if (!(GEMINI_MODELS as readonly string[]).includes(modelName)) {
      console.warn(`[ApiKeyRotation] Unknown model "${modelName}" — proceeding anyway.`);
    }

    // Try keys in order until one succeeds
    for (let attempt = 0; attempt < this.slots.length; attempt++) {
      const keyInfo = options.forceKeyIndex !== undefined ? { key: this.slots[options.forceKeyIndex]?.key, index: options.forceKeyIndex } : this.getNextKey();

      if (!keyInfo) {
        throw new Error('All Gemini API keys are rate-limited or exhausted. ' + 'Wait ~1 minute and retry, or add more GEMINI_API_KEY_* entries.');
      }

      try {
        const result = await this._callApi(keyInfo.key, modelName, messages, options);
        this.recordSuccess(keyInfo.index);
        this.recordTokens(keyInfo.index, result.tokensUsed);
        return {
          ...result,
          keyIndex: keyInfo.index,
          maskedKey: this.slots[keyInfo.index].maskedKey,
        };
      } catch (err: any) {
        const status = err?.status ?? err?.code;
        const msg = typeof err.message === 'string' ? err.message : '';

        const isRateLimit = status === 429 || /quota|rate.?limit|resource.?exhausted/i.test(msg);

        // Permanent key errors: leaked key, invalid key, project disabled, etc.
        // These must be skipped AND the key disabled so it is never retried.
        const isPermanentKeyError = (status === 403 && /leaked|reported|invalid.?api.?key|api.?key.?not.?valid|disabled|permission/i.test(msg)) || (status === 400 && /api.?key.?not.?valid|invalid.?key/i.test(msg)) || /your api key was reported/i.test(msg) || /api key not valid/i.test(msg);

        this.recordError(keyInfo.index);

        if (isRateLimit) {
          console.warn(`[ApiKeyRotation] Key ${keyInfo.index + 1} rate-limited — trying next key.`);
          continue; // retry with next key
        }

        if (isPermanentKeyError) {
          // Permanently disable this key so it is never selected again
          this.disableKey(keyInfo.index);
          console.warn(`[ApiKeyRotation] Key ${keyInfo.index + 1} permanently disabled` + ` (${status ?? 'err'}: ${msg.slice(0, 80)}) — trying next key.`);
          continue; // rotate to next key
        }

        // Unknown / transient error: re-throw immediately
        throw err;
      }
    }

    throw new Error('All API keys failed. Check your GEMINI_API_KEY_* values.');
  }

  // ── Internal: raw API call ────────────────────────────────────────────────

  private async _callApi(apiKey: string, model: string, messages: ChatMessage[], options: ChatOptions): Promise<{ text: string; model: string; tokensUsed: number }> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/` + `${model}:generateContent?key=${apiKey}`;

    // Map roles: 'assistant' → 'model', others pass through
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      parts: [{ text: m.content }],
    }));

    const body: Record<string, unknown> = { contents };

    // Generation config — only pass values that are valid for the Gemini API
    const genCfg: Record<string, unknown> = {};

    // temperature must be in [0, 2]
    if (options.temperature !== undefined && options.temperature !== null) {
      const temp = Number(options.temperature);
      if (!isNaN(temp) && temp >= 0 && temp <= 2) {
        genCfg.temperature = temp;
      } else {
        console.warn(`[ApiKeyRotation] Ignoring invalid temperature=${options.temperature} (must be 0–2)`);
      }
    }

    // maxOutputTokens must be a positive integer
    if (options.maxTokens !== undefined && options.maxTokens !== null) {
      const tokens = Math.floor(Number(options.maxTokens));
      if (!isNaN(tokens) && tokens >= 1) {
        genCfg.maxOutputTokens = tokens;
      } else {
        console.warn(`[ApiKeyRotation] Ignoring invalid maxTokens=${options.maxTokens} (must be >= 1)`);
      }
    }

    if (options.topP !== undefined) genCfg.topP = options.topP;
    if (options.topK !== undefined) genCfg.topK = options.topK;
    if (Object.keys(genCfg).length > 0) body.generationConfig = genCfg;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
      const msg = (err as any)?.error?.message ?? JSON.stringify(err);
      const error: any = new Error(`Gemini API ${res.status}: ${msg}`);
      error.status = res.status;
      throw error;
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    };

    // Extract text
    let text = '';
    if (data.candidates?.[0]?.content?.parts) {
      text = data.candidates[0].content.parts.map((p) => p.text ?? '').join('');
    }

    const tokensUsed = data.usageMetadata?.totalTokenCount ?? 0;

    return { text, model, tokensUsed };
  }

  // ── Public: statistics ────────────────────────────────────────────────────

  getStats(): RotationStats {
    const now = Date.now();
    const day = todayStr();

    let totalRequests = 0;
    let totalTokens = 0;
    let keysAvailable = 0;
    let keysEnabled = 0;

    const keys: KeyStatEntry[] = this.slots.map((slot, idx) => {
      // Snapshot-refresh without mutating (for reporting)
      const reqThisMin = now - slot.minuteWindowStart < 60_000 ? slot.requestsThisMinute : 0;
      const tokToday = slot.dayWindow === day ? slot.tokensToday : 0;

      const available = slot.enabled && reqThisMin < this.maxReqPerMinute && tokToday < this.maxTokensPerDay;

      if (slot.enabled) keysEnabled++;
      if (available) keysAvailable++;
      totalRequests += slot.totalRequests;
      totalTokens += slot.totalTokens;

      return {
        index: idx,
        maskedKey: slot.maskedKey,
        enabled: slot.enabled,
        available,
        requestsThisMinute: reqThisMin,
        maxRequestsPerMinute: this.maxReqPerMinute,
        tokensToday: tokToday,
        maxTokensPerDay: this.maxTokensPerDay,
        totalRequests: slot.totalRequests,
        totalTokens: slot.totalTokens,
        errorStreak: slot.errorStreak,
        lastUsedAt: slot.lastUsedAt,
      };
    });

    return {
      keysConfigured: this.slots.length,
      keysEnabled,
      keysAvailable,
      capacityPerMinute: keysAvailable * this.maxReqPerMinute,
      totalRequestsSinceStart: totalRequests,
      totalTokensSinceStart: totalTokens,
      maxRequestsPerMinute: this.maxReqPerMinute,
      maxTokensPerDay: this.maxTokensPerDay,
      keys,
    };
  }
}

// ─── Key loading ──────────────────────────────────────────────────────────────

/**
 * Load all GEMINI_API_KEY_* environment variables (sorted numerically).
 * Also accepts a bare GEMINI_API_KEY as key #0 if no indexed keys are found.
 */
export function loadApiKeysFromEnv(): string[] {
  const indexed: Array<[number, string]> = [];

  for (const [envVar, value] of Object.entries(process.env)) {
    if (!value?.trim()) continue;

    const match = envVar.match(/^GEMINI_API_KEY_(\d+)$/);
    if (match) {
      indexed.push([parseInt(match[1], 10), value.trim()]);
    }
  }

  // Sort by numeric suffix so key order is deterministic
  indexed.sort(([a], [b]) => a - b);
  const keys = indexed.map(([, v]) => v);

  // Fallback: bare GEMINI_API_KEY
  if (keys.length === 0 && process.env.GEMINI_API_KEY?.trim()) {
    keys.push(process.env.GEMINI_API_KEY.trim());
  }

  console.log(`[ApiKeyRotation] Loaded ${keys.length} API key(s) from environment.`);
  return keys;
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _instance: ApiKeyRotationService | null = null;

export function getApiKeyRotationService(): ApiKeyRotationService {
  if (!_instance) {
    const keys = loadApiKeysFromEnv();
    _instance = new ApiKeyRotationService(keys);
  }
  return _instance;
}

/** Reset singleton (useful in tests). */
export function resetApiKeyRotationService(): void {
  _instance = null;
}
