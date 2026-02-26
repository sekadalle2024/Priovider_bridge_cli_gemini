#!/usr/bin/env node

/**
 * Script de démarrage du serveur multi-provider
 * Lance le serveur TypeScript avec ts-node
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage du serveur multi-provider AionUI...\n');

// Chemin vers le fichier TypeScript du serveur
const serverPath = path.join(__dirname, 'src', 'webserver', 'server-multi-provider.ts');

// Démarrer le serveur avec ts-node
const server = spawn('npx', ['ts-node', serverPath], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
});

// Gestion des erreurs
server.on('error', (error) => {
  console.error('❌ Erreur lors du démarrage du serveur:', error.message);
  process.exit(1);
});

// Gestion de l'arrêt
server.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Le serveur s'est arrêté avec le code ${code}`);
    process.exit(code);
  }
});

// Gestion des signaux d'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.kill('SIGTERM');
});
