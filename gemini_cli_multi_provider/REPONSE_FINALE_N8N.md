# ✅ Réponse Finale - Multi-CLI Gemini pour n8n

## 🎯 Réponse à Vos Questions

### ❓ Quelle est l'URL de base pour chaque endpoint?

#### Load Balancer (Recommandé)
```
http://localhost:25815/api/v1/cli/chat
```
Distribution automatique entre profile2 et profile3

#### Profile2 - ohada.save@gmail.com
```
http://localhost:25815/api/v1/cli/profile2/chat
```

#### Profile3 - ohada.save3@gmail.com
```
http://localhost:25815/api/v1/cli/profile3/chat
```

#### Profile4 - ohada.save12@gmail.com (⚠️ Ne pas utiliser)
```
http://localhost:25815/api/v1/cli/profile4/chat
```
**Problème:** Timeout après 20+ minutes

### ❓ Quelle est la commande pour lancer le serveur?

```bash
npm run multi-cli
```

Le serveur démarre sur le port **25815**

## 📊 État Actuel

### Profils Disponibles
- ✅ **Profile2** (ohada.save@gmail.com) - Fonctionne
- ✅ **Profile3** (ohada.save3@gmail.com) - Fonctionne
- ❌ **Profile4** (ohada.save12@gmail.com) - Timeout

### Serveur
- **Port:** 25815
- **Status:** ✅ En ligne
- **Swagger:** http://localhost:25815/api-docs
- **Health:** http://localhost:25815/health

## 🔧 Configuration n8n

### Méthode Recommandée: HTTP Request Node

```
Node: HTTP Request
Method: POST
URL: http://localhost:25815/api/v1/cli/chat
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

### Extraire la Réponse

Dans un nœud Code après HTTP Request:
```javascript
return {
  response: $json.choices[0].message.content
};
```

## 📋 Exemple Complet

### Requête
```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "Dis bonjour en français"
    }
  ]
}
```

### Réponse
```json
{
  "id": "chatcmpl-1709825768000",
  "object": "chat.completion",
  "created": 1709825768,
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
    "prompt_tokens": 7,
    "completion_tokens": 3,
    "total_tokens": 10
  }
}
```

## ⚠️ Problème Profile4

### Symptôme
La commande `gemini` tourne indéfiniment (20+ minutes) pour profile4 (ohada.save12@gmail.com)

### Solution Temporaire
Utiliser uniquement profile2 et profile3:

```bash
# Dans .env
CLI_PROFILE4_ENABLED=false
MULTI_CLI_PROFILES=profile2,profile3

# Redémarrer
npm run multi-cli
```

### Cause Possible
- Compte ohada.save12@gmail.com peut avoir un problème d'éligibilité
- Problème de configuration Gemini CLI
- Problème réseau ou de quota

### Recommandation
Continuer avec 2 profils (profile2 et profile3) qui fonctionnent parfaitement

## 🚀 Workflow n8n Complet

```
[Webhook Trigger]
  Reçoit: { "prompt": "Votre question" }
    ↓
[HTTP Request]
  POST http://localhost:25815/api/v1/cli/chat
  Body: {
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "{{ $json.prompt }}"}]
  }
    ↓
[Code Node]
  return { response: $json.choices[0].message.content };
    ↓
[Respond to Webhook]
  Body: {{ $json.response }}
```

## 📈 Capacités

### Avec 2 Profils (profile2 + profile3)
- **Requêtes/minute:** 30-120
- **Tokens/jour:** 2-4M
- **Haute disponibilité:** Failover automatique
- **Load balancing:** Round-robin

## 🔗 Liens Utiles

### Documentation
- **Swagger UI:** http://localhost:25815/api-docs
- **Guide n8n:** `gemini_cli_multi_provider/N8N_INTEGRATION_MULTI_CLI.md`
- **Quick Start:** `gemini_cli_multi_provider/QUICK_START_N8N.md`

### Endpoints de Test
```bash
# Health check
curl http://localhost:25815/health

# Liste des profils
curl http://localhost:25815/api/v1/cli/profiles

# Test chat
curl -X POST http://localhost:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Test"}]}'
```

## ✅ Résumé

### Pour n8n
1. **Commande:** `npm run multi-cli`
2. **URL:** `http://localhost:25815/api/v1/cli/chat`
3. **Format:** OpenAI Compatible
4. **Profils actifs:** profile2, profile3 (2/3)

### Prochaines Étapes
1. ✅ Utiliser profile2 et profile3 dans n8n
2. ⏸️ Investiguer le problème profile4 plus tard
3. ✅ Profiter des 2 profils fonctionnels

---

**Serveur:** http://localhost:25815  
**Commande:** `npm run multi-cli`  
**Status:** ✅ Opérationnel avec 2 profils  
**Documentation:** http://localhost:25815/api-docs
