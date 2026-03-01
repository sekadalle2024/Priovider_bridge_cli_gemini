# 📚 Documentation Serveur des Assistants AionUI

## 🌐 Informations du Serveur

### URLs Principales

| Service | URL |
|---------|-----|
| **Serveur** | `http://localhost:25810` |
| **Swagger Documentation** | `http://localhost:25810/api-docs` |
| **Health Check** | `http://localhost:25810/health` |
| **Page d'accueil** | `http://localhost:25810` |

### Configuration

**Port** : 25810 (évite conflit avec provider-bridge:25809)

**Variable d'environnement** :
```env
ASSISTANT_PORT=25810
```

## 🚀 Démarrage

```bash
# Démarrer l'application (le serveur démarre automatiquement)
npm start

# Ou démarrer le serveur standalone
npm run assistants

# Mode développement
npm run assistants:dev
```

## 📡 Endpoints API

### Format OpenAPI (Recommandé pour n8n)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/chat/completions` | Chat format OpenAI |
| GET | `/api/v1/models` | Liste des 9 modèles Gemini |
| GET | `/api/v1/assistants` | Liste des 12 assistants |
| POST | `/api/v1/assistants/{id}/chat` | Chat avec assistant |

### Format Classique

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/gemini/chat` | Gemini CLI direct |
| GET | `/api/gemini/models` | Liste des modèles |
| GET | `/api/gemini/status` | Statut Gemini CLI |
| POST | `/api/assistant/{name}` | Exécuter un assistant |
| GET | `/api/assistants` | Liste des assistants |
| GET | `/health` | Health check |

## 🎨 Modèles Gemini

9 modèles disponibles :
- `gemini-3-flash`, `gemini-3-pro`
- `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.5-flash-lite`
- `gemini-2.0-flash`
- `gemini-1.5-flash`, `gemini-1.5-pro`
- `gemini-exp-1206`

## 🎯 Assistants

12 assistants disponibles :
1. cowork, 2. pptx-generator, 3. beautiful-mermaid, 4. pdf-to-ppt
5. game-3d, 6. ui-ux-pro-max, 7. planning-with-files, 8. human-3-coach
9. social-job-publisher, 10. moltbook, 11. openclaw-setup, 12. story-roleplay

## 📚 Documentation

### 🌟 Guides Essentiels

| Document | Description |
|----------|-------------|
| **[00_LIRE_EN_PREMIER.md](./00_LIRE_EN_PREMIER.md)** | Démarrage rapide et navigation |
| **[README_FINAL_ASSISTANTS.md](./README_FINAL_ASSISTANTS.md)** | README principal |
| **[N8N_ASSISTANTS_OPENAPI_GUIDE.md](./N8N_ASSISTANTS_OPENAPI_GUIDE.md)** | Guide n8n complet |

### 📖 Documentation Complète

- **CHANGEMENTS_FINAUX_ASSISTANTS.md** - Résumé des changements
- **MISE_A_JOUR_ASSISTANTS_OPENAPI.md** - Détails techniques
- **INTEGRATION_ASSISTANTS_COMPLETE.md** - Documentation complète
- **GUIDE_DEMARRAGE_RAPIDE_ASSISTANTS.md** - Guide de démarrage
- **README_ASSISTANTS_COMPLET.md** - Documentation exhaustive

### 🔍 Navigation

- **INDEX_DOCUMENTATION_ASSISTANTS.md** - Index complet
- **INDEX_ASSISTANTS_DOCUMENTATION.md** - Index alternatif

### 🛠️ Technique

- **PLAN_INTEGRATION_ASSISTANTS.md** - Plan technique
- **RESUME_IMPLEMENTATION_ASSISTANTS.md** - Résumé implémentation
- **GUIDE_ASSISTANTS_MICROSERVICES.md** - Architecture microservices

### 📦 Workflows

- **n8n-workflow-assistants-openapi.json** - Workflow n8n prêt à l'emploi

## 🧪 Tests

```bash
# Tests automatiques
npm run test:assistants:integration

# Test manuel
curl http://localhost:25810/health
```

## 📝 Exemple Rapide

### cURL

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}],
    "model": "gemini-3-flash"
  }'
```

### n8n

**URL** : `http://localhost:25810/api/v1/chat/completions`

**Body** :
```json
{
  "messages": [{"role": "user", "content": "{{ $json.prompt }}"}],
  "model": "gemini-3-flash"
}
```

## 🆘 Support

- **Swagger** : http://localhost:25810/api-docs
- **GitHub** : https://github.com/iOfficeAI/AionUi
- **Discord** : https://discord.gg/2QAwJn7Egx

---

**Version** : 1.1.0

**Port** : 25810

**Status** : ✅ PRODUCTION READY

**Swagger** : http://localhost:25810/api-docs
