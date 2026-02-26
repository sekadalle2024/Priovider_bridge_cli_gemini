#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Script pour ouvrir la documentation API dans le navigateur
 */

const { exec } = require('child_process');
const http = require('http');

const PORT = process.env.AIONUI_PORT || 25808;
const DOCS_URL = `http://localhost:${PORT}/docs`;

// Vérifier si le serveur est en cours d'exécution
function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Ouvrir l'URL dans le navigateur par défaut
function openBrowser(url) {
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error('❌ Erreur lors de l\'ouverture du navigateur:', error.message);
      console.log(`\n💡 Ouvrez manuellement: ${url}`);
    } else {
      console.log('✅ Documentation ouverte dans le navigateur!');
    }
  });
}

async function main() {
  console.log('🔍 Vérification du serveur...');
  
  const isRunning = await checkServer();
  
  if (!isRunning) {
    console.log('❌ Le serveur n\'est pas en cours d\'exécution sur le port', PORT);
    console.log('\n💡 Démarrez le serveur avec:');
    console.log('   npm run server');
    console.log('   ou');
    console.log('   node server.js --remote');
    process.exit(1);
  }
  
  console.log('✅ Serveur détecté!');
  console.log(`\n📖 Ouverture de la documentation: ${DOCS_URL}\n`);
  
  openBrowser(DOCS_URL);
}

main().catch((error) => {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
});
