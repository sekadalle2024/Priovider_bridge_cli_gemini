#!/usr/bin/env node

/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Script de build pour les services multi-provider
 */

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// Créer le dossier dist s'il n'existe pas
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log('🔨 Building multi-provider services...\n');

// Configuration commune
const commonConfig = {
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  sourcemap: true,
  external: [
    'electron',
    'better-sqlite3',
    'sharp',
    '@office-ai/aioncli-core',
    '@office-ai/platform',
    '@google/genai',
    'express',
    'cors',
    'cookie-parser',
  ],
  // Ne pas bundler les modules node_modules
  packages: 'external',
};

// Builds à effectuer
const builds = [
  {
    name: 'Multi-Provider Routes',
    config: {
      entryPoints: ['src/webserver/routes/multiProviderRoutes.ts'],
      outfile: 'dist/multi-provider-routes.js',
    }
  },
  {
    name: 'API Key Rotation Service',
    config: {
      entryPoints: ['src/webserver/services/ApiKeyRotationService.ts'],
      outfile: 'dist/api-key-rotation-service.js',
    }
  },
  {
    name: 'Gemini API Key Service',
    config: {
      entryPoints: ['src/webserver/services/GeminiApiKeyService.ts'],
      outfile: 'dist/gemini-api-key-service.js',
    }
  },
];

// Fonction pour build un fichier
async function buildFile(build) {
  try {
    console.log(`📦 Building ${build.name}...`);
    await esbuild.build({
      ...commonConfig,
      ...build.config,
    });
    console.log(`✅ ${build.name} built successfully\n`);
  } catch (error) {
    console.error(`❌ Error building ${build.name}:`, error);
    process.exit(1);
  }
}

// Build tous les fichiers
async function buildAll() {
  for (const build of builds) {
    await buildFile(build);
  }
  
  console.log('✨ All builds completed successfully!\n');
  console.log('📁 Output files:');
  builds.forEach(build => {
    console.log(`   - ${build.config.outfile}`);
  });
  console.log('');
}

// Exécuter le build
buildAll().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
