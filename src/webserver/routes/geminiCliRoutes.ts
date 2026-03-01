/**
 * Routes pour l'endpoint Gemini CLI par défaut
 * Endpoint unifié pour utiliser Gemini CLI sans assistant spécifique
 */

import { Router, Request, Response } from 'express';
import { getAssistantService } from '../services/AssistantService';

const router = Router();

/**
 * @swagger
 * /api/gemini/chat:
 *   post:
 *     summary: Endpoint Gemini CLI par défaut
 *     description: Utilise Gemini CLI directement sans assistant spécifique
 *     tags: [Gemini CLI]
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
 *                 example: "Explique-moi les microservices"
 *               model:
 *                 type: string
 *                 description: Modèle Gemini à utiliser
 *                 default: gemini-2.0-flash-exp
 *                 enum: [gemini-3-flash, gemini-3-pro, gemini-2.5-flash, gemini-2.5-pro, gemini-2.5-flash-lite, gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro, gemini-exp-1206]
 *                 example: "gemini-2.0-flash-exp"
 *               temperature:
 *                 type: number
 *                 description: Température de génération (0-1)
 *                 default: 0.7
 *                 example: 0.7
 *               maxTokens:
 *                 type: number
 *                 description: Nombre maximum de tokens
 *                 example: 2048
 *               context:
 *                 type: object
 *                 description: Contexte additionnel
 *     responses:
 *       200:
 *         description: Réponse de Gemini CLI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 result:
 *                   type: string
 *                   example: "Les microservices sont..."
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     model:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *       400:
 *         description: Requête invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { prompt, model, temperature, maxTokens, context } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: prompt'
      });
    }

    const service = getAssistantService();
    
    // Vérifier que Gemini CLI est disponible
    const geminiAvailable = await service.checkGeminiCli();
    if (!geminiAvailable) {
      return res.status(503).json({
        success: false,
        error: 'Gemini CLI is not available. Please install it first.'
      });
    }

    // Vérifier que le modèle est disponible
    const selectedModel = model || process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash-exp';
    if (!service.isModelAvailable(selectedModel)) {
      return res.status(400).json({
        success: false,
        error: `Model '${selectedModel}' is not available. Available models: ${service.getAvailableModels().join(', ')}`
      });
    }

    // Exécution directe via le service
    const directResult = await (service as any).runGeminiCli(
      prompt,
      selectedModel
    );

    return res.json({
      success: true,
      result: directResult,
      metadata: {
        model: selectedModel,
        timestamp: new Date().toISOString()
      }
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
 * /api/gemini/models:
 *   get:
 *     summary: Liste les modèles Gemini disponibles
 *     tags: [Gemini CLI]
 *     responses:
 *       200:
 *         description: Liste des modèles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 models:
 *                   type: array
 *                   items:
 *                     type: string
 *                     enum: [gemini-3-flash, gemini-3-pro, gemini-2.5-flash, gemini-2.5-pro, gemini-2.5-flash-lite, gemini-2.0-flash, gemini-1.5-flash, gemini-1.5-pro, gemini-exp-1206]
 */
router.get('/gemini/models', async (req: Request, res: Response) => {
  try {
    const service = getAssistantService();
    const geminiAvailable = await service.checkGeminiCli();

    if (!geminiAvailable) {
      return res.status(503).json({
        success: false,
        error: 'Gemini CLI is not available'
      });
    }

    const models = service.getAvailableModels();

    res.json({
      success: true,
      models,
      default: process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash-exp'
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
 * /api/gemini/status:
 *   get:
 *     summary: Vérifie le statut de Gemini CLI
 *     tags: [Gemini CLI]
 *     responses:
 *       200:
 *         description: Statut de Gemini CLI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 available:
 *                   type: boolean
 *                 version:
 *                   type: string
 */
router.get('/gemini/status', async (req: Request, res: Response) => {
  try {
    const service = getAssistantService();
    const geminiAvailable = await service.checkGeminiCli();

    res.json({
      success: true,
      available: geminiAvailable,
      cliPath: process.env.GEMINI_CLI_PATH || 'gemini',
      defaultModel: process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash-exp'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
