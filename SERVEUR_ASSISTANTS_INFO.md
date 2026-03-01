# 🌐 Serveur des Assistants - Informations Principales

## 📍 URLs du Serveur

### URL Principale
```
http://localhost:25810
```

### Documentation Swagger
```
http://localhost:25810/api-docs
```

### Health Check
```
http://localhost:25810/health
```

## 🚀 Démarrage

```bash
npm start
```

Le serveur démarre automatiquement sur le port **25810**

## 📚 Documentation Complète

Toute la documentation est disponible dans le dossier :

```
assistant_serveur_endpoint/
```

### Fichiers Principaux

1. **[assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md](./assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md)** ⭐
   - Démarrage rapide
   - URLs essentielles
   - Navigation

2. **[assistant_serveur_endpoint/README.md](./assistant_serveur_endpoint/README.md)**
   - Vue d'ensemble
   - Tous les endpoints
   - Documentation complète

3. **[assistant_serveur_endpoint/N8N_ASSISTANTS_OPENAPI_GUIDE.md](./assistant_serveur_endpoint/N8N_ASSISTANTS_OPENAPI_GUIDE.md)**
   - Guide complet n8n
   - Configuration
   - Exemples

## 📡 Endpoints Principaux

### Format OpenAPI (n8n)

```
POST   http://localhost:25810/api/v1/chat/completions
GET    http://localhost:25810/api/v1/models
GET    http://localhost:25810/api/v1/assistants
POST   http://localhost:25810/api/v1/assistants/{id}/chat
```

### Format Classique

```
POST   http://localhost:25810/api/gemini/chat
POST   http://localhost:25810/api/assistant/{name}
GET    http://localhost:25810/api/assistants
```

## 🎨 Caractéristiques

- **Port** : 25810
- **Modèles Gemini** : 9 disponibles
- **Assistants** : 12 disponibles
- **Format** : OpenAPI + Custom
- **Documentation** : Swagger interactive

## 🧪 Test Rapide

```bash
# Health check
curl http://localhost:25810/health

# Liste des modèles
curl http://localhost:25810/api/v1/models

# Test chat (NÉCESSITE GEMINI CLI)
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Bonjour"}],"model":"gemini-3-flash"}'
```

## ⚠️ Prérequis : Gemini CLI

**OBLIGATOIRE** pour que les assistants fonctionnent :

```bash
npm install -g @google/generative-ai-cli
gemini auth login
```

## 📝 Configuration n8n

**URL** : `http://localhost:25810/api/v1/chat/completions`

**Body** :
```json
{
  "messages": [{"role": "user", "content": "{{ $json.prompt }}"}],
  "model": "gemini-3-flash"
}
```

## 🔗 Liens Utiles

- **Swagger** : http://localhost:25810/api-docs
- **Documentation** : [assistant_serveur_endpoint/](./assistant_serveur_endpoint/)
- **GitHub** : https://github.com/iOfficeAI/AionUi

---

**Version** : 1.1.0

**Status** : ✅ PRODUCTION READY

Pour plus de détails, consultez : **[assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md](./assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md)**
