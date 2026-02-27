/**
 * Provider Bridge — Auth Middleware
 * JWT authentication and role-based authorization
 */

import type { Request, Response, NextFunction } from 'express';
import { verifyToken, type TokenPayload } from './auth-service';

/**
 * Extend Express Request with user info
 */
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

/**
 * Extract token from request (cookie or Authorization header)
 */
function extractToken(req: Request): string | null {
    // Try cookie first
    const cookieToken = req.cookies?.['pb-session'];
    if (cookieToken) return cookieToken;

    // Try Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    return null;
}

/**
 * Middleware: Require authentication
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const token = extractToken(req);

    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const payload = verifyToken(token);
    if (!payload) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }

    req.user = payload;
    next();
}

/**
 * Middleware: Require admin role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    requireAuth(req, res, () => {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }
        next();
    });
}

/**
 * Middleware: Optional auth (sets req.user if token present)
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
    const token = extractToken(req);
    if (token) {
        const payload = verifyToken(token);
        if (payload) {
            req.user = payload;
        }
    }
    next();
}
