/**
 * Provider Bridge — Admin Routes
 * User management, statistics, credential management
 */

import { Router, type Request, type Response } from 'express';
import { requireAdmin } from '../auth/middleware';
import { getDb } from '../database';
import { getAggregatedStats, getUserStats } from '../services/stats.service';
import { getApiKeyRotationService } from '../services/api-key-rotation.service';

const router = Router();

// All admin routes require admin role
router.use(requireAdmin);

/**
 * GET /api/admin/users — List all users with Google account status
 */
router.get('/users', async (req: Request, res: Response) => {
    try {
        const db = getDb();

        const result = await db.query(`
        SELECT u.id, u.email, u.display_name, u.role, u.google_id, u.created_at, u.last_login,
               (SELECT COUNT(*) FROM google_credentials gc WHERE gc.user_id = u.id AND gc.status = 'active') as active_credentials,
               (SELECT COALESCE(SUM(request_count), 0) FROM usage_stats us WHERE us.user_id = u.id) as total_requests,
               (SELECT COALESCE(SUM(tokens_used), 0) FROM usage_stats us WHERE us.user_id = u.id) as total_tokens
        FROM users u
        ORDER BY u.created_at DESC
        `);

        const users = result.rows;
        res.json({ users, total: users.length });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to list users' });
    }
});

/**
 * DELETE /api/admin/users/:id — Remove a user and revoke credentials
 */
router.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const db = getDb();

        // Prevent deleting yourself
        if (id === req.user!.userId) {
            res.status(400).json({ error: 'Cannot delete your own account' });
            return;
        }

        const userRes = await db.query('SELECT id, role FROM users WHERE id = $1', [id as string]);

        const user = userRes.rows[0] as unknown as { id: string; role: string } | undefined;
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Cascade delete handles credentials, stats, sessions
        await db.query('DELETE FROM users WHERE id = $1', [id as string]);

        res.json({ success: true, message: `User ${id} deleted` });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to delete user' });
    }
});

/**
 * PUT /api/admin/users/:id/status — Activate/deactivate user credentials
 */
router.put('/users/:id/status', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' | 'revoked'

        if (!['active', 'revoked'].includes(status)) {
            res.status(400).json({ error: 'Status must be "active" or "revoked"' });
            return;
        }

        const db = getDb();
        const result = await db.query(`
            UPDATE google_credentials SET status = $1, updated_at = NOW()
            WHERE user_id = $2
            `, [status as string, id as string]);

        res.json({ success: true, updatedRows: result.rowCount });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to update user status' });
    }
});

/**
 * GET /api/admin/stats — Aggregated statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const stats = await getAggregatedStats();
        const keyRotation = getApiKeyRotationService().getStats();

        res.json({
            ...stats,
            apiKeyRotation: keyRotation,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch stats' });
    }
});

/**
 * GET /api/admin/stats/:userId — Per-user statistics
 */
router.get('/stats/:userId', async (req: Request, res: Response) => {
    try {
        const rawUserId = req.params.userId;
        const userId = Array.isArray(rawUserId) ? rawUserId[0] : String(rawUserId);
        const db = getDb();

        const userRes = await db.query('SELECT id, email, display_name FROM users WHERE id = $1', [userId]);

        const user = userRes.rows[0] as unknown as { id: string; email: string; display_name: string } | undefined;
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const stats = await getUserStats(userId);
        res.json({ user, stats });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch user stats' });
    }
});

/**
 * GET /api/admin/credentials — List all Google credentials
 */
router.get('/credentials', async (req: Request, res: Response) => {
    try {
        const db = getDb();

        const result = await db.query(`
        SELECT gc.id, gc.user_id, gc.status, gc.scopes, gc.created_at, gc.updated_at,
               u.email, u.display_name
        FROM google_credentials gc
        JOIN users u ON u.id = gc.user_id
        ORDER BY gc.created_at DESC
        `);

        const credentials = result.rows;
        res.json({ credentials, total: credentials.length });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch credentials' });
    }
});

export default router;
