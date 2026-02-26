import express, { Request, Response, Router } from 'express';
import { getKiroCliService, KiroChatRequest } from '../services/KiroCliService';

const router: Router = express.Router();

/**
 * POST /api/kiro-cli/chat
 * Chat avec Kiro CLI
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const request: KiroChatRequest = req.body;

    if (!request.messages || !Array.isArray(request.messages)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'messages array is required'
      });
    }

    const kiroService = getKiroCliService();

    // Vérifier la disponibilité
    const available = await kiroService.checkAvailability();
    if (!available) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Kiro CLI is not available or not properly configured'
      });
    }

    // Stream ou réponse complète
    if (request.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        for await (const chunk of kiroService.chatStream(request)) {
          res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (error) {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    } else {
      const response = await kiroService.chat(request);
      res.json(response);
    }
  } catch (error) {
    console.error('Kiro CLI chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/kiro-cli/generate
 * Génération de code avec Kiro CLI
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, language, context } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'prompt is required'
      });
    }

    const kiroService = getKiroCliService();

    const available = await kiroService.checkAvailability();
    if (!available) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Kiro CLI is not available'
      });
    }

    const result = await kiroService.generate(prompt, { language, context });

    res.json({
      success: true,
      result,
      metadata: {
        language,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Kiro CLI generate error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/kiro-cli/status
 * Statut du service Kiro CLI
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const kiroService = getKiroCliService();
    const status = await kiroService.getStatus();

    res.json({
      provider: 'kiro-cli',
      ...status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Kiro CLI status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      provider: 'kiro-cli',
      available: false
    });
  }
});

/**
 * POST /api/kiro-cli/execute
 * Exécute une commande Kiro CLI personnalisée
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { command, args } = req.body;

    if (!command) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'command is required'
      });
    }

    const kiroService = getKiroCliService();

    const available = await kiroService.checkAvailability();
    if (!available) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Kiro CLI is not available'
      });
    }

    const result = await kiroService.execute(command, args || []);

    res.json({
      success: true,
      command,
      args,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Kiro CLI execute error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /v1/kiro-cli/chat/completions
 * Format compatible OpenAI pour n8n/LangChain
 */
router.post('/v1/chat/completions', async (req: Request, res: Response) => {
  try {
    const { messages, stream, temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: {
          message: 'messages array is required',
          type: 'invalid_request_error',
          code: 'invalid_messages'
        }
      });
    }

    const kiroService = getKiroCliService();

    const available = await kiroService.checkAvailability();
    if (!available) {
      return res.status(503).json({
        error: {
          message: 'Kiro CLI is not available',
          type: 'service_unavailable',
          code: 'kiro_cli_unavailable'
        }
      });
    }

    const request: KiroChatRequest = {
      messages,
      stream: stream || false,
      temperature,
      maxTokens: max_tokens
    };

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        for await (const chunk of kiroService.chatStream(request)) {
          const streamResponse = {
            id: `chatcmpl-${Date.now()}`,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: 'kiro-cli',
            choices: [
              {
                index: 0,
                delta: { content: chunk },
                finish_reason: null
              }
            ]
          };
          res.write(`data: ${JSON.stringify(streamResponse)}\n\n`);
        }

        const finalResponse = {
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: 'kiro-cli',
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: 'stop'
            }
          ]
        };
        res.write(`data: ${JSON.stringify(finalResponse)}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (error) {
        const errorResponse = {
          error: {
            message: error.message,
            type: 'server_error',
            code: 'kiro_cli_error'
          }
        };
        res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);
        res.end();
      }
    } else {
      const response = await kiroService.chat(request);
      res.json(response);
    }
  } catch (error) {
    console.error('Kiro CLI OpenAI-compatible chat error:', error);
    res.status(500).json({
      error: {
        message: error.message,
        type: 'server_error',
        code: 'internal_error'
      }
    });
  }
});

/**
 * POST /v1/kiro-cli/completions
 * Format compatible OpenAI (legacy) pour n8n/LangChain
 */
router.post('/v1/completions', async (req: Request, res: Response) => {
  try {
    const { prompt, stream, temperature, max_tokens } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: {
          message: 'prompt is required',
          type: 'invalid_request_error',
          code: 'invalid_prompt'
        }
      });
    }

    const kiroService = getKiroCliService();

    const available = await kiroService.checkAvailability();
    if (!available) {
      return res.status(503).json({
        error: {
          message: 'Kiro CLI is not available',
          type: 'service_unavailable',
          code: 'kiro_cli_unavailable'
        }
      });
    }

    // Convertir le prompt en format messages
    const messages = [{ role: 'user' as const, content: prompt }];

    const request: KiroChatRequest = {
      messages,
      stream: stream || false,
      temperature,
      maxTokens: max_tokens
    };

    const response = await kiroService.chat(request);

    // Convertir au format completions
    res.json({
      id: response.id,
      object: 'text_completion',
      created: response.created,
      model: 'kiro-cli',
      choices: [
        {
          text: response.choices[0].message.content,
          index: 0,
          finish_reason: response.choices[0].finish_reason
        }
      ],
      usage: response.usage
    });
  } catch (error) {
    console.error('Kiro CLI OpenAI-compatible completions error:', error);
    res.status(500).json({
      error: {
        message: error.message,
        type: 'server_error',
        code: 'internal_error'
      }
    });
  }
});

export default router;
