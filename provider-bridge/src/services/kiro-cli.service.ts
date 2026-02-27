/**
 * Provider Bridge — Kiro CLI Service
 * Wraps Kiro CLI execution via child_process
 */

import { spawn } from 'child_process';

export class KiroCliService {
    private isAvailable: boolean | null = null;
    private cliPath: string;

    constructor() {
        this.cliPath = process.env.KIRO_CLI_PATH || 'kiro';
    }

    /**
     * Check if Kiro CLI is installed
     */
    async checkAvailability(): Promise<boolean> {
        if (this.isAvailable !== null) return this.isAvailable;

        return new Promise((resolve) => {
            const proc = spawn(this.cliPath, ['--version'], {
                shell: true,
                timeout: 5000,
            });

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
     * Send a chat message via Kiro CLI
     */
    async chat(
        messages: Array<{ role: string; content: string }>,
        options?: { model?: string; timeout?: number }
    ): Promise<{ text: string; model: string }> {
        const available = await this.checkAvailability();
        if (!available) {
            throw new Error('Kiro CLI is not installed or not in PATH');
        }

        const lastMessage = messages[messages.length - 1];
        if (!lastMessage?.content) {
            throw new Error('No message content provided');
        }

        const args: string[] = ['chat', '--message', lastMessage.content];
        if (options?.model) {
            args.push('--model', options.model);
        }

        return new Promise((resolve, reject) => {
            const timeout = options?.timeout || 120000;
            const proc = spawn(this.cliPath, args, {
                shell: true,
                timeout,
            });

            let stdout = '';
            let stderr = '';

            proc.stdout?.on('data', (data) => { stdout += data.toString(); });
            proc.stderr?.on('data', (data) => { stderr += data.toString(); });

            proc.on('close', (code) => {
                if (code === 0) {
                    resolve({
                        text: stdout.trim(),
                        model: options?.model || 'kiro-default',
                    });
                } else {
                    reject(new Error(`Kiro CLI exited with code ${code}: ${stderr}`));
                }
            });

            proc.on('error', (err) => {
                reject(new Error(`Failed to start Kiro CLI: ${err.message}`));
            });
        });
    }

    /**
     * Get Kiro CLI status
     */
    async getStatus(): Promise<{ available: boolean; version?: string }> {
        const available = await this.checkAvailability();
        return { available };
    }
}

// Singleton
let instance: KiroCliService | null = null;

export function getKiroCliService(): KiroCliService {
    if (!instance) {
        instance = new KiroCliService();
    }
    return instance;
}
