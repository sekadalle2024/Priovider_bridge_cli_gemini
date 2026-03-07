# ⚡ Action Immédiate - Multi-CLI pour n8n

## 🚀 Démarrer Maintenant

### 1. Lancer le Serveur
```bash
npm run multi-cli
```

### 2. URLs pour n8n

**Load Balancer (Recommandé):**
```
http://localhost:25815/api/v1/cli/chat
```

**Profils Spécifiques:**
```
http://localhost:25815/api/v1/cli/profile2/chat  # ohada.save@gmail.com
http://localhost:25815/api/v1/cli/profile3/chat  # ohada.save3@gmail.com
```

### 3. Format de Requête

```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "Votre message"}
  ]
}
```

## ✅ C'est Tout!

Le serveur est opérationnel avec 2 profils actifs.

---

**Documentation:** `gemini_cli_multi_provider/N8N_INTEGRATION_MULTI_CLI.md`  
**Swagger:** http://localhost:25815/api-docs
