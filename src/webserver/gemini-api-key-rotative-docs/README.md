# 📚 Documentation Gemini API Key Rotative

Documentation complète pour le serveur Gemini API Key avec rotation automatique et intégration n8n.

## 🎯 Vue d'ensemble

Ce dossier contient toute la documentation pour:
- **Serveur standalone** avec rotation de 27 clés API Gemini
- **Intégration n8n** (HTTP Request et LangChain)
- **Endpoints OpenAI compatibles** pour LLM Chain
- **Workflows prêts à l'emploi**

## 📁 Structure du dossier

```
gemini-api-key-rotative-docs/
├── README.md (ce fichier)
├── INDEX.md (index de navigation)
├── RAPPORT_FINAL.md (rapport complet du projet)
│
├── 🚀 Démarrage rapide
│   ├── QUICK_ANSWER.md
│   ├── N8N_QUICK_SETUP.md
│   └── N8N_LANGCHAIN_QUICK_START.md
│
├── 📖 Documentation complète
│   ├── INTEGRATION_N8N_COMPLETE.md
│   ├── RESUME_FINAL.md
│   └── INDEX_N8N_INTEGRATION.md
│
├── 🔧 Guides spécifiques
│   ├── N8N_CONNECTION_FIX.md
│   ├── N8N_CREDENTIALS_SETUP.md
│   ├── N8N_LLM_CHAIN_SETUP.md
│   ├── N8N_LANGCHAIN_GUIDE_COMPLET.md
│   ├── N8N_LANGCHAIN_VISUAL_GUIDE.md
│   └── TEST_ENDPOINTS.md
│
├── ❓ Réponses aux questions
│   ├── REPONSES_QUESTIONS.md
│   ├── REPONSE_LANGCHAIN.md
│   └── n8n-config-example.md
│
└── 🎨 Workflows n8n
    └── n8n-workflows/
        ├── n8n-workflow-gemini-ready.json
        ├── n8n-workflow-langchain-simple-ready.json
        ├── n8n-workflow-langchain.json
        ├── n8n-workflow-langchain-advanced.json
        └── n8n-workflow-langchain-conversation.json
```

## 🚀 Démarrage rapide

### Pour HTTP Request (Ollama style)

**Lire:** [N8N_QUICK_SETUP.md](N8N_QUICK_SETUP.md)

**URL:** `http://127.0.0.1:25808/api/chat`

### Pour LangChain (OpenAI Chat Model)

**Lire:** [N8N_LANGCHAIN_QUICK_START.md](N8N_LANGCHAIN_QUICK_START.md)

**Configuration:**
- API Key: `dummy-key`
- Base URL: `http://127.0.0.1:25808/v1`
- Model: `gemini-2.5-flash`

## 📖 Documentation par besoin

### Je veux démarrer rapidement
→ [QUICK_ANSWER.md](QUICK_ANSWER.md) (2 min)

### Je veux comprendre tout
→ [INTEGRATION_N8N_COMPLETE.md](INTEGRATION_N8N_COMPLETE.md) (10 min)

### J'ai une erreur de connexion
→ [N8N_CONNECTION_FIX.md](N8N_CONNECTION_FIX.md)

### Je veux utiliser LangChain
→ [N8N_LANGCHAIN_GUIDE_COMPLET.md](N8N_LANGCHAIN_GUIDE_COMPLET.md)

### Je veux un workflow prêt
→ [n8n-workflows/](n8n-workflows/)

## 🎨 Workflows disponibles

| Fichier | Description | Utilisation |
|---------|-------------|-------------|
| `n8n-workflow-gemini-ready.json` | HTTP Request (Ollama + OpenAI) | Test des 2 méthodes |
| `n8n-workflow-langchain-simple-ready.json` | LangChain simple | ⭐ Recommandé pour débuter |
| `n8n-workflow-langchain.json` | LangChain basique | Question simple |
| `n8n-workflow-langchain-advanced.json` | LangChain avancé | Exemples multiples |
| `n8n-workflow-langchain-conversation.json` | LangChain avec mémoire | Conversation |

## 🔧 Serveur

**Fichier principal:** `server-api-key.js` (racine du projet)

**Démarrage:**
```bash
node server-api-key.js
```

**Endpoints disponibles:**
- `POST /api/chat` - Ollama compatible
- `POST /api/generate` - Génération simple
- `POST /v1/chat/completions` - OpenAI compatible (LangChain)
- `GET /v1/models` - Liste des modèles
- `GET /api/stats` - Statistiques de rotation
- `GET /health` - Health check
- `GET /docs` - Documentation Swagger

## 📊 Configuration

**Clés API:** 27 clés configurées dans `.env`
- 8 clés Ohada Finance
- 8 clés Ohada Save
- 11 clés Ohada Save 2

**Capacité:** 135 requêtes/minute (27 × 5)

**Modèles disponibles:**
- `gemini-2.5-flash` (recommandé)
- `gemini-1.5-flash`
- `gemini-1.5-pro`

## ✅ État du projet

**Status:** ✅ PRODUCTION READY

**Serveur:** http://0.0.0.0:25808  
**Provider:** gemini_api_key_rotative  
**Clés:** 27/27  
**Rotation:** Automatique

## 📝 Rapport complet

Pour un rapport détaillé de tout ce qui a été fait:
→ [RAPPORT_FINAL.md](RAPPORT_FINAL.md)

## 🔗 Liens utiles

**Documentation Swagger:** http://localhost:25808/docs  
**OpenAPI Spec:** http://localhost:25808/openapi.json  
**Health Check:** http://localhost:25808/health  
**Stats:** http://localhost:25808/api/stats

## 📚 Index complet

Pour naviguer dans toute la documentation:
→ [INDEX.md](INDEX.md)

---

**Créé le:** 26 février 2026  
**Version:** 1.9.0  
**Auteur:** AionUi Team
