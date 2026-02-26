# 🚀 Gemini CLI API - Index de Documentation

> Toute la documentation est maintenant dans `resources/gemini-api-docs/`

## 📚 Documentation Complète

Consultez le dossier **[src/webserver/gemini-api-docs/](./src/webserver/gemini-api-docs/)** pour accéder à toute la documentation.

## ⚡ Démarrage Rapide

```bash
# 1. Diagnostic
npm run diagnose:api

# 2. Démarrer le serveur
npm run webui:remote

# 3. Tester l'API
npm run test:api
```

## 📖 Guides Disponibles

### Pour Commencer
- **[Démarrage Ultra-Rapide](./src/webserver/gemini-api-docs/QUICK_START_FR.md)** - 3 commandes et c'est parti !
- **[Guide de Démarrage](./src/webserver/gemini-api-docs/GEMINI_API_QUICKSTART_FR.md)** - Installation et configuration

### Documentation Principale
- **[README Principal](./src/webserver/gemini-api-docs/README_GEMINI_API_FR.md)** - Vue d'ensemble complète
- **[Documentation Complète](./src/webserver/gemini-api-docs/GEMINI_API_ENDPOINT.md)** - Tous les détails

### Guides Spécifiques
- **[Utilisation avec Google](./src/webserver/gemini-api-docs/UTILISATION_AVEC_COMPTE_GOOGLE.md)** - Pour votre compte ohada.finance@gmail.com
- **[Commandes NPM](./src/webserver/gemini-api-docs/NPM_COMMANDS.md)** - Liste complète des commandes

### Référence Technique
- **[Implémentation](./src/webserver/gemini-api-docs/GEMINI_API_IMPLEMENTATION.md)** - Détails techniques
- **[Changelog](./src/webserver/gemini-api-docs/GEMINI_API_CHANGELOG.md)** - Historique des changements

## 🔗 Liens Rapides

### Endpoints API

| Endpoint | Description |
|----------|-------------|
| `POST /api/chat` | Chat avec historique de messages |
| `POST /api/generate` | Génération simple de texte |
| `GET /api/tags` | Liste des modèles disponibles |
| `GET /api/version` | Version de l'API |

### Commandes Essentielles

```bash
# Diagnostic complet
npm run diagnose:api

# Démarrer en mode développement
npm run webui:remote

# Tester tous les endpoints
npm run test:api

# Avec authentification
API_TOKEN=your_token npm run test:api
```

## 🎯 Cas d'Usage

1. **Automatisation n8n** - Intégrez Gemini dans vos workflows
2. **API Backend** - Exposez Gemini pour vos applications
3. **Prototypage** - Testez Gemini sans SDK
4. **Multi-plateforme** - Utilisez depuis n'importe quel langage

## 🌐 Déploiement

### Local
```bash
npm run webui:remote
# Accessible sur http://localhost:25808
```

### Netlify
```bash
netlify deploy --prod
# Configurer GEMINI_API_KEY dans le dashboard
```

### Vercel
```bash
vercel --prod
# Configurer GEMINI_API_KEY dans le dashboard
```

## 📊 Structure de la Documentation

```
src/webserver/gemini-api-docs/
├── README.md                              # Index de la documentation
├── QUICK_START_FR.md                      # Démarrage ultra-rapide
├── GEMINI_API_QUICKSTART_FR.md            # Guide de démarrage
├── README_GEMINI_API_FR.md                # README principal
├── GEMINI_API_ENDPOINT.md                 # Documentation complète
├── UTILISATION_AVEC_COMPTE_GOOGLE.md      # Guide compte Google
├── NPM_COMMANDS.md                        # Commandes npm
├── GEMINI_API_IMPLEMENTATION.md           # Détails techniques
└── GEMINI_API_CHANGELOG.md                # Changelog
```

## 🔐 Authentification

### OAuth Google (Local)
Votre compte **ohada.finance@gmail.com** est déjà configuré !

### Clé API (Serverless)
Obtenir une clé sur https://aistudio.google.com/apikey

### Token JWT
1. Ouvrir http://localhost:25808
2. Se connecter
3. Récupérer le token depuis les cookies

## 🐛 Dépannage

### Problèmes Courants

```bash
# Diagnostic complet
npm run diagnose:api

# Vérifier le serveur
curl http://localhost:25808/api/version

# Tester avec authentification
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:25808/api/tags
```

Voir la [documentation complète](./src/webserver/gemini-api-docs/GEMINI_API_ENDPOINT.md#dépannage) pour plus de solutions.

## 💬 Support

- **Documentation** : [src/webserver/gemini-api-docs/](./src/webserver/gemini-api-docs/)
- **GitHub Issues** : https://github.com/iOfficeAI/AionUi/issues
- **Discord** : https://discord.gg/aionui

## 📄 Licence

Apache-2.0 - Voir [LICENSE](./LICENSE)

---

**Version** : 1.9.0  
**Date** : 26 février 2026

**Consultez [src/webserver/gemini-api-docs/README.md](./src/webserver/gemini-api-docs/README.md) pour la documentation complète ! 📚**
