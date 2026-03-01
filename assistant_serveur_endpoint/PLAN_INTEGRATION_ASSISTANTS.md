# 📋 Plan d'Intégration des Assistants Microservices

## 🎯 Objectif
Intégrer le serveur des assistants comme microservices qui démarre automatiquement avec l'application Electron ou en mode WebUI.

## ✅ État Actuel
- ✅ Service AssistantService créé et fonctionnel
- ✅ Routes assistantRoutes configurées
- ✅ Swagger documentation prête
- ✅ Script de démarrage standalone disponible
- ✅ 12 assistants découverts automatiquement

## 🔧 Tâches à Réaliser

### 1. Créer le module de démarrage automatique
**Fichier**: `src/webserver/assistants-server.ts`
- Module qui démarre le serveur des assistants
- Gestion du port (défaut: 25810)
- Intégration avec les variables d'environnement
- Gestion propre de l'arrêt

### 2. Intégrer au démarrage de l'application
**Fichier**: `src/index.ts`
- Ajouter le démarrage du serveur des assistants dans `handleAppReady()`
- Vérifier la variable `ASSISTANTS_ENABLED` et `ASSISTANTS_AUTO_START`
- Démarrer en parallèle avec le serveur WebUI

### 3. Intégrer au serveur WebUI
**Fichier**: `src/webserver/index.ts`
- Ajouter le serveur des assistants au démarrage du WebUI
- Partager les mêmes configurations (CORS, auth, etc.)
- Afficher les URLs dans les logs de démarrage

### 4. Créer un endpoint unifié Gemini CLI
**Fichier**: `src/webserver/routes/geminiCliRoutes.ts`
- Endpoint par défaut: `/api/gemini/chat`
- Utilise le modèle par défaut `gemini-2.0-flash-exp`
- Documentation Swagger complète

### 5. Mettre à jour la configuration
**Fichier**: `.env`
- Ajouter les variables nécessaires
- Documenter chaque variable

### 6. Créer les scripts de test
**Fichier**: `scripts/test-assistants-integration.js`
- Tester le démarrage automatique
- Tester tous les endpoints
- Vérifier l'intégration avec Electron

### 7. Documentation
- Guide de démarrage rapide
- Exemples d'utilisation
- Intégration avec n8n/Vercel/Netlify

## 📊 Architecture Finale

```
┌─────────────────────────────────────────────────────────────┐
│                    Application AionUI                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Electron App    │         │   WebUI Server   │          │
│  │  (Desktop Mode)  │         │  (Port 25808)    │          │
│  └────────┬─────────┘         └────────┬─────────┘          │
│           │                            │                     │
│           └────────────┬───────────────┘                     │
│                        │                                     │
│           ┌────────────▼─────────────┐                       │
│           │  Assistants Server       │                       │
│           │  (Port 25810)            │                       │
│           │  - Gemini CLI Default    │                       │
│           │  - 12 Assistants         │                       │
│           └──────────────────────────┘                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Endpoints:
- GET  /                          → Page d'accueil avec liste
- GET  /api-docs                  → Documentation Swagger
- GET  /api/assistants            → Liste des assistants
- POST /api/assistant/:name       → Exécuter un assistant
- GET  /api/assistant/:name/info  → Info d'un assistant
- POST /api/gemini/chat           → Endpoint Gemini CLI par défaut
- GET  /health                    → Health check
```

## 🚀 Ordre d'Exécution

1. ✅ Créer le module de démarrage automatique
2. ✅ Intégrer au démarrage Electron
3. ✅ Intégrer au serveur WebUI
4. ✅ Créer l'endpoint Gemini CLI unifié
5. ✅ Mettre à jour .env
6. ✅ Créer les tests
7. ✅ Documenter

## 📝 Notes Importantes

- Le serveur des assistants doit démarrer même si Gemini CLI n'est pas disponible
- Les erreurs ne doivent pas bloquer le démarrage de l'application
- Logs clairs pour le debugging
- Support du hot-reload en développement
- Gestion propre de l'arrêt (SIGINT, SIGTERM)

## 🎯 Résultat Attendu

Une fois terminé, l'utilisateur pourra :
1. Démarrer l'application normalement (`npm start`)
2. Le serveur des assistants démarre automatiquement
3. Accéder à http://localhost:25810 pour voir les assistants
4. Utiliser tous les assistants via API REST
5. Intégrer facilement avec n8n, Vercel, Netlify
