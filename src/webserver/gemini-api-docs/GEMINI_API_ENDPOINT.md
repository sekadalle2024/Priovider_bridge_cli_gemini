# Gemini CLI API Endpoint - Guide Complet

Ce guide explique comment utiliser les endpoints API Gemini CLI dans AionUI, compatibles avec Ollama et utilisables dans n8n.

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Configuration Locale](#configuration-locale)
- [Configuration Netlify](#configuration-netlify)
- [Configuration Vercel](#configuration-vercel)
- [Utilisation avec n8n](#utilisation-avec-n8n)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

AionUI expose maintenant Gemini CLI comme API REST compatible avec le format Ollama, permettant :

- ✅ Utilisation dans n8n via le nœud HTTP Request
- ✅ Compatible avec les outils qui supportent Ollama
- ✅ Authentification Google OAuth réutilisée
- ✅ Déploiement local, Netlify ou Vercel

### Endpoints disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/chat` | POST | Chat avec historique de messages |
| `/api/generate` | POST | Génération simple de texte |
| `/api/tags` | GET | Liste des modèles disponibles |
| `/api/version` | GET | Version de l'API |

---

## 🏠 Configuration Locale

### 1. Prérequis

- Node.js 22+ installé
- AionUI installé
- Authentification Google configurée via Gemini CLI

### 2. Vérifier l'authentification Google

```bash
# Lancer Gemini CLI pour s'authentifier
gemini

# Suivre les instructions pour se connecter avec Google
# Les credentials seront sauvegardés dans ~/.gemini/oauth_creds.json
```

### 3. Démarrer le serveur WebUI

```bash
# Démarrer en mode WebUI avec accès réseau
npm run webui:remote

# Ou avec les variables d'environnement
GEMINI_MODEL=gemini-2.0-flash-exp npm run webui:remote
```

Le serveur démarre sur `http://localhost:25808` (ou le port configuré).

### 4. Obtenir un token d'authentification

1. Ouvrir `http://localhost:25808` dans le navigateur
2. Se connecter avec les credentials admin
3. Récupérer le token JWT depuis les cookies ou le localStorage

### 5. Tester l'API

```bash
# Test avec curl
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "stream": false
  }'
```

---

## ☁️ Configuration Netlify

### 1. Préparer le projet

Le fichier `netlify.toml` est déjà configuré dans le projet.

### 2. Déployer sur Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter à Netlify
netlify login

# Déployer
netlify deploy --prod
```

### 3. Configurer les variables d'environnement

Dans le dashboard Netlify (Site settings > Environment variables) :

```
GEMINI_API_KEY=votre_cle_api_gemini
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 4. Utiliser l'API

```bash
curl -X POST https://votre-site.netlify.app/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 🚀 Configuration Vercel

### 1. Préparer le projet

Le fichier `vercel.json` est déjà configuré dans le projet.

### 2. Déployer sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel --prod
```

### 3. Configurer les variables d'environnement

Dans le dashboard Vercel (Settings > Environment Variables) :

```
GEMINI_API_KEY=votre_cle_api_gemini
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 4. Utiliser l'API

```bash
curl -X POST https://votre-projet.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 🔗 Utilisation avec n8n

### Configuration du nœud HTTP Request

1. **Ajouter un nœud HTTP Request**

2. **Configurer l'URL** :
   - Local : `http://localhost:25808/api/chat`
   - Netlify : `https://votre-site.netlify.app/api/chat`
   - Vercel : `https://votre-projet.vercel.app/api/chat`

3. **Méthode** : POST

4. **Headers** :
   ```json
   {
     "Content-Type": "application/json",
     "Authorization": "Bearer YOUR_JWT_TOKEN"
   }
   ```

5. **Body** :
   ```json
   {
     "model": "gemini-2.0-flash-exp",
     "messages": [
       {
         "role": "user",
         "content": "{{ $json.prompt }}"
       }
     ],
     "stream": false
   }
   ```

### Exemple de workflow n8n

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "path": "gemini-chat",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Gemini Chat",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300],
      "parameters": {
        "url": "http://localhost:25808/api/chat",
        "method": "POST",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer YOUR_TOKEN"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "messages",
              "value": "={{ [{\"role\": \"user\", \"content\": $json.prompt}] }}"
            }
          ]
        }
      }
    },
    {
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [650, 300],
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Gemini Chat", "type": "main", "index": 0}]]
    },
    "Gemini Chat": {
      "main": [[{"node": "Respond", "type": "main", "index": 0}]]
    }
  }
}
```

---

## 📝 Exemples d'utilisation

### Exemple 1 : Chat simple

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explique-moi la programmation asynchrone en JavaScript"}
    ]
  }'
```

### Exemple 2 : Chat avec historique

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Bonjour!"},
      {"role": "assistant", "content": "Bonjour! Comment puis-je vous aider?"},
      {"role": "user", "content": "Explique-moi les Promises"}
    ]
  }'
```

### Exemple 3 : Génération simple

```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prompt": "Écris un poème sur l'\''IA"
  }'
```

### Exemple 4 : Liste des modèles

```bash
curl -X GET http://localhost:25808/api/tags \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exemple 5 : Python

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

### Exemple 6 : JavaScript/Node.js

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
      messages: [
        { role: 'user', content: message }
      ]
    })
  });
  
  return await response.json();
}

chat('Hello!').then(console.log);
```

---

## 🔧 Dépannage

### Erreur : "Google OAuth authentication not configured"

**Solution** :
```bash
# Lancer Gemini CLI et s'authentifier
gemini

# Vérifier que le fichier existe
ls ~/.gemini/oauth_creds.json
```

### Erreur : "Unauthorized"

**Causes possibles** :
1. Token JWT expiré → Se reconnecter à l'interface web
2. Token manquant → Ajouter le header `Authorization: Bearer TOKEN`
3. Token invalide → Vérifier le format du token

### Erreur : "Port already in use"

**Solution** :
```bash
# Changer le port
AIONUI_PORT=8080 npm run webui:remote
```

### Erreur : "Model not found"

**Solution** :
```bash
# Vérifier le modèle disponible
curl http://localhost:25808/api/tags -H "Authorization: Bearer TOKEN"

# Utiliser un modèle valide
export GEMINI_MODEL=gemini-2.0-flash-exp
```

### Performance lente

**Optimisations** :
1. Utiliser `stream: false` pour les réponses complètes
2. Réduire la taille des messages
3. Utiliser un modèle plus rapide (flash au lieu de pro)

### Erreur de quota

**Solution** :
```bash
# Vérifier votre quota dans Google AI Studio
# https://aistudio.google.com/

# Ou utiliser une clé API différente
export GEMINI_API_KEY=nouvelle_cle
```

---

## 🔐 Sécurité

### Bonnes pratiques

1. **Ne jamais exposer votre token JWT publiquement**
2. **Utiliser HTTPS en production** (Netlify/Vercel le font automatiquement)
3. **Renouveler régulièrement les tokens**
4. **Limiter les permissions du token**
5. **Utiliser des variables d'environnement** pour les secrets

### Rate Limiting

L'API inclut un rate limiter par défaut :
- 100 requêtes par 15 minutes par IP
- Configurable dans `src/webserver/middleware/security.ts`

---

## 📚 Ressources

- [Documentation Gemini CLI](https://geminicli.com/docs)
- [Documentation n8n](https://docs.n8n.io/)
- [Documentation Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [AionUI GitHub](https://github.com/iOfficeAI/AionUi)

---

## 🤝 Support

Pour toute question ou problème :

1. Vérifier la [FAQ](#dépannage)
2. Consulter les [GitHub Issues](https://github.com/iOfficeAI/AionUi/issues)
3. Rejoindre le [Discord](https://discord.gg/aionui)

---

**Bon développement avec Gemini CLI API! 🚀**
