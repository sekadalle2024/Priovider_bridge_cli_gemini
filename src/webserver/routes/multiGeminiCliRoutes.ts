import express, { Request, Response } from 'express';
import { multiGeminiCliService } from '../services/MultiGeminiCliService';

const router = express.Router();

/**
 * @swagger
 * /api/v1/cli/profiles:
 *   get:
 *     summary: Liste tous les profils Gemini CLI
 *     tags: [Multi Gemini CLI]
 *     responses:
 *       200:
 *         description: Liste des profils
 */
router.get('/profiles', (req: Request, res: Response) => {
  try {
    const profiles = multiGeminiCliService.getProfiles();
    res.json({
      success: true,
      count: profiles.length,
      profiles: profiles.map(p => ({
        id: p.id,
        name: p.name,
        account: p.account,
        port: p.port,
        enabled: p.enabled
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/cli/profiles/stats:
 *   get:
 *     summary: Obtenir les statistiques de tous les profils
 *     tags: [Multi Gemini CLI]
 *     responses:
 *       200:
 *         description: Statistiques des profils
 */
router.get('/profiles/stats', (req: Request, res: Response) => {
  try {
    const allStats = multiGeminiCliService.getAllStats();
    const statsObject: any = {};

    allStats.forEach((stats, profileId) => {
      statsObject[profileId] = stats;
    });

    res.json({
      success: true,
      stats: statsObject
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/cli/profiles/{profileId}:
 *   get:
 *     summary: Obtenir les détails d'un profil
 *     tags: [Multi Gemini CLI]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du profil
 */
router.get('/profiles/:profileId', (req: Request, res: Response) => {
  try {
    const profileId = req.params.profileId as string;
    const profile = multiGeminiCliService.getProfile(profileId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: `Profile ${profileId} not found`
      });
    }

    const stats = multiGeminiCliService.getProfileStats(profileId);

    res.json({
      success: true,
      profile: {
        id: profile.id,
        name: profile.name,
        account: profile.account,
        port: profile.port,
        enabled: profile.enabled
      },
      stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/cli/{profileId}/chat:
 *   post:
 *     summary: Chat avec un profil Gemini CLI spécifique
 *     tags: [Multi Gemini CLI]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 default: gemini-2.5-flash
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant, system]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: Réponse du chat
 */
router.post('/:profileId/chat', async (req: Request, res: Response) => {
  try {
    const profileId = req.params.profileId as string;
    const chatRequest = req.body;

    if (!chatRequest.messages || !Array.isArray(chatRequest.messages)) {
      return res.status(400).json({
        success: false,
        error: 'messages array is required'
      });
    }

    const profile = multiGeminiCliService.getProfile(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: `Profile ${profileId} not found`
      });
    }

    const response = await multiGeminiCliService.chat(chatRequest, profileId);
    res.json(response);
  } catch (error: any) {
    console.error(`Error in profile ${req.params.profileId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      profile: req.params.profileId
    });
  }
});

/**
 * @swagger
 * /api/v1/cli/chat:
 *   post:
 *     summary: Chat avec load balancing automatique
 *     tags: [Multi Gemini CLI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 default: gemini-2.5-flash
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant, system]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: Réponse du chat
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const chatRequest = req.body;

    if (!chatRequest.messages || !Array.isArray(chatRequest.messages)) {
      return res.status(400).json({
        success: false,
        error: 'messages array is required'
      });
    }

    const response = await multiGeminiCliService.chat(chatRequest);
    res.json(response);
  } catch (error: any) {
    console.error('Error in load balanced chat:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/cli/profiles/{profileId}/enable:
 *   post:
 *     summary: Activer un profil
 *     tags: [Multi Gemini CLI]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil activé
 */
router.post('/profiles/:profileId/enable', (_req: Request, res: Response) => {
  try {
    const profileId = _req.params.profileId as string;
    multiGeminiCliService.markProfileAvailable(profileId);

    res.json({
      success: true,
      message: `Profile ${profileId} enabled`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/v1/cli/profiles/{profileId}/disable:
 *   post:
 *     summary: Désactiver un profil
 *     tags: [Multi Gemini CLI]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil désactivé
 */
router.post('/profiles/:profileId/disable', (_req: Request, res: Response) => {
  try {
    const profileId = _req.params.profileId as string;
    multiGeminiCliService.markProfileUnavailable(profileId);

    res.json({
      success: true,
      message: `Profile ${profileId} disabled`
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
