/**
 * Provider Bridge — CLI OpenAI-Compatible Router
 *
 * Mounted at /cli in server.ts, this router exposes a complete
 * OpenAI-compatible API that routes exclusively to Gemini CLI (OAuth).
 *
 * n8n / LangChain base URLs:
 *   - http://127.0.0.1:25809/cli
 *   - http://127.0.0.1:25809/v1/cli
 *
 * Endpoints:
 *   GET  /cli/models              → list all available models
 *   POST /cli/chat/completions    → chat via Gemini CLI (OAuth, no API key consumed)
 *   GET  /cli/v1/models           → alias for /cli/models
 *   POST /cli/v1/chat/completions → alias for /cli/chat/completions
 */

import { Router, type Request, type Response } from 'express';
import { optionalAuth } from '../auth/middleware';
import { getGeminiCliService } from '../services/gemini-cli.service';
import { recordUsage } from '../services/stats.service';

const router = Router();

// ── Shared model list ─────────────────────────────────────────────────────────

const GEMINI_MODELS = [
  { id: 'gemini-3-flash',        label: 'Gemini 3 Flash' },
  { id: 'gemini-3-pro',          label: 'Gemini 3 Pro' },
  { id: 'gemini-2.5-flash',      label: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-pro',        label: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
  { id: 'gemini-2.0-flash',      label: 'Gemini 2.0 Flash' },
  { id: 'gemini-1.5-flash',      label: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-pro',        label: 'Gemini 1.5 Pro' },
  { id: 'gemini-exp-1206',       label: 'Gemini Experimental 1206' },
];

/**
 * Resolve the active model list.
 * Reads GEMINI_AVAILABLE_MODELS from .env at runtime so no rebuild is needed
 * when the list changes.
 */
function getModelList(): { id: string; label: string }[] {
  const env = process.env.GEMINI_AVAILABLE_MODELS;
  if (!env) return GEMINI_MODELS;

  const ids = env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return ids.map((id) => {
    const known = GEMINI_MODELS.find((m) => m.id === id);
    return known ?? { id, label: id };
  });
}

// ── GET /models ───────────────────────────────────────────────────────────────

/**
 * GET /cli/models
 *
 * OpenAI-compatible model list for the Gemini CLI (OAuth) provider.
 * n8n fetches this URL automatically when the base URL is set to
 * http://127.0.0.1:25809/cli
 */
router.get('/models', (_req: Request, res: Response) => {
  const models = getModelList().map((m) => ({
    id: m.id,
    object: 'model',
    created: 1677610602,
    owned_by: 'google',
    description: `${m.label} — Gemini CLI OAuth (no API key consumed)`,
  }));

  res.json({ object: 'list', data: models });
});

// ── POST /chat/completions ────────────────────────────────────────────────────

/**
 * POST /cli/chat/completions
 *
 * OpenAI-compatible chat endpoint — always routes to Gemini CLI (OAuth).
 *
 * Body (OpenAI format):
 *   {
 *     "model":    "gemini-2.5-pro",   // any model from /cli/models
 *     "messages": [{ "role": "user", "content": "..." }],
 *     "temperature": 0.7              // ignored by CLI, passed for compatibility
 *   }
 *
 * Notes:
 *   • model defaults to gemini-2.5-pro (confirmed available via OAuth)
 *   • temperature / max_tokens are accepted but not forwarded to the CLI
 *     (the CLI uses its own defaults)
 *   • Model availability depends on your Google account OAuth quota
 */
router.post('/chat/completions', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { messages, model } = req.body as {
      messages?: { role: string; content: string }[];
      model?: string;
    };

    if (!messages?.length) {
      res.status(400).json({
        error: {
          message: 'messages array is required and must not be empty',
          type: 'invalid_request_error',
          param: 'messages',
          code: null,
        },
      });
      return;
    }

    const targetModel = model || 'gemini-2.5-pro';
    const service = getGeminiCliService();

    const result = await service.chat(messages, { model: targetModel });

    if (req.user) {
      await recordUsage({
        userId: req.user.userId,
        provider: 'gemini_cli',
        model: result.model,
      });
    }

    res.json({
      id: `chatcmpl-cli-${Date.now()}`,
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
    res.status(500).json({
      error: {
        message: error.message,
        type: 'api_error',
        param: null,
        code: null,
      },
    });
  }
});

// ── v1 aliases for better OpenAI compatibility ───────────────────────────────

/**
 * GET /cli/v1/models
 * Alias for /cli/models — some tools expect /v1/models path
 */
router.get('/v1/models', (_req: Request, res: Response) => {
  const models = getModelList().map((m) => ({
    id: m.id,
    object: 'model',
    created: 1677610602,
    owned_by: 'google',
    description: `${m.label} — Gemini CLI OAuth (no API key consumed)`,
  }));

  res.json({ object: 'list', data: models });
});

/**
 * POST /cli/v1/chat/completions
 * Alias for /cli/chat/completions — standard OpenAI path
 */
router.post('/v1/chat/completions', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { messages, model } = req.body as {
      messages?: { role: string; content: string }[];
      model?: string;
    };

    if (!messages?.length) {
      res.status(400).json({
        error: {
          message: 'messages array is required and must not be empty',
          type: 'invalid_request_error',
          param: 'messages',
          code: null,
        },
      });
      return;
    }

    const targetModel = model || 'gemini-2.5-pro';
    const service = getGeminiCliService();

    const result = await service.chat(messages, { model: targetModel });

    if (req.user) {
      await recordUsage({
        userId: req.user.userId,
        provider: 'gemini_cli',
        model: result.model,
      });
    }

    res.json({
      id: `chatcmpl-cli-${Date.now()}`,
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
    res.status(500).json({
      error: {
        message: error.message,
        type: 'api_error',
        param: null,
        code: null,
      },
    });
  }
});

export default router;
