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
 * GET /api/admin/accounts — List all Google accounts (alias for users)
 */
router.get('/accounts', async (req: Request, res: Response) => {
    try {
        const db = getDb();

        const result = await db.query(`
        SELECT u.id, u.email, u.display_name as name, u.google_id, u.created_at, u.last_login as lastUsed,
               (SELECT COUNT(*) FROM google_credentials gc WHERE gc.user_id = u.id AND gc.status = 'active') > 0 as geminiCliEnabled,
               (SELECT COALESCE(SUM(request_count), 0) FROM usage_stats us WHERE us.user_id = u.id) as requestCount,
               CASE WHEN u.last_login > NOW() - INTERVAL '7 days' THEN 'active' ELSE 'inactive' END as status
        FROM users u
        WHERE u.google_id IS NOT NULL
        ORDER BY u.created_at DESC
        `);

        res.json(result.rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to list accounts' });
    }
});

/**
 * GET /api/admin/usage — Usage statistics per account
 */
router.get('/usage', async (req: Request, res: Response) => {
    try {
        const db = getDb();

        const result = await db.query(`
        SELECT u.email, us.model, us.request_count as requests, 
               us.tokens_used as tokensUsed, us.token_limit as tokenLimit
        FROM usage_stats us
        JOIN users u ON u.id = us.user_id
        ORDER BY us.tokens_used DESC
        LIMIT 100
        `);

        res.json(result.rows);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch usage stats' });
    }
});

/**
 * DELETE /api/admin/accounts/:id — Remove an account (alias for users)
 */
router.delete('/accounts/:id', async (req: Request, res: Response) => {
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
            res.status(404).json({ error: 'Account not found' });
            return;
        }

        // Cascade delete handles credentials, stats, sessions
        await db.query('DELETE FROM users WHERE id = $1', [id as string]);

        res.json({ success: true, message: `Account ${id} deleted` });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to delete account' });
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
        const db = getDb();
        
        // Total accounts
        const accountsRes = await db.query('SELECT COUNT(*) as count FROM users WHERE google_id IS NOT NULL');
        const totalAccounts = (accountsRes.rows[0] as { count: number }).count;
        
        // Active models
        const modelsRes = await db.query('SELECT COUNT(DISTINCT model) as count FROM usage_stats');
        const activeModels = (modelsRes.rows[0] as { count: number }).count;
        
        // Requests in last 24h
        const requestsRes = await db.query(`
            SELECT COALESCE(SUM(request_count), 0) as count 
            FROM usage_stats 
            WHERE updated_at > NOW() - INTERVAL '24 hours'
        `);
        const requests24h = (requestsRes.rows[0] as { count: number }).count;
        
        // API Keys count
        const keysRes = await db.query('SELECT COUNT(*) as count FROM google_credentials WHERE status = \'active\'');
        const apiKeys = (keysRes.rows[0] as { count: number }).count;
        
        const stats = await getAggregatedStats();
        const keyRotation = getApiKeyRotationService().getStats();

        res.json({
            totalAccounts,
            activeModels,
            requests24h,
            apiKeys,
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
