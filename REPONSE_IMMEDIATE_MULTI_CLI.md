# ⚡ Réponse Immédiate - Multi-CLI pour n8n

## 🎯 Base URL OpenAI Compatible

```
http://127.0.0.1:25815/api/v1/cli
```

## 🚀 Commande

```bash
npm run multi-cli
```

## 📡 Endpoints

### Load Balancer (Recommandé)
```
POST http://127.0.0.1:25815/api/v1/cli/chat
```

### Profile2 (ohada.save@gmail.com)
```
POST http://127.0.0.1:25815/api/v1/cli/profile2/chat
```

### Profile3 (ohada.save3@gmail.com)
```
POST http://127.0.0.1:25815/api/v1/cli/profile3/chat
```

## 📋 Body (JSON)

```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "Votre message"}
  ]
}
```

## 🔧 Configuration n8n

```
Method: POST
URL: http://127.0.0.1:25815/api/v1/cli/chat
Body: Format JSON ci-dessus
```

## 📊 Comparaison avec Serveur Assistants

| Serveur | Port | Base URL |
|---------|------|----------|
| Assistants | 25810 | `http://127.0.0.1:25810/api/v1` |
| Multi-CLI | 25815 | `http://127.0.0.1:25815/api/v1/cli` |

---

**Port:** 25815  
**Profils:** 2 actifs  
**Status:** ✅ Opérationnel
