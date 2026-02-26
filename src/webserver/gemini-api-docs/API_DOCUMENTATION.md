# 📚 Documentation API Gemini CLI

Documentation interactive de l'API Gemini CLI compatible Ollama.

## 🚀 Accès rapide

### Interface interactive (Swagger UI)
```bash
# Ouvrir automatiquement dans le navigateur
npm run docs:api

# Ou accéder manuellement
http://localhost:25808/docs
```

### Spécification OpenAPI
```bash
# Format JSON
http://localhost:25808/openapi.json
```

## 📖 Endpoints disponibles

### Informations
- `GET /` - Page d'accueil de l'API
- `GET /health` - Vérification de santé du serveur
- `GET /api/version` - Version de l'API
- `GET /docs` - Documentation interactive (Swagger UI)
- `GET /openapi.json` - Spécification OpenAPI 3.0

### Modèles
- `GET /api/tags` - Liste des modèles Gemini disponibles

### Génération
- `POST /api/generate` - Génération de texte à partir d'un prompt
- `POST /api/chat` - Chat conversationnel avec historique

## 💡 Exemples d'utilisation

### Génération simple

```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "stream": false
  }'
```

### Chat conversationnel

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "stream": false
  }'
```

### Avec options avancées

```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash-preview",
    "prompt": "Write a haiku about coding",
    "stream": false,
    "options": {
      "temperature": 0.8
    }
  }'
```

## 🔧 Tester l'API

### Via l'interface Swagger
1. Démarrer le serveur: `npm run server:remote`
2. Ouvrir la documentation: `npm run docs:api`
3. Cliquer sur un endpoint
4. Cliquer sur "Try it out"
5. Remplir les paramètres
6. Cliquer sur "Execute"

### Via le script de test
```bash
npm run test:api
```

### Via curl (PowerShell)
```powershell
$body = @{
    prompt = "Say hello"
    stream = $false
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:25808/api/generate `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing | Select-Object -ExpandProperty Content
```

## 📊 Format des réponses

### Génération (non-streaming)
```json
{
  "model": "gemini-3-flash-preview",
  "created_at": "2026-02-26T16:50:08.717Z",
  "response": "Hello! I'm Gemini CLI...",
  "done": true
}
```

### Chat (non-streaming)
```json
{
  "model": "gemini-3-flash-preview",
  "created_at": "2026-02-26T16:50:08.717Z",
  "message": {
    "role": "assistant",
    "content": "The capital of France is Paris."
  },
  "done": true
}
```

## 🔐 Authentification

L'API utilise des tokens JWT pour l'authentification (optionnel selon la configuration).

Pour obtenir un token:
1. Accéder à l'interface WebUI: `http://localhost:25808`
2. Se connecter
3. Copier le token JWT
4. Utiliser le token dans les requêtes:

```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}'
```

## 🌐 Compatibilité Ollama

Cette API est compatible avec le format Ollama, ce qui signifie que vous pouvez:
- Utiliser des clients Ollama existants
- Intégrer avec des outils comme n8n, LangChain, etc.
- Remplacer Ollama par Gemini CLI sans changer votre code

## 📝 Notes

- Le serveur doit être démarré avec `npm run server:remote` pour être accessible
- Par défaut, le serveur écoute sur le port 25808
- Le modèle par défaut est `gemini-3-flash-preview`
- L'authentification Google OAuth est utilisée si configurée

## 🔗 Ressources

- [Documentation complète](src/webserver/gemini-api-docs/README.md)
- [Guide de démarrage rapide](src/webserver/gemini-api-docs/GEMINI_API_ENDPOINT.md)
- [GitHub](https://github.com/iOfficeAI/AionUi)
- [Spécification OpenAPI](http://localhost:25808/openapi.json)
