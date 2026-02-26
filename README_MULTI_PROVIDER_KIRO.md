# 🚀 AionUI Multi-Provider API Server avec Kiro CLI

## Vue d'ensemble

Serveur API unifié qui expose **Gemini CLI**, **Gemini API Key (rotative)** et **Kiro CLI** via des endpoints REST compatibles OpenAI pour intégration dans n8n, LangChain, et autres outils.

## 🎯 Providers disponibles

### 1. Gemini CLI (`gemini_cli`)
- Utilise Google OAuth pour l'authentification
- Accès aux modèles Gemini via CLI
- Pas de limite de taux stricte

### 2. Gemini API Key Rotative (`gemini_api_key`)
- Rotation automatique de 27 clés API
- Limites: 5 req/min, 250k tokens/jour par clé
- Modèles: Gemini 2.5 Flash, Gemini 1.5 Flash

### 3. Kiro CLI (`kiro_cli`) ⭐ NOUVEAU
- Assistant de développement IA dans le terminal
- Support multi-modèles (Claude, GPT-4, etc.)
- Analyse de code, génération, refactoring
- Support MCP (Model Context Protocol)

## 📦 Installation

### Prérequis

```bash
# Node.js 18+
node --version

# Installer les dépendances
npm install
```

### Installation de Kiro CLI

```bash
# Via npm
npm install -g @kirodotdev/cli

# Via script d'installation
curl -fsSL https://kiro.dev/install.sh | sh

# Vérifier l'installation
kiro --version

# Authentifier
kiro auth login
```

### Configuration

1. **Copier le fichier d'environnement**
```bash
cp .env.example .env
```

2. **Éditer `.env`**
```env
# Kiro CLI
KIRO_CLI_ENABLED=true
KIRO_CLI_PATH=/usr/local/bin/kiro
KIRO_CLI_WORKSPACE=./workspace
KIRO_CLI_MODEL=claude-3-5-sonnet
KIRO_CLI_TIMEOUT=300000

# Gemini API Keys (déjà configurées)
# ...

# Serveur
PORT=25808
```

3. **Démarrer le serveur**
```bash
npm run start:multi-provider
```

## 🔌 Endpoints

### Endpoints par provider

#### Kiro CLI

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/kiro-cli/chat` | POST | Chat avec Kiro CLI |
| `/api/kiro-cli/generate` | POST | Génération de code |
| `/api/kiro-cli/status` | GET | Statut du service |
| `/api/kiro-cli/execute` | POST | Commande personnalisée |
| `/v1/kiro-cli/chat/completions` | POST | Format OpenAI |

#### Gemini CLI

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/gemini-cli/chat` | POST | Chat avec Gemini CLI |
| `/api/gemini-cli/generate` | POST | Génération de code |
| `/api/gemini-cli/status` | GET | Statut du service |
| `/v1/gemini-cli/chat/completions` | POST | Format OpenAI |

#### Gemini API Key

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/gemini-api-key/chat` | POST | Chat avec rotation |
| `/api/gemini-api-key/generate` | POST | Génération de code |
| `/api/gemini-api-key/status` | GET | Statut et rotation |
| `/v1/gemini-api-key/chat/completions` | POST | Format OpenAI |

### Endpoints globaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/health` | GET | Health check |
| `/api/providers` | GET | Liste des providers |
| `/` | GET | Documentation web |

## 💡 Exemples d'utilisation

### 1. Chat avec Kiro CLI

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

### 4. Vérifier le statut

```bash
curl http://localhost:25808/api/kiro-cli/status
```

## 🔧 Intégration n8n

### Configuration HTTP Request Node

1. **Method**: POST
2. **URL**: `http://localhost:25808/v1/kiro-cli/chat/completions`
3. **Body**:
```json
{
  "model": "kiro-cli",
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ]
}
```

### Configuration LangChain Chat Model

1. **Base URL**: `http://localhost:25808/v1/kiro-cli`
2. **Model**: `kiro-cli`
3. **API Key**: `dummy` (si pas d'auth)

## 📊 Comparaison des providers

| Feature | Gemini CLI | Gemini API Key | Kiro CLI |
|---------|------------|----------------|----------|
| Authentification | Google OAuth | API Keys | Session CLI |
| Rate Limit | Aucun | 5/min, 250k/jour | Aucun |
| Modèles | Gemini 2.5, 1.5 | Gemini 2.5, 1.5 | Claude, GPT-4 |
| Streaming | ✅ | ✅ | ✅ |
| Code Generation | ✅ | ✅ | ✅ |
| Code Analysis | ❌ | ❌ | ✅ |
| Refactoring | ❌ | ❌ | ✅ |
| MCP Support | ❌ | ❌ | ✅ |
| Context Aware | ✅ | ❌ | ✅ |

## 🎯 Cas d'usage Kiro CLI

### 1. Analyse de code
```javascript
{
  "messages": [
    {
      "role": "user",
      "content": "Analyse ce code et suggère des améliorations:\n\n```js\nfunction add(a,b){return a+b}\n```"
    }
  ]
}
```

### 2. Génération de tests
```javascript
{
  "prompt": "Génère des tests Jest pour cette fonction",
  "language": "javascript",
  "context": {
    "code": "function validateEmail(email) { ... }"
  }
}
```

### 3. Refactoring
```javascript
{
  "messages": [
    {
      "role": "user",
      "content": "Refactorise ce code pour améliorer la lisibilité"
    }
  ]
}
```

### 4. Documentation
```javascript
{
  "prompt": "Génère la documentation JSDoc pour ce code"
}
```

## 🧪 Tests

### Tester Kiro CLI

```bash
# Tous les tests
node scripts/test-kiro-cli.js

# Avec URL personnalisée
node scripts/test-kiro-cli.js --url http://localhost:8080
```

### Tester tous les providers

```bash
node scripts/test-multi-provider.js
```

## 📚 Documentation

### Documentation Kiro CLI
- [README](./src/webserver/kiro-cli-docs/README.md)
- [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)
- [Index](./src/webserver/kiro-cli-docs/INDEX.md)

### Documentation Gemini
- [Gemini CLI](./src/webserver/gemini-api-docs/)
- [Gemini API Key](./src/webserver/gemini-api-key-rotative-docs/)

### Guides généraux
- [Démarrage immédiat](./DEMARRAGE_IMMEDIAT.md)
- [Commandes essentielles](./COMMANDES_ESSENTIELLES.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🚀 Déploiement

### Local
```bash
npm run start:multi-provider
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Docker (à venir)
```bash
docker build -t aionui-multi-provider .
docker run -p 25808:25808 aionui-multi-provider
```

## 🔒 Sécurité

### Authentification (optionnel)

Ajouter dans `.env`:
```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### Rate Limiting

Configurer dans `.env`:
```env
API_RATE_LIMIT_WINDOW_MS=60000
API_RATE_LIMIT_MAX_REQUESTS=100
```

## 🐛 Dépannage

### Kiro CLI non trouvé

```bash
# Vérifier l'installation
which kiro

# Mettre à jour le chemin
export KIRO_CLI_PATH=$(which kiro)
```

### Erreur d'authentification Kiro

```bash
# Se reconnecter
kiro auth logout
kiro auth login
```

### Timeout

Augmenter dans `.env`:
```env
KIRO_CLI_TIMEOUT=600000  # 10 minutes
```

### Port déjà utilisé

```bash
# Changer le port
export PORT=3001
npm run start:multi-provider
```

## 📝 Scripts disponibles

```bash
# Démarrer le serveur multi-provider
npm run start:multi-provider

# Tester Kiro CLI
npm run test:kiro-cli

# Tester tous les providers
npm run test:multi-provider

# Build pour production
npm run build

# Ouvrir la documentation
npm run docs:open
```

## 🤝 Contribution

Les contributions sont les bienvenues! Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 Licence

Apache-2.0 - Voir [LICENSE](./LICENSE)

## 🔗 Liens utiles

- [Kiro CLI Documentation](https://kiro.dev/docs/cli/)
- [Gemini API](https://ai.google.dev/)
- [n8n Documentation](https://docs.n8n.io/)
- [LangChain](https://js.langchain.com/)

## 📞 Support

- GitHub Issues: [Créer une issue](https://github.com/iOfficeAI/AionUi/issues)
- Discord: [Rejoindre](https://discord.gg/aionui)
- Documentation: [Lire](./docs/)

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2024  
**Auteurs**: AionUI Team
