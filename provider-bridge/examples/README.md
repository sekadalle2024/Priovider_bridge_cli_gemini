# 📚 Provider Bridge — Exemples et Tests

Ce dossier contient des exemples complets pour tester et utiliser Provider Bridge.

## 📁 Fichiers Disponibles

| Fichier | Description |
|---------|-------------|
| **[test-endpoints.js](./test-endpoints.js)** | Script Node.js avec 9 exemples de tests complets |
| **[n8n-workflow-simple-chat.json](./n8n-workflow-simple-chat.json)** | Workflow n8n simple pour chat |
| **[n8n-workflow-provider-bridge.json](./n8n-workflow-provider-bridge.json)** | Workflow n8n complet avec login et stats |
| **[curl-examples.sh](./curl-examples.sh)** | Exemples curl pour tous les endpoints |

## 🧪 Test Endpoints (Node.js)

### Installation

```bash
cd provider-bridge/examples
# Aucune dépendance requise, utilise Node.js natif
```

### Utilisation

```bash
# Test sur Netlify (production)
node test-endpoints.js

# Test sur localhost
BASE_URL=http://localhost:25809 node test-endpoints.js
```

### Exemples Inclus

1. **Health Check** — Vérifier que le serveur fonctionne
2. **Login** — Obtenir un JWT token
3. **Get Models** — Liste des modèles disponibles
4. **Chat Completion** — Chat avec Gemini (API Key Rotative)
5. **Gemini CLI** — Chat avec Gemini CLI (OAuth)
6. **Admin Stats** — Statistiques globales
7. **Get Accounts** — Liste des comptes Google
8. **Get Usage** — Statistiques d'utilisation
9. **OpenAPI Spec** — Spécification OpenAPI

### Résultat Attendu

```
══════════════════════════════════════════════════════════════════════
🧪 Provider Bridge — Test Endpoints Examples
══════════════════════════════════════════════════════════════════════

📍 Base URL: https://providerbridge.netlify.app

📋 Example 1: Health Check
──────────────────────────────────────────────────────────────────────

✅ Status: 200
Response:
{
  "status": "ok",
  "service": "provider-bridge",
  "timestamp": "2026-03-02T...",
  "environment": "production"
}

📋 Example 2: Login
──────────────────────────────────────────────────────────────────────

✅ Status: 200
Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@provider-bridge.local",
    "role": "admin"
  }
}

🔑 JWT Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

...

✅ All examples completed successfully!
```

## 🔗 Workflows n8n

### 1. Simple Chat

**Fichier** : `n8n-workflow-simple-chat.json`

**Description** : Workflow minimal pour tester le chat avec Gemini.

**Import dans n8n** :
1. Ouvrez n8n
2. Cliquez sur **Import from File**
3. Sélectionnez `n8n-workflow-simple-chat.json`
4. Remplacez `YOUR_JWT_TOKEN_HERE` par votre token
5. Cliquez sur **Execute Workflow**

### 2. Complete Example

**Fichier** : `n8n-workflow-provider-bridge.json`

**Description** : Workflow complet avec login, chat et statistiques.

**Fonctionnalités** :
- Login automatique
- Chat avec Gemini
- Récupération des statistiques

**Import dans n8n** :
1. Ouvrez n8n
2. Cliquez sur **Import from File**
3. Sélectionnez `n8n-workflow-provider-bridge.json`
4. Cliquez sur **Execute Workflow**

## 📝 Exemples curl

### Health Check

```bash
curl https://providerbridge.netlify.app/health
```

### Login

```bash
curl -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@provider-bridge.local",
    "password": "admin123"
  }'
```

### Get Models

```bash
TOKEN="your-jwt-token"

curl https://providerbridge.netlify.app/v1/models \
  -H "Authorization: Bearer $TOKEN"
```

### Chat Completion

```bash
TOKEN="your-jwt-token"

curl -X POST https://providerbridge.netlify.app/v1/chat/completions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "messages": [
      {"role": "user", "content": "Bonjour!"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'
```

### Admin Stats

```bash
TOKEN="your-jwt-token"

curl https://providerbridge.netlify.app/api/admin/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Get Accounts

```bash
TOKEN="your-jwt-token"

curl https://providerbridge.netlify.app/api/admin/accounts \
  -H "Authorization: Bearer $TOKEN"
```

### Get Usage

```bash
TOKEN="your-jwt-token"

curl https://providerbridge.netlify.app/api/admin/usage \
  -H "Authorization: Bearer $TOKEN"
```

### OpenAPI Spec

```bash
curl https://providerbridge.netlify.app/openapi.json
```

## 🎯 Utilisation avec n8n

### Configuration HTTP Request Node

```json
{
  "method": "POST",
  "url": "https://providerbridge.netlify.app/v1/chat/completions",
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_JWT_TOKEN"
  },
  "body": {
    "model": "gemini-2.0-flash-exp",
    "messages": [
      {"role": "user", "content": "={{$json.query}}"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }
}
```

### Obtenir un JWT Token

#### Option 1 : Via le Dashboard

1. Connectez-vous : `https://providerbridge.netlify.app`
2. Ouvrez la console (F12)
3. Tapez : `localStorage.getItem('token')`
4. Copiez le token

#### Option 2 : Via l'API

```bash
curl -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@provider-bridge.local", "password": "admin123"}'
```

## 📊 Swagger UI

Pour voir tous les exemples interactifs, ouvrez :

```
https://providerbridge.netlify.app/docs
```

Le Swagger UI contient :
- Tous les endpoints disponibles
- Exemples de requêtes
- Exemples de réponses
- Schémas de données
- Possibilité de tester directement

## 🔐 Authentication

Tous les endpoints (sauf `/health`, `/openapi.json`, `/docs`) nécessitent un JWT token.

### Obtenir un Token

```bash
curl -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@provider-bridge.local",
    "password": "admin123"
  }'
```

### Utiliser le Token

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl https://providerbridge.netlify.app/api/admin/stats \
  -H "Authorization: Bearer $TOKEN"
```

## 🐛 Dépannage

### Erreur 401 Unauthorized

Vérifiez que :
- Le token JWT est valide
- Le header `Authorization: Bearer TOKEN` est présent
- Le token n'est pas expiré

### Erreur 500 Internal Server Error

Vérifiez que :
- Les variables d'environnement sont configurées sur Netlify
- Google OAuth est configuré (si nécessaire)
- Les API Keys Gemini sont valides (si nécessaire)

### Erreur CORS

Vérifiez que :
- Vous utilisez le bon domaine
- Les headers CORS sont configurés dans `netlify.toml`

## 📚 Documentation

- [README.md](../README.md) — Documentation complète
- [QUICK_START.md](../QUICK_START.md) — Guide rapide
- [DEPLOYMENT_NETLIFY.md](../DEPLOYMENT_NETLIFY.md) — Guide de déploiement
- [Swagger UI](https://providerbridge.netlify.app/docs) — Documentation interactive

## 🎉 Résumé

Ce dossier contient tout ce dont vous avez besoin pour tester Provider Bridge :

✅ Script Node.js avec 9 exemples complets
✅ 2 workflows n8n prêts à l'emploi
✅ Exemples curl pour tous les endpoints
✅ Documentation détaillée
✅ Guide de dépannage

**Commencez par** : `node test-endpoints.js`
