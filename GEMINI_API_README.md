# 🚀 Gemini CLI API - Guide de Démarrage

API REST compatible Ollama pour transformer Gemini CLI en serveur API accessible.

## 📚 Documentation Complète

**Toute la documentation est centralisée dans:**
```
src/webserver/gemini-api-docs/
```

### 📖 Index Principal
👉 **[src/webserver/gemini-api-docs/INDEX.md](src/webserver/gemini-api-docs/INDEX.md)**

L'index contient:
- Vue d'ensemble de toute la documentation
- Guides par cas d'usage
- Parcours d'apprentissage
- Liens vers tous les documents

## 🚀 Démarrage Rapide

### 1. Installation
```bash
# Installer les dépendances
npm install

# Installer Gemini CLI (si pas déjà fait)
npm install -g @google/gemini-cli
```

### 2. Configuration
```bash
# Authentification Google OAuth
gemini

# Ou configurer avec API Key
cp .env.example .env
# Éditer .env et ajouter GEMINI_API_KEY
```

### 3. Démarrage
```bash
# Démarrer le serveur
npm run server:remote

# Ouvrir la documentation Swagger
npm run docs:api
```

### 4. Test
```bash
# Tester l'API
npm run test:api

# Ou manuellement
curl http://localhost:25808/api/version
```

## 📖 Documentation Disponible

| Document | Description |
|----------|-------------|
| [INDEX.md](src/webserver/gemini-api-docs/INDEX.md) | **Index complet** - Point d'entrée principal |
| [README.md](src/webserver/gemini-api-docs/README.md) | Vue d'ensemble générale |
| [GEMINI_API_ENDPOINT.md](src/webserver/gemini-api-docs/GEMINI_API_ENDPOINT.md) | Guide technique détaillé |
| [API_DOCUMENTATION.md](src/webserver/gemini-api-docs/API_DOCUMENTATION.md) | Guide d'utilisation pratique |
| [MODELS_GUIDE.md](src/webserver/gemini-api-docs/MODELS_GUIDE.md) | Guide des modèles Gemini |

## 🌐 Accès Rapide

- **Swagger UI**: http://localhost:25808/docs
- **OpenAPI Spec**: http://localhost:25808/openapi.json
- **API Base**: http://localhost:25808/api

## 🎯 Cas d'Usage Courants

### Génération de Texte
```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "prompt": "Explain quantum computing",
    "stream": false
  }'
```

### Chat Conversationnel
```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "stream": false
  }'
```

## 🔧 Scripts Disponibles

```bash
npm run server:remote    # Démarrer le serveur
npm run docs:api         # Ouvrir Swagger UI
npm run test:api         # Tester l'API
npm run diagnose:api     # Diagnostiquer la config
```

## 📊 Configuration

### Variables d'Environnement
```bash
# Modèle par défaut
GEMINI_MODEL=gemini-2.5-flash

# Port du serveur
AIONUI_PORT=25808

# API Key (optionnel si OAuth configuré)
GEMINI_API_KEY=your_api_key
```

Voir `.env.example` pour la configuration complète.

## 🆘 Support

### Problèmes Courants
- **Erreur 429**: Voir [MODELS_GUIDE.md](src/webserver/gemini-api-docs/MODELS_GUIDE.md#gestion-des-erreurs-429)
- **Timeout**: Configuration dans `dist/gemini-service-standalone.js` (300s par défaut)
- **Authentification**: Exécuter `gemini` pour configurer OAuth

### Diagnostic
```bash
npm run diagnose:api
```

## 🔗 Liens Utiles

- [Documentation Gemini API](https://ai.google.dev/gemini-api/docs)
- [Gemini CLI](https://geminicli.com/docs/)
- [Compatibilité Ollama](https://github.com/ollama/ollama/blob/main/docs/api.md)

## 📝 Licence

Apache 2.0 - Voir LICENSE

---

**Pour la documentation complète, consultez [INDEX.md](src/webserver/gemini-api-docs/INDEX.md)**
