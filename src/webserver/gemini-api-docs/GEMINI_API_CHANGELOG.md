# Changelog - Gemini CLI API Endpoint

## [1.9.0] - 2026-02-26

### ✨ Nouvelles fonctionnalités

#### API REST Gemini CLI
- **Endpoints compatibles Ollama** : Ajout de `/api/chat`, `/api/generate`, `/api/tags`, `/api/version`
- **Service GeminiApiService** : Service dédié pour gérer les requêtes API Gemini
- **Streaming supporté** : Réponses en temps réel avec format NDJSON
- **Authentification JWT** : Réutilisation du système d'authentification existant
- **Rate limiting** : Protection contre les abus avec limite de 100 req/15min

#### Déploiement Serverless
- **Netlify Functions** : Support complet avec fonctions serverless
- **Vercel Functions** : Support complet avec API routes
- **Configuration automatique** : Fichiers `netlify.toml` et `vercel.json` prêts à l'emploi

#### Documentation
- **Guide complet** : Documentation détaillée en français et anglais
- **Démarrage rapide** : Guide de démarrage en 5 minutes
- **Exemples n8n** : Workflows n8n prêts à l'emploi
- **Script de test** : Script Node.js pour tester tous les endpoints

### 🔧 Améliorations

#### Architecture
- **Service isolé** : `GeminiApiService` séparé du reste de l'application
- **Gestion d'erreurs** : Meilleure gestion des erreurs avec messages enrichis
- **Performance** : Optimisation du streaming et de la gestion mémoire

#### Sécurité
- **CSRF Protection** : Protection CSRF pour tous les endpoints POST
- **Token validation** : Validation stricte des tokens JWT
- **CORS configuré** : Configuration CORS flexible pour développement et production

#### Configuration
- **Variables d'environnement** : Support complet avec `.env.example`
- **OAuth Google** : Détection automatique des credentials OAuth
- **Multi-clés API** : Support des clés API multiples (rotation automatique)

### 📝 Fichiers ajoutés

```
src/webserver/
├── services/
│   └── GeminiApiService.ts          # Service API Gemini
└── routes/
    └── geminiApiRoutes.ts            # Routes API Gemini

netlify/
└── functions/
    ├── gemini-chat.ts                # Fonction Netlify chat
    └── gemini-generate.ts            # Fonction Netlify generate

api/
├── chat.ts                           # Fonction Vercel chat
└── generate.ts                       # Fonction Vercel generate

docs/
├── GEMINI_API_README.md              # README principal
├── GEMINI_API_ENDPOINT.md            # Documentation complète
├── GEMINI_API_QUICKSTART_FR.md       # Démarrage rapide FR
└── GEMINI_API_CHANGELOG.md           # Ce fichier

scripts/
└── test-gemini-api.js                # Script de test

netlify.toml                          # Configuration Netlify
vercel.json                           # Configuration Vercel
.env.example                          # Exemple de configuration
```

### 🔄 Fichiers modifiés

```
src/webserver/routes/apiRoutes.ts     # Ajout des routes Gemini
package.json                          # Ajout dépendances Netlify/Vercel
```

### 📦 Dépendances ajoutées

```json
{
  "devDependencies": {
    "@netlify/functions": "^2.8.2",
    "@vercel/node": "^3.2.29"
  }
}
```

### 🎯 Compatibilité

- **Node.js** : 22+ (requis)
- **Gemini CLI** : Toutes versions avec OAuth support
- **n8n** : Toutes versions
- **Ollama clients** : Compatible avec le format Ollama API

### 🚀 Migration

#### Pour les utilisateurs existants

Aucune migration nécessaire ! Les nouvelles fonctionnalités sont additives.

#### Pour activer l'API

1. **Authentification Google** :
   ```bash
   gemini  # S'authentifier une fois
   ```

2. **Démarrer le serveur** :
   ```bash
   npm run webui:remote
   ```

3. **Tester l'API** :
   ```bash
   npm run test:api
   ```

### 📊 Métriques

- **Lignes de code ajoutées** : ~1500
- **Nouveaux endpoints** : 4
- **Nouveaux fichiers** : 12
- **Tests ajoutés** : Script de test automatisé

### 🐛 Corrections de bugs

Aucun bug corrigé dans cette version (nouvelles fonctionnalités uniquement).

### ⚠️ Breaking Changes

Aucun breaking change. Toutes les fonctionnalités existantes restent inchangées.

### 🔮 Prochaines étapes

#### Version 1.9.1 (planifiée)
- [ ] Support du streaming natif pour Netlify/Vercel
- [ ] Webhooks pour notifications
- [ ] Métriques et monitoring
- [ ] Cache des réponses

#### Version 1.10.0 (planifiée)
- [ ] Support de plus de modèles (Claude, OpenAI via proxy)
- [ ] API GraphQL en plus de REST
- [ ] Dashboard de monitoring
- [ ] Rate limiting configurable par utilisateur

### 📚 Ressources

- **Documentation** : [docs/GEMINI_API_README.md](./GEMINI_API_README.md)
- **Guide rapide** : [docs/GEMINI_API_QUICKSTART_FR.md](./GEMINI_API_QUICKSTART_FR.md)
- **Guide complet** : [docs/GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md)
- **Tests** : `npm run test:api`

### 🙏 Remerciements

Merci à la communauté AionUI pour les retours et suggestions qui ont permis de créer cette fonctionnalité !

---

**Note** : Cette version est compatible avec AionUI 1.8.17+
