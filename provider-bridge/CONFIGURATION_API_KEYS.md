# 🔑 Configuration des API Keys Gemini

## ⚠️ Problème Actuel

Vous recevez cette erreur :

```json
{
  "error": "No Gemini API keys configured. Add GEMINI_API_KEY_1=your_key to provider-bridge/.env and restart the server.",
  "provider": "gemini_api_key_rotative"
}
```

Cela signifie que les API Keys ne sont pas configurées sur Netlify.

## ✅ Solution : Ajouter les API Keys sur Netlify

### Étape 1 : Accéder aux Variables d'Environnement

1. Allez sur : `https://app.netlify.com/projects/providerbridge/settings/env`
2. Ou : Dashboard Netlify > **Site settings** > **Environment variables**

### Étape 2 : Ajouter les API Keys

Cliquez sur **Add a variable** et ajoutez chaque clé :

```bash
# Group 1 — ohada finance (C → H)
GEMINI_API_KEY_1=AIzaSyB0FTk5EAq5S1Jz2QpZie_bjJ6Hfdu7E8s
GEMINI_API_KEY_2=AIzaSyDqI21lhzrzRbfqvDbhiYleEJTh2v7reD4
GEMINI_API_KEY_3=AIzaSyBt-gjGo9u8YsIvP872J4Z9bE08oaMs9fI
GEMINI_API_KEY_4=AIzaSyBz8t4Ibq5w800FoGkAWfeE4yeoLIXR1lQ
GEMINI_API_KEY_5=AIzaSyDeVZUAr5frBFplhCsAbCTG8lEuhsjcbUE
GEMINI_API_KEY_6=AIzaSyBnlMGijGvcHu4OwguAoZVw0U0kZgK-5hw

# Group 2 — ohada save (B → H)
GEMINI_API_KEY_7=AIzaSyBcl6X0Da-wYezHh6JTEq8r2o0hThzEgNM
GEMINI_API_KEY_8=AIzaSyD3H1I3XJX7CMUF846_It-6Yo-iLmwjUyo
GEMINI_API_KEY_9=AIzaSyCIUt5nTKk4v4CMMXa_I92_GBSnRFfYgMw
GEMINI_API_KEY_10=AIzaSyCtsmpNpnMcaBxoiM5BOMdYxXLusseLn58
GEMINI_API_KEY_11=AIzaSyA3QJTjXDzvQ623IR5Y5pahsn1zSWyGw2E
GEMINI_API_KEY_12=AIzaSyBdD9FCBucY3CX8CHmmukG0zUvIhA64U5g
GEMINI_API_KEY_13=AIzaSyCwW1rrjl07667dddMp_6PGVAiF4zUvONE
```

### Étape 3 : Ajouter les Autres Variables

Ajoutez également ces variables :

```bash
# Configuration
GEMINI_MODEL=gemini-2.5-flash
API_KEY_MAX_REQUESTS_PER_MINUTE=15
API_KEY_MAX_TOKENS_PER_DAY=1000000

# Security
JWT_SECRET=provider-bridge-production-secret-2026-change-this

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Server
PORT=25809
ALLOW_REMOTE=true
NODE_ENV=production

# Models
GEMINI_AVAILABLE_MODELS=gemini-3-flash,gemini-3-pro,gemini-2.5-flash,gemini-2.5-pro,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro,gemini-exp-1206
```

### Étape 4 : Redéployer

Après avoir ajouté les variables, redéployez :

```bash
cd provider-bridge
netlify deploy --prod
```

Ou attendez que Netlify redéploie automatiquement (si vous avez activé le déploiement continu).

## 🧪 Vérification

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

### Test 2 : Get Models

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
    ...
  ]
}
```

### Test 3 : Chat (avec login)

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

**Résultat attendu** :
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1677610602,
  "model": "gemini-2.5-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Bonjour! Comment puis-je vous aider?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  }
}
```

## 📊 Capacité avec 13 API Keys

Avec 13 API Keys configurées :

- **Requêtes par minute** : 13 × 15 = **195 req/min**
- **Requêtes par jour** : 13 × 1440 = **18 720 req/day**
- **Tokens par jour** : 13 × 1M = **13M tokens/day**

## 🔐 Sécurité

### ⚠️ Important

Les API Keys dans ce fichier sont **déjà exposées publiquement** dans votre `.env`. 

**Recommandations** :
1. Ne partagez jamais ce fichier
2. Utilisez des variables d'environnement sur Netlify
3. Régénérez les clés si elles sont compromises
4. Utilisez Google OAuth pour éviter de consommer les API Keys

## 🎯 Prochaines Étapes

1. **Ajouter les variables sur Netlify** (5 min)
   - Allez sur https://app.netlify.com/projects/providerbridge/settings/env
   - Ajoutez les 13 API Keys
   - Ajoutez les autres variables

2. **Redéployer** (2 min)
   ```bash
   cd provider-bridge
   netlify deploy --prod
   ```

3. **Tester** (2 min)
   ```bash
   curl https://providerbridge.netlify.app/v1/models
   ```

## 📚 Documentation

- [DEPLOYMENT_SUCCESS.md](../DEPLOYMENT_SUCCESS.md) — Guide de déploiement
- [QUICK_START.md](./QUICK_START.md) — Guide rapide
- [examples/README.md](./examples/README.md) — Exemples de tests

## 🐛 Dépannage

### Erreur : "No Gemini API keys configured"

**Cause** : Les variables `GEMINI_API_KEY_1` à `GEMINI_API_KEY_13` ne sont pas définies sur Netlify.

**Solution** : Ajoutez-les dans Netlify Dashboard > Environment variables.

### Erreur : "Invalid API key"

**Cause** : Une ou plusieurs API Keys sont invalides ou révoquées.

**Solution** : Vérifiez les clés sur https://aistudio.google.com/apikey et remplacez les clés invalides.

### Erreur : "Rate limit exceeded"

**Cause** : Vous avez dépassé la limite de 15 req/min par clé.

**Solution** : Le système de rotation devrait gérer cela automatiquement. Si le problème persiste, ajoutez plus de clés.

---

**Après configuration, votre Provider Bridge sera pleinement fonctionnel sur Netlify! 🎉**
