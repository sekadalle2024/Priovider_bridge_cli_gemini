# ✅ Réponse Finale - Multi-CLI Gemini pour n8n

## 🎯 Base URL pour OpenAI Compatible Endpoints

### Pour n8n (avec adresse IP)
```
http://127.0.0.1:25815/api/v1/cli
```

### Endpoints Complets

| Endpoint | URL Complète | Status |
|----------|--------------|--------|
| **Load Balancer** | `http://127.0.0.1:25815/api/v1/cli/chat` | ✅ Recommandé |
| **Profile2** | `http://127.0.0.1:25815/api/v1/cli/profile2/chat` | ✅ Actif |
| **Profile3** | `http://127.0.0.1:25815/api/v1/cli/profile3/chat` | ✅ Actif |

## 🚀 Commande de Démarrage

```bash
npm run multi-cli
```

Le serveur démarre sur le port **25815**

## 🔧 Configuration n8n - HTTP Request Node

```
Method: POST
URL: http://127.0.0.1:25815/api/v1/cli/chat
Authentication: None
Body Content Type: JSON

Body:
{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ]
}
```

## 📊 Comparaison avec Serveur Assistants

| Serveur | Port | Base URL | Endpoint |
|---------|------|----------|----------|
| **Assistants** | 25810 | `http://127.0.0.1:25810/api/v1` | `/assistants/chat` |
| **Multi-CLI** | 25815 | `http://127.0.0.1:25815/api/v1/cli` | `/chat` |

## 🧪 Test Rapide

```bash
curl -X POST http://127.0.0.1:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Bonjour"}]}'
```

## 📋 Format de Réponse

```json
{
  "id": "chatcmpl-1234567890",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gemini-2.5-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Bonjour !"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 3,
    "completion_tokens": 3,
    "total_tokens": 6
  }
}
```

## 🔍 Endpoints Utiles

```
Health:     http://127.0.0.1:25815/health
Profiles:   http://127.0.0.1:25815/api/v1/cli/profiles
Stats:      http://127.0.0.1:25815/api/v1/cli/profiles/stats
Swagger:    http://127.0.0.1:25815/api-docs
```

## 📝 Notes Importantes

- **Utilisez `127.0.0.1`** au lieu de `localhost` (comme pour le serveur assistants)
- **Port:** 25815 (différent du serveur assistants sur 25810)
- **Format:** OpenAI Compatible
- **Profils actifs:** 2 (profile2, profile3)
- **Load balancing:** Round-robin automatique

## 📚 Documentation Complète

- **Guide n8n:** `gemini_cli_multi_provider/N8N_INTEGRATION_MULTI_CLI.md`
- **URLs de base:** `URLS_BASE_MULTI_CLI.md`
- **Quick Start:** `gemini_cli_multi_provider/QUICK_START_N8N.md`

---

**Base URL:** `http://127.0.0.1:25815/api/v1/cli`  
**Commande:** `npm run multi-cli`  
**Status:** ✅ Opérationnel avec 2 profils
