/**
 * Routes pour les assistants comme microservices
 */

import { Router, Request, Response } from 'express';
import { getAssistantService, AssistantRequest } from '../services/AssistantService';
import geminiCliRoutes from './geminiCliRoutes';
import assistantOpenApiRoutes from './assistantOpenApiRoutes';

const router = Router();

// Intégrer les routes Gemini CLI
router.use(geminiCliRoutes);

// Intégrer les routes OpenAPI compatibles
router.use(assistantOpenApiRoutes);

/**
 * @swagger
 * /api/assistants:
 *   get:
 *     summary: Liste tous les assistants disponibles
 *     tags: [Assistants]
 *     responses:
 *       200:
 *         description: Liste des assistants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assistants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       displayName:
 *                         type: string
 *                       description:
 *                         type: string
 *                       endpoint:
 *                         type: string
 *                       capabilities:
 *                         type: array
 *                         items:
 *                           type: string
 */
router.get('/assistants', async (req: Request, res: Response) => {
  try {
    const service = getAssistantService();
    const assistants = await service.discoverAssistants();

    res.json({
      success: true,
      count: assistants.length,
      assistants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/assistant/{name}:
 *   post:
 *     summary: Exécute un assistant spécifique
 *     tags: [Assistants]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom de l'assistant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: La requête utilisateur
 *               context:
 *                 type: object
 *                 description: Contexte additionnel
 *               model:
 *                 type: string
 *                 description: Modèle Gemini à utiliser
 *                 enum: [gemini-3-flash, gemini-3-pro, gemini-2.5-flash, gemini-2.5-pro, gemini-2.5-flash-lite, gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro, gemini-exp-1206]
 *                 default: gemini-2.0-flash-exp
 *               temperature:
 *                 type: number
 *                 description: Température de génération
 *                 default: 0.7
 *               maxTokens:
 *                 type: number
 *                 description: Nombre maximum de tokens
 *     responses:
 *       200:
 *         description: Résultat de l'exécution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: string
 *                 metadata:
 *                   type: object
 */
router.post('/assistant/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const request: AssistantRequest = req.body;

    if (!request.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: prompt'
      });
    }

    const service = getAssistantService();
    
    // Vérifier que le modèle est disponible si spécifié
    if (request.model && !service.isModelAvailable(request.model)) {
      return res.status(400).json({
        success: false,
        error: `Model '${request.model}' is not available. Available models: ${service.getAvailableModels().join(', ')}`
      });
    }
    
    const result = await service.executeAssistant(name, request);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/assistant/{name}/info:
 *   get:
 *     summary: Obtient les informations d'un assistant
 *     tags: [Assistants]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom de l'assistant
 *     responses:
 *       200:
 *         description: Informations de l'assistant
 */
router.get('/assistant/:name/info', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const service = getAssistantService();
    const assistants = await service.discoverAssistants();
    const assistant = assistants.find(a => a.name === name);

    if (!assistant) {
      return res.status(404).json({
        success: false,
        error: `Assistant '${name}' not found`
      });
    }

    res.json({
      success: true,
      assistant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/assistant/health:
 *   get:
 *     summary: Vérifie la santé du service d'assistants
 *     tags: [Assistants]
 *     responses:
 *       200:
 *         description: État du service
 */
router.get('/assistant/health', async (req: Request, res: Response) => {
  try {
    const service = getAssistantService();
    const geminiAvailable = await service.checkGeminiCli();
    const assistants = await service.discoverAssistants();

    res.json({
      success: true,
      status: 'healthy',
      geminiCli: geminiAvailable ? 'available' : 'unavailable',
      assistantsCount: assistants.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
