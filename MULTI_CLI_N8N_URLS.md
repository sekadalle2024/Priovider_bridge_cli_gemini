# 🔗 URLs Multi-CLI Gemini pour n8n

## 🚀 Commande de Démarrage
```bash
npm run multi-cli
```

## 📡 URLs de Base (OpenAI Compatible)

### Load Balancer (Recommandé)
```
http://localhost:25815/api/v1/cli/chat
```

### Profile2 - ohada.save@gmail.com
```
http://localhost:25815/api/v1/cli/profile2/chat
```

### Profile3 - ohada.save3@gmail.com
```
http://localhost:25815/api/v1/cli/profile3/chat
```

## 📋 Format de Requête

```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "Votre message"}
  ]
}
```

## 🔍 Endpoints Utiles

- **Swagger:** http://localhost:25815/api-docs
- **Health:** http://localhost:25815/health
- **Profils:** http://localhost:25815/api/v1/cli/profiles
- **Stats:** http://localhost:25815/api/v1/cli/profiles/stats

## 📚 Documentation Complète

Voir: `gemini_cli_multi_provider/N8N_INTEGRATION_MULTI_CLI.md`

---

**Port:** 25815  
**Profils actifs:** 2 (profile2, profile3)  
**Status:** ✅ Opérationnel
