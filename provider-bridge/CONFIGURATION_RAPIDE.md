# ⚡ Configuration Rapide des API Keys sur Netlify

## 🎯 Objectif

Configurer les 13 API Keys Gemini sur Netlify pour que Provider Bridge fonctionne.

## 📍 Lien Direct

**Allez directement sur** : https://app.netlify.com/projects/providerbridge/settings/env

## ✅ Étapes Simples

### 1. Ouvrir la Page des Variables

1. Allez sur : https://app.netlify.com/projects/providerbridge/settings/env
2. Ou : Dashboard Netlify > **providerbridge** > **Site settings** > **Environment variables**

### 2. Ajouter les 13 API Keys

Cliquez sur **Add a variable** pour chaque clé :

| Variable | Valeur |
|----------|--------|
| `GEMINI_API_KEY_1` | `AIzaSyB0FTk5EAq5S1Jz2QpZie_bjJ6Hfdu7E8s` |
| `GEMINI_API_KEY_2` | `AIzaSyDqI21lhzrzRbfqvDbhiYleEJTh2v7reD4` |
| `GEMINI_API_KEY_3` | `AIzaSyBt-gjGo9u8YsIvP872J4Z9bE08oaMs9fI` |
| `GEMINI_API_KEY_4` | `AIzaSyBz8t4Ibq5w800FoGkAWfeE4yeoLIXR1lQ` |
| `GEMINI_API_KEY_5` | `AIzaSyDeVZUAr5frBFplhCsAbCTG8lEuhsjcbUE` |
| `GEMINI_API_KEY_6` | `AIzaSyBnlMGijGvcHu4OwguAoZVw0U0kZgK-5hw` |
| `GEMINI_API_KEY_7` | `AIzaSyBcl6X0Da-wYezHh6JTEq8r2o0hThzEgNM` |
| `GEMINI_API_KEY_8` | `AIzaSyD3H1I3XJX7CMUF846_It-6Yo-iLmwjUyo` |
| `GEMINI_API_KEY_9` | `AIzaSyCIUt5nTKk4v4CMMXa_I92_GBSnRFfYgMw` |
| `GEMINI_API_KEY_10` | `AIzaSyCtsmpNpnMcaBxoiM5BOMdYxXLusseLn58` |
| `GEMINI_API_KEY_11` | `AIzaSyA3QJTjXDzvQ623IR5Y5pahsn1zSWyGw2E` |
| `GEMINI_API_KEY_12` | `AIzaSyBdD9FCBucY3CX8CHmmukG0zUvIhA64U5g` |
| `GEMINI_API_KEY_13` | `AIzaSyCwW1rrjl07667dddMp_6PGVAiF4zUvONE` |

### 3. Ajouter les Variables de Configuration

| Variable | Valeur |
|----------|--------|
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `JWT_SECRET` | `provider-bridge-prod-secret-2026` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `admin123` |
| `PORT` | `25809` |
| `ALLOW_REMOTE` | `true` |
| `NODE_ENV` | `production` |

### 4. Redéployer

Netlify va automatiquement redéployer après l'ajout des variables.

Ou forcez un redéploiement :

```bash
cd provider-bridge
netlify deploy --prod
```

### 5. Tester

```bash
curl https://providerbridge.netlify.app/v1/models
```

**Résultat attendu** : Liste des modèles Gemini disponibles.

## 🚀 Méthode Automatique (Optionnel)

Si vous préférez automatiser, utilisez le script :

```bash
cd provider-bridge
.\scripts\configure-netlify-env.ps1
```

Ou sur Linux/Mac :

```bash
cd provider-bridge
chmod +x scripts/configure-netlify-env.sh
./scripts/configure-netlify-env.sh
```

## ✅ Vérification

### Test 1 : Models

```bash
curl https://providerbridge.netlify.app/v1/models
```

### Test 2 : Chat

```bash
# 1. Login
curl -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@provider-bridge.local","password":"admin123"}'

# 2. Copier le token et l'utiliser
TOKEN="votre-token-ici"

curl -X POST https://providerbridge.netlify.app/v1/chat/completions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

## 📊 Capacité

Avec 13 API Keys :
- **195 requêtes/minute**
- **18 720 requêtes/jour**
- **13M tokens/jour**

## 🎉 C'est Tout!

Après configuration, Provider Bridge sera pleinement fonctionnel sur :

```
https://providerbridge.netlify.app
```

---

**Temps estimé** : 5-10 minutes
