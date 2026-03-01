#!/usr/bin/env node

/**
 * Script pour démarrer le serveur des assistants
 * Peut être utilisé en standalone ou intégré à l'application Electron
 */

const { spawn } = require('child_process');
const path = require('path');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Configuration
const serverPath = path.join(__dirname, 'server-assistants-standalone.js');
const port = process.env.ASSISTANT_PORT || 25810;

log('\n' + '='.repeat(60), 'bright');
log('🚀 Démarrage du serveur des assistants AionUI', 'blue');
log('='.repeat(60), 'bright');

// Utiliser node pour exécuter le fichier JavaScript standalone
const command = 'node';
const args = [serverPath];

log(`\n📦 Commande: ${command} ${args.join(' ')}`, 'yellow');
log(`🔌 Port: ${port}`, 'yellow');
log(`📁 Assistants: ${path.join(__dirname, '..', 'assistant')}`, 'yellow');
log('');

// Démarrer le serveur
const server = spawn(command, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    ASSISTANT_PORT: port,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
});

server.on('error', (error) => {
  log(`\n❌ Erreur lors du démarrage: ${error.message}`, 'red');
  process.exit(1);
});

server.on('close', (code) => {
  if (code !== 0) {
    log(`\n❌ Le serveur s'est arrêté avec le code ${code}`, 'red');
  } else {
    log('\n✅ Serveur arrêté proprement', 'green');
  }
  process.exit(code);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  log('\n\n🛑 Arrêt du serveur...', 'yellow');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  log('\n\n🛑 Arrêt du serveur...', 'yellow');
  server.kill('SIGTERM');
});
