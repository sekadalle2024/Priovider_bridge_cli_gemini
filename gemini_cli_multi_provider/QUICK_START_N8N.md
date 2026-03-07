# ⚡ Quick Start - Multi-CLI Gemini pour n8n

## 🎯 En 3 Étapes

### 1️⃣ Démarrer le Serveur
```bash
npm run multi-cli
```

### 2️⃣ URLs de Base pour n8n

| Endpoint | URL | Status |
|----------|-----|--------|
| **Load Balancer** | `http://localhost:25815/api/v1/cli/chat` | ✅ Recommandé |
| **Profile2** | `http://localhost:25815/api/v1/cli/profile2/chat` | ✅ Actif |
| **Profile3** | `http://localhost:25815/api/v1/cli/profile3/chat` | ✅ Actif |
| **Profile4** | `http://localhost:25815/api/v1/cli/profile4/chat` | ❌ Timeout |

### 3️⃣ Configuration n8n

#### HTTP Request Node
```
Method: POST
URL: http://localhost:25815/api/v1/cli/chat
Headers: Content-Type: application/json
Body:
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "Votre message"}
  ]
}
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
        "content": "La réponse de Gemini"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

## 🔗 Extraire la Réponse dans n8n

```javascript
// Dans un nœud Code
return {
  response: $json.choices[0].message.content
};
```

## ⚠️ Important

- **Profile4 a un timeout** - N'utilisez que profile2 ou profile3
- **Load Balancer recommandé** - Distribution automatique
- **Port:** 25815 (différent du serveur assistants sur 25810)

## 📚 Documentation Complète

Voir: `gemini_cli_multi_provider/N8N_INTEGRATION_MULTI_CLI.md`
