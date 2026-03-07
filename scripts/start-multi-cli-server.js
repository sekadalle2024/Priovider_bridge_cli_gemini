#!/usr/bin/env node

/**
 * Script de démarrage du serveur Multi-CLI Gemini
 * Démarre un serveur avec plusieurs profils Gemini CLI
 */

// Charger les variables d'environnement
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

console.log('🚀 Démarrage du serveur Multi-CLI Gemini...\n');

// Vérifier la configuration
const profiles = (process.env.MULTI_CLI_PROFILES || 'profile1').split(',');
console.log(`📋 Profils configurés: ${profiles.join(', ')}`);

profiles.forEach(profileId => {
  const home = process.env[`CLI_${profileId.toUpperCase()}_HOME`];
  const account = process.env[`CLI_${profileId.toUpperCase()}_ACCOUNT`];
  const enabled = process.env[`CLI_${profileId.toUpperCase()}_ENABLED`];

  if (enabled !== 'false') {
    console.log(`  ✅ ${profileId}: ${account || 'unknown'}`);
    if (!home) {
      console.log(`     ⚠️  HOME not configured`);
    }
  } else {
    console.log(`  ⏸️  ${profileId}: disabled`);
  }
});

console.log('\n📊 Configuration:');
console.log(`  Strategy: ${process.env.CLI_LOAD_BALANCER_STRATEGY || 'round-robin'}`);
console.log(`  Port: ${process.env.PORT || 25810}`);

// Créer l'application Express
const app = express();

app.use(cors());
app.use(express.json());

// Routes de base
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'multi-cli-gemini',
    profiles: profiles.length,
    timestamp: new Date().toISOString()
  });
});

// Importer les routes Multi-CLI
try {
  const multiCliRoutes = require('../dist/routes/multiGeminiCliRoutes').default;
  app.use('/api/v1/cli', multiCliRoutes);
  console.log('\n✅ Routes Multi-CLI chargées');
  
  // Charger la documentation Swagger
  try {
    const { multiCliSwaggerSpec } = require('../dist/swagger/multiCliSwagger');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(multiCliSwaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Multi-CLI Gemini API Documentation'
    }));
    console.log('✅ Documentation Swagger chargée: /api-docs');
  } catch (swaggerError) {
    console.warn('⚠️  Documentation Swagger non disponible:', swaggerError.message);
  }
} catch (error) {
  console.error('\n❌ Erreur lors du chargement des routes:', error.message);
  console.log('   Détails:', error.stack);
  console.log('\n💡 Compilation des fichiers TypeScript...');
  
  // Essayer de compiler automatiquement
  const { execSync } = require('child_process');
  try {
    execSync('npx tsc src/webserver/services/MultiGeminiCliService.ts src/webserver/routes/multiGeminiCliRoutes.ts --outDir dist --module commonjs --target es2020 --esModuleInterop --skipLibCheck', { stdio: 'inherit' });
    console.log('✅ Compilation réussie, redémarrez le serveur');
  } catch (compileError) {
    console.error('❌ Échec de la compilation');
  }
  process.exit(1);
}

// Démarrer le serveur
const PORT = process.env.MULTI_CLI_PORT || process.env.PORT || 25815;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Serveur Multi-CLI Gemini démarré!');
  console.log('='.repeat(60));
  console.log(`\n📡 Endpoints disponibles:`);
  console.log(`\n  Load Balancer:`);
  console.log(`    POST http://localhost:${PORT}/api/v1/cli/chat`);
  console.log(`\n  Profils:`);
  console.log(`    GET  http://localhost:${PORT}/api/v1/cli/profiles`);
  profiles.forEach(profileId => {
    const enabled = process.env[`CLI_${profileId.toUpperCase()}_ENABLED`];
    if (enabled !== 'false') {
      console.log(`    POST http://localhost:${PORT}/api/v1/cli/${profileId}/chat`);
    }
  });
  console.log(`\n  Statistiques:`);
  console.log(`    GET  http://localhost:${PORT}/api/v1/cli/profiles/stats`);
  console.log(`\n  Health Check:`);
  console.log(`    GET  http://localhost:${PORT}/health`);
  console.log(`\n  Documentation:`);
  console.log(`    Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Testez avec:');
  console.log(`\n  curl -X POST http://localhost:${PORT}/api/v1/cli/chat \\`);
  console.log(`    -H "Content-Type: application/json" \\`);
  console.log(`    -d '{"messages":[{"role":"user","content":"Hello"}]}'`);
  console.log('\n' + '='.repeat(60));
});

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('\n❌ Erreur non gérée:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n❌ Promise rejetée:', reason);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n\n👋 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Arrêt du serveur...');
  process.exit(0);
});
