# 🔗 Provider Bridge — URLs pour n8n

## 📍 URL de Base

```
https://providerbridge.netlify.app
```

## 🔑 Gemini API Key Rotative (Recommandé)

### Base URL
```
https://providerbridge.netlify.app/v1
```

### Endpoints
```
GET  /v1/models                 # Liste des modèles
POST /v1/chat/completions       # Chat avec rotation automatique
```

### Caractéristiques
- ✅ 13 API Keys configurées
- ✅ Rotation automatique
- ✅ 195 requêtes/minute (13 × 15)
- ✅ 18 720 requêtes/jour
- ✅ Format OpenAI compatible

### Configuration n8n

**HTTP Request Node** :
```json
{
  "method": "POST",
  "url": "https://providerbridge.netlify.app/v1/chat/completions",
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_JWT_TOKEN"
  },
  "sendBody": true,
  "bodyParameters": {
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "={{$json.query}}"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }
}
```

## 🔐 Gemini CLI (OAuth)

### Base URL
```
https://providerbridge.netlify.app/cli
```

### Endpoints
```
GET  /cli/models                # Liste des modèles
POST /cli/chat/completions      # Chat via OAuth Google
```

### Caractéristiques
- ✅ Utilise votre compte Google OAuth
- ✅ Aucune API Key consommée
- ⚠️ Plus lent (~30-90 secondes)
- ✅ Format OpenAI compatible

### Configuration n8n

**HTTP Request Node** :
```json
{
  "method": "POST",
  "url": "https://providerbridge.netlify.app/cli/chat/completions",
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_JWT_TOKEN"
  },
  "sendBody": true,
  "bodyParameters": {
    "model": "gemini-2.5-pro",
    "messages": [
      {"role": "user", "content": "={{$json.query}}"}
    ]
  }
}
```

## 🔑 Obtenir un JWT Token

### Option 1 : Via le Dashboard

1. Allez sur : `https://providerbridge.netlify.app`
2. Connectez-vous avec Google
3. Ouvrez la console (F12)
4. Tapez : `localStorage.getItem('token')`
5. Copiez le token

### Option 2 : Via l'API

```bash
curl -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@provider-bridge.local",
    "password": "admin123"
  }'
```

Réponse :
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "admin@provider-bridge.local",
    "role": "admin"
  }
}
```

## 📊 Comparaison des Providers

| Critère | API Key Rotative | Gemini CLI (OAuth) |
|---------|------------------|-------------------|
| **Base URL** | `/v1` | `/cli` |
| **Vitesse** | ⚡ Rapide (1-3s) | 🐌 Lent (30-90s) |
| **Capacité** | 195 req/min | Illimité |
| **API Keys** | Consomme 13 clés | Aucune clé |
| **Auth** | JWT Token | JWT Token |
| **Format** | OpenAI compatible | OpenAI compatible |
| **Recommandé pour** | Production, n8n | Tests, développement |

## 🎯 Recommandation pour n8n

**Utilisez l'API Key Rotative** (`/v1`) pour :
- ✅ Production
- ✅ Workflows automatisés
- ✅ Réponses rapides
- ✅ Haute disponibilité

**Utilisez Gemini CLI** (`/cli`) pour :
- ✅ Tests
- ✅ Développement
- ✅ Économiser les API Keys
- ⚠️ Accepter des délais plus longs

## 🧪 Test Rapide

### Test Models

```bash
curl https://providerbridge.netlify.app/v1/models
```

### Test Chat

```bash
# 1. Login
TOKEN=$(curl -s -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@provider-bridge.local","password":"admin123"}' \
  | jq -r '.token')

# 2. Chat
curl -X POST https://providerbridge.netlify.app/v1/chat/completions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

## 📚 Documentation

- **Swagger UI** : https://providerbridge.netlify.app/docs
- **OpenAPI Spec** : https://providerbridge.netlify.app/openapi.json
- **Dashboard** : https://providerbridge.netlify.app/

## 🎉 Résumé

**URL de base pour n8n (API Key Rotative)** :
```
https://providerbridge.netlify.app/v1
```

**Endpoint principal** :
```
POST https://providerbridge.netlify.app/v1/chat/completions
```

**Authentication** :
```
Header: Authorization: Bearer YOUR_JWT_TOKEN
```

---

**Prêt à utiliser dans n8n! 🚀**
