# ⚡ ACTION IMMÉDIATE - Multi-CLI Gemini

## 🚀 Démarrer le Serveur

```bash
npm run multi-cli
```

## 📡 Base URL pour n8n

```
http://127.0.0.1:25815/api/v1/cli
```

## 🔗 Endpoint Chat

```
POST http://127.0.0.1:25815/api/v1/cli/chat
```

## 📋 Body

```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "Votre message"}
  ]
}
```

## ✅ Vérification

```bash
curl http://127.0.0.1:25815/health
```

---

**Documentation complète:** `gemini_cli_multi_provider/SYNTHESE_FINALE_N8N.md`
