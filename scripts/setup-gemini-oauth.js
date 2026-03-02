#!/usr/bin/env node

/**
 * Script pour configurer les credentials OAuth Gemini depuis les variables d'environnement
 * Utilisé lors du déploiement sur Render (sans Docker)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔐 Setting up Gemini OAuth credentials...');

// Vérifier si les variables d'environnement sont définies
const accessToken = process.env.GEMINI_OAUTH_ACCESS_TOKEN;
const refreshToken = process.env.GEMINI_OAUTH_REFRESH_TOKEN;

if (!accessToken && !refreshToken) {
  console.log('⚠️  No OAuth credentials found in environment variables');
  console.log('ℹ️  Set GEMINI_OAUTH_ACCESS_TOKEN and GEMINI_OAUTH_REFRESH_TOKEN');
  process.exit(0);  // Ne pas échouer, juste avertir
}

// Créer le dossier .gemini
const geminiDir = path.join(os.homedir(), '.gemini');
if (!fs.existsSync(geminiDir)) {
  fs.mkdirSync(geminiDir, { recursive: true });
  console.log(`✅ Created directory: ${geminiDir}`);
}

// Créer le fichier oauth_creds.json
const credsPath = path.join(geminiDir, 'oauth_creds.json');
const creds = {
  access_token: accessToken || '',
  refresh_token: refreshToken || '',
  token_type: 'Bearer',
  expiry_date: Date.now() + 3600000  // 1 heure
};

fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));
fs.chmodSync(credsPath, 0o600);  // Permissions restrictives

console.log(`✅ OAuth credentials saved to: ${credsPath}`);
console.log('🎉 Gemini CLI is ready to use!');
