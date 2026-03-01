/**
 * Provider Bridge — Database Layer (SQLite)
 *
 * Uses better-sqlite3 as a zero-config local database.
 * Exposes the same  { query(sql, params): Promise<{rows, rowCount}> }
 * interface so all existing services/routes work without changes.
 *
 * SQL translation handled transparently:
 *   $1 $2 …        → ?
 *   NOW()          → datetime('now')
 *   CURRENT_DATE   → date('now')
 *   INTERVAL expr  → date() modifier syntax
 *   ::text cast    → removed
 *   TIMESTAMPTZ    → TEXT  (schema only)
 *   SERIAL PK      → INTEGER PRIMARY KEY AUTOINCREMENT  (schema only)
 */

import Database from 'better-sqlite3';
import path from 'path';

// ── Config ────────────────────────────────────────────────────────────────────

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'provider-bridge.db');

// ── SQLite singleton ──────────────────────────────────────────────────────────

let _sqlite: Database.Database | null = null;

function getSqlite(): Database.Database {
  if (_sqlite) return _sqlite;

  _sqlite = new Database(DB_PATH);
  _sqlite.pragma('journal_mode = WAL');
  _sqlite.pragma('foreign_keys = ON');

  return _sqlite;
}

// ── SQL adapters ──────────────────────────────────────────────────────────────

/**
 * Translate PostgreSQL SQL to SQLite-compatible SQL at runtime.
 * Handles queries (SELECT / INSERT / UPDATE / DELETE).
 */
function adaptSql(sql: string): string {
  return (
    sql
      // 1. NOW() → datetime('now')
      .replace(/\bNOW\(\)/gi, "datetime('now')")

      // 2. CURRENT_DATE - INTERVAL 'N days' → date('now', '-N days')
      //    Must happen BEFORE plain CURRENT_DATE replacement.
      .replace(/\bCURRENT_DATE\s*-\s*INTERVAL\s*'(\d+)\s*days?'/gi, "date('now', '-$1 days')")

      // 3. date('now') - INTERVAL 'N days' → date('now', '-N days')
      .replace(/date\('now'\)\s*-\s*INTERVAL\s*'(\d+)\s*days?'/gi, "date('now', '-$1 days')")

      // 4. CURRENT_DATE alone → date('now')
      .replace(/\bCURRENT_DATE\b/gi, "date('now')")

      // 5. ::text  type cast → remove
      .replace(/::text\b/gi, '')

      // 6. $1 $2 … positional params → ?
      .replace(/\$\d+/g, '?')
  );
}

/**
 * Translate PostgreSQL DDL schema to SQLite-compatible DDL.
 * Only used during initializeSchema().
 */
function adaptSchema(sql: string): string {
  return sql
    .replace(/\bTIMESTAMPTZ\b/gi, 'TEXT')
    .replace(/\bSERIAL\s+PRIMARY\s+KEY\b/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
    .replace(/\bDEFAULT\s+NOW\(\)/gi, "DEFAULT (datetime('now'))")
    .replace(/\bDEFAULT\s+CURRENT_DATE\b/gi, "DEFAULT (date('now'))")
    .replace(/\$\d+/g, '?');
}

// ── pg-compatible result type ─────────────────────────────────────────────────

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

// ── Pool-compatible adapter ───────────────────────────────────────────────────

class SqlitePool {
  query<T = any>(rawSql: string, params: any[] = []): Promise<QueryResult<T>> {
    return new Promise((resolve, reject) => {
      try {
        const db = getSqlite();
        const sql = adaptSql(rawSql);
        const upper = sql.trimStart().toUpperCase();

        // ── SELECT / WITH → .all() ────────────────────────────────
        if (upper.startsWith('SELECT') || upper.startsWith('WITH')) {
          const stmt = db.prepare(sql);
          const rows = stmt.all(...params) as T[];
          resolve({ rows, rowCount: rows.length });
          return;
        }

        // ── INSERT / UPDATE / DELETE → .run() ─────────────────────
        if (upper.startsWith('INSERT') || upper.startsWith('UPDATE') || upper.startsWith('DELETE')) {
          const stmt = db.prepare(sql);
          const info = stmt.run(...params);
          resolve({ rows: [], rowCount: info.changes });
          return;
        }

        // ── DDL / PRAGMA / anything else → exec() ─────────────────
        db.exec(sql);
        resolve({ rows: [], rowCount: 0 });
      } catch (err) {
        reject(err);
      }
    });
  }

  async end(): Promise<void> {
    if (_sqlite) {
      _sqlite.close();
      _sqlite = null;
    }
  }
}

// ── Singleton pool ────────────────────────────────────────────────────────────

let _pool: SqlitePool | null = null;

/**
 * Returns the database pool singleton.
 * Call `pool.query(sql, params)` exactly as you would with node-postgres.
 */
export function getDb(): SqlitePool {
  if (!_pool) _pool = new SqlitePool();
  return _pool;
}

// ── Schema initialization ─────────────────────────────────────────────────────

/**
 * Create all tables and indexes if they don't already exist.
 * Safe to call multiple times (idempotent).
 */
export async function initializeSchema(): Promise<void> {
  const db = getSqlite();

  const rawSchema = `
        -- Users
        CREATE TABLE IF NOT EXISTS users (
            id            TEXT    PRIMARY KEY,
            email         TEXT    UNIQUE NOT NULL,
            display_name  TEXT    NOT NULL DEFAULT '',
            google_id     TEXT    UNIQUE,
            role          TEXT    NOT NULL DEFAULT 'user'
                              CHECK(role IN ('admin', 'user')),
            password_hash TEXT,
            created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at    TEXT    NOT NULL DEFAULT (datetime('now')),
            last_login    TEXT
        );

        -- Google OAuth credentials (linked to users)
        CREATE TABLE IF NOT EXISTS google_credentials (
            id            TEXT    PRIMARY KEY,
            user_id       TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            access_token  TEXT    NOT NULL,
            refresh_token TEXT,
            token_expiry  TEXT,
            scopes        TEXT    DEFAULT '',
            status        TEXT    NOT NULL DEFAULT 'active'
                              CHECK(status IN ('active', 'revoked')),
            created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
            updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        -- Usage statistics
        CREATE TABLE IF NOT EXISTS usage_stats (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id       TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            provider      TEXT    NOT NULL,
            model         TEXT    NOT NULL DEFAULT 'unknown',
            tokens_used   INTEGER NOT NULL DEFAULT 0,
            request_count INTEGER NOT NULL DEFAULT 1,
            day           TEXT    NOT NULL DEFAULT (date('now')),
            created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        -- Active sessions
        CREATE TABLE IF NOT EXISTS sessions (
            id          TEXT    PRIMARY KEY,
            user_id     TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token_hash  TEXT    NOT NULL,
            ip_address  TEXT    DEFAULT '',
            user_agent  TEXT    DEFAULT '',
            expires_at  TEXT    NOT NULL,
            created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
        );

        -- Indexes
        CREATE INDEX IF NOT EXISTS idx_usage_stats_user_day  ON usage_stats(user_id, day);
        CREATE INDEX IF NOT EXISTS idx_usage_stats_provider  ON usage_stats(provider, day);
        CREATE INDEX IF NOT EXISTS idx_sessions_user         ON sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_expires      ON sessions(expires_at);
        CREATE INDEX IF NOT EXISTS idx_google_creds_user     ON google_credentials(user_id);
    `;

  // Split on semicolons and run each statement individually so that
  // "already exists" errors on one statement don't abort the rest.
  const statements = adaptSchema(rawSchema)
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    try {
      db.exec(stmt + ';');
    } catch (err: any) {
      // Ignore harmless "already exists" errors from re-runs
      if (!String(err?.message).includes('already exists')) {
        throw err;
      }
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export async function closeDb(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}

/** Convenience wrapper — use getDb().query() in new code instead. */
export async function execute(sql: string, args: any[] = []): Promise<QueryResult> {
  return getDb().query(sql, args);
}
