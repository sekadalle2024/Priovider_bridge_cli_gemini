# 🔗 URLs de Base - Multi-CLI Gemini (OpenAI Compatible)

## 🚀 Commande de Démarrage
```bash
npm run multi-cli
```

## 📡 URLs de Base avec Adresse IP (127.0.0.1)

### ✅ Load Balancer (Recommandé)
```
http://127.0.0.1:25815/api/v1/cli
```

### ✅ Profile2 - ohada.save@gmail.com
```
http://127.0.0.1:25815/api/v1/cli/profile2
```

### ✅ Profile3 - ohada.save3@gmail.com
```
http://127.0.0.1:25815/api/v1/cli/profile3
```

## 📋 Endpoints Complets

### Load Balancer
```
POST http://127.0.0.1:25815/api/v1/cli/chat
```

### Profile2
```
POST http://127.0.0.1:25815/api/v1/cli/profile2/chat
```

### Profile3
```
POST http://127.0.0.1:25815/api/v1/cli/profile3/chat
```

## 🔧 Configuration n8n

### Base URL à utiliser dans n8n
```
http://127.0.0.1:25815/api/v1/cli
```

### Endpoint Chat
```
/chat
```

### URL Complète
```
http://127.0.0.1:25815/api/v1/cli/chat
```

## 📋 Format de Requête

```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "Votre message"
    }
  ]
}
```

## 🔍 Comparaison avec le Serveur Assistants

### Serveur Assistants (Port 25810)
```
Base URL: http://127.0.0.1:25810/api/v1
Endpoint: /assistants/chat
URL complète: http://127.0.0.1:25810/api/v1/assistants/chat
```

### Serveur Multi-CLI (Port 25815)
```
Base URL: http://127.0.0.1:25815/api/v1/cli
Endpoint: /chat
URL complète: http://127.0.0.1:25815/api/v1/cli/chat
```

## 📊 Tableau Récapitulatif

| Serveur | Port | Base URL | Endpoint | URL Complète |
|---------|------|----------|----------|--------------|
| **Assistants** | 25810 | `http://127.0.0.1:25810/api/v1` | `/assistants/chat` | `http://127.0.0.1:25810/api/v1/assistants/chat` |
| **Multi-CLI (Load Balancer)** | 25815 | `http://127.0.0.1:25815/api/v1/cli` | `/chat` | `http://127.0.0.1:25815/api/v1/cli/chat` |
| **Multi-CLI (Profile2)** | 25815 | `http://127.0.0.1:25815/api/v1/cli/profile2` | `/chat` | `http://127.0.0.1:25815/api/v1/cli/profile2/chat` |
| **Multi-CLI (Profile3)** | 25815 | `http://127.0.0.1:25815/api/v1/cli/profile3` | `/chat` | `http://127.0.0.1:25815/api/v1/cli/profile3/chat` |

## 🧪 Test avec cURL

### Load Balancer
```bash
curl -X POST http://127.0.0.1:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Test"}]}'
```

### Profile2 Spécifique
```bash
curl -X POST http://127.0.0.1:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Test"}]}'
```

## 🔍 Endpoints Utiles

### Health Check
```
GET http://127.0.0.1:25815/health
```

### Liste des Profils
```
GET http://127.0.0.1:25815/api/v1/cli/profiles
```

### Statistiques
```
GET http://127.0.0.1:25815/api/v1/cli/profiles/stats
```

### Documentation Swagger
```
GET http://127.0.0.1:25815/api-docs
```

## ⚡ Quick Start n8n

### HTTP Request Node
```
Method: POST
URL: http://127.0.0.1:25815/api/v1/cli/chat
Authentication: None
Body Content Type: JSON

Body:
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ]
}
```

## 📝 Notes Importantes

- **Port Multi-CLI:** 25815 (différent du serveur assistants sur 25810)
- **Format:** OpenAI Compatible
- **Profils actifs:** 2 (profile2, profile3)
- **Load balancing:** Round-robin automatique
- **Adresse IP:** Utilisez `127.0.0.1` au lieu de `localhost` si nécessaire

---

**Serveur:** http://127.0.0.1:25815  
**Base URL:** http://127.0.0.1:25815/api/v1/cli  
**Commande:** `npm run multi-cli`  
**Status:** ✅ Opérationnel
