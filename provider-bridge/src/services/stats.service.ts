/**
 * Provider Bridge — Stats Service
 * Records and aggregates usage statistics per user/provider/model
 */

import { getDb } from '../database';

/**
 * Record a usage event
 */
export function recordUsage(data: {
    userId: string;
    provider: string;
    model: string;
    tokensUsed?: number;
}): void {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];

    // Try to update existing row for this user/provider/model/day
    const result = db.prepare(`
    UPDATE usage_stats 
    SET request_count = request_count + 1,
        tokens_used = tokens_used + ?
    WHERE user_id = ? AND provider = ? AND model = ? AND day = ?
  `).run(data.tokensUsed || 0, data.userId, data.provider, data.model, today);

    if (result.changes === 0) {
        db.prepare(`
      INSERT INTO usage_stats (user_id, provider, model, tokens_used, request_count, day)
      VALUES (?, ?, ?, ?, 1, ?)
    `).run(data.userId, data.provider, data.model, data.tokensUsed || 0, today);
    }
}

/**
 * Get aggregated stats for admin dashboard
 */
export function getAggregatedStats(): {
    totalRequests: number;
    totalTokens: number;
    activeUsers: number;
    byProvider: Array<{ provider: string; requests: number; tokens: number }>;
    byModel: Array<{ model: string; requests: number; tokens: number }>;
    byDay: Array<{ day: string; requests: number; tokens: number }>;
} {
    const db = getDb();

    const totalRow = db.prepare(`
    SELECT COALESCE(SUM(request_count), 0) as total_requests,
           COALESCE(SUM(tokens_used), 0) as total_tokens
    FROM usage_stats
  `).get() as { total_requests: number; total_tokens: number };

    const activeUsersRow = db.prepare(`
    SELECT COUNT(DISTINCT user_id) as count FROM usage_stats
    WHERE day >= date('now', '-7 days')
  `).get() as { count: number };

    const byProvider = db.prepare(`
    SELECT provider, SUM(request_count) as requests, SUM(tokens_used) as tokens
    FROM usage_stats GROUP BY provider ORDER BY requests DESC
  `).all() as Array<{ provider: string; requests: number; tokens: number }>;

    const byModel = db.prepare(`
    SELECT model, SUM(request_count) as requests, SUM(tokens_used) as tokens
    FROM usage_stats GROUP BY model ORDER BY requests DESC LIMIT 20
  `).all() as Array<{ model: string; requests: number; tokens: number }>;

    const byDay = db.prepare(`
    SELECT day, SUM(request_count) as requests, SUM(tokens_used) as tokens
    FROM usage_stats
    WHERE day >= date('now', '-30 days')
    GROUP BY day ORDER BY day ASC
  `).all() as Array<{ day: string; requests: number; tokens: number }>;

    return {
        totalRequests: totalRow.total_requests,
        totalTokens: totalRow.total_tokens,
        activeUsers: activeUsersRow.count,
        byProvider,
        byModel,
        byDay,
    };
}

/**
 * Get stats for a specific user
 */
export function getUserStats(userId: string): {
    totalRequests: number;
    totalTokens: number;
    byProvider: Array<{ provider: string; requests: number; tokens: number }>;
    byDay: Array<{ day: string; requests: number; tokens: number }>;
} {
    const db = getDb();

    const totalRow = db.prepare(`
    SELECT COALESCE(SUM(request_count), 0) as total_requests,
           COALESCE(SUM(tokens_used), 0) as total_tokens
    FROM usage_stats WHERE user_id = ?
  `).get(userId) as { total_requests: number; total_tokens: number };

    const byProvider = db.prepare(`
    SELECT provider, SUM(request_count) as requests, SUM(tokens_used) as tokens
    FROM usage_stats WHERE user_id = ? GROUP BY provider
  `).all(userId) as Array<{ provider: string; requests: number; tokens: number }>;

    const byDay = db.prepare(`
    SELECT day, SUM(request_count) as requests, SUM(tokens_used) as tokens
    FROM usage_stats WHERE user_id = ? AND day >= date('now', '-30 days')
    GROUP BY day ORDER BY day ASC
  `).all(userId) as Array<{ day: string; requests: number; tokens: number }>;

    return {
        totalRequests: totalRow.total_requests,
        totalTokens: totalRow.total_tokens,
        byProvider,
        byDay,
    };
}
