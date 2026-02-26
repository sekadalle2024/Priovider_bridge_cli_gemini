# 📋 Commandes NPM - Gemini CLI API

## 🚀 Commandes Principales

### Démarrage du Serveur

```bash
# Mode développement avec interface graphique
npm start

# Mode WebUI (interface web uniquement)
npm run webui

# Mode WebUI avec accès réseau (recommandé pour l'API)
npm run webui:remote

# Mode production
npm run webui:prod

# Mode production avec accès réseau
npm run webui:prod:remote
```

### Tests et Diagnostic

```bash
# Diagnostic complet de la configuration
npm run diagnose:api

# Test automatisé de tous les endpoints
npm run test:api

# Test avec authentification
API_TOKEN=your_token npm run test:api

# Tests unitaires
npm run test

# Tests avec watch mode
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

### Build et Distribution

```bash
# Build pour Electron
npm run package

# Build pour toutes les plateformes
npm run build

# Build pour macOS
npm run build-mac
npm run build-mac:arm64
npm run build-mac:x64

# Build pour Windows
npm run build-win

# Build pour Linux
npm run build-deb
```

### Utilitaires

```bash
# Réinitialiser le mot de passe admin
npm run resetpass

# Réinitialiser pour un utilisateur spécifique
npm run resetpass username

# Linter
npm run lint

# Linter avec correction automatique
npm run lint:fix

# Formatter
npm run format

# Vérifier le formatage
npm run format:check
```

### Debug

```bash
# Debug performance
npm run debug:perf

# Rapport de performance
npm run debug:perf:report

# Debug MCP
npm run debug:mcp

# Liste des serveurs MCP
npm run debug:mcp:list

# Valider la config MCP
npm run debug:mcp:validate

# Debug custom agent
npm run debug:custom-agent
```

## 🔧 Variables d'Environnement

### Pour le Serveur

```bash
# Port du serveur (défaut: 25808)
AIONUI_PORT=8080 npm run webui:remote

# Workspace path
WORKSPACE_PATH=/path/to/workspace npm run webui:remote

# Proxy
HTTP_PROXY=http://proxy:8080 npm run webui:remote

# Mode YOLO (auto-approve)
GEMINI_YOLO_MODE=true npm run webui:remote
```

### Pour Gemini

```bash
# Clé API Gemini
GEMINI_API_KEY=your_key npm run webui:remote

# Modèle à utiliser
GEMINI_MODEL=gemini-2.0-flash-exp npm run webui:remote

# Base URL
GOOGLE_GEMINI_BASE_URL=https://api.example.com npm run webui:remote

# Google Cloud Project
GOOGLE_CLOUD_PROJECT=your-project npm run webui:remote
```

### Pour les Tests

```bash
# Host de l'API
API_HOST=localhost npm run test:api

# Port de l'API
API_PORT=25808 npm run test:api

# Token d'authentification
API_TOKEN=your_token npm run test:api

# Utiliser HTTPS
USE_HTTPS=true npm run test:api
```

## 📊 Exemples d'Utilisation

### Démarrage Complet

```bash
# 1. Diagnostic
npm run diagnose:api

# 2. Démarrer le serveur
npm run webui:remote

# 3. Dans un autre terminal, tester
npm run test:api
```

### Développement

```bash
# Terminal 1 : Serveur en mode watch
npm start

# Terminal 2 : Tests en mode watch
npm run test:watch

# Terminal 3 : Linter en mode watch
npm run lint:fix
```

### Production

```bash
# Build
npm run build

# Démarrer en production
npm run webui:prod:remote
```

### Debug

```bash
# Debug avec performance monitoring
npm run debug:perf

# Voir le rapport
npm run debug:perf:report
```

## 🎯 Workflows Recommandés

### Workflow 1 : Développement Local

```bash
# 1. Vérifier la config
npm run diagnose:api

# 2. Démarrer en mode dev
npm run webui:remote

# 3. Tester l'API
npm run test:api

# 4. Développer et tester
# (le serveur redémarre automatiquement)
```

### Workflow 2 : Déploiement

```bash
# 1. Tests
npm run test
npm run test:api

# 2. Linter
npm run lint

# 3. Build
npm run build

# 4. Déployer
netlify deploy --prod
# ou
vercel --prod
```

### Workflow 3 : Debug

```bash
# 1. Diagnostic
npm run diagnose:api

# 2. Debug MCP
npm run debug:mcp:list

# 3. Debug performance
npm run debug:perf

# 4. Voir les rapports
npm run debug:perf:report
```

## 🔍 Commandes de Diagnostic

### Vérifier la Configuration

```bash
# Diagnostic complet
npm run diagnose:api

# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier Gemini CLI
gemini --version

# Vérifier les credentials OAuth
ls ~/.gemini/oauth_creds.json
```

### Vérifier le Serveur

```bash
# Démarrer le serveur
npm run webui:remote

# Dans un autre terminal, tester
curl http://localhost:25808/api/version

# Tester avec authentification
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:25808/api/tags
```

### Vérifier les Dépendances

```bash
# Liste des dépendances
npm list

# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour les dépendances
npm update
```

## 📝 Scripts Personnalisés

### Créer un Script Personnalisé

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "my-script": "node scripts/my-script.js"
  }
}
```

### Exemples de Scripts Utiles

```json
{
  "scripts": {
    "dev": "npm run webui:remote",
    "prod": "npm run webui:prod:remote",
    "check": "npm run diagnose:api && npm run test:api",
    "deploy:netlify": "netlify deploy --prod",
    "deploy:vercel": "vercel --prod"
  }
}
```

## 🚀 Raccourcis Utiles

```bash
# Démarrage rapide
npm run webui:remote

# Test rapide
npm run test:api

# Diagnostic rapide
npm run diagnose:api

# Build rapide
npm run build

# Déploiement rapide
netlify deploy --prod
```

## 💡 Conseils

1. **Toujours vérifier** avec `npm run diagnose:api` avant de démarrer
2. **Utiliser `webui:remote`** pour l'API (pas `webui`)
3. **Tester régulièrement** avec `npm run test:api`
4. **Linter avant commit** avec `npm run lint:fix`
5. **Build avant déploiement** avec `npm run build`

## 📚 Ressources

- **Documentation** : [GEMINI_API_README.md](./GEMINI_API_README.md)
- **Guide Rapide** : [GEMINI_API_QUICKSTART_FR.md](./GEMINI_API_QUICKSTART_FR.md)
- **Dépannage** : [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md#dépannage)

---

**Bon développement ! 🚀**
