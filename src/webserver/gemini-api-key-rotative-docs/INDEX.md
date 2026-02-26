# 📚 Index - Documentation Gemini API Key Rotative

Guide de navigation complet pour toute la documentation.

## 🚀 Démarrage rapide (5 minutes)

### Je veux utiliser HTTP Request dans n8n
→ [N8N_QUICK_SETUP.md](N8N_QUICK_SETUP.md)

**URL:** `http://127.0.0.1:25808/api/chat`

### Je veux utiliser LangChain dans n8n
→ [N8N_LANGCHAIN_QUICK_START.md](N8N_LANGCHAIN_QUICK_START.md)

**Configuration:**
- API Key: `dummy-key`
- Base URL: `http://127.0.0.1:25808/v1`

### Je veux des réponses ultra-rapides
→ [QUICK_ANSWER.md](QUICK_ANSWER.md)

## 📖 Documentation complète (10-15 minutes)

### Vue d'ensemble complète
→ [INTEGRATION_N8N_COMPLETE.md](INTEGRATION_N8N_COMPLETE.md)

Contient:
- Problèmes résolus
- Configuration serveur
- 2 méthodes d'intégration n8n
- Tests de validation
- Exemples de workflows

### Résumé final
→ [RESUME_FINAL.md](RESUME_FINAL.md)

Contient:
- Travail effectué
- Modifications apportées
- Documentation créée
- Prochaines étapes

### Index navigation n8n
→ [INDEX_N8N_INTEGRATION.md](INDEX_N8N_INTEGRATION.md)

Navigation complète de toute la documentation n8n.

## 🔧 Guides spécifiques

### Fix erreur de connexion (ECONNREFUSED)
→ [N8N_CONNECTION_FIX.md](N8N_CONNECTION_FIX.md)

**Problème:** `connect ECONNREFUSED ::1:25808`

**Solution:** Utiliser `127.0.0.1` au lieu de `localhost`

### Configuration credentials n8n
→ [N8N_CREDENTIALS_SETUP.md](N8N_CREDENTIALS_SETUP.md)

Guide pas à pas pour créer les credentials OpenAI API dans n8n.

### Configuration LLM Chain
→ [N8N_LLM_CHAIN_SETUP.md](N8N_LLM_CHAIN_SETUP.md)

Guide complet pour utiliser avec LangChain:
- Configuration OpenAI Chat Model
- Endpoints OpenAI compatibles
- Voir les modèles disponibles
- Cas d'usage avancés

### Guide LangChain complet
→ [N8N_LANGCHAIN_GUIDE_COMPLET.md](N8N_LANGCHAIN_GUIDE_COMPLET.md)

Documentation détaillée:
- Réponses aux questions
- Configuration étape par étape
- Workflow complet
- Tests et vérifications
- Dépannage

### Guide LangChain visuel
→ [N8N_LANGCHAIN_VISUAL_GUIDE.md](N8N_LANGCHAIN_VISUAL_GUIDE.md)

Guide avec captures d'écran textuelles:
- Créer les credentials
- Configurer le workflow
- Exécuter et vérifier

### Tests des endpoints
→ [TEST_ENDPOINTS.md](TEST_ENDPOINTS.md)

Tests complets de tous les endpoints:
- Health check
- Liste des modèles
- Chat OpenAI
- Chat Ollama
- Stats de rotation

## ❓ Réponses aux questions

### Questions générales
→ [REPONSES_QUESTIONS.md](REPONSES_QUESTIONS.md)

Réponses détaillées aux 2 questions principales:
1. Intégration LLM Chain (URL, API Key, modèles)
2. Fix erreur workflow (ECONNREFUSED)

### Questions LangChain
→ [REPONSE_LANGCHAIN.md](REPONSE_LANGCHAIN.md)

Réponses spécifiques:
- Dois-je utiliser un nœud Ollama?
- Quelle URL intégrer?
- Ai-je besoin d'une clé API?

### Exemples de configuration
→ [n8n-config-example.md](n8n-config-example.md)

Exemples détaillés:
- Configuration HTTP Request
- Headers et Body
- Workflow complet à importer
- Variations et cas d'usage

### Guide d'intégration
→ [GUIDE_N8N_INTEGRATION.md](GUIDE_N8N_INTEGRATION.md)

Guide complet d'intégration avec:
- Cas d'usage
- Workflows exemples
- Monitoring
- Best practices

## 🎨 Workflows n8n

### Dossier workflows
→ [n8n-workflows/](n8n-workflows/)

### Liste des workflows

| Fichier | Description | Recommandé |
|---------|-------------|------------|
| `n8n-workflow-gemini-ready.json` | Test HTTP Request (Ollama + OpenAI) | Pour tester |
| `n8n-workflow-langchain-simple-ready.json` | LangChain simple | ⭐ Pour débuter |
| `n8n-workflow-langchain.json` | LangChain basique | Question simple |
| `n8n-workflow-langchain-advanced.json` | LangChain avancé | Exemples multiples |
| `n8n-workflow-langchain-conversation.json` | LangChain avec mémoire | Conversation |

### Comment importer

1. Ouvrir n8n
2. Workflows → Import from File
3. Sélectionner le fichier JSON
4. Configurer les credentials si nécessaire
5. Exécuter

## 📊 Rapport du projet

### Rapport final complet
→ [RAPPORT_FINAL.md](RAPPORT_FINAL.md)

Contient:
- Objectif du projet
- Ce qui a été fait (9 sections)
- Ce qui n'a pas été fait (bundling)
- État actuel du serveur
- Ce qu'il reste à faire
- Organisation des fichiers
- Statistiques du projet
- Checklist finale
- Conclusion

## 🔗 Liens rapides

### Serveur

**Démarrage:**
```bash
node server-api-key.js
```

**URLs:**
- Documentation Swagger: http://localhost:25808/docs
- OpenAPI Spec: http://localhost:25808/openapi.json
- Health Check: http://localhost:25808/health
- Stats: http://localhost:25808/api/stats

### Endpoints

**Ollama compatible:**
- `POST /api/chat`
- `POST /api/generate`

**OpenAI compatible:**
- `POST /v1/chat/completions`
- `GET /v1/models`

**Monitoring:**
- `GET /health`
- `GET /api/stats`
- `GET /api/version`

## 📋 Par type de besoin

### Je veux démarrer en 2 minutes
1. [QUICK_ANSWER.md](QUICK_ANSWER.md)
2. Créer credentials dans n8n
3. Importer un workflow
4. Exécuter

### Je veux comprendre tout
1. [INTEGRATION_N8N_COMPLETE.md](INTEGRATION_N8N_COMPLETE.md)
2. [RAPPORT_FINAL.md](RAPPORT_FINAL.md)
3. [N8N_LANGCHAIN_GUIDE_COMPLET.md](N8N_LANGCHAIN_GUIDE_COMPLET.md)

### J'ai un problème
1. [N8N_CONNECTION_FIX.md](N8N_CONNECTION_FIX.md) - Erreur de connexion
2. [REPONSES_QUESTIONS.md](REPONSES_QUESTIONS.md) - Questions générales
3. [REPONSE_LANGCHAIN.md](REPONSE_LANGCHAIN.md) - Questions LangChain

### Je veux des exemples
1. [n8n-workflows/](n8n-workflows/) - Workflows prêts
2. [n8n-config-example.md](n8n-config-example.md) - Exemples de config
3. [TEST_ENDPOINTS.md](TEST_ENDPOINTS.md) - Exemples de tests

## 🎯 Checklist d'utilisation

### Première utilisation

- [ ] Lire [QUICK_ANSWER.md](QUICK_ANSWER.md)
- [ ] Démarrer le serveur: `node server-api-key.js`
- [ ] Vérifier: `curl http://127.0.0.1:25808/health`
- [ ] Créer credentials dans n8n
- [ ] Importer un workflow
- [ ] Exécuter et vérifier

### Pour HTTP Request

- [ ] Lire [N8N_QUICK_SETUP.md](N8N_QUICK_SETUP.md)
- [ ] URL: `http://127.0.0.1:25808/api/chat`
- [ ] Importer `n8n-workflow-gemini-ready.json`
- [ ] Tester

### Pour LangChain

- [ ] Lire [N8N_LANGCHAIN_QUICK_START.md](N8N_LANGCHAIN_QUICK_START.md)
- [ ] Créer credentials OpenAI API
- [ ] Base URL: `http://127.0.0.1:25808/v1`
- [ ] API Key: `dummy-key`
- [ ] Importer `n8n-workflow-langchain-simple-ready.json`
- [ ] Configurer le nœud "Gemini Chat Model"
- [ ] Tester

## 📚 Structure complète

```
gemini-api-key-rotative-docs/
├── README.md                           # Index principal
├── INDEX.md                            # Ce fichier
├── RAPPORT_FINAL.md                    # Rapport complet
│
├── Démarrage rapide/
│   ├── QUICK_ANSWER.md                 # 2 min
│   ├── N8N_QUICK_SETUP.md              # 5 min - HTTP Request
│   └── N8N_LANGCHAIN_QUICK_START.md    # 5 min - LangChain
│
├── Documentation complète/
│   ├── INTEGRATION_N8N_COMPLETE.md     # Vue d'ensemble
│   ├── RESUME_FINAL.md                 # Résumé
│   └── INDEX_N8N_INTEGRATION.md        # Index n8n
│
├── Guides spécifiques/
│   ├── N8N_CONNECTION_FIX.md           # Fix ECONNREFUSED
│   ├── N8N_CREDENTIALS_SETUP.md        # Credentials
│   ├── N8N_LLM_CHAIN_SETUP.md          # LLM Chain
│   ├── N8N_LANGCHAIN_GUIDE_COMPLET.md  # Guide complet
│   ├── N8N_LANGCHAIN_VISUAL_GUIDE.md   # Guide visuel
│   └── TEST_ENDPOINTS.md               # Tests
│
├── Réponses/
│   ├── REPONSES_QUESTIONS.md           # Questions générales
│   ├── REPONSE_LANGCHAIN.md            # Questions LangChain
│   ├── n8n-config-example.md           # Exemples config
│   └── GUIDE_N8N_INTEGRATION.md        # Guide intégration
│
└── Workflows/
    └── n8n-workflows/
        ├── n8n-workflow-gemini-ready.json
        ├── n8n-workflow-langchain-simple-ready.json
        ├── n8n-workflow-langchain.json
        ├── n8n-workflow-langchain-advanced.json
        └── n8n-workflow-langchain-conversation.json
```

## ✅ État du projet

**Status:** ✅ PRODUCTION READY

**Serveur:** http://0.0.0.0:25808  
**Clés API:** 27/27  
**Capacité:** 135 req/min  
**Provider:** gemini_api_key_rotative

---

**Créé le:** 26 février 2026  
**Version:** 1.9.0  
**Auteur:** AionUi Team
