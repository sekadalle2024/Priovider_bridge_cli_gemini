/**
 * Provider Bridge — Auth Service
 * JWT token management, password hashing, user authentication
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDb } from '../database';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '24h';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export interface UserRecord {
    id: string;
    email: string;
    display_name: string;
    google_id: string | null;
    role: string;
    password_hash: string | null;
    created_at: string;
    updated_at: string;
    last_login: string | null;
}

function getJwtSecret(): string {
    return process.env.JWT_SECRET || 'provider-bridge-default-secret-change-me';
}

/**
 * Generate a unique user ID
 */
export function generateUserId(): string {
    return `pb_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: Pick<UserRecord, 'id' | 'email' | 'role'>): string {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, getJwtSecret()) as TokenPayload;
    } catch {
        return null;
    }
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<{ token: string; user: UserRecord } | null> {
    const db = getDb();
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    const user = result.rows[0] as unknown as UserRecord | undefined;

    if (!user || !user.password_hash) {
        return null;
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
        return null;
    }

    // Update last login
    await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = generateToken(user);
    return { token, user };
}

/**
 * Register a new user (via Google OAuth or manual)
 */
export async function registerUser(data: {
    email: string;
    displayName: string;
    googleId?: string;
    password?: string;
    role?: string;
}): Promise<UserRecord> {
    const db = getDb();
    const id = generateUserId();
    const passwordHash = data.password ? await hashPassword(data.password) : null;

    await db.query(`
        INSERT INTO users (id, email, display_name, google_id, role, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [id, data.email, data.displayName, data.googleId || null, data.role || 'user', passwordHash]);

    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    return result.rows[0] as unknown as UserRecord;
}

/**
 * Find or create a user from Google OAuth profile
 */
export async function findOrCreateGoogleUser(profile: {
    googleId: string;
    email: string;
    displayName: string;
    accessToken: string;
    refreshToken?: string;
    tokenExpiry?: string;
    scopes?: string;
}): Promise<{ user: UserRecord; isNew: boolean }> {
    const db = getDb();

    // Check if user exists by google_id
    const result = await db.query('SELECT * FROM users WHERE google_id = $1', [profile.googleId]);

    let user = result.rows[0] as unknown as UserRecord | undefined;

    if (user) {
        // Update last login
        await db.query('UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1', [user.id]);

        // Update credentials
        const credResult = await db.query('SELECT id FROM google_credentials WHERE user_id = $1 AND status = \'active\'', [user.id]);

        const existingCred = credResult.rows[0] as unknown as { id: string } | undefined;

        if (existingCred) {
            await db.query(`
                UPDATE google_credentials
                SET access_token = $1, refresh_token = COALESCE($2, refresh_token), token_expiry = $3, scopes = $4, updated_at = NOW()
                WHERE id = $5
            `, [profile.accessToken, profile.refreshToken === undefined ? null : profile.refreshToken, profile.tokenExpiry || null, profile.scopes || '', existingCred.id]);
        } else {
            const credId = `cred_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
            await db.query(`
                INSERT INTO google_credentials (id, user_id, access_token, refresh_token, token_expiry, scopes)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [credId, user.id, profile.accessToken, profile.refreshToken || null, profile.tokenExpiry || null, profile.scopes || '']);
        }

        return { user, isNew: false };
    }

    // Create new user
    user = await registerUser({
        email: profile.email,
        displayName: profile.displayName,
        googleId: profile.googleId,
    });

    // Store Google credentials
    const credId = `cred_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    await db.query(`
        INSERT INTO google_credentials (id, user_id, access_token, refresh_token, token_expiry, scopes)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [credId, user.id, profile.accessToken, profile.refreshToken || null, profile.tokenExpiry || null, profile.scopes || '']);

    return { user, isNew: true };
}

/**
 * Ensure admin user exists on first boot
 */
export async function ensureAdminUser(): Promise<void> {
    const db = getDb();
    const adminEmail = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const result = await db.query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin']);
    if (result.rows.length > 0) return;

    await registerUser({
        email: adminEmail,
        displayName: 'Administrator',
        password: adminPassword,
        role: 'admin',
    });

    console.log(`✅ Admin user created: ${adminEmail}`);
}
