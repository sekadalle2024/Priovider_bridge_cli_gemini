# 🎯 Provider Bridge — URLs Finales

## ✅ Déploiement Réussi!

Le projet est maintenant en ligne sur Netlify.

## 🌐 URL Principale

```
https://providerbridge.netlify.app
```

## 📍 URLs Importantes

| Service | URL |
|---------|-----|
| **Dashboard** | https://providerbridge.netlify.app/ |
| **Swagger UI** | https://providerbridge.netlify.app/docs |
| **OpenAPI Spec** | https://providerbridge.netlify.app/openapi.json |
| **Health Check** | https://providerbridge.netlify.app/health |

## 🔗 Endpoints pour n8n

### Base URL
```
https://providerbridge.netlify.app
```

### Endpoints Principaux
```
POST /v1/chat/completions          (OpenAI compatible)
GET  /v1/models                    (Liste des modèles)
POST /api/providers/gemini_cli/chat
POST /api/providers/gemini_api_key_rotative/chat
```

### Authentication
```
Header: Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔧 Configuration Netlify

### Variables d'Environnement à Ajouter

Allez sur : `https://app.netlify.com/projects/providerbridge/settings/env`

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://providerbridge.netlify.app/api/auth/google/callback
JWT_SECRET=...
GEMINI_API_KEY_1=...
```

## 📊 Netlify Admin

```
Admin:       https://app.netlify.com/projects/providerbridge
Build Logs:  https://app.netlify.com/projects/providerbridge/deploys
Function Logs: https://app.netlify.com/projects/providerbridge/logs/functions
```

## 🎯 Prochaines Étapes

1. **Configurer Google OAuth** (10 min)
2. **Ajouter les variables d'environnement** (5 min)
3. **Tester le dashboard** (2 min)
4. **Intégrer avec n8n** (5 min)

## 📚 Documentation

- [DEPLOYMENT_SUCCESS.md](./DEPLOYMENT_SUCCESS.md) — Guide complet
- [provider-bridge/README.md](./provider-bridge/README.md) — Documentation
- [provider-bridge/DEPLOYMENT_NETLIFY.md](./provider-bridge/DEPLOYMENT_NETLIFY.md) — Déploiement

---

**Statut** : ✅ Live
**URL** : https://providerbridge.netlify.app
