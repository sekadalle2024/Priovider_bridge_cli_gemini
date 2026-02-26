#!/usr/bin/env node

/**
 * Script pour démarrer uniquement le serveur WebUI sans Electron
 * Script to start only the WebUI server without Electron
 */

// Simuler l'environnement Electron minimal
global.app = {
  getPath: (name) => {
    const os = require('os');
    const path = require('path');
    if (name === 'userData') {
      return path.join(os.homedir(), '.aionui');
    }
    return os.tmpdir();
  },
  isReady: () => true,
  whenReady: () => Promise.resolve(),
};

// Charger le serveur WebUI
async function startServer() {
  try {
    console.log('🚀 Starting AionUI WebUI Server...\n');
    
    // Importer le module du serveur
    const { startWebServer } = await import('./out/main/chunks/index-BrWkxdwc.js');
    
    // Configuration
    const port = parseInt(process.env.AIONUI_PORT || '25808', 10);
    const allowRemote = process.env.AIONUI_ALLOW_REMOTE === 'true' || process.argv.includes('--remote');
    
    console.log(`📍 Port: ${port}`);
    console.log(`🌐 Remote Access: ${allowRemote ? 'Enabled' : 'Disabled'}\n`);
    
    // Démarrer le serveur
    await startWebServer(port, allowRemote);
    
    console.log('\n✅ Server started successfully!');
    console.log(`\n📍 Access the API at: http://localhost:${port}`);
    console.log(`\n🔗 Endpoints:`);
    console.log(`   - POST http://localhost:${port}/api/chat`);
    console.log(`   - POST http://localhost:${port}/api/generate`);
    console.log(`   - GET  http://localhost:${port}/api/tags`);
    console.log(`   - GET  http://localhost:${port}/api/version`);
    console.log(`\n💡 Press Ctrl+C to stop the server\n`);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down server...');
  process.exit(0);
});

// Démarrer
startServer().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
