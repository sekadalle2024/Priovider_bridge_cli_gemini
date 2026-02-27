/**
 * Provider Bridge — Auth Routes
 * Login, Google OAuth, logout, current user
 */

import { Router, type Request, type Response } from 'express';
import { login, findOrCreateGoogleUser, generateToken, type UserRecord } from '../auth/auth-service';
import { requireAuth } from '../auth/middleware';
import { getDb } from '../database';

const router = Router();

/**
 * POST /api/auth/login — Email + password login
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const result = await login(email, password);
        if (!result) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Set cookie
        res.cookie('pb-session', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24h
        });

        res.json({
            success: true,
            token: result.token,
            user: {
                id: result.user.id,
                email: result.user.email,
                displayName: result.user.display_name,
                role: result.user.role,
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Login failed' });
    }
});

/**
 * GET /api/auth/google — Initiate Google OAuth flow
 */
router.get('/google', (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 25809}/api/auth/google/callback`;

    if (!clientId) {
        res.status(500).json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env' });
        return;
    }

    const scopes = [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/generative-language',
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&access_type=offline` +
        `&prompt=consent`;

    res.redirect(authUrl);
});

/**
 * GET /api/auth/google/callback — Handle Google OAuth callback
 */
router.get('/google/callback', async (req: Request, res: Response) => {
    try {
        const { code } = req.query;
        if (!code) {
            res.status(400).json({ error: 'Authorization code missing' });
            return;
        }

        const clientId = process.env.GOOGLE_CLIENT_ID!;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 25809}/api/auth/google/callback`;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: code as string,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json() as {
            access_token: string;
            refresh_token?: string;
            expires_in?: number;
            scope?: string;
        };

        if (!tokenData.access_token) {
            res.status(400).json({ error: 'Failed to obtain access token' });
            return;
        }

        // Get user info
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userInfo = await userInfoResponse.json() as {
            id: string;
            email: string;
            name: string;
        };

        // Find or create user
        const { user } = await findOrCreateGoogleUser({
            googleId: userInfo.id,
            email: userInfo.email,
            displayName: userInfo.name || userInfo.email,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            tokenExpiry: tokenData.expires_in
                ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
                : undefined,
            scopes: tokenData.scope,
        });

        // Generate JWT
        const token = generateToken(user);

        // Set cookie
        res.cookie('pb-session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // Redirect to dashboard
        res.redirect('/?login=success');
    } catch (error: any) {
        console.error('Google OAuth callback error:', error);
        res.redirect('/?login=error&message=' + encodeURIComponent(error.message));
    }
});

/**
 * POST /api/auth/logout — Destroy session
 */
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('pb-session');
    res.json({ success: true });
});

/**
 * GET /api/auth/me — Get current user info
 */
router.get('/me', requireAuth, (req: Request, res: Response) => {
    const db = getDb();
    const user = db.prepare('SELECT id, email, display_name, role, google_id, created_at, last_login FROM users WHERE id = ?')
        .get(req.user!.userId) as Partial<UserRecord> | undefined;

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // Check if user has Google credentials
    const hasCreds = db.prepare('SELECT COUNT(*) as count FROM google_credentials WHERE user_id = ? AND status = \'active\'')
        .get(req.user!.userId) as { count: number };

    res.json({
        ...user,
        hasGoogleCredentials: hasCreds.count > 0,
    });
});

export default router;
