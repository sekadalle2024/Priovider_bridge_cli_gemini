/**
 * Provider Bridge — Provider Routes
 * Unified API endpoints for Gemini CLI, Gemini API Key Rotative, Kiro CLI
 * Also includes OpenAI-compatible endpoints for n8n/LangChain
 */

import { Router, type Request, type Response } from 'express';
import { requireAuth, optionalAuth } from '../auth/middleware';
import { getGeminiCliService } from '../services/gemini-cli.service';
import { getApiKeyRotationService } from '../services/api-key-rotation.service';
import { getKiroCliService } from '../services/kiro-cli.service';
import { getN8nService } from '../services/n8n.service';
import { recordUsage } from '../services/stats.service';

const router = Router();

// ============================================================
// Common endpoints
// ============================================================

/**
 * GET /api/providers — List available providers and their status
 */
router.get('/providers', async (req: Request, res: Response) => {
    const geminiCli = getGeminiCliService();
    const apiKeyRotation = getApiKeyRotationService();
    const kiroCli = getKiroCliService();
    const n8nService = getN8nService();

    const [geminiStatus, kiroStatus, n8nStatus] = await Promise.all([
        geminiCli.getStatus(),
        kiroCli.getStatus(),
        n8nService.getStatus(),
    ]);

    res.json({
        providers: [
            {
                id: 'gemini_cli',
                name: 'Gemini CLI',
                description: 'Google Gemini via CLI with OAuth authentication',
                available: geminiStatus.available,
                hasOAuth: geminiStatus.hasOAuth,
                endpoints: {
                    chat: 'POST /api/providers/gemini_cli/chat',
                    generate: 'POST /api/providers/gemini_cli/generate',
                },
            },
            {
                id: 'gemini_api_key_rotative',
                name: 'Gemini API Key Rotative',
                description: 'Gemini API with automatic key rotation (5 req/min per key)',
                available: apiKeyRotation.keyCount > 0,
                keysLoaded: apiKeyRotation.keyCount,
                endpoints: {
                    chat: 'POST /api/providers/gemini_api_key_rotative/chat',
                    generate: 'POST /api/providers/gemini_api_key_rotative/generate',
                    stats: 'GET /api/providers/gemini_api_key_rotative/stats',
                },
            },
            {
                id: 'kiro_cli',
                name: 'Kiro CLI',
                description: 'Amazon Kiro via CLI',
                available: kiroStatus.available,
                endpoints: {
                    chat: 'POST /api/providers/kiro_cli/chat',
                    generate: 'POST /api/providers/kiro_cli/generate',
                },
            },
            {
                id: 'n8n',
                name: 'N8N Workflow',
                description: 'Custom integration workflow via N8N',
                available: n8nStatus.available,
                endpoints: {
                    chat: 'POST /api/providers/n8n/chat',
                    generate: 'POST /api/providers/n8n/generate',
                },
            }
        ],
    });
});

/**
 * GET /api/providers/models — List available models
 */
router.get('/providers/models', (req: Request, res: Response) => {
    res.json({
        models: [
            { id: 'gemini-2.5-pro', provider: 'gemini_cli', name: 'Gemini 2.5 Pro' },
            { id: 'gemini-2.5-flash', provider: 'gemini_api_key_rotative', name: 'Gemini 2.5 Flash' },
            { id: 'gemini-2.5-flash-lite', provider: 'gemini_api_key_rotative', name: 'Gemini 2.5 Flash Lite' },
            { id: 'gemini-2.0-flash', provider: 'gemini_api_key_rotative', name: 'Gemini 2.0 Flash' },
            { id: 'kiro-default', provider: 'kiro_cli', name: 'Kiro Default' },
            { id: 'n8n-workflow', provider: 'n8n', name: 'N8N Custom Workflow' },
        ],
    });
});

// ============================================================
// Gemini CLI endpoints
// ============================================================

router.post('/providers/gemini_cli/chat', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { messages, model, options } = req.body;
        if (!messages?.length) {
            res.status(400).json({ error: 'No messages provided' });
            return;
        }

        const service = getGeminiCliService();
        const result = await service.chat(messages, {
            model: model || options?.model,
            timeout: options?.timeout,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'gemini_cli', model: result.model });
        }

        res.json({
            model: result.model,
            provider: 'gemini_cli',
            created_at: new Date().toISOString(),
            message: { role: 'assistant', content: result.text },
            done: true,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message, provider: 'gemini_cli' });
    }
});

router.post('/providers/gemini_cli/generate', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { prompt, model, options } = req.body;
        if (!prompt) {
            res.status(400).json({ error: 'No prompt provided' });
            return;
        }

        const service = getGeminiCliService();
        const result = await service.chat([{ role: 'user', content: prompt }], {
            model: model || options?.model,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'gemini_cli', model: result.model });
        }

        res.json({
            model: result.model,
            provider: 'gemini_cli',
            created_at: new Date().toISOString(),
            response: result.text,
            done: true,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message, provider: 'gemini_cli' });
    }
});

// ============================================================
// Gemini API Key Rotative endpoints
// ============================================================

router.post('/providers/gemini_api_key_rotative/chat', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { messages, model, options } = req.body;
        if (!messages?.length) {
            res.status(400).json({ error: 'No messages provided' });
            return;
        }

        const service = getApiKeyRotationService();
        const result = await service.chat(messages, {
            model: model || options?.model,
            temperature: options?.temperature,
            maxTokens: options?.max_tokens,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'gemini_api_key_rotative', model: result.model });
        }

        res.json({
            model: result.model,
            provider: 'gemini_api_key_rotative',
            created_at: new Date().toISOString(),
            message: { role: 'assistant', content: result.text },
            done: true,
            keyUsed: `Key ${result.keyIndex + 1}/${service.keyCount}`,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message, provider: 'gemini_api_key_rotative' });
    }
});

router.post('/providers/gemini_api_key_rotative/generate', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { prompt, model, options } = req.body;
        if (!prompt) {
            res.status(400).json({ error: 'No prompt provided' });
            return;
        }

        const service = getApiKeyRotationService();
        const result = await service.chat([{ role: 'user', content: prompt }], {
            model: model || options?.model,
            temperature: options?.temperature,
            maxTokens: options?.max_tokens,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'gemini_api_key_rotative', model: result.model });
        }

        res.json({
            model: result.model,
            provider: 'gemini_api_key_rotative',
            created_at: new Date().toISOString(),
            response: result.text,
            done: true,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message, provider: 'gemini_api_key_rotative' });
    }
});

router.get('/providers/gemini_api_key_rotative/stats', (req: Request, res: Response) => {
    const service = getApiKeyRotationService();
    res.json(service.getStats());
});

// ============================================================
// Kiro CLI endpoints
// ============================================================

router.post('/providers/kiro_cli/chat', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { messages, model, options } = req.body;
        if (!messages?.length) {
            res.status(400).json({ error: 'No messages provided' });
            return;
        }

        const service = getKiroCliService();
        const result = await service.chat(messages, {
            model: model || options?.model,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'kiro_cli', model: result.model });
        }

        res.json({
            model: result.model,
            provider: 'kiro_cli',
            created_at: new Date().toISOString(),
            message: { role: 'assistant', content: result.text },
            done: true,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message, provider: 'kiro_cli' });
    }
});

router.post('/providers/kiro_cli/generate', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { prompt, model, options } = req.body;
        if (!prompt) {
            res.status(400).json({ error: 'No prompt provided' });
            return;
        }

        const service = getKiroCliService();
        const result = await service.chat([{ role: 'user', content: prompt }], {
            model: model || options?.model,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'kiro_cli', model: result.model });
        }

        res.json({
            model: result.model,
            provider: 'kiro_cli',
            created_at: new Date().toISOString(),
            response: result.text,
            done: true,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message, provider: 'kiro_cli' });
    }
});

// ============================================================
// N8N endpoints
// ============================================================

router.post('/providers/n8n/chat', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { messages, model, options } = req.body;
        if (!messages?.length) {
            res.status(400).json({ error: 'No messages provided' });
            return;
        }

        const service = getN8nService();
        const result = await service.chat(messages, {
            timeout: options?.timeout,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'n8n', model: result.model });
        }

        res.json({
            model: result.model,
            provider: 'n8n',
            created_at: new Date().toISOString(),
            message: { role: 'assistant', content: result.text },
            done: true,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message, provider: 'n8n' });
    }
});

router.post('/providers/n8n/generate', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { prompt, model, options } = req.body;
        if (!prompt) {
            res.status(400).json({ error: 'No prompt provided' });
            return;
        }

        const service = getN8nService();
        const result = await service.chat([{ role: 'user', content: prompt }], {
            timeout: options?.timeout,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'n8n', model: result.model });
        }

        res.json({
            model: result.model,
            provider: 'n8n',
            created_at: new Date().toISOString(),
            response: result.text,
            done: true,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message, provider: 'n8n' });
    }
});

// ============================================================
// OpenAI-compatible endpoints (for n8n / LangChain)
// ============================================================

/**
 * POST /v1/chat/completions — OpenAI-compatible chat endpoint
 */
router.post('/v1/chat/completions', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { messages, model, temperature, max_tokens } = req.body;
        if (!messages?.length) {
            res.status(400).json({ error: { message: 'No messages provided', type: 'invalid_request_error' } });
            return;
        }

        // Route to appropriate provider based on model
        const service = getApiKeyRotationService();
        const result = await service.chat(messages, {
            model: model || 'gemini-2.5-flash',
            temperature,
            maxTokens: max_tokens,
        });

        if (req.user) {
            recordUsage({ userId: req.user.userId, provider: 'gemini_api_key_rotative', model: result.model });
        }

        res.json({
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion',
            created: Math.floor(Date.now() / 1000),
            model: result.model,
            choices: [
                {
                    index: 0,
                    message: { role: 'assistant', content: result.text },
                    finish_reason: 'stop',
                },
            ],
            usage: {
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0,
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: { message: error.message, type: 'api_error' } });
    }
});

/**
 * GET /v1/models — OpenAI-compatible models list
 */
router.get('/v1/models', (req: Request, res: Response) => {
    res.json({
        object: 'list',
        data: [
            { id: 'gemini-2.5-flash', object: 'model', created: 1677610602, owned_by: 'google' },
            { id: 'gemini-2.5-pro', object: 'model', created: 1677610602, owned_by: 'google' },
            { id: 'gemini-2.5-flash-lite', object: 'model', created: 1677610602, owned_by: 'google' },
            { id: 'gemini-2.0-flash', object: 'model', created: 1677610602, owned_by: 'google' },
        ],
    });
});

// ============================================================
// Ollama-compatible endpoints
// ============================================================

/**
 * GET /api/tags — Ollama-compatible model list
 */
router.get('/tags', (req: Request, res: Response) => {
    res.json({
        models: [
            { name: 'gemini-2.5-flash', model: 'gemini-2.5-flash', modified_at: new Date().toISOString(), size: 0 },
            { name: 'gemini-2.5-pro', model: 'gemini-2.5-pro', modified_at: new Date().toISOString(), size: 0 },
            { name: 'gemini-2.5-flash-lite', model: 'gemini-2.5-flash-lite', modified_at: new Date().toISOString(), size: 0 },
        ],
    });
});

/**
 * GET /api/version — API version info
 */
router.get('/version', (req: Request, res: Response) => {
    const keyRotation = getApiKeyRotationService();
    res.json({
        version: '1.0.0',
        name: 'Provider Bridge Endpoint',
        providers: ['gemini_cli', 'gemini_api_key_rotative', 'kiro_cli'],
        apiKeysLoaded: keyRotation.keyCount,
    });
});

export default router;
