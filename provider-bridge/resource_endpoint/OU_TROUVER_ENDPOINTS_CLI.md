# 🔍 Où Trouver les Endpoints CLI dans Swagger

Guide visuel rapide pour localiser les endpoints Gemini CLI OAuth dans la documentation Swagger.

---

## ⚡ Réponse Rapide

Les endpoints CLI sont dans Swagger sous le tag :

```
📁 OpenAI Compatible — CLI
```

**URL Swagger** : http://localhost:25809/docs

---

## 📍 Localisation Exacte

### Dans Swagger UI

Quand vous ouvrez http://localhost:25809/docs, vous voyez plusieurs sections (tags).

Faites défiler jusqu'à trouver :

```
┌─────────────────────────────────────────────────────────┐
│ 📁 OpenAI Compatible — CLI                              │
│    OpenAI-compatible endpoints → Gemini CLI OAuth,      │
│    no API key consumed                                  │
│    (base URL: http://127.0.0.1:25809/cli)              │
│                                                         │
│    GET  /cli/models                                     │
│    POST /cli/chat/completions                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Les 2 Endpoints CLI

### 1. GET /cli/models

**Description** : Liste des modèles Gemini disponibles via CLI OAuth

**URL complète** : `http://localhost:25809/cli/models`

**Réponse** :
```json
{
  "object": "list",
  "data": [
    {
      "id": "gemini-2.5-pro",
      "object": "model",
      "created": 1677610602,
      "owned_by": "google",
      "description": "Gemini 2.5 Pro — Gemini CLI OAuth (no API key consumed)"
    }
  ]
}
```

---

### 2. POST /cli/chat/completions

**Description** : Chat via Gemini CLI OAuth (aucune clé API consommée)

**URL complète** : `http://localhost:25809/cli/chat/completions`

**Requête** :
```json
{
  "model": "gemini-2.5-pro",
  "messages": [
    {
      "role": "user",
      "content": "Bonjour!"
    }
  ]
}
```

**Réponse** :
```json
{
  "id": "chatcmpl-cli-1234567890",
  "object": "chat.completion",
  "created": 1677610602,
  "model": "gemini-2.5-pro",
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

---

## 📊 Tous les Tags dans Swagger

Voici l'ordre des tags dans Swagger UI :

```
1. 📁 Auth
2. 📁 Admin
3. 📁 Gemini CLI
4. 📁 Gemini API Key
5. 📁 Kiro CLI
6. 📁 OpenAI Compatible — API Key    ← /v1/chat/completions
7. 📁 OpenAI Compatible — CLI        ← /cli/chat/completions ⚡
8. 📁 Common
```

Les endpoints CLI sont dans le tag **#7** : `OpenAI Compatible — CLI`

---

## 🔄 Différence entre les 2 Tags OpenAI

| Tag | Base URL | Provider | Endpoints |
|-----|----------|----------|-----------|
| **OpenAI Compatible — API Key** | `http://localhost:25809` | API Key Rotative | `/v1/models`<br>`/v1/chat/completions` |
| **OpenAI Compatible — CLI** | `http://localhost:25809/cli` | Gemini CLI OAuth | `/cli/models`<br>`/cli/chat/completions` |

---

## 🧪 Tester dans Swagger

### Étape 1 : Ouvrir Swagger

```
http://localhost:25809/docs
```

### Étape 2 : Trouver le Tag

Faites défiler jusqu'à :
```
📁 OpenAI Compatible — CLI
```

### Étape 3 : Cliquer sur l'Endpoint

Cliquez sur :
```
POST /cli/chat/completions
```

### Étape 4 : Tester

1. Cliquez sur **"Try it out"**
2. Le JSON d'exemple est déjà rempli
3. Cliquez sur **"Execute"**
4. Voir la réponse en bas

---

## ✅ Vérification

Pour vérifier que les endpoints CLI sont bien présents :

### Méthode 1 : Via Swagger UI

1. Ouvrez http://localhost:25809/docs
2. Cherchez le tag `OpenAI Compatible — CLI`
3. Vous devriez voir 2 endpoints

### Méthode 2 : Via OpenAPI JSON

1. Ouvrez http://localhost:25809/openapi.json
2. Cherchez `"/cli/chat/completions"` dans le JSON
3. Vous devriez trouver la définition complète

### Méthode 3 : Via curl

```bash
# Test models
curl http://localhost:25809/cli/models

# Test chat
curl -X POST http://localhost:25809/cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-pro","messages":[{"role":"user","content":"Bonjour!"}]}'
```

---

## 🐛 Si Vous Ne Trouvez Pas les Endpoints

### 1. Vérifier que le serveur est lancé

```bash
curl http://localhost:25809/health
```

**Réponse attendue** :
```json
{"status": "ok", "timestamp": "...", "uptime": 123.45}
```

### 2. Vider le cache du navigateur

Appuyez sur `Ctrl + F5` dans Swagger UI

### 3. Vérifier l'OpenAPI JSON

```bash
curl http://localhost:25809/openapi.json | grep "/cli/chat/completions"
```

Vous devriez voir la définition de l'endpoint.

### 4. Redémarrer le serveur

```bash
# Dans le terminal du serveur : Ctrl+C
# Puis relancer
cd provider-bridge
npm run dev
```

---

## 📚 Documentation Complète

- [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) — Guide complet Swagger
- [N8N_BASE_URLS.md](./N8N_BASE_URLS.md) — URLs pour n8n
- [GEMINI_CLI_OPENAI_ENDPOINTS.md](./GEMINI_CLI_OPENAI_ENDPOINTS.md) — Guide Gemini CLI

---

## 💡 Résumé

**Tag dans Swagger** : `OpenAI Compatible — CLI`

**Endpoints** :
- `GET /cli/models`
- `POST /cli/chat/completions`

**Base URL n8n** : `http://localhost:25809/cli`

**URL Swagger** : http://localhost:25809/docs

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
