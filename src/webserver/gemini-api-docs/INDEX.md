# 📚 Documentation Gemini CLI API - Index Complet

Documentation complète pour l'API Gemini CLI compatible Ollama.

## 🚀 Démarrage Rapide

### Installation et Configuration
1. **Prérequis**: Node.js 22+, Gemini CLI installé
2. **Configuration**: Copier `.env.example` vers `.env`
3. **Démarrage**: `npm run server:remote`
4. **Documentation**: `npm run docs:api`

### Premier Test
```bash
# Test simple
curl http://localhost:25808/api/version

# Génération de texte
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello","stream":false}'
```

## 📖 Documentation Disponible

### 1. [README.md](./README.md)
**Vue d'ensemble générale**
- Introduction à l'API
- Architecture du système
- Fonctionnalités principales
- Liens vers les autres documents

### 2. [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md)
**Guide technique détaillé**
- Configuration complète
- Endpoints détaillés avec exemples
- Authentification et sécurité
- Déploiement (Netlify, Vercel)
- Troubleshooting

### 3. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
**Guide d'utilisation pratique**
- Accès à la documentation interactive (Swagger)
- Exemples curl et PowerShell
- Format des réponses
- Authentification JWT
- Compatibilité Ollama

### 4. [MODELS_GUIDE.md](./MODELS_GUIDE.md)
**Guide des modèles Gemini**
- Liste des modèles disponibles
- Comparaison et recommandations
- Gestion des erreurs 429
- Stratégies de fallback
- Bonnes pratiques

## 🌐 Accès à la Documentation Interactive

### Swagger UI
```
http://localhost:25808/docs
```
Interface interactive pour tester tous les endpoints directement depuis le navigateur.

**Commande rapide:**
```bash
npm run docs:api
```

### Spécification OpenAPI
```
http://localhost:25808/openapi.json
```
Spécification OpenAPI 3.0 complète, importable dans Postman, Insomnia, etc.

## 🎯 Guides par Cas d'Usage

### Pour les Développeurs

#### Intégration Rapide
1. Lire [README.md](./README.md) - Vue d'ensemble
2. Consulter [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Exemples pratiques
3. Tester via Swagger UI - `npm run docs:api`

#### Configuration Avancée
1. Lire [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md) - Configuration détaillée
2. Consulter [MODELS_GUIDE.md](./MODELS_GUIDE.md) - Optimisation des modèles
3. Configurer `.env` selon vos besoins

### Pour les Utilisateurs n8n/LangChain

#### Configuration n8n
```javascript
// Configuration du nœud HTTP Request
URL: http://localhost:25808/api/generate
Method: POST
Body: {
  "model": "gemini-2.5-pro",
  "prompt": "{{$json.prompt}}",
  "stream": false
}
```

Voir [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md#utilisation-avec-n8n) pour plus de détails.

### Pour le Déploiement

#### Netlify/Vercel
1. Lire [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md#déploiement)
2. Configurer les variables d'environnement
3. Déployer avec `netlify deploy` ou `vercel deploy`

## 📊 Structure de la Documentation

```
src/webserver/gemini-api-docs/
├── INDEX.md                    # Ce fichier - Index complet
├── README.md                   # Vue d'ensemble générale
├── GEMINI_API_ENDPOINT.md      # Guide technique détaillé
├── API_DOCUMENTATION.md        # Guide d'utilisation pratique
└── MODELS_GUIDE.md             # Guide des modèles Gemini
```

## 🔧 Scripts Utiles

```bash
# Démarrer le serveur
npm run server:remote

# Ouvrir la documentation Swagger
npm run docs:api

# Tester l'API
npm run test:api

# Diagnostiquer la configuration
npm run diagnose:api
```

## 📋 Endpoints Disponibles

| Endpoint | Méthode | Description | Documentation |
|----------|---------|-------------|---------------|
| `/` | GET | Page d'accueil | [README.md](./README.md) |
| `/health` | GET | Santé du serveur | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |
| `/api/version` | GET | Version de l'API | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |
| `/api/tags` | GET | Liste des modèles | [MODELS_GUIDE.md](./MODELS_GUIDE.md) |
| `/api/generate` | POST | Génération de texte | [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md) |
| `/api/chat` | POST | Chat conversationnel | [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md) |
| `/docs` | GET | Documentation Swagger | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |
| `/openapi.json` | GET | Spécification OpenAPI | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |

## 🎓 Parcours d'Apprentissage

### Niveau Débutant
1. ✅ Lire [README.md](./README.md) - Comprendre les bases
2. ✅ Suivre [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Premiers tests
3. ✅ Utiliser Swagger UI - Tester interactivement

### Niveau Intermédiaire
1. ✅ Lire [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md) - Configuration avancée
2. ✅ Consulter [MODELS_GUIDE.md](./MODELS_GUIDE.md) - Optimiser les modèles
3. ✅ Intégrer avec n8n/LangChain

### Niveau Avancé
1. ✅ Déployer sur Netlify/Vercel
2. ✅ Implémenter des stratégies de fallback
3. ✅ Optimiser les performances et les coûts

## 🔗 Liens Externes

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Gemini CLI Documentation](https://geminicli.com/docs/)
- [Ollama API Compatibility](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [OpenAPI Specification](https://swagger.io/specification/)

## 💡 Ressources Supplémentaires

### Scripts
- `scripts/test-gemini-api.js` - Script de test automatisé
- `scripts/diagnose-gemini-api.js` - Diagnostic de configuration
- `scripts/open-docs.js` - Ouverture automatique de Swagger UI

### Configuration
- `.env.example` - Template de configuration
- `server.js` - Serveur standalone
- `dist/gemini-api-routes.js` - Routes de l'API

## 🆘 Support et Troubleshooting

### Problèmes Courants

#### Erreur 429 (Capacity Exhausted)
→ Voir [MODELS_GUIDE.md](./MODELS_GUIDE.md#gestion-des-erreurs-429)

#### Timeout
→ Voir [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md#configuration-du-timeout)

#### Authentification
→ Voir [API_DOCUMENTATION.md](./API_DOCUMENTATION.md#authentification)

### Obtenir de l'Aide
1. Consulter la documentation appropriée ci-dessus
2. Vérifier les logs du serveur
3. Exécuter `npm run diagnose:api`
4. Ouvrir une issue sur GitHub

## 📝 Notes de Version

### Version 1.0.0 (Février 2026)
- ✅ API compatible Ollama
- ✅ Documentation Swagger interactive
- ✅ Support multi-modèles
- ✅ Timeout configurable (300s)
- ✅ Authentification OAuth Google
- ✅ Déploiement Netlify/Vercel

## 🎯 Prochaines Étapes

Après avoir consulté cette documentation:
1. Choisir le guide approprié selon votre niveau
2. Tester l'API via Swagger UI
3. Intégrer dans votre projet
4. Consulter [MODELS_GUIDE.md](./MODELS_GUIDE.md) pour optimiser

---

**Dernière mise à jour**: Février 2026  
**Maintenu par**: AionUI Team  
**Licence**: Apache 2.0
