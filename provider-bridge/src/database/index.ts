/**
 * Provider Bridge — Database Layer
 * SQLite database initialization and schema management
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'provider-bridge.db');

/**
 * Get or create the SQLite database singleton
 */
export function getDb(): Database.Database {
    if (db) return db;

    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    initializeSchema(db);
    return db;
}

/**
 * Initialize database schema (runs on first launch)
 */
function initializeSchema(database: Database.Database): void {
    database.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      google_id TEXT UNIQUE,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      password_hash TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login TEXT
    );

    -- Google OAuth credentials (linked to users)
    CREATE TABLE IF NOT EXISTS google_credentials (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      token_expiry TEXT,
      scopes TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'revoked')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Usage statistics
    CREATE TABLE IF NOT EXISTS usage_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL CHECK(provider IN ('gemini_cli', 'gemini_api_key_rotative', 'kiro_cli')),
      model TEXT NOT NULL DEFAULT 'unknown',
      tokens_used INTEGER NOT NULL DEFAULT 0,
      request_count INTEGER NOT NULL DEFAULT 1,
      day TEXT NOT NULL DEFAULT (date('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Active sessions
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      ip_address TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_usage_stats_user_day ON usage_stats(user_id, day);
    CREATE INDEX IF NOT EXISTS idx_usage_stats_provider ON usage_stats(provider, day);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_google_creds_user ON google_credentials(user_id);
  `);
}

/**
 * Close the database connection
 */
export function closeDb(): void {
    if (db) {
        db.close();
        db = null;
    }
}
