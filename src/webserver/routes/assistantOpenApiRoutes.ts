/**
 * Routes OpenAPI compatibles pour n8n
 * Format standardisé pour l'intégration avec n8n et autres outils
 */

import { Router, Request, Response } from 'express';
import { getAssistantService, AssistantRequest, AVAILABLE_GEMINI_MODELS } from '../services/AssistantService';

const router = Router();

/**
 * @swagger
 * /api/v1/chat/completions:
 *   post:
 *     summary: OpenAPI compatible chat endpoint (format OpenAI)
 *     description: Endpoint compatible avec le format OpenAI pour n8n et autres outils
 *     tags: [OpenAPI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [system, user, assistant]
 *                     content:
 *                       type: string
 *               model:
 *                 type: string
 *                 enum: [gemini-3-flash, gemini-3-pro, gemini-2.5-flash, gemini-2.5-pro, gemini-2.5-flash-lite, gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro, gemini-exp-1206]
 *                 default: gemini-2.0-flash-exp
 *               temperature:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 2
 *                 default: 0.7
 *               max_tokens:
 *                 type: number
 *                 default: 2048
 *               stream:
 *                 type: boolean
 *                 default: false
 *               assistant:
 *                 type: string
 *                 description: Nom de l'assistant à utiliser (optionnel)
 *     responses:
 *       200:
 *         description: Réponse du chat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 object:
 *                   type: string
 *                   example: chat.completion
 *                 created:
 *                   type: number
 *                 model:
 *                   type: string
 *                 choices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       index:
 *                         type: number
 *                       message:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                           content:
 *                             type: string
 *                       finish_reason:
 *                         type: string
 *                 usage:
 *                   type: object
 *                   properties:
 *                     prompt_tokens:
 *                       type: number
 *                     completion_tokens:
 *                       type: number
 *                     total_tokens:
 *                       type: number
 */
router.post('/v1/chat/completions', async (req: Request, res: Response) => {
  try {
    const { messages, model, temperature, max_tokens, stream, assistant } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Missing required field: messages',
          type: 'invalid_request_error',
          code: 'missing_messages'
        }
      });
    }

    // Construire le prompt à partir des messages
    const prompt = messages
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const service = getAssistantService();
    
    // Vérifier que Gemini CLI est disponible
    const geminiAvailable = await service.checkGeminiCli();
    if (!geminiAvailable) {
      return res.status(503).json({
        error: {
          message: 'Gemini CLI is not available',
          type: 'service_unavailable',
          code: 'gemini_cli_unavailable'
        }
      });
    }

    // Vérifier que le modèle est disponible
    const selectedModel = model || process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash-exp';
    if (!service.isModelAvailable(selectedModel)) {
      return res.status(400).json({
        error: {
          message: `Model '${selectedModel}' is not available`,
          type: 'invalid_request_error',
          code: 'invalid_model'
        }
      });
    }

    const request: AssistantRequest = {
      prompt,
      model: selectedModel,
      temperature,
      maxTokens: max_tokens,
      stream
    };

    let result;
    if (assistant) {
      // Utiliser un assistant spécifique
      result = await service.executeAssistant(assistant, request);
    } else {
      // Exécution directe via Gemini CLI
      const directResult = await (service as any).runGeminiCli(prompt, selectedModel);
      result = {
        success: true,
        result: directResult
      };
    }

    if (!result.success) {
      return res.status(400).json({
        error: {
          message: result.error || 'Unknown error',
          type: 'api_error',
          code: 'execution_failed'
        }
      });
    }

    // Format de réponse compatible OpenAI
    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: selectedModel,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: result.result
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: Math.ceil(prompt.length / 4),
        completion_tokens: Math.ceil((result.result?.length || 0) / 4),
        total_tokens: Math.ceil((prompt.length + (result.result?.length || 0)) / 4)
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'api_error',
        code: 'internal_error'
      }
    });
  }
});

/**
 * @swagger
 * /api/v1/models:
 *   get:
 *     summary: Liste tous les modèles disponibles (format OpenAI)
 *     tags: [OpenAPI]
 *     responses:
 *       200:
 *         description: Liste des modèles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 object:
 *                   type: string
 *                   example: list
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       object:
 *                         type: string
 *                       created:
 *                         type: number
 *                       owned_by:
 *                         type: string
 */
router.get('/v1/models', async (req: Request, res: Response) => {
  try {
    const service = getAssistantService();
    const models = service.getAvailableModels();

    const response = {
      object: 'list',
      data: models.map(model => ({
        id: model,
        object: 'model',
        created: Math.floor(Date.now() / 1000),
        owned_by: 'google',
        permission: [],
        root: model,
        parent: null
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'api_error',
        code: 'internal_error'
      }
    });
  }
});

/**
 * @swagger
 * /api/v1/assistants:
 *   get:
 *     summary: Liste tous les assistants disponibles (format OpenAI)
 *     tags: [OpenAPI]
 *     responses:
 *       200:
 *         description: Liste des assistants
 */
router.get('/v1/assistants', async (req: Request, res: Response) => {
  try {
    const service = getAssistantService();
    const assistants = await service.discoverAssistants();

    const response = {
      object: 'list',
      data: assistants.map(assistant => ({
        id: assistant.name,
        object: 'assistant',
        created_at: Math.floor(Date.now() / 1000),
        name: assistant.displayName,
        description: assistant.description,
        model: process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash-exp',
        instructions: `Assistant: ${assistant.displayName}`,
        tools: assistant.capabilities.map(cap => ({
          type: 'function',
          function: {
            name: cap.toLowerCase().replace(/\s+/g, '_'),
            description: cap
          }
        })),
        metadata: {
          endpoint: assistant.endpoint,
          capabilities: assistant.capabilities
        }
      }))
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'api_error',
        code: 'internal_error'
      }
    });
  }
});

/**
 * @swagger
 * /api/v1/assistants/{assistant_id}/chat:
 *   post:
 *     summary: Chat avec un assistant spécifique (format OpenAI)
 *     tags: [OpenAPI]
 *     parameters:
 *       - in: path
 *         name: assistant_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                     content:
 *                       type: string
 *               model:
 *                 type: string
 *                 enum: [gemini-3-flash, gemini-3-pro, gemini-2.5-flash, gemini-2.5-pro, gemini-2.5-flash-lite, gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro, gemini-exp-1206]
 *     responses:
 *       200:
 *         description: Réponse de l'assistant
 */
router.post('/v1/assistants/:assistant_id/chat', async (req: Request, res: Response) => {
  try {
    const { assistant_id } = req.params;
    const { messages, model, temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: {
          message: 'Missing required field: messages',
          type: 'invalid_request_error',
          code: 'missing_messages'
        }
      });
    }

    const prompt = messages
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const service = getAssistantService();
    const selectedModel = model || process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash-exp';

    const result = await service.executeAssistant(assistant_id, {
      prompt,
      model: selectedModel,
      temperature,
      maxTokens: max_tokens
    });

    if (!result.success) {
      return res.status(400).json({
        error: {
          message: result.error || 'Unknown error',
          type: 'api_error',
          code: 'execution_failed'
        }
      });
    }

    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: selectedModel,
      assistant_id,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: result.result
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: Math.ceil(prompt.length / 4),
        completion_tokens: Math.ceil((result.result?.length || 0) / 4),
        total_tokens: Math.ceil((prompt.length + (result.result?.length || 0)) / 4)
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'api_error',
        code: 'internal_error'
      }
    });
  }
});

export default router;
