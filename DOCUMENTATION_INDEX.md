# 📚 Index de la Documentation - AionUI Multi-Provider

## 🎯 Vue d'ensemble

Ce projet expose **3 providers IA** (Gemini CLI, Gemini API Key, Kiro CLI) via des endpoints REST compatibles OpenAI pour intégration dans n8n, LangChain, et autres outils.

## 🚀 Démarrage rapide

### Pour commencer immédiatement
1. [QUICK_START_KIRO_CLI.md](./QUICK_START_KIRO_CLI.md) - Installation et premiers tests en 5 minutes
2. [DEMARRAGE_IMMEDIAT.md](./DEMARRAGE_IMMEDIAT.md) - Guide de démarrage général
3. [COMMANDES_ESSENTIELLES.md](./COMMANDES_ESSENTIELLES.md) - Commandes principales

## 📖 Documentation par provider

### Kiro CLI (Nouveau ⭐)

#### Documentation principale
- [README](./src/webserver/kiro-cli-docs/README.md) - Vue d'ensemble complète
- [INDEX](./src/webserver/kiro-cli-docs/INDEX.md) - Navigation dans la doc Kiro CLI
- [API_REFERENCE](./src/webserver/kiro-cli-docs/API_REFERENCE.md) - Référence API détaillée
- [INTEGRATION_N8N](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md) - Guide d'intégration n8n

#### Guides rapides
- [QUICK_START_KIRO_CLI](./QUICK_START_KIRO_CLI.md) - Démarrage en 5 minutes
- [KIRO_CLI_INTEGRATION_COMPLETE](./KIRO_CLI_INTEGRATION_COMPLETE.md) - Rapport d'intégration complet

### Gemini CLI

#### Documentation principale
- [README](./src/webserver/gemini-api-docs/README.md) - Vue d'ensemble
- [INDEX](./src/webserver/gemini-api-docs/INDEX.md) - Navigation
- [API_REFERENCE](./src/webserver/gemini-api-docs/API_REFERENCE.md) - Référence API

#### Guides d'intégration
- [INTEGRATION_N8N](./src/webserver/gemini-api-docs/INTEGRATION_N8N.md) - Guide n8n
- [GUIDE_N8N_INTEGRATION](./GUIDE_N8N_INTEGRATION.md) - Guide complet n8n
- [N8N_QUICK_SETUP](./N8N_QUICK_SETUP.md) - Configuration rapide

### Gemini API Key (Rotative)

#### Documentation principale
- [README](./src/webserver/gemini-api-key-rotative-docs/README.md) - Vue d'ensemble
- [INDEX](./src/webserver/gemini-api-key-rotative-docs/INDEX.md) - Navigation
- [RAPPORT_FINAL](./src/webserver/gemini-api-key-rotative-docs/RAPPORT_FINAL.md) - Rapport complet

#### Guides d'intégration
- [INDEX_N8N_INTEGRATION](./src/webserver/gemini-api-key-rotative-docs/INDEX_N8N_INTEGRATION.md) - Guide n8n
- [INTEGRATION_N8N_COMPLETE](./INTEGRATION_N8N_COMPLETE.md) - Intégration complète

## 🔧 Documentation technique

### Configuration et déploiement
- [DEPLOYMENT_GUIDE](./DEPLOYMENT_GUIDE.md) - Guide de déploiement complet
- [README_MULTI_PROVIDER_KIRO](./README_MULTI_PROVIDER_KIRO.md) - README principal multi-provider
- [MULTI_PROVIDER_README](./MULTI_PROVIDER_README.md) - Documentation multi-provider
- [MULTI_PROVIDER_API](./MULTI_PROVIDER_API.md) - API multi-provider

### Guides de développement
- [CODE_STYLE](./CODE_STYLE.md) - Guide de style de code
- [IMPLEMENTATION_COMPLETE](./IMPLEMENTATION_COMPLETE.md) - Détails d'implémentation
- [SYNTHESE_IMPLEMENTATION_FR](./SYNTHESE_IMPLEMENTATION_FR.md) - Synthèse en français

## 🔌 Intégration n8n

### Guides généraux
- [N8N_LANGCHAIN_GUIDE_COMPLET](./N8N_LANGCHAIN_GUIDE_COMPLET.md) - Guide LangChain complet
- [N8N_LANGCHAIN_VISUAL_GUIDE](./N8N_LANGCHAIN_VISUAL_GUIDE.md) - Guide visuel
- [N8N_CREDENTIALS_SETUP](./N8N_CREDENTIALS_SETUP.md) - Configuration des credentials
- [N8N_CONNECTION_FIX](./N8N_CONNECTION_FIX.md) - Résolution de problèmes de connexion

### Guides spécifiques
- [N8N_LLM_CHAIN_SETUP](./N8N_LLM_CHAIN_SETUP.md) - Configuration LLM Chain
- [N8N_HTTP_REQUEST_SETUP](./N8N_HTTP_REQUEST_SETUP.md) - Configuration HTTP Request

### Workflows exemples
- [n8n-workflow-gemini-ready.json](./n8n-workflow-gemini-ready.json)
- [n8n-workflow-langchain.json](./n8n-workflow-langchain.json)
- [n8n-workflow-langchain-conversation.json](./n8n-workflow-langchain-conversation.json)
- [n8n-workflow-langchain-advanced.json](./n8n-workflow-langchain-advanced.json)
- [n8n-workflow-langchain-simple-ready.json](./n8n-workflow-langchain-simple-ready.json)
- [examples/n8n-workflow-example.json](./examples/n8n-workflow-example.json)

## 🧪 Tests et diagnostic

### Scripts de test
- `npm run test:kiro-cli` - Tester Kiro CLI
- `npm run test:multi-provider` - Tester tous les providers
- `npm run test:api` - Tester l'API Gemini
- `npm run diagnose:api` - Diagnostiquer l'API

### Documentation de test
- [TEST_ENDPOINTS](./TEST_ENDPOINTS.md) - Tests des endpoints
- [scripts/test-kiro-cli.js](./scripts/test-kiro-cli.js) - Script de test Kiro CLI
- [scripts/test-multi-provider.js](./scripts/test-multi-provider.js) - Script de test multi-provider

## 📋 Références rapides

### Réponses aux questions
- [QUICK_ANSWER](./QUICK_ANSWER.md) - Réponses rapides
- [REPONSES_QUESTIONS](./REPONSES_QUESTIONS.md) - FAQ
- [REPONSE_LANGCHAIN](./REPONSE_LANGCHAIN.md) - Questions LangChain

### Résumés
- [RESUME_FINAL](./RESUME_FINAL.md) - Résumé final du projet
- [PROJET_FINAL_RESUME](./PROJET_FINAL_RESUME.md) - Résumé du projet final
- [PROJET_TERMINE](./PROJET_TERMINE.md) - Projet terminé

## 🗂️ Organisation de la documentation

### Structure des dossiers

```
.
├── src/webserver/
│   ├── kiro-cli-docs/          # Documentation Kiro CLI
│   ├── gemini-api-docs/         # Documentation Gemini CLI
│   └── gemini-api-key-rotative-docs/  # Documentation Gemini API Key
│
├── scripts/                     # Scripts de test et build
│   ├── test-kiro-cli.js
│   ├── test-multi-provider.js
│   └── ...
│
├── examples/                    # Exemples de workflows
│   └── n8n-workflow-example.json
│
└── *.md                        # Documentation racine
```

## 🎯 Par cas d'usage

### Je veux démarrer rapidement
1. [QUICK_START_KIRO_CLI.md](./QUICK_START_KIRO_CLI.md)
2. [DEMARRAGE_IMMEDIAT.md](./DEMARRAGE_IMMEDIAT.md)

### Je veux intégrer avec n8n
1. [N8N_QUICK_SETUP.md](./N8N_QUICK_SETUP.md)
2. [INTEGRATION_N8N_COMPLETE.md](./INTEGRATION_N8N_COMPLETE.md)
3. Workflows exemples dans `/examples/`

### Je veux utiliser Kiro CLI
1. [QUICK_START_KIRO_CLI.md](./QUICK_START_KIRO_CLI.md)
2. [src/webserver/kiro-cli-docs/README.md](./src/webserver/kiro-cli-docs/README.md)
3. [src/webserver/kiro-cli-docs/API_REFERENCE.md](./src/webserver/kiro-cli-docs/API_REFERENCE.md)

### Je veux utiliser Gemini CLI
1. [src/webserver/gemini-api-docs/README.md](./src/webserver/gemini-api-docs/README.md)
2. [GUIDE_N8N_INTEGRATION.md](./GUIDE_N8N_INTEGRATION.md)

### Je veux utiliser Gemini API Key
1. [src/webserver/gemini-api-key-rotative-docs/README.md](./src/webserver/gemini-api-key-rotative-docs/README.md)
2. [src/webserver/gemini-api-key-rotative-docs/INDEX_N8N_INTEGRATION.md](./src/webserver/gemini-api-key-rotative-docs/INDEX_N8N_INTEGRATION.md)

### Je veux déployer en production
1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. [README_MULTI_PROVIDER_KIRO.md](./README_MULTI_PROVIDER_KIRO.md)

### Je veux comprendre l'architecture
1. [KIRO_CLI_INTEGRATION_COMPLETE.md](./KIRO_CLI_INTEGRATION_COMPLETE.md)
2. [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)
3. [MULTI_PROVIDER_API.md](./MULTI_PROVIDER_API.md)

### Je veux résoudre un problème
1. [TEST_ENDPOINTS.md](./TEST_ENDPOINTS.md)
2. [N8N_CONNECTION_FIX.md](./N8N_CONNECTION_FIX.md)
3. [REPONSES_QUESTIONS.md](./REPONSES_QUESTIONS.md)

## 📊 Comparaison des providers

| Feature | Gemini CLI | Gemini API Key | Kiro CLI |
|---------|------------|----------------|----------|
| Auth | Google OAuth | API Keys | Session CLI |
| Rate Limit | Aucun | 5/min, 250k/jour | Aucun |
| Modèles | Gemini 2.5, 1.5 | Gemini 2.5, 1.5 | Claude, GPT-4 |
| Streaming | ✅ | ✅ | ✅ |
| Code Gen | ✅ | ✅ | ✅ |
| Code Analysis | ❌ | ❌ | ✅ |
| Refactoring | ❌ | ❌ | ✅ |
| MCP Support | ❌ | ❌ | ✅ |
| Context Aware | ✅ | ❌ | ✅ |

## 🔗 Liens externes

### Documentation officielle
- [Kiro CLI](https://kiro.dev/docs/cli/)
- [Gemini API](https://ai.google.dev/)
- [n8n](https://docs.n8n.io/)
- [LangChain](https://js.langchain.com/)

### Repositories
- [AionUI GitHub](https://github.com/iOfficeAI/AionUi)
- [Kiro GitHub](https://github.com/kirodotdev/Kiro)

## 🆘 Support

### Obtenir de l'aide
1. Consulter la documentation appropriée ci-dessus
2. Vérifier les [REPONSES_QUESTIONS.md](./REPONSES_QUESTIONS.md)
3. Tester avec les scripts fournis
4. Créer une issue GitHub

### Contribuer
1. Lire [CODE_STYLE.md](./CODE_STYLE.md)
2. Consulter l'architecture dans [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)
3. Proposer des améliorations

## 📝 Notes

- Tous les fichiers `.md` à la racine sont en français
- Les fichiers dans `src/webserver/*/docs/` sont organisés par provider
- Les workflows n8n sont dans `/examples/` et à la racine
- Les scripts de test sont dans `/scripts/`

## 🔄 Mises à jour

Ce fichier index est maintenu à jour avec chaque nouvelle documentation ajoutée.

Dernière mise à jour : 2024

---

**Navigation rapide**:
- [Démarrage rapide](#-démarrage-rapide)
- [Documentation par provider](#-documentation-par-provider)
- [Intégration n8n](#-intégration-n8n)
- [Par cas d'usage](#-par-cas-dusage)
- [Support](#-support)
