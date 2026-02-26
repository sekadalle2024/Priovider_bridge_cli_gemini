# 📋 Réponses aux Questions

## Question 1: Intégration LLM Chain (OpenAI/Ollama/Grok)

### ✅ URL et API Key pour voir vos modèles

**URL pour voir les modèles:**
```
http://127.0.0.1:25808/v1/models
```

**Test avec curl:**
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
      "owned_by": "google"
    },
    {
      "id": "gemini-1.5-flash",
      "object": "model",
      "owned_by": "google"
    },
    {
      "id": "gemini-1.5-pro",
      "object": "model",
      "owned_by": "google"
    }
  ]
}
```

### Configuration dans n8n (OpenAI Chat Model)

**Credentials OpenAI API:**
- **API Key:** `dummy-key` (n'importe quoi, non vérifié)
- **Base URL:** `http://127.0.0.1:25808/v1`

**Modèles disponibles:**
- `gemini-2.5-flash` (recommandé)
- `gemini-1.5-flash`
- `gemini-1.5-pro`

### Endpoints disponibles

| Endpoint | Type | Description |
|----------|------|-------------|
| `/v1/chat/completions` | POST | OpenAI compatible (pour LangChain) |
| `/v1/models` | GET | Liste des modèles |
| `/api/chat` | POST | Ollama compatible |
| `/api/generate` | POST | Génération simple |

## Question 2: Erreur workflow n8n (ECONNREFUSED ::1:25808)

### ❌ Problème

```
connect ECONNREFUSED ::1:25808
```

**Cause:** n8n essaie de se connecter via IPv6 (`::1`) au lieu d'IPv4 (`127.0.0.1`).

### ✅ Solution appliquée

**1. Serveur modifié pour écouter sur `0.0.0.0`**

Le serveur écoute maintenant sur toutes les interfaces (IPv4 et IPv6).

**2. Utiliser `127.0.0.1` dans n8n**

Dans vos nœuds HTTP Request, utilisez:

```
✅ Bon: http://127.0.0.1:25808/api/chat
❌ Mauvais: http://localhost:25808/api/chat
```

**3. Si n8n est dans Docker**

```
http://host.docker.internal:25808/api/chat
```

### Workflow corrigé

**Configuration HTTP Request:**

```json
{
  "url": "http://127.0.0.1:25808/api/chat",
  "method": "POST",
  "sendBody": true,
  "jsonParameters": true,
  "bodyParametersJson": "{\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"{{ $json.prompt }}\"\n    }\n  ],\n  \"stream\": false\n}",
  "options": {
    "timeout": 60000
  }
}
```

## 🎯 Résumé des modifications

### Modifications apportées au serveur

1. ✅ **Ajout endpoint OpenAI:** `/v1/chat/completions`
2. ✅ **Ajout liste modèles:** `/v1/models`
3. ✅ **Serveur écoute sur `0.0.0.0`** (fix IPv6)
4. ✅ **Logs mis à jour** avec nouveaux endpoints

### Fichiers créés

1. ✅ `N8N_LLM_CHAIN_SETUP.md` - Configuration LLM Chain
2. ✅ `N8N_CONNECTION_FIX.md` - Fix erreur de connexion
3. ✅ `N8N_CREDENTIALS_SETUP.md` - Configuration credentials
4. ✅ `TEST_ENDPOINTS.md` - Tests des endpoints
5. ✅ `REPONSES_QUESTIONS.md` - Ce fichier

## 🧪 Tests effectués

### Test 1: Liste des modèles ✅

```bash
curl http://127.0.0.1:25808/v1/models
```

**Résultat:** 3 modèles retournés

### Test 2: Chat OpenAI compatible ✅

```bash
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

**Résultat:**
```json
{
  "id": "chatcmpl-1772138035182",
  "object": "chat.completion",
  "model": "gemini-2.5-flash",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
    }
  }],
  "provider": "gemini_api_key_rotative",
  "keyUsed": "Key 1/27"
}
```

### Test 3: Serveur accessible ✅

```bash
curl http://127.0.0.1:25808/health
```

**Résultat:** Status OK, 27 clés chargées

## 📊 Configuration finale

### Pour HTTP Request (style Ollama)

**URL:** `http://127.0.0.1:25808/api/chat`

**Body:**
```json
{
  "messages": [
    {"role": "user", "content": "Votre question"}
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

## ✅ Checklist de vérification

- [x] Serveur démarré sur `0.0.0.0:25808`
- [x] 27 clés API chargées
- [x] Endpoint `/v1/models` fonctionne
- [x] Endpoint `/v1/chat/completions` fonctionne
- [x] Endpoint `/api/chat` fonctionne
- [x] Serveur accessible via `127.0.0.1`
- [x] Provider confirmé: `gemini_api_key_rotative`
- [x] Rotation visible: `keyUsed: Key X/27`

## 🎉 Prêt pour n8n!

Votre serveur est maintenant:
- ✅ Compatible OpenAI (LangChain)
- ✅ Compatible Ollama
- ✅ Accessible depuis n8n (IPv4 et IPv6)
- ✅ 27 clés API avec rotation automatique
- ✅ 135 requêtes/minute de capacité

## 📚 Documentation complète

1. **Configuration LLM Chain:** [N8N_LLM_CHAIN_SETUP.md](N8N_LLM_CHAIN_SETUP.md)
2. **Fix connexion:** [N8N_CONNECTION_FIX.md](N8N_CONNECTION_FIX.md)
3. **Credentials n8n:** [N8N_CREDENTIALS_SETUP.md](N8N_CREDENTIALS_SETUP.md)
4. **Tests endpoints:** [TEST_ENDPOINTS.md](TEST_ENDPOINTS.md)
5. **Guide rapide n8n:** [N8N_QUICK_SETUP.md](N8N_QUICK_SETUP.md)

## 🚀 Prochaines étapes

1. **Créer les credentials dans n8n** (voir N8N_CREDENTIALS_SETUP.md)
2. **Tester avec un workflow simple**
3. **Utiliser dans vos workflows LangChain**
4. **Monitorer l'utilisation** avec `/api/stats`

---

**Serveur actif:** ✅ Running on http://0.0.0.0:25808  
**Clés chargées:** ✅ 27/27  
**Provider:** ✅ gemini_api_key_rotative  
**Capacité:** ✅ 135 req/min
