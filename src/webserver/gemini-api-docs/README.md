# 📚 Documentation Gemini CLI API - AionUI

Bienvenue dans la documentation complète de l'API Gemini CLI pour AionUI !

> **📖 INDEX COMPLET**: Consultez [INDEX.md](./INDEX.md) pour une vue d'ensemble organisée de toute la documentation.

## 🚀 Démarrage Ultra-Rapide

```bash
# 1. Diagnostic
npm run diagnose:api

# 2. Démarrer
npm run webui:remote

# 3. Tester
npm run test:api
```

**👉 [Guide de Démarrage Rapide](./QUICK_START_FR.md)**

## 🧭 Navigation Rapide

**Nouveau ?** Consultez **[NAVIGATION_RAPIDE.md](./NAVIGATION_RAPIDE.md)** pour trouver rapidement ce que vous cherchez !

## 🎯 Vue d'ensemble

Cette documentation couvre l'implémentation complète d'endpoints API REST pour exposer Gemini CLI comme un service web compatible Ollama, utilisable dans n8n et déployable sur Netlify/Vercel.

## 📋 Table des Matières

### 🚀 Démarrage

1. **[QUICK_START_FR.md](./QUICK_START_FR.md)** ⚡
   - Démarrage ultra-rapide en 3 commandes
   - Configuration minimale
   - Premier test
   - Parfait pour commencer rapidement

2. **[GEMINI_API_QUICKSTART_FR.md](./GEMINI_API_QUICKSTART_FR.md)** 🏃
   - Guide de démarrage rapide détaillé
   - Installation locale
   - Déploiement Netlify/Vercel
   - Configuration n8n

### 📖 Documentation Complète

3. **[README_GEMINI_API_FR.md](./README_GEMINI_API_FR.md)** 📘
   - README principal avec vue d'ensemble
   - Fonctionnalités
   - Architecture
   - Exemples de code (Python, JavaScript, cURL)

4. **[GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md)** 📕
   - Documentation technique complète
   - Tous les endpoints détaillés
   - Configuration avancée
   - Intégration n8n complète
   - Dépannage approfondi

### 🔧 Guides Spécifiques

5. **[UTILISATION_AVEC_COMPTE_GOOGLE.md](./UTILISATION_AVEC_COMPTE_GOOGLE.md)** 🔐
   - Guide pour votre compte Google (ohada.finance@gmail.com)
   - Configuration OAuth
   - Utilisation locale et réseau
   - Déploiement sur Internet

6. **[NPM_COMMANDS.md](./NPM_COMMANDS.md)** 💻
   - Liste complète des commandes npm
   - Variables d'environnement
   - Workflows recommandés
   - Scripts personnalisés

### 📝 Référence Technique

7. **[GEMINI_API_IMPLEMENTATION.md](./GEMINI_API_IMPLEMENTATION.md)** 🛠️
   - Détails d'implémentation
   - Structure des fichiers
   - Architecture technique
   - Notes pour les développeurs

8. **[GEMINI_API_CHANGELOG.md](./GEMINI_API_CHANGELOG.md)** 📅
   - Historique des changements
   - Nouvelles fonctionnalités
   - Corrections de bugs
   - Roadmap

## 🎓 Par où commencer ?

### Vous êtes pressé ?
👉 **[QUICK_START_FR.md](./QUICK_START_FR.md)** - 3 commandes et c'est parti !

### Vous voulez comprendre ?
👉 **[README_GEMINI_API_FR.md](./README_GEMINI_API_FR.md)** - Vue d'ensemble complète

### Vous voulez tout savoir ?
👉 **[GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md)** - Documentation exhaustive

### Vous utilisez votre compte Google ?
👉 **[UTILISATION_AVEC_COMPTE_GOOGLE.md](./UTILISATION_AVEC_COMPTE_GOOGLE.md)** - Guide personnalisé

### Vous développez ?
👉 **[GEMINI_API_IMPLEMENTATION.md](./GEMINI_API_IMPLEMENTATION.md)** - Détails techniques

## 🔗 Liens Rapides

### Endpoints API

| Endpoint | Description | Documentation |
|----------|-------------|---------------|
| `POST /api/chat` | Chat avec historique | [Voir détails](./GEMINI_API_ENDPOINT.md#post-apichat) |
| `POST /api/generate` | Génération simple | [Voir détails](./GEMINI_API_ENDPOINT.md#post-apigenerate) |
| `GET /api/tags` | Liste des modèles | [Voir détails](./GEMINI_API_ENDPOINT.md#get-apitags) |
| `GET /api/version` | Version de l'API | [Voir détails](./GEMINI_API_ENDPOINT.md#get-apiversion) |

### Commandes Essentielles

```bash
# Diagnostic
npm run diagnose:api

# Démarrer le serveur
npm run webui:remote

# Tester l'API
npm run test:api
```

### Configuration

```bash
# Variables d'environnement
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash-exp
AIONUI_PORT=25808
```

## 📊 Structure de la Documentation

```
resources/gemini-api-docs/
├── README.md                              # Ce fichier
├── QUICK_START_FR.md                      # Démarrage ultra-rapide
├── GEMINI_API_QUICKSTART_FR.md            # Guide de démarrage
├── README_GEMINI_API_FR.md                # README principal
├── GEMINI_API_ENDPOINT.md                 # Documentation complète
├── UTILISATION_AVEC_COMPTE_GOOGLE.md      # Guide compte Google
├── NPM_COMMANDS.md                        # Commandes npm
├── GEMINI_API_IMPLEMENTATION.md           # Détails techniques
└── GEMINI_API_CHANGELOG.md                # Changelog
```

## 🎯 Cas d'Usage

### 1. Automatisation n8n
- [Configuration n8n](./GEMINI_API_ENDPOINT.md#utilisation-avec-n8n)
- [Exemples de workflows](./GEMINI_API_ENDPOINT.md#exemple-de-workflow-n8n)

### 2. API Backend
- [Déploiement local](./GEMINI_API_QUICKSTART_FR.md#installation-rapide-local)
- [Déploiement Netlify](./GEMINI_API_QUICKSTART_FR.md#déploiement-netlify)
- [Déploiement Vercel](./GEMINI_API_QUICKSTART_FR.md#déploiement-vercel)

### 3. Intégration Application
- [Exemples Python](./README_GEMINI_API_FR.md#python)
- [Exemples JavaScript](./README_GEMINI_API_FR.md#javascript)
- [Exemples cURL](./README_GEMINI_API_FR.md#curl)

## 🔐 Sécurité

- **Authentification** : JWT tokens + Google OAuth
- **Rate Limiting** : 100 requêtes / 15 minutes
- **CSRF Protection** : Activée sur tous les endpoints POST
- **CORS** : Configuré pour développement et production

Voir [Configuration Sécurité](./GEMINI_API_ENDPOINT.md#sécurité) pour plus de détails.

## 🐛 Dépannage

### Problèmes Courants

1. **"Google OAuth authentication not configured"**
   - Solution : [Guide OAuth](./UTILISATION_AVEC_COMPTE_GOOGLE.md#votre-compte-google)

2. **"Unauthorized"**
   - Solution : [Obtenir un token](./UTILISATION_AVEC_COMPTE_GOOGLE.md#obtenir-votre-token-jwt)

3. **"Port already in use"**
   - Solution : [Changer le port](./GEMINI_API_ENDPOINT.md#erreur--port-already-in-use)

Voir [Dépannage Complet](./GEMINI_API_ENDPOINT.md#dépannage) pour plus de solutions.

## 📚 Ressources Externes

- [Documentation Gemini CLI](https://geminicli.com/docs)
- [Documentation n8n](https://docs.n8n.io/)
- [Documentation Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [AionUI GitHub](https://github.com/iOfficeAI/AionUi)
- [Discord Community](https://discord.gg/aionui)

## 💬 Support

### Besoin d'aide ?

1. **Consultez la documentation** appropriée ci-dessus
2. **Utilisez le diagnostic** : `npm run diagnose:api`
3. **Testez l'API** : `npm run test:api`
4. **Ouvrez une issue** : [GitHub Issues](https://github.com/iOfficeAI/AionUi/issues)
5. **Rejoignez Discord** : [Discord Community](https://discord.gg/aionui)

### Contribuer

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](../../CONTRIBUTING.md).

## 📄 Licence

Apache-2.0 - Voir [LICENSE](../../LICENSE)

## 🎉 Remerciements

Merci à la communauté AionUI et aux contributeurs de Gemini CLI !

---

**Version** : 1.9.0  
**Date** : 26 février 2026  
**Auteur** : Équipe AionUI

**Bon développement ! 🚀**
