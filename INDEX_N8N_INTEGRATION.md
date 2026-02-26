# 📚 Index - Intégration n8n avec Gemini API

## 🎯 Réponses rapides

**Fichier:** [QUICK_ANSWER.md](QUICK_ANSWER.md)

- ✅ URL pour voir les modèles: `http://127.0.0.1:25808/v1/models`
- ✅ API Key pour n8n: `dummy-key`
- ✅ Base URL: `http://127.0.0.1:25808/v1`
- ✅ Fix erreur ECONNREFUSED: Utiliser `127.0.0.1` au lieu de `localhost`

## 📖 Documentation complète

### 1. Résumé complet
**Fichier:** [INTEGRATION_N8N_COMPLETE.md](INTEGRATION_N8N_COMPLETE.md)

Vue d'ensemble complète de l'intégration avec:
- Problèmes résolus
- Configuration serveur
- 2 méthodes d'intégration n8n
- Tests de validation
- Exemples de workflows
- Monitoring et stats

### 2. Réponses détaillées aux questions
**Fichier:** [REPONSES_QUESTIONS.md](REPONSES_QUESTIONS.md)

Réponses détaillées aux 2 questions:
1. Intégration LLM Chain (URL, API Key, modèles)
2. Fix erreur workflow (ECONNREFUSED)

### 3. Configuration LLM Chain
**Fichier:** [N8N_LLM_CHAIN_SETUP.md](N8N_LLM_CHAIN_SETUP.md)

Guide complet pour utiliser avec LangChain:
- Configuration OpenAI Chat Model
- Endpoints OpenAI compatibles
- Voir les modèles disponibles
- Cas d'usage avancés (RAG, Agents, Chains)

### 4. Fix erreur de connexion
**Fichier:** [N8N_CONNECTION_FIX.md](N8N_CONNECTION_FIX.md)

Solution détaillée pour l'erreur ECONNREFUSED:
- Cause du problème (IPv6 vs IPv4)
- 3 solutions possibles
- Workflow corrigé
- Tests de connexion
- Checklist de dépannage

### 5. Configuration credentials
**Fichier:** [N8N_CREDENTIALS_SETUP.md](N8N_CREDENTIALS_SETUP.md)

Guide pas à pas pour configurer n8n:
- Créer credentials OpenAI API
- Tester la connexion
- Utiliser dans un workflow
- Exemples de workflows (RAG, Agents, Chains)
- Dépannage

### 6. Tests des endpoints
**Fichier:** [TEST_ENDPOINTS.md](TEST_ENDPOINTS.md)

Tests complets de tous les endpoints:
- Health check
- Liste des modèles
- Chat OpenAI compatible
- Chat Ollama compatible
- Stats de rotation
- Exemples de requêtes

## 🚀 Guides de démarrage rapide

### 7. Setup rapide n8n
**Fichier:** [N8N_QUICK_SETUP.md](N8N_QUICK_SETUP.md)

Configuration ultra-rapide copier-coller:
- Configuration HTTP Request
- Body JSON
- Exemples de prompts
- Workflow à importer

### 8. Exemples de configuration
**Fichier:** [n8n-config-example.md](n8n-config-example.md)

Exemples détaillés de configuration:
- Paramètres HTTP Request
- Headers
- Body JSON
- Workflow complet à importer
- Variations (dynamique, generate, conversation)
- Cas d'usage avancés

### 9. Guide d'intégration complet
**Fichier:** [GUIDE_N8N_INTEGRATION.md](GUIDE_N8N_INTEGRATION.md)

Guide complet d'intégration avec:
- Cas d'usage
- Workflows exemples
- Monitoring
- Best practices

## 🎨 Workflows prêts à l'emploi

### 10. Workflow de test complet
**Fichier:** [n8n-workflow-gemini-ready.json](n8n-workflow-gemini-ready.json)

Workflow n8n prêt à importer qui teste:
- HTTP Request (Ollama style)
- HTTP Request (OpenAI style)
- Extraction des réponses
- Merge des résultats

**Importer dans n8n:**
1. Workflows → Import from File
2. Sélectionner `n8n-workflow-gemini-ready.json`
3. Exécuter

### 11. Exemple de workflow
**Fichier:** [examples/n8n-workflow-example.json](examples/n8n-workflow-example.json)

Autre exemple de workflow avec différents cas d'usage.

## 🔧 Configuration serveur

### 12. Serveur API Key
**Fichier:** [server-api-key.js](server-api-key.js)

Serveur principal avec:
- Rotation automatique des 27 clés API
- Endpoints Ollama compatibles
- Endpoints OpenAI compatibles
- Monitoring et stats

### 13. Documentation Swagger
**Fichier:** [swagger-api-key.js](swagger-api-key.js)

Documentation interactive accessible à:
- http://localhost:25808/docs

## 📊 Monitoring et tests

### 14. Scripts de test
**Fichier:** [scripts/test-multi-provider.js](scripts/test-multi-provider.js)

Scripts pour tester le serveur.

### 15. Diagnostics
**Fichier:** [scripts/diagnose-gemini-api.js](scripts/diagnose-gemini-api.js)

Scripts de diagnostic.

## 🎯 Navigation rapide

### Par besoin:

**Je veux démarrer rapidement:**
→ [QUICK_ANSWER.md](QUICK_ANSWER.md)

**Je veux comprendre tout:**
→ [INTEGRATION_N8N_COMPLETE.md](INTEGRATION_N8N_COMPLETE.md)

**J'ai une erreur de connexion:**
→ [N8N_CONNECTION_FIX.md](N8N_CONNECTION_FIX.md)

**Je veux utiliser LangChain:**
→ [N8N_LLM_CHAIN_SETUP.md](N8N_LLM_CHAIN_SETUP.md)

**Je veux configurer les credentials:**
→ [N8N_CREDENTIALS_SETUP.md](N8N_CREDENTIALS_SETUP.md)

**Je veux tester les endpoints:**
→ [TEST_ENDPOINTS.md](TEST_ENDPOINTS.md)

**Je veux un workflow prêt:**
→ [n8n-workflow-gemini-ready.json](n8n-workflow-gemini-ready.json)

## ✅ Checklist de démarrage

- [ ] Lire [QUICK_ANSWER.md](QUICK_ANSWER.md)
- [ ] Vérifier le serveur: `curl http://127.0.0.1:25808/health`
- [ ] Voir les modèles: `curl http://127.0.0.1:25808/v1/models`
- [ ] Créer credentials dans n8n (voir [N8N_CREDENTIALS_SETUP.md](N8N_CREDENTIALS_SETUP.md))
- [ ] Importer workflow de test: [n8n-workflow-gemini-ready.json](n8n-workflow-gemini-ready.json)
- [ ] Exécuter le workflow
- [ ] Vérifier la réponse contient `provider: gemini_api_key_rotative`

## 🎉 Résumé

**Serveur:** ✅ http://0.0.0.0:25808  
**Clés API:** ✅ 27/27  
**Capacité:** ✅ 135 req/min  
**Provider:** ✅ gemini_api_key_rotative  
**Status:** ✅ OPERATIONAL

**Endpoints disponibles:**
- `/api/chat` - Ollama compatible
- `/api/generate` - Génération simple
- `/v1/chat/completions` - OpenAI compatible
- `/v1/models` - Liste des modèles
- `/api/stats` - Statistiques
- `/health` - Health check

**Modèles disponibles:**
- `gemini-2.5-flash` ⭐ (recommandé)
- `gemini-1.5-flash`
- `gemini-1.5-pro`

---

**Documentation créée le:** 26 février 2026  
**Version serveur:** 1.9.0  
**Compatible avec:** n8n, LangChain, OpenAI, Ollama
