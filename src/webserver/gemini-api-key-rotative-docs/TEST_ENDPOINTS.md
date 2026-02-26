# 🧪 Test des Endpoints - Guide Complet

## ✅ Serveur démarré avec succès

Le serveur écoute maintenant sur `0.0.0.0:25808` (IPv4 et IPv6).

**Nouveaux endpoints ajoutés:**
- ✅ `POST /v1/chat/completions` (OpenAI compatible)
- ✅ `GET /v1/models` (Liste des modèles)

## 🔧 Tests des endpoints

### 1. Health Check

```bash
curl http://127.0.0.1:25808/health
```

**Résultat:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-26T...",
  "uptime": 123.45,
  "provider": "gemini_api_key_rotative",
  "keysLoaded": 27
}
```

### 2. Liste des modèles (OpenAI compatible)

```bash
curl http://127.0.0.1:25808/v1/models
```

**Résultat:**
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
      "id": "gemini-1.5-flash",
      "object": "model",
      "created": 1677610602,
      "owned_by": "google"
    },
    {
      "id": "gemini-1.5-pro",
      "object": "model",
      "created": 1677610602,
      "owned_by": "google"
    }
  ]
}
```

### 3. Chat OpenAI compatible

```bash
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Quelle est la capitale du Sénégal?"}
    ],
    "temperature": 0.7
  }'
```

**Résultat:**
```json
{
  "id": "chatcmpl-1772138035182",
  "object": "chat.completion",
  "created": 1772138035,
  "model": "gemini-2.5-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "La capitale du Sénégal est Dakar."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  },
  "provider": "gemini_api_key_rotative",
  "keyUsed": "Key 1/27"
}
```

### 4. Chat Ollama compatible

```bash
curl -X POST http://127.0.0.1:25808/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Bonjour!"}
    ],
    "stream": false
  }'
```

**Résultat:**
```json
{
  "model": "gemini-2.5-flash",
  "provider": "gemini_api_key_rotative",
  "created_at": "2026-02-26T...",
  "message": {
    "role": "assistant",
    "content": "Bonjour! Comment puis-je vous aider?"
  },
  "done": true,
  "keyUsed": "Key 1/27"
}
```

### 5. Stats de rotation

```bash
curl http://127.0.0.1:25808/api/stats
```

**Résultat:**
```json
{
  "totalKeys": 27,
  "availableKeys": 27,
  "usage": [
    {
      "index": 0,
      "requestsThisMinute": 1,
      "available": true
    },
    ...
  ]
}
```

## 🎯 Configuration n8n

### Pour HTTP Request (Ollama style)

**URL:** `http://127.0.0.1:25808/api/chat`

**Body:**
```json
{
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ],
  "stream": false
}
```

### Pour OpenAI Chat Model (LangChain)

**Credentials:**
- Type: OpenAI API
- API Key: `dummy-key`
- Base URL: `http://127.0.0.1:25808/v1`

**Model:** `gemini-2.5-flash`

## 🔍 Voir les modèles dans n8n

### Méthode 1: Via l'API

Dans un nœud HTTP Request:

```
GET http://127.0.0.1:25808/v1/models
```

### Méthode 2: Dans OpenAI Chat Model

Une fois les credentials configurés avec la base URL `http://127.0.0.1:25808/v1`, n8n devrait automatiquement charger les modèles disponibles.

## ✅ Checklist de vérification

- [x] Serveur démarré sur `0.0.0.0:25808`
- [x] 27 clés API chargées
- [x] Endpoint `/health` fonctionne
- [x] Endpoint `/v1/models` retourne 3 modèles
- [x] Endpoint `/v1/chat/completions` fonctionne
- [x] Endpoint `/api/chat` fonctionne
- [x] Provider confirmé: `gemini_api_key_rotative`
- [x] Rotation visible: `keyUsed: Key X/27`

## 🎨 Exemples de requêtes

### Exemple 1: Question simple

```bash
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Quelle est la capitale du Mali?"}]
  }'
```

### Exemple 2: Avec température

```bash
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Écris un haiku sur l'\''IA"}],
    "temperature": 0.9
  }'
```

### Exemple 3: Avec max_tokens

```bash
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Explique la relativité"}],
    "temperature": 0.7,
    "max_tokens": 500
  }'
```

## 🚀 Prêt pour n8n!

Votre serveur est maintenant compatible avec:
- ✅ n8n HTTP Request (Ollama style)
- ✅ n8n OpenAI Chat Model (LangChain)
- ✅ Toute application compatible OpenAI
- ✅ Rotation automatique des 27 clés API

**Capacité totale:** 135 requêtes/minute

---

**Prochaine étape:** Configurer n8n avec les credentials OpenAI
