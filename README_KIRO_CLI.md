# 🚀 Kiro CLI Integration - Guide Complet

## ✨ Nouveauté : Kiro CLI est maintenant intégré !

Kiro CLI, l'assistant de développement IA puissant, est maintenant disponible dans AionUI Multi-Provider Server aux côtés de Gemini CLI et Gemini API Key.

## 🎯 Qu'est-ce que Kiro CLI ?

Kiro CLI est un assistant de développement IA qui fonctionne dans votre terminal. Il offre :

- 💬 **Chat interactif** avec contexte de projet
- 🔧 **Génération de code** multi-langages
- 🔍 **Analyse de code** et détection de bugs
- ♻️ **Refactoring** intelligent
- 📝 **Documentation** automatique
- 🔌 **Support MCP** (Model Context Protocol)
- 🤖 **Multi-modèles** (Claude, GPT-4, etc.)

## 🚀 Démarrage en 3 étapes

### Étape 1 : Installer Kiro CLI

```bash
# Via npm
npm install -g @kirodotdev/cli

# Vérifier l'installation
kiro --version

# Authentifier
kiro auth login
```

### Étape 2 : Démarrer le serveur

```bash
npm run start:multi-provider
```

Le serveur démarre sur `http://localhost:25808`

### Étape 3 : Tester

```bash
# Vérifier le statut
curl http://localhost:25808/api/kiro-cli/status

# Premier chat
curl -X POST http://localhost:25808/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello Kiro!"}]}'
```

## 📖 Documentation

### Guides de démarrage
- 🚀 [Démarrage rapide (5 min)](./QUICK_START_KIRO_CLI.md)
- 📚 [Documentation complète](./src/webserver/kiro-cli-docs/README.md)
- 🔗 [Index de la documentation](./DOCUMENTATION_INDEX.md)

### Références techniques
- 📖 [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- 🔌 [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)
- ✅ [Rapport d'intégration](./KIRO_CLI_INTEGRATION_COMPLETE.md)

### Documentation multi-provider
- 🌐 [README Multi-Provider](./README_MULTI_PROVIDER_KIRO.md)
- 📋 [Index général](./DOCUMENTATION_INDEX.md)

## 🔌 Endpoints disponibles

### Kiro CLI

| Endpoint | Description |
|----------|-------------|
| `POST /api/kiro-cli/chat` | Chat interactif |
| `POST /api/kiro-cli/generate` | Génération de code |
| `GET /api/kiro-cli/status` | Statut du service |
| `POST /v1/kiro-cli/chat/completions` | Format OpenAI (n8n/LangChain) |

### Autres providers

| Provider | Endpoint Chat | Endpoint OpenAI |
|----------|---------------|-----------------|
| Gemini CLI | `/api/gemini-cli/chat` | `/v1/gemini-cli/chat/completions` |
| Gemini API Key | `/api/gemini-api-key/chat` | `/v1/gemini-api-key/chat/completions` |

## 💡 Exemples d'utilisation

### 1. Chat simple

```bash
curl -X POST http://localhost:25808/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explique-moi les closures en JavaScript"}
    ]
  }'
```

### 2. Génération de code

```bash
curl -X POST http://localhost:25808/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une fonction TypeScript pour valider un email",
    "language": "typescript"
  }'
```

### 3. Format OpenAI (pour n8n)

```bash
curl -X POST http://localhost:25808/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kiro-cli",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

## 🔧 Intégration n8n

### Configuration HTTP Request Node

```json
{
  "method": "POST",
  "url": "http://localhost:25808/v1/kiro-cli/chat/completions",
  "body": {
    "model": "kiro-cli",
    "messages": [
      {"role": "user", "content": "{{ $json.prompt }}"}
    ]
  }
}
```

### Configuration LangChain

```
Base URL: http://localhost:25808/v1/kiro-cli
Model: kiro-cli
API Key: dummy
```

## 🎯 Cas d'usage

### Développement assisté
```javascript
// Demander à Kiro de créer une fonction
{
  "prompt": "Crée une fonction pour valider un email avec regex",
  "language": "typescript"
}
```

### Revue de code
```javascript
// Analyser du code existant
{
  "messages": [
    {
      "role": "user",
      "content": "Analyse ce code:\n\nfunction add(a,b){return a+b}"
    }
  ]
}
```

### Génération de tests
```javascript
// Créer des tests unitaires
{
  "prompt": "Génère des tests Jest pour une fonction de validation d'email"
}
```

### Documentation
```javascript
// Générer de la documentation
{
  "prompt": "Génère la documentation JSDoc pour ce code"
}
```

## 🧪 Tests

### Tester Kiro CLI

```bash
npm run test:kiro-cli
```

### Tester tous les providers

```bash
npm run test:multi-provider
```

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

## ⚙️ Configuration

### Variables d'environnement

Le fichier `.env` contient déjà la configuration :

```env
KIRO_CLI_ENABLED=true
KIRO_CLI_PATH=/usr/local/bin/kiro
KIRO_CLI_WORKSPACE=./workspace
KIRO_CLI_MODEL=claude-3-5-sonnet
KIRO_CLI_TIMEOUT=300000
```

### Personnalisation

```bash
# Changer le modèle
KIRO_CLI_MODEL=gpt-4-turbo

# Changer le workspace
KIRO_CLI_WORKSPACE=/path/to/your/project

# Augmenter le timeout
KIRO_CLI_TIMEOUT=600000  # 10 minutes
```

## 🐛 Dépannage

### Kiro CLI non trouvé

```bash
# Vérifier l'installation
which kiro

# Mettre à jour le chemin dans .env
KIRO_CLI_PATH=$(which kiro)
```

### Erreur d'authentification

```bash
kiro auth logout
kiro auth login
```

### Timeout

```env
# Augmenter dans .env
KIRO_CLI_TIMEOUT=600000
```

## 📚 Ressources

### Documentation
- [Kiro CLI Official](https://kiro.dev/docs/cli/)
- [Kiro GitHub](https://github.com/kirodotdev/Kiro)
- [n8n Documentation](https://docs.n8n.io/)
- [LangChain](https://js.langchain.com/)

### Fichiers du projet
- [Guide de démarrage rapide](./QUICK_START_KIRO_CLI.md)
- [Documentation complète](./src/webserver/kiro-cli-docs/README.md)
- [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)
- [Rapport d'intégration](./KIRO_CLI_INTEGRATION_COMPLETE.md)

## 🎉 Fonctionnalités

- ✅ Chat interactif avec contexte
- ✅ Génération de code multi-langages
- ✅ Analyse et refactoring de code
- ✅ Streaming de réponses
- ✅ Format compatible OpenAI
- ✅ Intégration n8n/LangChain
- ✅ Support MCP
- ✅ Multi-modèles (Claude, GPT-4)
- ✅ Documentation automatique
- ✅ Tests automatisés

## 🚀 Commandes npm

```bash
# Démarrer le serveur multi-provider
npm run start:multi-provider

# Tester Kiro CLI
npm run test:kiro-cli

# Tester tous les providers
npm run test:multi-provider

# Diagnostiquer l'API
npm run diagnose:api
```

## 📞 Support

Pour toute question :
1. Consulter la [documentation](./DOCUMENTATION_INDEX.md)
2. Lire le [guide de démarrage rapide](./QUICK_START_KIRO_CLI.md)
3. Vérifier le [rapport d'intégration](./KIRO_CLI_INTEGRATION_COMPLETE.md)
4. Créer une issue GitHub

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez :
- [Code Style](./CODE_STYLE.md)
- [Architecture](./KIRO_CLI_INTEGRATION_COMPLETE.md)

## 📄 Licence

Apache-2.0 - Voir [LICENSE](./LICENSE)

---

**Version** : 1.0.0  
**Statut** : ✅ Production Ready  
**Dernière mise à jour** : 2024

🎉 **Kiro CLI est maintenant intégré et prêt à l'emploi !**
