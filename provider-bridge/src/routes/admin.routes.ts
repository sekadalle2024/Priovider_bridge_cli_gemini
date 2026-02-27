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
router.get('/users', (req: Request, res: Response) => {
    const db = getDb();

    const users = db.prepare(`
    SELECT u.id, u.email, u.display_name, u.role, u.google_id, u.created_at, u.last_login,
           (SELECT COUNT(*) FROM google_credentials gc WHERE gc.user_id = u.id AND gc.status = 'active') as active_credentials,
           (SELECT COALESCE(SUM(request_count), 0) FROM usage_stats us WHERE us.user_id = u.id) as total_requests,
           (SELECT COALESCE(SUM(tokens_used), 0) FROM usage_stats us WHERE us.user_id = u.id) as total_tokens
    FROM users u
    ORDER BY u.created_at DESC
  `).all();

    res.json({ users, total: users.length });
});

/**
 * DELETE /api/admin/users/:id — Remove a user and revoke credentials
 */
router.delete('/users/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const db = getDb();

    // Prevent deleting yourself
    if (id === req.user!.userId) {
        res.status(400).json({ error: 'Cannot delete your own account' });
        return;
    }

    const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(id) as { id: string; role: string } | undefined;
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // Cascade delete handles credentials, stats, sessions
    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.json({ success: true, message: `User ${id} deleted` });
});

/**
 * PUT /api/admin/users/:id/status — Activate/deactivate user credentials
 */
router.put('/users/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // 'active' | 'revoked'

    if (!['active', 'revoked'].includes(status)) {
        res.status(400).json({ error: 'Status must be "active" or "revoked"' });
        return;
    }

    const db = getDb();
    const result = db.prepare(`
    UPDATE google_credentials SET status = ?, updated_at = datetime('now')
    WHERE user_id = ?
  `).run(status, id);

    res.json({ success: true, updatedRows: result.changes });
});

/**
 * GET /api/admin/stats — Aggregated statistics
 */
router.get('/stats', (req: Request, res: Response) => {
    const stats = getAggregatedStats();
    const keyRotation = getApiKeyRotationService().getStats();

    res.json({
        ...stats,
        apiKeyRotation: keyRotation,
    });
});

/**
 * GET /api/admin/stats/:userId — Per-user statistics
 */
router.get('/stats/:userId', (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const db = getDb();

    const user = db.prepare('SELECT id, email, display_name FROM users WHERE id = ?').get(userId) as { id: string; email: string; display_name: string } | undefined;
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    const stats = getUserStats(userId);
    res.json({ user, stats });
});

/**
 * GET /api/admin/credentials — List all Google credentials
 */
router.get('/credentials', (req: Request, res: Response) => {
    const db = getDb();

    const credentials = db.prepare(`
    SELECT gc.id, gc.user_id, gc.status, gc.scopes, gc.created_at, gc.updated_at,
           u.email, u.display_name
    FROM google_credentials gc
    JOIN users u ON u.id = gc.user_id
    ORDER BY gc.created_at DESC
  `).all();

    res.json({ credentials, total: credentials.length });
});

export default router;
