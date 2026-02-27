/**
 * Provider Bridge — Gemini CLI Service
 * Wraps Gemini CLI execution using stored Google OAuth credentials
 */

import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';

export class GeminiCliService {
    private isAvailable: boolean | null = null;

    /**
     * Check if Gemini CLI is installed
     */
    async checkAvailability(): Promise<boolean> {
        if (this.isAvailable !== null) return this.isAvailable;

        return new Promise((resolve) => {
            const proc = spawn('gemini', ['--version'], {
                shell: true,
                timeout: 5000,
            });

            let output = '';
            proc.stdout?.on('data', (data) => { output += data.toString(); });
            proc.on('close', (code) => {
                this.isAvailable = code === 0;
                resolve(this.isAvailable);
            });
            proc.on('error', () => {
                this.isAvailable = false;
                resolve(false);
            });
        });
    }

    /**
     * Check if Google OAuth credentials exist
     */
    hasOAuthCredentials(): boolean {
        const credPath = path.join(os.homedir(), '.gemini', 'oauth_creds.json');
        return fs.existsSync(credPath);
    }

    /**
     * Send a chat message via Gemini CLI
     */
    async chat(
        messages: Array<{ role: string; content: string }>,
        options?: { model?: string; timeout?: number }
    ): Promise<{ text: string; model: string }> {
        const available = await this.checkAvailability();
        if (!available) {
            throw new Error('Gemini CLI is not installed or not in PATH. Install with: npm install -g @google/gemini-cli');
        }

        const lastMessage = messages[messages.length - 1];
        if (!lastMessage?.content) {
            throw new Error('No message content provided');
        }

        const args: string[] = [];
        if (options?.model) {
            args.push('--model', options.model);
        }
        args.push(lastMessage.content);

        return new Promise((resolve, reject) => {
            const timeout = options?.timeout || 120000;
            const proc = spawn('gemini', args, {
                shell: true,
                timeout,
                env: { ...process.env, GEMINI_CLI: '1' },
            });

            let stdout = '';
            let stderr = '';

            proc.stdout?.on('data', (data) => { stdout += data.toString(); });
            proc.stderr?.on('data', (data) => { stderr += data.toString(); });

            proc.on('close', (code) => {
                if (code === 0) {
                    resolve({
                        text: stdout.trim(),
                        model: options?.model || 'gemini-cli-default',
                    });
                } else {
                    reject(new Error(`Gemini CLI exited with code ${code}: ${stderr}`));
                }
            });

            proc.on('error', (err) => {
                reject(new Error(`Failed to start Gemini CLI: ${err.message}`));
            });
        });
    }

    /**
     * Get Gemini CLI status
     */
    async getStatus(): Promise<{
        available: boolean;
        hasOAuth: boolean;
        version?: string;
    }> {
        const available = await this.checkAvailability();
        return {
            available,
            hasOAuth: this.hasOAuthCredentials(),
        };
    }
}

// Singleton
let instance: GeminiCliService | null = null;

export function getGeminiCliService(): GeminiCliService {
    if (!instance) {
        instance = new GeminiCliService();
    }
    return instance;
}
