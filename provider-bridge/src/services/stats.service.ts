/**
 * Provider Bridge — Stats Service
 * Records and aggregates usage statistics per user/provider/model
 * SQLite-compatible queries (no INTERVAL / ::text PostgreSQL-isms)
 */

import { getDb } from '../database';

/**
 * Record a usage event
 */
export async function recordUsage(data: { userId: string; provider: string; model: string; tokensUsed?: number }): Promise<void> {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  // Try to update existing row for this user/provider/model/day
  const updateResult = await db.query(
    `
        UPDATE usage_stats
        SET request_count = request_count + 1,
            tokens_used   = tokens_used + $1
        WHERE user_id = $2 AND provider = $3 AND model = $4 AND day = $5
        `,
    [data.tokensUsed || 0, data.userId, data.provider, data.model, today]
  );

  if (updateResult.rowCount === 0) {
    await db.query(
      `
            INSERT INTO usage_stats (user_id, provider, model, tokens_used, request_count, day)
            VALUES ($1, $2, $3, $4, 1, $5)
            `,
      [data.userId, data.provider, data.model, data.tokensUsed || 0, today]
    );
  }
}

/**
 * Get aggregated stats for admin dashboard
 */
export async function getAggregatedStats(): Promise<{
  totalRequests: number;
  totalTokens: number;
  activeUsers: number;
  byProvider: Array<{ provider: string; requests: number; tokens: number }>;
  byModel: Array<{ model: string; requests: number; tokens: number }>;
  byDay: Array<{ day: string; requests: number; tokens: number }>;
}> {
  const db = getDb();

  const totalRes = await db.query(`
    SELECT COALESCE(SUM(request_count), 0) AS total_requests,
           COALESCE(SUM(tokens_used),   0) AS total_tokens
    FROM usage_stats
    `);

  const totalRow = totalRes.rows[0] as unknown as { total_requests: number; total_tokens: number };

  // SQLite: date('now', '-7 days') instead of CURRENT_DATE - INTERVAL '7 days'
  const activeUsersRes = await db.query(`
    SELECT COUNT(DISTINCT user_id) AS count
    FROM usage_stats
    WHERE day >= date('now', '-7 days')
    `);

  const activeUsersRow = activeUsersRes.rows[0] as unknown as { count: number };

  const byProviderRes = await db.query(`
    SELECT provider,
           SUM(request_count) AS requests,
           SUM(tokens_used)   AS tokens
    FROM usage_stats
    GROUP BY provider
    ORDER BY requests DESC
    `);

  const byProvider = byProviderRes.rows as unknown as Array<{ provider: string; requests: number; tokens: number }>;

  const byModelRes = await db.query(`
    SELECT model,
           SUM(request_count) AS requests,
           SUM(tokens_used)   AS tokens
    FROM usage_stats
    GROUP BY model
    ORDER BY requests DESC
    LIMIT 20
    `);

  const byModel = byModelRes.rows as unknown as Array<{ model: string; requests: number; tokens: number }>;

  // SQLite: day is stored as TEXT (ISO date), cast not needed — just select it directly
  const byDayRes = await db.query(`
    SELECT day,
           SUM(request_count) AS requests,
           SUM(tokens_used)   AS tokens
    FROM usage_stats
    WHERE day >= date('now', '-30 days')
    GROUP BY day
    ORDER BY day ASC
    `);

  const byDay = byDayRes.rows as unknown as Array<{ day: string; requests: number; tokens: number }>;

  return {
    totalRequests: Number(totalRow.total_requests),
    totalTokens: Number(totalRow.total_tokens),
    activeUsers: Number(activeUsersRow.count),
    byProvider,
    byModel,
    byDay,
  };
}

/**
 * Get stats for a specific user
 */
export async function getUserStats(userId: string): Promise<{
  totalRequests: number;
  totalTokens: number;
  byProvider: Array<{ provider: string; requests: number; tokens: number }>;
  byDay: Array<{ day: string; requests: number; tokens: number }>;
}> {
  const db = getDb();

  const totalRes = await db.query(
    `
        SELECT COALESCE(SUM(request_count), 0) AS total_requests,
               COALESCE(SUM(tokens_used),   0) AS total_tokens
        FROM usage_stats
        WHERE user_id = $1
        `,
    [userId]
  );

  const totalRow = totalRes.rows[0] as unknown as { total_requests: number; total_tokens: number };

  const byProviderRes = await db.query(
    `
        SELECT provider,
               SUM(request_count) AS requests,
               SUM(tokens_used)   AS tokens
        FROM usage_stats
        WHERE user_id = $1
        GROUP BY provider
        `,
    [userId]
  );

  const byProvider = byProviderRes.rows as unknown as Array<{ provider: string; requests: number; tokens: number }>;

  // SQLite: day is TEXT, no ::text cast needed
  const byDayRes = await db.query(
    `
        SELECT day,
               SUM(request_count) AS requests,
               SUM(tokens_used)   AS tokens
        FROM usage_stats
        WHERE user_id = $1
          AND day >= date('now', '-30 days')
        GROUP BY day
        ORDER BY day ASC
        `,
    [userId]
  );

  const byDay = byDayRes.rows as unknown as Array<{ day: string; requests: number; tokens: number }>;

  return {
    totalRequests: Number(totalRow.total_requests),
    totalTokens: Number(totalRow.total_tokens),
    byProvider,
    byDay,
  };
}
