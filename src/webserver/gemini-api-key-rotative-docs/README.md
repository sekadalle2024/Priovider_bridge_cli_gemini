# 📚 Documentation Gemini API Key Rotative

Documentation complète pour le serveur Gemini API Key avec rotation automatique et intégration n8n.

## 🎯 Vue d'ensemble

Ce dossier contient toute la documentation pour:
- **Serveur standalone** avec rotation de 27 clés API Gemini
- **7 modèles Gemini** incluant les nouveaux Gemini 3 Flash et 3 Pro
- **Intégration n8n** via endpoints OpenAI compatibles (`/v1`)
- **Rotation automatique** des clés API (135 req/min)
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

### Configuration n8n (OpenAI Compatible)

**Base URL:** `http://127.0.0.1:25808/v1`  
**API Key:** `dummy` (n'importe quelle valeur)

**Modèles disponibles:**
- `gemini-3-flash` ⭐ (nouveau, recommandé)
- `gemini-3-pro` ⭐ (nouveau, plus puissant)
- `gemini-2.5-flash`
- `gemini-2.5-pro`
- `gemini-1.5-flash`
- `gemini-1.5-pro`
- `gemini-exp-1206`

**Endpoints:**
- `GET /v1/models` - Liste des modèles
- `POST /v1/chat/completions` - Chat avec vraie API Gemini

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

**Fichier principal:** `server-simple.js` (racine du projet)

**Démarrage:**
```bash
node server-simple.js
```

**Endpoints disponibles:**
- `GET /v1/models` - Liste des 7 modèles Gemini
- `POST /v1/chat/completions` - Chat avec vraie API Gemini + rotation automatique
- `GET /api/providers` - Informations sur les providers
- `GET /health` - Health check
- `GET /` - Page d'accueil avec documentation

**Architecture:**
- `server-simple.js` - Serveur Express principal
- `gemini-api-client.js` - Client API avec rotation des 27 clés

## 📊 Configuration

**Clés API:** 27 clés configurées dans `.env`
- 8 clés Ohada Finance (A-H)
- 8 clés Ohada Save (A-H)
- 11 clés Ohada Save 2 (A-K)

**Capacité:** 135 requêtes/minute (27 × 5 req/min)

**Modèles disponibles (7):**
- `gemini-3-flash` ⭐ (nouveau, recommandé)
- `gemini-3-pro` ⭐ (nouveau, plus puissant)
- `gemini-2.5-flash`
- `gemini-2.5-pro`
- `gemini-1.5-flash`
- `gemini-1.5-pro`
- `gemini-exp-1206`

**Rotation automatique:**
- Chaque requête utilise la clé suivante
- Logs affichent quelle clé est utilisée
- Stats disponibles via les réponses API

## ✅ État du projet

**Status:** ✅ PRODUCTION READY

**Serveur:** http://localhost:25808  
**Base URL n8n:** `http://127.0.0.1:25808/v1`  
**Clés API:** 27/27 actives  
**Modèles:** 7 disponibles  
**Rotation:** Automatique avec logs

## 📝 Rapport complet

Pour un rapport détaillé de tout ce qui a été fait:
→ [RAPPORT_FINAL.md](RAPPORT_FINAL.md)

## 🔗 Liens utiles

**Page d'accueil:** http://localhost:25808  
**Health Check:** http://localhost:25808/health  
**Liste des modèles:** http://localhost:25808/v1/models  
**Providers:** http://localhost:25808/api/providers

## 🧪 Tests rapides

**Tester la liste des modèles:**
```bash
curl http://127.0.0.1:25808/v1/models
```

**Tester le chat:**
```bash
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "messages": [{"role": "user", "content": "Bonjour"}]
  }'
```

**Tester dans n8n:**
1. Créer un nœud "OpenAI Chat Model"
2. Base URL: `http://127.0.0.1:25808/v1`
3. API Key: `dummy`
4. Model: `gemini-3-flash`
5. Exécuter

## 📚 Index complet

Pour naviguer dans toute la documentation:
→ [INDEX.md](INDEX.md)

---

**Créé le:** 26 février 2026  
**Version:** 1.9.0  
**Auteur:** AionUi Team
