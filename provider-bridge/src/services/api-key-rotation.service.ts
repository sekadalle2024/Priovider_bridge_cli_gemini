/**
 * Provider Bridge — API Key Rotation Service
 * Manages multiple Gemini API keys with round-robin rotation
 */

import crypto from 'crypto';

interface KeyUsage {
    key: string;
    maskedKey: string;
    requestsThisMinute: number;
    totalRequests: number;
    lastReset: number;
    lastUsed: number | null;
    available: boolean;
}

const MAX_REQUESTS_PER_MINUTE = 5;

export class ApiKeyRotationService {
    private keys: string[] = [];
    private usage: KeyUsage[] = [];
    private currentIndex = 0;

    constructor() {
        this.loadKeys();
    }

    /**
     * Load API keys from environment variables
     */
    private loadKeys(): void {
        this.keys = Object.entries(process.env)
            .filter(([key]) => key.startsWith('GEMINI_API_KEY_'))
            .map(([, value]) => value!)
            .filter(Boolean);

        this.usage = this.keys.map((key) => ({
            key,
            maskedKey: key.substring(0, 8) + '...' + key.substring(key.length - 4),
            requestsThisMinute: 0,
            totalRequests: 0,
            lastReset: Date.now(),
            lastUsed: null,
            available: true,
        }));
    }

    /**
     * Get the next available API key (round-robin with rate limiting)
     */
    getNextKey(): { key: string; index: number } | null {
        if (this.keys.length === 0) return null;

        const now = Date.now();
        let attempts = 0;

        while (attempts < this.keys.length) {
            const idx = this.currentIndex % this.keys.length;
            const usage = this.usage[idx];

            // Reset counter if a minute has passed
            if (now - usage.lastReset >= 60000) {
                usage.requestsThisMinute = 0;
                usage.lastReset = now;
                usage.available = true;
            }

            if (usage.requestsThisMinute < MAX_REQUESTS_PER_MINUTE) {
                usage.requestsThisMinute++;
                usage.totalRequests++;
                usage.lastUsed = now;
                this.currentIndex = (idx + 1) % this.keys.length;
                return { key: usage.key, index: idx };
            }

            usage.available = false;
            this.currentIndex = (idx + 1) % this.keys.length;
            attempts++;
        }

        return null; // All keys exhausted
    }

    /**
     * Get usage statistics
     */
    getStats(): {
        totalKeys: number;
        availableKeys: number;
        usage: Array<{
            index: number;
            maskedKey: string;
            requestsThisMinute: number;
            totalRequests: number;
            available: boolean;
        }>;
    } {
        const now = Date.now();
        return {
            totalKeys: this.keys.length,
            availableKeys: this.usage.filter((u) => {
                if (now - u.lastReset >= 60000) return true;
                return u.requestsThisMinute < MAX_REQUESTS_PER_MINUTE;
            }).length,
            usage: this.usage.map((u, i) => ({
                index: i,
                maskedKey: u.maskedKey,
                requestsThisMinute: now - u.lastReset >= 60000 ? 0 : u.requestsThisMinute,
                totalRequests: u.totalRequests,
                available: now - u.lastReset >= 60000 ? true : u.requestsThisMinute < MAX_REQUESTS_PER_MINUTE,
            })),
        };
    }

    /**
     * Call Gemini API with automatic key rotation
     */
    async chat(
        messages: Array<{ role: string; content: string }>,
        options?: { model?: string; temperature?: number; maxTokens?: number }
    ): Promise<{ text: string; model: string; keyIndex: number }> {
        const keyInfo = this.getNextKey();
        if (!keyInfo) {
            throw new Error('All API keys are rate limited. Please wait a moment.');
        }

        const modelName = options?.model || 'gemini-2.5-flash';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${keyInfo.key}`;

        const contents = messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : m.role,
            parts: [{ text: m.content }],
        }));

        const body: Record<string, unknown> = { contents };
        if (options?.temperature !== undefined || options?.maxTokens !== undefined) {
            body.generationConfig = {
                ...(options.temperature !== undefined && { temperature: options.temperature }),
                ...(options.maxTokens !== undefined && { maxOutputTokens: options.maxTokens }),
            };
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Gemini API error: ${response.status} — ${JSON.stringify(errorData)}`);
        }

        const result = (await response.json()) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };

        let text = '';
        if (result.candidates?.[0]?.content?.parts) {
            text = result.candidates[0].content.parts.map((p) => p.text || '').join('');
        }

        return { text, model: modelName, keyIndex: keyInfo.index };
    }

    get keyCount(): number {
        return this.keys.length;
    }
}

// Singleton
let instance: ApiKeyRotationService | null = null;

export function getApiKeyRotationService(): ApiKeyRotationService {
    if (!instance) {
        instance = new ApiKeyRotationService();
    }
    return instance;
}
