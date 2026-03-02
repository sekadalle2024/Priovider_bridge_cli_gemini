# 🔗 URLs Base pour les Providers

## 📍 Provider Bridge — URLs de Production

**Base URL** : `https://providerbridge.netlify.app`

---

## 🤖 1. Gemini API Key Rotative (13 clés, 195 req/min)

### Base URL pour n8n
```
https://providerbridge.netlify.app/v1
```

### Endpoints OpenAI-Compatible

#### Liste des modèles
```
GET https://providerbridge.netlify.app/v1/models
```

#### Chat Completions
```
POST https://providerbridge.netlify.app/v1/chat/completions
```

**Body** :
```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "Votre message"}
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Headers** :
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN (optionnel)
```

### Modèles Disponibles
- `gemini-3-flash`
- `gemini-3-pro`
- `gemini-2.5-flash` ⭐ (recommandé)
- `gemini-2.5-pro`
- `gemini-2.5-flash-lite`
- `gemini-2.0-flash`
- `gemini-1.5-flash`
- `gemini-1.5-pro`
- `gemini-exp-1206`

### Capacité
- **13 API Keys** configurées
- **15 req/min** par clé
- **Capacité totale** : 195 req/min
- **Rotation automatique** des clés

---

## 🔐 2. Gemini CLI (OAuth Google, pas de consommation d'API Key)

### Base URL pour n8n
```
https://providerbridge.netlify.app/v1/cli
```

### Endpoints OpenAI-Compatible

#### Liste des modèles
```
GET https://providerbridge.netlify.app/v1/cli/models
```

#### Chat Completions
```
POST https://providerbridge.netlify.app/v1/cli/chat/completions
```

**Body** :
```json
{
  "model": "gemini-2.5-pro",
  "messages": [
    {"role": "user", "content": "Votre message"}
  ]
}
```

**Headers** :
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN (optionnel)
```

### Modèles Disponibles
- `gemini-2.5-pro` ⭐ (recommandé, confirmé disponible)
- `gemini-2.5-flash`
- `gemini-2.5-flash-lite`
- `gemini-2.0-flash`
- Autres modèles selon votre compte Google

### Avantages
- ✅ **Pas de consommation d'API Key**
- ✅ **Authentification OAuth Google**
- ✅ **Quota généreux** (selon votre compte)
- ✅ **Accès aux modèles premium** (gemini-2.5-pro)

### Prérequis
- Gemini CLI installé sur le serveur
- Authentification OAuth configurée (`gemini auth`)

---

## 📊 Comparaison des Providers

| Critère | API Key Rotative | Gemini CLI |
|---------|------------------|------------|
| **Base URL** | `/v1` | `/v1/cli` |
| **Authentification** | API Keys (13) | OAuth Google |
| **Capacité** | 195 req/min | Selon compte |
| **Modèle par défaut** | gemini-2.5-flash | gemini-2.5-pro |
| **Consommation API Key** | ✅ Oui | ❌ Non |
| **Setup** | Variables d'env | CLI + OAuth |
| **Recommandé pour** | Production, haute capacité | Développement, tests |

---

## 🔗 Configuration n8n

### Option 1 : API Key Rotative (Production)

**HTTP Request Node** :
```
Method: POST
URL: https://providerbridge.netlify.app/v1/chat/completions
Authentication: None (ou Bearer Token)
Body:
{
  "model": "gemini-2.5-flash",
  "messages": [{"role": "user", "content": "={{$json.query}}"}]
}
```

**LangChain Chat Model Node** :
```
Base URL: https://providerbridge.netlify.app/v1
Model: gemini-2.5-flash
API Key: (laisser vide ou JWT token)
```

### Option 2 : Gemini CLI (Développement)

**HTTP Request Node** :
```
Method: POST
URL: https://providerbridge.netlify.app/v1/cli/chat/completions
Authentication: None (ou Bearer Token)
Body:
{
  "model": "gemini-2.5-pro",
  "messages": [{"role": "user", "content": "={{$json.query}}"}]
}
```

**LangChain Chat Model Node** :
```
Base URL: https://providerbridge.netlify.app/v1/cli
Model: gemini-2.5-pro
API Key: (laisser vide ou JWT token)
```

---

## 🧪 Tests Rapides

### Test API Key Rotative

```bash
# Liste des modèles
curl https://providerbridge.netlify.app/v1/models

# Chat
curl -X POST https://providerbridge.netlify.app/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

### Test Gemini CLI

```bash
# Liste des modèles
curl https://providerbridge.netlify.app/v1/cli/models

# Chat
curl -X POST https://providerbridge.netlify.app/v1/cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

---

## 🎯 Recommandations

### Pour la Production
✅ **Utilisez API Key Rotative** (`/v1`)
- Haute capacité (195 req/min)
- Rotation automatique des clés
- Pas besoin d'OAuth
- Modèle rapide : `gemini-2.5-flash`

### Pour le Développement
✅ **Utilisez Gemini CLI** (`/v1/cli`)
- Pas de consommation d'API Key
- Accès aux modèles premium
- Quota généreux
- Modèle puissant : `gemini-2.5-pro`

### Pour les Tests
✅ **Utilisez les deux**
- Testez d'abord avec CLI (gratuit)
- Passez à API Key pour la production
- Comparez les performances

---

## 📚 Documentation Complète

### Swagger UI
```
https://providerbridge.netlify.app/docs
```

### OpenAPI Spec
```
https://providerbridge.netlify.app/openapi.json
```

### Exemples
- [examples/test-endpoints.js](./examples/test-endpoints.js) — Tests Node.js
- [examples/n8n-workflow-simple-chat.json](./examples/n8n-workflow-simple-chat.json) — Workflow n8n simple
- [examples/n8n-workflow-provider-bridge.json](./examples/n8n-workflow-provider-bridge.json) — Workflow complet

---

## 🔐 Authentification (Optionnelle)

### Obtenir un JWT Token

```bash
# Login
curl -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@provider-bridge.local","password":"admin123"}'
```

**Réponse** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@provider-bridge.local",
    "role": "admin"
  }
}
```

### Utiliser le Token

```bash
curl -X POST https://providerbridge.netlify.app/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Bonjour"}]}'
```

---

## 📍 Résumé des URLs

| Provider | Base URL | Endpoint Chat | Endpoint Models |
|----------|----------|---------------|-----------------|
| **API Key Rotative** | `/v1` | `POST /v1/chat/completions` | `GET /v1/models` |
| **Gemini CLI** | `/v1/cli` | `POST /v1/cli/chat/completions` | `GET /v1/cli/models` |

**URL Complète** : `https://providerbridge.netlify.app` + Base URL + Endpoint

---

**Déployé sur** : https://providerbridge.netlify.app
**Documentation** : https://providerbridge.netlify.app/docs
**Statut** : ✅ Production Live

