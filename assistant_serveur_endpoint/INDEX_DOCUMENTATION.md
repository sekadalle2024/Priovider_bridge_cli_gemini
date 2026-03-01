# 📚 Index de la Documentation - Serveur des Assistants

## 🎯 Documents essentiels (à lire en premier)

### 1. Démarrage rapide
- **[00_LIRE_EN_PREMIER.md](00_LIRE_EN_PREMIER.md)** - Point d'entrée principal
- **[DEMARRAGE_SIMPLE.md](DEMARRAGE_SIMPLE.md)** - Guide de démarrage simplifié
- **[README.md](README.md)** - Documentation complète du serveur

### 2. Installation et configuration
- **[INSTALLATION_GEMINI_CLI_COMPLETE.md](../INSTALLATION_GEMINI_CLI_COMPLETE.md)** - Installation de Gemini CLI (obligatoire)
- **[GEMINI_CLI_OBLIGATOIRE.md](../GEMINI_CLI_OBLIGATOIRE.md)** - Pourquoi Gemini CLI est nécessaire
- **[CONFIGURATION_FINALE_ASSISTANTS.md](../CONFIGURATION_FINALE_ASSISTANTS.md)** - Configuration complète

### 3. Mode "auto" (nouveau!)
- **[MODE_AUTO_GEMINI.md](../MODE_AUTO_GEMINI.md)** - Documentation du mode auto
- **[MEMO_MODE_AUTO.md](MEMO_MODE_AUTO.md)** - Mémo rapide sur le mode auto
- **[TEST_MODE_AUTO_RESULTAT.md](../TEST_MODE_AUTO_RESULTAT.md)** - Résultats des tests

## 🔗 Intégration n8n

### Documentation n8n
- **[N8N_INTEGRATION_URL.md](N8N_INTEGRATION_URL.md)** - URL et configuration pour n8n
- **[N8N_QUICK_SETUP_ASSISTANTS.md](../N8N_QUICK_SETUP_ASSISTANTS.md)** - Configuration rapide
- **[N8N_ASSISTANTS_ENDPOINT.md](../N8N_ASSISTANTS_ENDPOINT.md)** - Guide complet d'intégration

### Workflows n8n prêts à l'emploi
- **[n8n-workflow-assistants-openapi.json](n8n-workflow-assistants-openapi.json)** - Workflow complet

## 📡 API et Endpoints

### Documentation API
- **[URLS_SERVEUR.md](URLS_SERVEUR.md)** - Liste de tous les endpoints
- **Swagger UI**: http://localhost:25810/api-docs

### Endpoints principaux
```
POST   /api/v1/chat/completions  - Chat avec les assistants
GET    /api/v1/models            - Liste des modèles
GET    /api/v1/assistants        - Liste des assistants
GET    /health                   - Health check
```

## 🤖 Assistants disponibles

### Liste des 13 assistants
1. **beautiful-mermaid** - Génération de diagrammes Mermaid
2. **cowork** - Assistant de collaboration
3. **data-analyst** - Analyse de données
4. **game-3d** - Développement de jeux 3D
5. **human-3-coach** - Coaching personnel
6. **moltbook** - Gestion de livres
7. **openclaw-setup** - Configuration OpenClaw
8. **pdf-to-ppt** - Conversion PDF vers PowerPoint
9. **planning-with-files** - Planification avec fichiers
10. **pptx-generator** - Génération de présentations
11. **social-job-publisher** - Publication d'offres d'emploi
12. **story-roleplay** - Jeu de rôle narratif
13. **ui-ux-pro-max** - Design UI/UX professionnel

### Documentation des assistants
- **Dossier**: `../assistant/`
- **Template**: `../assistant/TEMPLATE_ASSISTANT.md`

## 🧪 Tests et validation

### Scripts de test
- **[test-mode-auto.js](../scripts/test-mode-auto.js)** - Test du mode auto
- **[test-assistant-complete.js](../scripts/test-assistant-complete.js)** - Test complet
- **[test-gemini-cli-installation.js](../scripts/test-gemini-cli-installation.js)** - Test Gemini CLI
- **[test-assistants-integration.js](../scripts/test-assistants-integration.js)** - Test d'intégration

### Résultats des tests
- **[TEST_MODE_AUTO_RESULTAT.md](../TEST_MODE_AUTO_RESULTAT.md)** - Résultats mode auto
- **[TEST_FINAL_ASSISTANTS.md](../TEST_FINAL_ASSISTANTS.md)** - Tests finaux

## 🔧 Configuration et déploiement

### Fichiers de configuration
- **[.env](../.env)** - Variables d'environnement
- **[.env.example](../.env.example)** - Exemple de configuration

### Scripts de démarrage
- **[server-assistants-standalone.js](../scripts/server-assistants-standalone.js)** - Serveur standalone
- **[start-assistants-server.js](../scripts/start-assistants-server.js)** - Script de démarrage

### Configuration recommandée
```env
# Port du serveur
ASSISTANT_PORT=25810

# Modèle par défaut (mode auto)
GEMINI_DEFAULT_MODEL=auto

# Chemin vers Gemini CLI
GEMINI_CLI_PATH=gemini

# Activer les assistants
ASSISTANTS_ENABLED=true
```

## 📊 Résumés et rapports

### Résumés d'installation
- **[RESUME_INSTALLATION_ASSISTANTS.md](../RESUME_INSTALLATION_ASSISTANTS.md)** - Résumé installation
- **[RESUME_FINAL_SERVEUR_ASSISTANTS.md](../RESUME_FINAL_SERVEUR_ASSISTANTS.md)** - Résumé final
- **[INSTALLATION_COMPLETE_ASSISTANTS.md](../INSTALLATION_COMPLETE_ASSISTANTS.md)** - Installation complète

### Rapports de configuration
- **[SERVEUR_PRET_MODE_AUTO.md](../SERVEUR_PRET_MODE_AUTO.md)** - Serveur prêt avec mode auto
- **[SERVEUR_ASSISTANTS_INFO.md](../SERVEUR_ASSISTANTS_INFO.md)** - Informations du serveur
- **[CORRECTION_SERVEUR_ASSISTANTS.md](../CORRECTION_SERVEUR_ASSISTANTS.md)** - Corrections appliquées

## 🎓 Guides et tutoriels

### Guides de démarrage
1. **Installation**: Lire `INSTALLATION_GEMINI_CLI_COMPLETE.md`
2. **Configuration**: Lire `CONFIGURATION_FINALE_ASSISTANTS.md`
3. **Démarrage**: Lire `DEMARRAGE_SIMPLE.md`
4. **Intégration n8n**: Lire `N8N_INTEGRATION_URL.md`

### Guides avancés
- **[GUIDE_ASSISTANTS_MICROSERVICES.md](GUIDE_ASSISTANTS_MICROSERVICES.md)** - Architecture microservices
- **[GUIDE_DEMARRAGE_RAPIDE_ASSISTANTS.md](GUIDE_DEMARRAGE_RAPIDE_ASSISTANTS.md)** - Démarrage rapide
- **[INTEGRATION_ASSISTANTS_COMPLETE.md](INTEGRATION_ASSISTANTS_COMPLETE.md)** - Intégration complète

## 🔍 Dépannage

### Problèmes courants

#### Le serveur ne démarre pas
1. Vérifier que Gemini CLI est installé: `gemini --version`
2. Vérifier l'authentification: `gemini auth status`
3. Vérifier le port 25810 est libre
4. Consulter: `CORRECTION_SERVEUR_ASSISTANTS.md`

#### Le mode "auto" ne fonctionne pas
1. Vérifier la configuration `.env`: `GEMINI_DEFAULT_MODEL=auto`
2. Tester Gemini CLI: `gemini -m auto -p "test"`
3. Consulter: `MODE_AUTO_GEMINI.md`

#### Erreur dans n8n
1. Vérifier l'URL: `http://localhost:25810/api/v1/chat/completions`
2. Vérifier que le serveur est démarré
3. Consulter: `N8N_INTEGRATION_URL.md`

## 📝 Notes importantes

### Mode "auto" (recommandé)
- ✅ Sélection automatique du meilleur modèle
- ✅ Mise à jour automatique vers Gemini 3
- ✅ Cohérent avec l'app Electron
- ✅ Configuration par défaut

### Gemini CLI (obligatoire)
- ✅ Version: 0.31.0 ou supérieure
- ✅ Authentification requise
- ✅ Compte: ohada.finance@gmail.com
- ✅ Installation: `npm install -g @google/gemini-cli`

### Port du serveur
- ✅ Port: 25810 (évite conflit avec provider-bridge:25809)
- ✅ Localhost uniquement par défaut
- ✅ Configurable via `ASSISTANT_PORT`

## 🚀 Commandes rapides

### Démarrer le serveur
```bash
node scripts/server-assistants-standalone.js
```

### Tester le serveur
```bash
curl http://localhost:25810/health
```

### Tester le mode auto
```bash
node scripts/test-mode-auto.js
```

### Ouvrir Swagger
```bash
start http://localhost:25810/api-docs
```

## 📚 Documentation externe

### Gemini CLI
- **Site officiel**: https://geminicli.com
- **Documentation**: https://geminicli.com/docs
- **Cheatsheet**: https://geminicli.com/docs/cheatsheet

### n8n
- **Site officiel**: https://n8n.io
- **Documentation**: https://docs.n8n.io
- **HTTP Request Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/

## 🎯 Checklist de démarrage

- [ ] Gemini CLI installé (`gemini --version`)
- [ ] Gemini CLI authentifié (`gemini auth status`)
- [ ] Configuration `.env` mise à jour
- [ ] Mode "auto" configuré (`GEMINI_DEFAULT_MODEL=auto`)
- [ ] Serveur démarré (`node scripts/server-assistants-standalone.js`)
- [ ] Health check OK (`curl http://localhost:25810/health`)
- [ ] Swagger accessible (`http://localhost:25810/api-docs`)
- [ ] Test mode auto réussi (`node scripts/test-mode-auto.js`)
- [ ] Intégration n8n configurée

## 📞 Support

### En cas de problème
1. Consulter la section "Dépannage" ci-dessus
2. Vérifier les logs du serveur
3. Consulter la documentation pertinente
4. Vérifier la configuration `.env`

### Logs du serveur
Le serveur affiche:
- ✅ Status Gemini CLI
- 📦 Nombre d'assistants découverts
- 🚀 URL du serveur
- 📚 URL de la documentation

## 🎉 Conclusion

Cette documentation couvre tous les aspects du serveur des assistants:
- Installation et configuration
- Mode "auto" (nouveau!)
- Intégration n8n
- API et endpoints
- Tests et validation
- Dépannage

**Le serveur est prêt à être utilisé avec le mode "auto"!**

---

**Date**: 1er mars 2026  
**Version**: 1.0.0  
**Port**: 25810  
**Modèle par défaut**: auto  
**Assistants**: 13 disponibles  
**Gemini CLI**: v0.31.0
