# 🚀 AionUi Multi-Provider API Server

Serveur API unifié exposant plusieurs providers d'IA via des endpoints compatibles Ollama.

## 📋 Table des matières

- [Providers disponibles](#providers-disponibles)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Endpoints API](#endpoints-api)
- [Exemples](#exemples)
- [Intégration n8n](#intégration-n8n)
- [Déploiement](#déploiement)

## 🤖 Providers disponibles

### 1. Gemini CLI (`gemini_cli`)

Utilise Gemini CLI avec authentification Google OAuth.

- **Authentification**: Google OAuth (via `gemini auth login`)
- **Avantages**: Accès complet aux fonctionnalités Gemini CLI
- **Endpoints**:
  - `POST /api/gemini_cli/chat`
  - `POST /api/gemini_cli/generate`

### 2. Gemini API Key Rotative (`gemini_api_key_rotative`)

Utilise les clés API Gemini avec rotation automatique pour respecter les limites.

- **Authentification**: Clés API (configurées dans `.env`)
- **Limites par clé**: 5 requêtes/minute, 250,000 tokens/jour
- **Rotation automatique**: Bascule automatiquement entre les clés disponibles
- **Endpoints**:
  - `POST /api/gemini_api_key_rotative/chat`
  - `POST /api/gemini_api_key_rotative/generate`
  - `GET /api/gemini_api_key_rotative/stats` (statistiques d'utilisation)

### 3. Kiro CLI (`kiro_cli`)

À venir - Intégration avec Kiro CLI.

- **Status**: Non implémenté
- **Endpoints**:
  - `POST /api/kiro_cli/chat`
  - `POST /api/kiro_cli/generate`

## 📥 Installation

### Prérequis

- Node.js 22+ (installé via nvm)
- npm ou bun
- Compte Google (pour Gemini CLI)
- Clés API Gemini (pour le provider API Key)

### Étapes

1. **Cloner le projet**

```bash
git clone https://github.com/iOfficeAI/AionUi.git
cd AionUi
```

2. **Installer les dépendances**

```bash
npm install
# ou
bun install
```

3. **Configurer les variables d'environnement**

Copier `.env.example` vers `.env` et configurer:

```bash
cp .env.example .env
```

4. **Configurer Gemini CLI (optionnel)**

```bash
gemini auth login
```

5. **Builder les services**

```bash
node scripts/build-multi-provider.js
```

## ⚙️ Configuration

### Fichier `.env`

Le fichier `.env` contient toutes les configurations nécessaires:

```env
# Clés API Gemini (rotation automatique)
GEMINI_API_KEY_OHADA_FINANCE_A=AIzaSy...
GEMINI_API_KEY_OHADA_FINANCE_B=AIzaSy...
# ... (ajoutez toutes vos clés)

# Configuration du serveur
PORT=25808
AIONUI_ALLOW_REMOTE=false

# Modèle par défaut
GEMINI_MODEL=gemini-2.0-flash-exp

# Workspace
WORKSPACE_PATH=./workspace
```

### Clés API

Le serveur charge automatiquement toutes les variables d'environnement commençant par `GEMINI_API_KEY_`.

**Format**: `GEMINI_API_KEY_<NOM>_<LETTRE>=<clé>`

Exemple:
```env
GEMINI_API_KEY_OHADA_FINANCE_A=AIzaSyA3cPcbSfi8OR6X2x5KtaeoW6XfNv1UE60
GEMINI_API_KEY_OHADA_FINANCE_B=AIzaSyAoQJDYmHFrpaE19tWaFMw56blu9pBwqX8
```

## 🚀 Utilisation

### Démarrer le serveur

```bash
# Mode local (127.0.0.1)
node server.js

# Mode remote (0.0.0.0)
node server.js --remote

# Avec npm
npm run server
npm run server:remote
```

### Vérifier le statut

```bash
curl http://localhost:25808/health
```

### Lister les providers

```bash
curl http://localhost:25808/api/providers
```

## 📡 Endpoints API

### Endpoints communs

#### GET /api/providers

Liste tous les providers disponibles avec leur statut.

**Réponse**:
```json
{
  "providers": [
    {
      "name": "gemini_cli",
      "description": "Gemini CLI with Google OAuth authentication",
      "status": "available",
      "endpoints": {
        "chat": "/api/gemini_cli/chat",
        "generate": "/api/gemini_cli/generate"
      }
    },
    {
      "name": "gemini_api_key_rotative",
      "description": "Gemini API with automatic key rotation",
      "status": "available",
      "endpoints": {
        "chat": "/api/gemini_api_key_rotative/chat",
        "generate": "/api/gemini_api_key_rotative/generate",
        "stats": "/api/gemini_api_key_rotative/stats"
      }
    }
  ]
}
```

### Gemini CLI

#### POST /api/gemini_cli/chat

Envoyer un message via Gemini CLI.

**Requête**:
```json
{
  "model": "gemini-2.0-flash-exp",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "stream": true
}
```

**Réponse (streaming)**:
```json
{"model":"gemini-cli","provider":"gemini_cli","created_at":"2025-01-01T00:00:00.000Z","message":{"role":"assistant","content":"Hello"},"done":false}
{"model":"gemini-cli","provider":"gemini_cli","created_at":"2025-01-01T00:00:00.000Z","message":{"role":"assistant","content":"!"},"done":false}
{"model":"gemini-cli","provider":"gemini_cli","created_at":"2025-01-01T00:00:00.000Z","message":{"role":"assistant","content":""},"done":true}
```

#### POST /api/gemini_cli/generate

Générer une complétion via Gemini CLI.

**Requête**:
```json
{
  "model": "gemini-2.0-flash-exp",
  "prompt": "Write a haiku about coding",
  "stream": true
}
```

### Gemini API Key Rotative

#### POST /api/gemini_api_key_rotative/chat

Envoyer un message via Gemini API avec rotation des clés.

**Requête**:
```json
{
  "model": "gemini-2.0-flash-exp",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "stream": true,
  "options": {
    "temperature": 0.7,
    "max_tokens": 1000
  }
}
```

#### POST /api/gemini_api_key_rotative/generate

Générer une complétion via Gemini API avec rotation des clés.

#### GET /api/gemini_api_key_rotative/stats

Obtenir les statistiques d'utilisation des clés API.

**Réponse**:
```json
{
  "totalKeys": 27,
  "availableKeys": 25,
  "usage": [
    {
      "index": 0,
      "requestsThisMinute": 3,
      "tokensToday": 15000,
      "available": true
    }
  ]
}
```

## 💡 Exemples

### Exemple avec curl

```bash
# Chat avec Gemini CLI
curl -X POST http://localhost:25808/api/gemini_cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": false
  }'

# Chat avec Gemini API Key (rotation automatique)
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": false
  }'

# Statistiques des clés API
curl http://localhost:25808/api/gemini_api_key_rotative/stats
```

### Exemple avec Python

```python
import requests

# Configuration
BASE_URL = "http://localhost:25808"
PROVIDER = "gemini_api_key_rotative"  # ou "gemini_cli"

# Envoyer un message
response = requests.post(
    f"{BASE_URL}/api/{PROVIDER}/chat",
    json={
        "messages": [
            {"role": "user", "content": "Explain quantum computing"}
        ],
        "stream": False
    }
)

result = response.json()
print(result["message"]["content"])
```

### Exemple avec JavaScript/Node.js

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:25808';
const PROVIDER = 'gemini_api_key_rotative';

async function chat(message) {
  const response = await axios.post(
    `${BASE_URL}/api/${PROVIDER}/chat`,
    {
      messages: [
        { role: 'user', content: message }
      ],
      stream: false
    }
  );
  
  return response.data.message.content;
}

chat('What is AI?').then(console.log);
```

## 🔗 Intégration n8n

### Configuration dans n8n

1. **Ajouter un nœud HTTP Request**

2. **Configurer l'URL**:
   - URL: `http://localhost:25808/api/gemini_api_key_rotative/chat`
   - Method: POST

3. **Configurer le Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "stream": false,
  "options": {
    "temperature": 0.7
  }
}
```

4. **Headers**:
   - Content-Type: `application/json`

### Workflow n8n complet

```json
{
  "nodes": [
    {
      "name": "Gemini API",
      "type": "n8n-nodes-base.httpRequest",
      "position": [250, 300],
      "parameters": {
        "url": "http://localhost:25808/api/gemini_api_key_rotative/chat",
        "method": "POST",
        "bodyParameters": {
          "parameters": [
            {
              "name": "messages",
              "value": "[{\"role\":\"user\",\"content\":\"{{ $json.prompt }}\"}]"
            },
            {
              "name": "stream",
              "value": false
            }
          ]
        }
      }
    }
  ]
}
```

## 🌐 Déploiement

### Déploiement local

```bash
# Démarrer en mode production
NODE_ENV=production node server.js --remote
```

### Déploiement sur Netlify

Le projet inclut des fonctions Netlify dans `netlify/functions/`:

1. **Configurer `netlify.toml`**:
```toml
[build]
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. **Déployer**:
```bash
netlify deploy --prod
```

### Déploiement sur Vercel

1. **Créer `vercel.json`**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

2. **Déployer**:
```bash
vercel --prod
```

### Variables d'environnement en production

Configurer dans votre plateforme de déploiement:

```env
GEMINI_API_KEY_OHADA_FINANCE_A=...
GEMINI_API_KEY_OHADA_FINANCE_B=...
# ... toutes vos clés

GEMINI_MODEL=gemini-2.0-flash-exp
PORT=25808
NODE_ENV=production
```

## 🔒 Sécurité

### Rate Limiting

Le serveur inclut un rate limiting par défaut:
- 100 requêtes par minute par IP
- Configurable via `API_RATE_LIMIT_MAX_REQUESTS`

### Authentification

Pour ajouter une authentification JWT:

1. Configurer `JWT_SECRET` dans `.env`
2. Les tokens sont validés automatiquement via `TokenMiddleware`

### CORS

CORS est configuré pour accepter:
- `localhost`
- `127.0.0.1`
- IPs locales (si `--remote` est activé)

## 📊 Monitoring

### Logs

Les logs incluent:
- Sélection des clés API
- Utilisation des quotas
- Erreurs et warnings

### Statistiques

Obtenir les stats en temps réel:

```bash
curl http://localhost:25808/api/gemini_api_key_rotative/stats
```

## 🐛 Dépannage

### Erreur: "Aucune clé API trouvée"

Vérifier que les clés sont bien configurées dans `.env`:
```bash
grep GEMINI_API_KEY .env
```

### Erreur: "Toutes les clés ont atteint leurs limites"

Attendre 1 minute ou ajouter plus de clés API dans `.env`.

### Erreur: "Google OAuth not configured"

Pour utiliser Gemini CLI:
```bash
gemini auth login
```

## 📚 Documentation supplémentaire

- [README principal](README.md)
- [Documentation Gemini API](src/webserver/gemini-api-docs/README.md)
- [Guide d'utilisation avec compte Google](src/webserver/gemini-api-docs/UTILISATION_AVEC_COMPTE_GOOGLE.md)

## 🤝 Support

- GitHub Issues: https://github.com/iOfficeAI/AionUi/issues
- Discord: [Lien Discord]
- Documentation: https://aionui.com

## 📄 Licence

Apache-2.0 - Voir [LICENSE](LICENSE)
