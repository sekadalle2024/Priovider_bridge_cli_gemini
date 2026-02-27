/**
 * Provider Bridge — Main Server Entry Point
 * Express server with all routes, middleware, and static file serving
 */

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import os from 'os';

import { getDb, closeDb } from './database';
import { ensureAdminUser } from './auth/auth-service';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import providerRoutes from './routes/provider.routes';
import { openApiSpec, getSwaggerHTML } from './swagger';

const PORT = parseInt(process.env.PORT || '25809', 10);
const ALLOW_REMOTE = process.argv.includes('--remote') || process.env.ALLOW_REMOTE === 'true';
const HOST = ALLOW_REMOTE ? '0.0.0.0' : '127.0.0.1';

const app = express();

// ============================================================
// Middleware
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS
const allowedOrigins = [
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
];

if (ALLOW_REMOTE) {
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
        const netInfo = nets[name];
        if (!netInfo) continue;
        for (const net of netInfo) {
            if (net.family === 'IPv4' && !net.internal) {
                allowedOrigins.push(`http://${net.address}:${PORT}`);
            }
        }
    }
}

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
}));

// ============================================================
// API Routes
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', providerRoutes);

// OpenAI-compatible routes (mounted at root level for /v1/*)
app.use('/', providerRoutes);

// ============================================================
// Swagger Documentation
// ============================================================
app.get('/docs', (req, res) => {
    res.send(getSwaggerHTML());
});

app.get('/openapi.json', (req, res) => {
    res.json(openApiSpec);
});

// ============================================================
// Health check
// ============================================================
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ============================================================
// Serve static frontend
// ============================================================
app.use(express.static(path.join(__dirname, '..', 'public')));

// SPA fallback — serve index.html for all non-API routes
app.get('/{*path}', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'public', 'index.html');
    res.sendFile(indexPath);
});

// ============================================================
// Error handler
// ============================================================
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Server Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

// ============================================================
// Start server
// ============================================================
async function start() {
    // Initialize database
    getDb();

    // Ensure admin user
    await ensureAdminUser();

    const server = app.listen(PORT, HOST, () => {
        console.log('\n' + '═'.repeat(70));
        console.log('🌉 Provider Bridge Endpoint — Started!');
        console.log('═'.repeat(70));
        console.log(`\n📍 Server: http://localhost:${PORT}`);

        if (ALLOW_REMOTE) {
            const nets = os.networkInterfaces();
            for (const name of Object.keys(nets)) {
                const netInfo = nets[name];
                if (!netInfo) continue;
                for (const net of netInfo) {
                    if (net.family === 'IPv4' && !net.internal) {
                        console.log(`   Network: http://${net.address}:${PORT}`);
                    }
                }
            }
        }

        console.log(`\n📚 Documentation:`);
        console.log(`   Swagger UI:  http://localhost:${PORT}/docs`);
        console.log(`   OpenAPI:     http://localhost:${PORT}/openapi.json`);

        console.log(`\n🔑 Auth:`);
        console.log(`   Login:       POST http://localhost:${PORT}/api/auth/login`);
        console.log(`   Google OAuth: GET http://localhost:${PORT}/api/auth/google`);

        console.log(`\n🤖 Providers:`);
        console.log(`   Gemini CLI:   POST /api/providers/gemini_cli/chat`);
        console.log(`   API Key Rot.: POST /api/providers/gemini_api_key_rotative/chat`);
        console.log(`   Kiro CLI:     POST /api/providers/kiro_cli/chat`);

        console.log(`\n🔗 n8n / LangChain:`);
        console.log(`   POST http://localhost:${PORT}/v1/chat/completions`);
        console.log(`   GET  http://localhost:${PORT}/v1/models`);

        console.log(`\n🎛️  Admin Dashboard:`);
        console.log(`   http://localhost:${PORT}`);
        console.log(`   Default: admin / admin123`);

        console.log('\n' + '═'.repeat(70) + '\n');
    });

    // Graceful shutdown
    const shutdown = () => {
        console.log('\n\n👋 Shutting down Provider Bridge...');
        server.close(() => {
            closeDb();
            console.log('✅ Server stopped');
            process.exit(0);
        });
        setTimeout(() => process.exit(1), 5000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', error);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason) => {
        console.error('❌ Unhandled Rejection:', reason);
        process.exit(1);
    });
}

start().catch(console.error);

export default app;
