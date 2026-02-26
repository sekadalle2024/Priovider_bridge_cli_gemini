# 🚀 Gemini CLI API Endpoint - AionUI

> Exposez Gemini CLI comme API REST compatible Ollama, utilisable dans n8n et déployable sur Netlify/Vercel

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

## 📋 Qu'est-ce que c'est ?

Cette implémentation ajoute des endpoints API REST à AionUI pour exposer Gemini CLI comme un service web compatible avec le format Ollama. Vous pouvez maintenant :

- 🔌 **Utiliser Gemini dans n8n** via le nœud HTTP Request
- 🌐 **Déployer sur Netlify/Vercel** comme API serverless
- 🔄 **Compatible Ollama** - Fonctionne avec les outils qui supportent Ollama
- 🔐 **Authentification Google OAuth** - Réutilise vos credentials Gemini CLI existants
- ⚡ **Streaming supporté** - Réponses en temps réel

## ✨ Fonctionnalités

- ✅ API REST compatible Ollama (`/api/chat`, `/api/generate`)
- ✅ Authentification Google OAuth ou clé API
- ✅ Streaming et non-streaming
- ✅ Rate limiting et sécurité (CSRF, JWT)
- ✅ Déploiement local, Netlify ou Vercel
- ✅ Documentation complète en français
- ✅ Scripts de test et diagnostic

## 🚀 Démarrage Rapide

### Installation

```bash
# Cloner le projet
git clone https://github.com/iOfficeAI/AionUi.git
cd AionUi

# Installer les dépendances
npm install

# Authentification Google (si pas déjà fait)
gemini
```

### Démarrer le serveur

```bash
# Mode développement avec accès réseau
npm run webui:remote

# Le serveur démarre sur http://localhost:25808
```

### Tester l'API

```bash
# Diagnostic complet
npm run diagnose:api

# Test automatisé
npm run test:api

# Test manuel
curl http://localhost:25808/api/version
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [**Guide Complet**](docs/GEMINI_API_ENDPOINT.md) | Documentation détaillée avec tous les exemples |
| [**Démarrage Rapide**](docs/GEMINI_API_QUICKSTART_FR.md) | Guide de démarrage en 5 minutes |
| [**README Principal**](docs/GEMINI_API_README.md) | Vue d'ensemble et architecture |
| [**Utilisation avec Google**](docs/UTILISATION_AVEC_COMPTE_GOOGLE.md) | Guide pour votre compte Google |
| [**Changelog**](docs/GEMINI_API_CHANGELOG.md) | Historique des changements |
| [**Implémentation**](GEMINI_API_IMPLEMENTATION.md) | Détails techniques de l'implémentation |

## 🔌 Endpoints API

### POST /api/chat

Chat avec historique de messages (compatible Ollama).

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Bonjour!"}
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
    "content": "Bonjour! Comment puis-je vous aider?"
  },
  "done": true
}
```

### POST /api/generate

Génération simple de texte.

```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prompt": "Écris un haiku sur l'\''IA"
  }'
```

### GET /api/tags

Liste des modèles disponibles.

```bash
curl http://localhost:25808/api/tags \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET /api/version

Version de l'API (pas d'authentification requise).

```bash
curl http://localhost:25808/api/version
```

## 🔗 Intégration n8n

### Configuration HTTP Request Node

1. **URL** : `http://localhost:25808/api/chat`
2. **Method** : POST
3. **Authentication** : Header Auth
   - Name: `Authorization`
   - Value: `Bearer YOUR_JWT_TOKEN`
4. **Body** :
   ```json
   {
     "messages": [
       {"role": "user", "content": "{{ $json.prompt }}"}
     ]
   }
   ```

Voir la [documentation complète](docs/GEMINI_API_ENDPOINT.md#utilisation-avec-n8n) pour un workflow complet.

## 🌐 Déploiement

### Local

```bash
# Démarrer le serveur
npm run webui:remote

# Accessible sur http://localhost:25808
```

### Netlify

```bash
# Déployer
netlify deploy --prod

# Configurer les variables dans le dashboard
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash-exp
```

### Vercel

```bash
# Déployer
vercel --prod

# Configurer les variables dans le dashboard
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash-exp
```

## 🔐 Authentification

### OAuth Google (Local uniquement)

```bash
# S'authentifier avec Gemini CLI
gemini

# Les credentials sont sauvegardés dans ~/.gemini/oauth_creds.json
```

### Clé API (Local et Serverless)

1. Obtenir une clé sur https://aistudio.google.com/apikey
2. Configurer dans `.env` ou dans le dashboard Netlify/Vercel :
   ```bash
   GEMINI_API_KEY=your_api_key
   ```

### Token JWT

1. Ouvrir http://localhost:25808
2. Se connecter avec vos credentials
3. Récupérer le token JWT depuis les cookies
4. Utiliser dans le header : `Authorization: Bearer TOKEN`

## 🛠️ Configuration

### Variables d'environnement

Copier `.env.example` vers `.env` :

```bash
# Gemini Configuration
GEMINI_API_KEY=your_api_key              # Optionnel si OAuth configuré
GEMINI_MODEL=gemini-2.0-flash-exp        # Modèle à utiliser

# Server Configuration
AIONUI_PORT=25808                        # Port du serveur
WORKSPACE_PATH=/path/to/workspace        # Workspace path

# Optional
HTTP_PROXY=http://proxy:8080             # Proxy HTTP
GEMINI_YOLO_MODE=false                   # Auto-approve actions
```

## 🧪 Tests

### Diagnostic

```bash
# Vérifier la configuration
npm run diagnose:api
```

### Tests automatisés

```bash
# Sans authentification
npm run test:api

# Avec authentification
API_TOKEN=your_token npm run test:api
```

### Tests manuels

```bash
# Version (pas d'auth)
curl http://localhost:25808/api/version

# Chat (avec auth)
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
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

## 📝 Exemples de Code

### Python

```python
import requests

response = requests.post(
    'http://localhost:25808/api/chat',
    headers={'Authorization': 'Bearer YOUR_TOKEN'},
    json={'messages': [{'role': 'user', 'content': 'Hello!'}]}
)
print(response.json())
```

### JavaScript

```javascript
const response = await fetch('http://localhost:25808/api/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});
const data = await response.json();
console.log(data);
```

### cURL

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

## 🐛 Dépannage

### Erreur : "Google OAuth authentication not configured"

```bash
# S'authentifier avec Gemini CLI
gemini
```

### Erreur : "Unauthorized"

- Token JWT expiré → Se reconnecter
- Token invalide → Vérifier le format `Bearer TOKEN`

### Erreur : "Port already in use"

```bash
# Changer le port
AIONUI_PORT=8080 npm run webui:remote
```

### Diagnostic complet

```bash
npm run diagnose:api
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 Licence

Apache-2.0 - Voir [LICENSE](LICENSE)

## 🔗 Liens Utiles

- [Documentation Gemini CLI](https://geminicli.com/docs)
- [Documentation n8n](https://docs.n8n.io/)
- [Documentation Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [AionUI GitHub](https://github.com/iOfficeAI/AionUi)
- [Discord Community](https://discord.gg/aionui)

## 💬 Support

- **GitHub Issues** : [Ouvrir une issue](https://github.com/iOfficeAI/AionUi/issues)
- **Discord** : [Rejoindre le serveur](https://discord.gg/aionui)
- **Documentation** : [Lire les docs](docs/GEMINI_API_README.md)

## 🎉 Remerciements

Merci à la communauté AionUI et aux contributeurs de Gemini CLI !

---

**Développé avec ❤️ pour la communauté open source**

**Version** : 1.9.0  
**Date** : 26 février 2026  
**Auteur** : Équipe AionUI
