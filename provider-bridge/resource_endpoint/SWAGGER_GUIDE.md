# 📚 Guide Swagger — Provider Bridge

Guide pour naviguer dans la documentation Swagger et trouver les endpoints OpenAI-compatibles.

---

## 🌐 Accéder à Swagger

**URL** : http://localhost:25809/docs

---

## 📍 Où Trouver les Endpoints OpenAI-Compatible

Dans Swagger, les endpoints sont organisés par **tags** (catégories). Voici où trouver chaque type d'endpoint :

### 1️⃣ OpenAI Compatible — CLI (Gemini CLI OAuth)

**Tag** : `OpenAI Compatible — CLI`

**Base URL n8n** : `http://127.0.0.1:25809/cli`

**Endpoints** :
- `GET /cli/models` — Liste des modèles Gemini CLI
- `POST /cli/chat/completions` — Chat via Gemini CLI OAuth

**Caractéristiques** :
- ✅ Gratuit (OAuth Google)
- ✅ Aucune clé API consommée
- ✅ Quota OAuth généreux
- ⚠️ Délai plus long (~30-90s)

---

### 2️⃣ OpenAI Compatible — API Key (Gemini API Key Rotative)

**Tag** : `OpenAI Compatible — API Key`

**Base URL n8n** : `http://127.0.0.1:25809/v1`

**Endpoints** :
- `GET /v1/models` — Liste des modèles API Key Rotation
- `POST /v1/chat/completions` — Chat via API Key Rotation

**Caractéristiques** :
- ✅ 195 req/min (13 clés × 15)
- ✅ Rotation automatique
- ✅ Réponse rapide
- ✅ Production ready

---

## 🔍 Navigation dans Swagger

### Étape 1 : Ouvrir Swagger UI

Allez sur : http://localhost:25809/docs

### Étape 2 : Trouver les Tags

Faites défiler la page. Vous verrez plusieurs sections (tags) :

```
📁 Auth
📁 Admin
📁 Gemini CLI
📁 Gemini API Key
📁 Kiro CLI
📁 OpenAI Compatible — API Key    ← API Key Rotative
📁 OpenAI Compatible — CLI         ← Gemini CLI OAuth
📁 Common
```

### Étape 3 : Cliquer sur le Tag

Cliquez sur **"OpenAI Compatible — CLI"** pour voir :
- `GET /cli/models`
- `POST /cli/chat/completions`

Cliquez sur **"OpenAI Compatible — API Key"** pour voir :
- `GET /v1/models`
- `POST /v1/chat/completions`

### Étape 4 : Tester un Endpoint

1. Cliquez sur l'endpoint (ex: `POST /cli/chat/completions`)
2. Cliquez sur **"Try it out"**
3. Modifiez le JSON d'exemple
4. Cliquez sur **"Execute"**
5. Voir la réponse en bas

---

## 📋 Exemple de Test dans Swagger

### Test Gemini CLI OAuth

1. Ouvrez `POST /cli/chat/completions`
2. Cliquez sur **"Try it out"**
3. Utilisez ce JSON :
```json
{
  "model": "gemini-2.5-pro",
  "messages": [
    {
      "role": "user",
      "content": "Dis bonjour en français"
    }
  ]
}
```
4. Cliquez sur **"Execute"**

### Test API Key Rotative

1. Ouvrez `POST /v1/chat/completions`
2. Cliquez sur **"Try it out"**
3. Utilisez ce JSON :
```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "Dis bonjour en français"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1024
}
```
4. Cliquez sur **"Execute"**

---

## 🎯 Comparaison des Endpoints

| Critère | `/cli/chat/completions` | `/v1/chat/completions` |
|---------|-------------------------|------------------------|
| **Tag Swagger** | OpenAI Compatible — CLI | OpenAI Compatible — API Key |
| **Base URL n8n** | `http://localhost:25809/cli` | `http://localhost:25809` |
| **Provider** | Gemini CLI OAuth | API Key Rotative |
| **Coût** | Gratuit | Gratuit (tier free) |
| **Quota** | Quota OAuth | 195 req/min |
| **Délai** | ~30-90s | ~2-5s |
| **Setup** | OAuth requis | Clés dans .env |

---

## 📖 Description des Tags Swagger

| Tag | Description |
|-----|-------------|
| **Auth** | Authentification (login, Google OAuth) |
| **Admin** | Administration (users, stats) |
| **Gemini CLI** | Endpoints natifs Gemini CLI |
| **Gemini API Key** | Endpoints natifs API Key Rotative |
| **Kiro CLI** | Endpoints natifs Kiro CLI |
| **OpenAI Compatible — CLI** | ⚡ Endpoints OpenAI pour Gemini CLI |
| **OpenAI Compatible — API Key** | ⚡ Endpoints OpenAI pour API Key |
| **Common** | Endpoints communs (health, version) |

---

## 🔗 URLs Complètes

### Gemini CLI OAuth

```
Base URL: http://localhost:25809/cli

Endpoints:
- GET  http://localhost:25809/cli/models
- POST http://localhost:25809/cli/chat/completions
- GET  http://localhost:25809/cli/v1/models (alias)
- POST http://localhost:25809/cli/v1/chat/completions (alias)
```

### API Key Rotative

```
Base URL: http://localhost:25809

Endpoints:
- GET  http://localhost:25809/v1/models
- POST http://localhost:25809/v1/chat/completions
```

---

## 🐛 Si les Endpoints n'Apparaissent Pas

### 1. Vérifier que le serveur est lancé

```bash
curl http://localhost:25809/health
```

### 2. Vider le cache du navigateur

Appuyez sur `Ctrl + F5` pour recharger Swagger

### 3. Vérifier l'OpenAPI JSON

Allez sur : http://localhost:25809/openapi.json

Cherchez `/cli/chat/completions` dans le JSON

### 4. Redémarrer le serveur

```bash
# Arrêter (Ctrl+C dans le terminal)
# Puis relancer
cd provider-bridge
npm run dev
```

---

## 💡 Conseils

### Pour Tester Rapidement
- Utilisez Swagger UI pour tester les endpoints
- Les exemples sont pré-remplis
- Pas besoin de curl ou Postman

### Pour n8n
- Copiez la base URL depuis Swagger
- Les modèles sont listés dans `GET /models`
- Testez d'abord dans Swagger avant n8n

### Pour le Développement
- Swagger se met à jour automatiquement (hot-reload)
- Les modifications du code sont reflétées immédiatement
- Utilisez "Try it out" pour tester vos changements

---

## 📚 Documentation Complète

- [N8N_BASE_URLS.md](./N8N_BASE_URLS.md) — URLs pour n8n
- [GEMINI_CLI_OPENAI_ENDPOINTS.md](./GEMINI_CLI_OPENAI_ENDPOINTS.md) — Guide Gemini CLI
- [ENDPOINTS_SUMMARY.md](./ENDPOINTS_SUMMARY.md) — Résumé des endpoints

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
