# 🚀 Gemini CLI API Endpoint - AionUI

Exposez Gemini CLI comme API REST compatible Ollama, utilisable dans n8n, et déployable sur Netlify/Vercel.

## 📋 Fonctionnalités

✅ **API REST compatible Ollama** - Endpoints `/api/chat` et `/api/generate`  
✅ **Authentification Google OAuth** - Réutilise les credentials Gemini CLI  
✅ **Compatible n8n** - Utilisez Gemini dans vos workflows n8n  
✅ **Déploiement flexible** - Local, Netlify ou Vercel  
✅ **Streaming supporté** - Réponses en temps réel  
✅ **Rate limiting** - Protection contre les abus  
✅ **Sécurisé** - JWT tokens et CSRF protection  

## 🎯 Cas d'usage

- **Automatisation n8n** : Intégrez Gemini dans vos workflows
- **API Backend** : Exposez Gemini pour vos applications
- **Prototypage rapide** : Testez Gemini sans SDK
- **Multi-plateforme** : Utilisez Gemini depuis n'importe quel langage

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Cloner le projet
git clone https://github.com/iOfficeAI/AionUi.git
cd AionUi

# Installer les dépendances
npm install

# Authentification Google (pour OAuth)
gemini
```

### 2. Démarrer le serveur

```bash
# Mode développement
npm run webui:remote

# Mode production
npm run webui:prod:remote
```

Le serveur démarre sur `http://localhost:25808`

### 3. Tester l'API

```bash
# Tester les endpoints
npm run test:api

# Avec authentification
API_TOKEN=your_jwt_token npm run test:api
```

## 📚 Documentation

- **[Guide Complet](./GEMINI_API_ENDPOINT.md)** - Documentation détaillée
- **[Démarrage Rapide](./GEMINI_API_QUICKSTART_FR.md)** - Guide rapide en français
- **[Exemples n8n](#exemples-n8n)** - Workflows n8n prêts à l'emploi

## 🔌 Endpoints API

### POST /api/chat

Chat avec historique de messages (compatible Ollama).

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

**Réponse** :
```json
{
  "model": "gemini-2.0-flash-exp",
  "created_at": "2026-02-26T10:50:19.851Z",
  "message": {
    "role": "assistant",
    "content": "Hello! How can I help you today?"
  },
  "done": true
}
```

### POST /api/generate

Génération simple de texte (compatible Ollama).

```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prompt": "Write a haiku about AI"
  }'
```

### GET /api/tags

Liste des modèles disponibles.

```bash
curl http://localhost:25808/api/tags \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET /api/version

Version de l'API.

```bash
curl http://localhost:25808/api/version
```

## 🔐 Authentification

### Obtenir un token JWT

1. Ouvrir `http://localhost:25808` dans le navigateur
2. Se connecter avec vos credentials
3. Le token JWT est dans les cookies ou localStorage

### Utiliser le token

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:25808/api/chat
```

## 🌐 Déploiement

### Netlify

```bash
# Déployer
netlify deploy --prod

# Configurer les variables
# Dashboard → Environment variables
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash-exp
```

### Vercel

```bash
# Déployer
vercel --prod

# Configurer les variables
# Dashboard → Settings → Environment Variables
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash-exp
```

## 🔗 Intégration n8n

### Configuration HTTP Request Node

**URL** : `http://localhost:25808/api/chat`  
**Method** : POST  
**Authentication** : Header Auth  
**Header Name** : Authorization  
**Header Value** : Bearer YOUR_TOKEN  

**Body** :
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ]
}
```

### Exemple de workflow

Voir [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md#utilisation-avec-n8n) pour un workflow complet.

## 🛠️ Configuration

### Variables d'environnement

Copier `.env.example` vers `.env` et configurer :

```bash
# Gemini Configuration
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=gemini-2.0-flash-exp

# Server Configuration
AIONUI_PORT=25808
WORKSPACE_PATH=/path/to/workspace

# Optional
HTTP_PROXY=http://proxy:8080
GEMINI_YOLO_MODE=false
```

### OAuth Google

```bash
# S'authentifier avec Gemini CLI
gemini

# Les credentials sont sauvegardés dans
~/.gemini/oauth_creds.json
```

## 🧪 Tests

```bash
# Tester tous les endpoints
npm run test:api

# Avec token
API_TOKEN=your_token npm run test:api

# Tester un endpoint spécifique
curl http://localhost:25808/api/version
```

## 📊 Architecture

```
┌─────────────────┐
│   n8n / Client  │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  AionUI WebUI   │
│  (Express API)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GeminiApiService│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gemini Agent   │
│  (aioncli-core) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gemini API     │
│  (Google)       │
└─────────────────┘
```

## 🔧 Dépannage

### Erreur : "Google OAuth authentication not configured"

```bash
# S'authentifier avec Gemini CLI
gemini
```

### Erreur : "Unauthorized"

- Vérifier que le token JWT est valide
- Se reconnecter pour obtenir un nouveau token

### Erreur : "Port already in use"

```bash
# Changer le port
AIONUI_PORT=8080 npm run webui:remote
```

### Performance lente

- Utiliser `stream: false` pour les réponses complètes
- Utiliser un modèle plus rapide (flash au lieu de pro)
- Vérifier votre quota API

## 📝 Exemples de code

### Python

```python
import requests

url = "http://localhost:25808/api/chat"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN"
}
data = {
    "messages": [
        {"role": "user", "content": "Hello!"}
    ]
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

### JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

async function chat(message) {
  const response = await fetch('http://localhost:25808/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }]
    })
  });
  
  return await response.json();
}

chat('Hello!').then(console.log);
```

### cURL

```bash
# Chat simple
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'

# Génération
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"prompt": "Write a poem"}'
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](../CONTRIBUTING.md).

## 📄 Licence

Apache-2.0 - Voir [LICENSE](../LICENSE)

## 🔗 Liens utiles

- [Documentation Gemini CLI](https://geminicli.com/docs)
- [Documentation n8n](https://docs.n8n.io/)
- [Documentation Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [AionUI GitHub](https://github.com/iOfficeAI/AionUi)
- [Discord Community](https://discord.gg/aionui)

## 💬 Support

- **GitHub Issues** : [Ouvrir une issue](https://github.com/iOfficeAI/AionUi/issues)
- **Discord** : [Rejoindre le serveur](https://discord.gg/aionui)
- **Documentation** : [Lire les docs](./GEMINI_API_ENDPOINT.md)

---

**Développé avec ❤️ par l'équipe AionUI**
