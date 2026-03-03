# ✅ Provider Bridge — Réponse Finale

## 📍 URL de Base pour n8n

```
https://providerbridge.netlify.app/v1
```

## 🎯 Endpoints Principaux

### 1. Gemini API Key Rotative (Recommandé pour Production)

**Base URL** : `https://providerbridge.netlify.app/v1`

**Endpoints** :
```
GET  /v1/models                 # Liste des modèles disponibles
POST /v1/chat/completions       # Chat avec rotation automatique des 13 clés
```

**Capacité** :
- 13 API Keys configurées
- 15 requêtes/minute par clé
- **Total : 195 requêtes/minute**
- **~18 720 requêtes/jour**

**Modèle recommandé** : `gemini-2.5-flash`

### 2. Gemini CLI (OAuth Google, pas de consommation d'API Key)

**Base URL** : `https://providerbridge.netlify.app/v1/cli`

**Endpoints** :
```
GET  /v1/cli/models             # Liste des modèles disponibles
POST /v1/cli/chat/completions   # Chat via OAuth Google
```

**Avantages** :
- Pas de consommation d'API Key
- Accès aux modèles premium
- Quota généreux selon votre compte Google

**Modèle recommandé** : `gemini-2.5-pro`

---

## 🔧 Configuration n8n

### Option 1 : HTTP Request Node (Simple)

```json
{
  "method": "POST",
  "url": "https://providerbridge.netlify.app/v1/chat/completions",
  "authentication": "none",
  "sendBody": true,
  "bodyParameters": {
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "={{$json.query}}"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  },
  "headers": {
    "Content-Type": "application/json"
  }
}
```

### Option 2 : LangChain Chat Model Node

```
Base URL: https://providerbridge.netlify.app/v1
Model: gemini-2.5-flash
API Key: (laisser vide)
```

---

## 🔐 Authentification (Optionnelle)

Si vous souhaitez utiliser l'authentification JWT :

### 1. Obtenir un Token

```bash
curl -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@provider-bridge.local","password":"admin123"}'
```

**Réponse** :
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

### 2. Utiliser le Token dans n8n

Ajoutez un header :
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🚀 Redémarrage du Build

### ✅ Vous avez configuré les variables manuellement

Maintenant, redémarrez le build pour que les changements prennent effet :

### Méthode 1 : Dashboard Netlify (Recommandé)

1. **Allez sur** : https://app.netlify.com/projects/providerbridge/deploys
2. Cliquez sur **Trigger deploy** > **Deploy site**
3. Attendez 2-3 minutes

### Méthode 2 : Via un Commit Vide

```bash
cd provider-bridge
git commit --allow-empty -m "Trigger rebuild with env vars"
git push
```

---

## 🧪 Tests Après le Build

### Test 1 : Health Check

```bash
curl https://providerbridge.netlify.app/health
```

**Résultat attendu** :
```json
{
  "status": "ok",
  "service": "provider-bridge",
  "timestamp": "2026-03-02T...",
  "environment": "production"
}
```

### Test 2 : Liste des Modèles

```bash
curl https://providerbridge.netlify.app/v1/models
```

**Résultat attendu** :
```json
{
  "object": "list",
  "data": [
    {
      "id": "gemini-2.5-flash",
      "object": "model",
      "created": 1677610602,
      "owned_by": "google"
    },
    {
      "id": "gemini-2.5-pro",
      "object": "model",
      "created": 1677610602,
      "owned_by": "google"
    }
  ]
}
```

### Test 3 : Chat Complet

```bash
curl -X POST https://providerbridge.netlify.app/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour! Comment vas-tu?"}
    ]
  }'
```

**Résultat attendu** : Réponse de Gemini avec le contenu du message.

---

## 📊 Comparaison des Providers

| Critère | API Key Rotative (`/v1`) | Gemini CLI (`/v1/cli`) |
|---------|--------------------------|------------------------|
| **Vitesse** | ⚡ Rapide (1-3s) | 🐌 Plus lent (30-90s) |
| **Capacité** | 195 req/min | Selon compte Google |
| **API Keys** | Consomme 13 clés | Aucune clé |
| **Modèle par défaut** | gemini-2.5-flash | gemini-2.5-pro |
| **Recommandé pour** | Production, n8n | Tests, développement |

---

## 🎯 Recommandation pour n8n

### Pour la Production
✅ **Utilisez `/v1` (API Key Rotative)**
- URL : `https://providerbridge.netlify.app/v1/chat/completions`
- Modèle : `gemini-2.5-flash`
- Rapide et fiable
- Haute capacité (195 req/min)

### Pour le Développement
✅ **Utilisez `/v1/cli` (Gemini CLI)**
- URL : `https://providerbridge.netlify.app/v1/cli/chat/completions`
- Modèle : `gemini-2.5-pro`
- Pas de consommation d'API Key
- Accès aux modèles premium

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

### Exemples de Code
- [provider-bridge/examples/test-endpoints.js](./provider-bridge/examples/test-endpoints.js)
- [provider-bridge/examples/n8n-workflow-simple-chat.json](./provider-bridge/examples/n8n-workflow-simple-chat.json)
- [provider-bridge/examples/n8n-workflow-provider-bridge.json](./provider-bridge/examples/n8n-workflow-provider-bridge.json)

---

## 📍 Résumé des URLs

| Service | URL |
|---------|-----|
| **Base URL n8n (Production)** | `https://providerbridge.netlify.app/v1` |
| **Base URL n8n (Dev)** | `https://providerbridge.netlify.app/v1/cli` |
| **Dashboard** | `https://providerbridge.netlify.app/` |
| **Swagger** | `https://providerbridge.netlify.app/docs` |
| **Health Check** | `https://providerbridge.netlify.app/health` |
| **Netlify Admin** | `https://app.netlify.com/projects/providerbridge` |

---

## ✅ Checklist Finale

### Configuration
- [x] Projet déployé sur Netlify
- [x] Variables d'environnement configurées (13 API Keys)
- [ ] Build redémarré (en attente)
- [ ] Tests effectués

### Intégration n8n
- [ ] HTTP Request Node configuré
- [ ] Workflow testé
- [ ] Production ready

---

## 🎉 Prochaines Étapes

1. **Redémarrez le build** (2-3 minutes)
   - Via Dashboard : https://app.netlify.com/projects/providerbridge/deploys
   - Cliquez sur "Trigger deploy" > "Deploy site"

2. **Testez les endpoints** (2 minutes)
   ```bash
   curl https://providerbridge.netlify.app/v1/models
   ```

3. **Configurez n8n** (5 minutes)
   - Créez un HTTP Request Node
   - URL : `https://providerbridge.netlify.app/v1/chat/completions`
   - Body : `{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Test"}]}`

4. **Testez votre workflow** (2 minutes)
   - Exécutez le workflow
   - Vérifiez la réponse de Gemini

---

## 📞 Support

### Documentation
- [provider-bridge/README.md](./provider-bridge/README.md) — Documentation complète
- [provider-bridge/QUICK_START.md](./provider-bridge/QUICK_START.md) — Guide rapide
- [N8N_URLS_PROVIDER_BRIDGE.md](./N8N_URLS_PROVIDER_BRIDGE.md) — Guide n8n détaillé

### Logs
- **Build logs** : https://app.netlify.com/projects/providerbridge/deploys
- **Function logs** : https:/