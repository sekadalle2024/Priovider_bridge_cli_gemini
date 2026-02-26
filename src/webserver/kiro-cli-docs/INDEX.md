# Documentation Kiro CLI Integration

## 📚 Table des matières

### 1. [README.md](./README.md)
Vue d'ensemble complète de l'intégration Kiro CLI
- Qu'est-ce que Kiro CLI ?
- Architecture d'intégration
- Installation et configuration
- Utilisation des endpoints
- Dépannage

### 2. [INTEGRATION_N8N.md](./INTEGRATION_N8N.md)
Guide d'intégration avec n8n
- Configuration n8n
- Exemples de workflows
- Cas d'usage pratiques
- Gestion des erreurs
- Bonnes pratiques

### 3. [API_REFERENCE.md](./API_REFERENCE.md)
Référence complète de l'API
- Endpoints disponibles
- Schémas de requêtes/réponses
- Codes d'erreur
- Exemples de code

## 🚀 Démarrage rapide

### Installation

```bash
# 1. Installer Kiro CLI
npm install -g @kirodotdev/cli

# 2. Authentifier
kiro auth login

# 3. Configurer le serveur
cp .env.example .env
# Éditer .env et configurer KIRO_CLI_*

# 4. Démarrer le serveur
npm run start:multi-provider
```

### Premier test

```bash
# Vérifier le statut
curl http://localhost:3000/api/kiro-cli/status

# Envoyer un message
curl -X POST http://localhost:3000/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

## 📖 Structure de la documentation

```
kiro-cli-docs/
├── INDEX.md                    # Ce fichier
├── README.md                   # Vue d'ensemble
├── INTEGRATION_N8N.md          # Guide n8n
├── API_REFERENCE.md            # Référence API
├── EXAMPLES.md                 # Exemples de code
├── TROUBLESHOOTING.md          # Dépannage
└── CHANGELOG.md                # Historique des versions
```

## 🔗 Liens utiles

- [Documentation officielle Kiro](https://kiro.dev/docs/cli/)
- [GitHub Kiro](https://github.com/kirodotdev/Kiro)
- [Kiro CLI Commands](https://kiro.dev/docs/cli/reference/cli-commands)
- [n8n Documentation](https://docs.n8n.io/)

## 🎯 Cas d'usage principaux

### 1. Chat interactif
Conversation avec contexte de projet pour assistance au développement

### 2. Génération de code
Création automatique de fonctions, classes, composants

### 3. Analyse de code
Revue de code, détection de bugs, suggestions d'amélioration

### 4. Refactoring
Amélioration de la qualité du code existant

### 5. Documentation
Génération automatique de documentation

## 🔧 Configuration

### Variables d'environnement

```env
KIRO_CLI_ENABLED=true
KIRO_CLI_PATH=/usr/local/bin/kiro
KIRO_CLI_WORKSPACE=./workspace
KIRO_CLI_MODEL=claude-3-5-sonnet
KIRO_CLI_TIMEOUT=300000
```

### Endpoints principaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/kiro-cli/chat` | POST | Chat avec Kiro CLI |
| `/api/kiro-cli/generate` | POST | Génération de code |
| `/api/kiro-cli/status` | GET | Statut du service |
| `/v1/kiro-cli/chat/completions` | POST | Format OpenAI |

## 📊 Fonctionnalités

- ✅ Chat interactif avec contexte
- ✅ Génération de code
- ✅ Analyse et refactoring
- ✅ Streaming de réponses
- ✅ Format compatible OpenAI
- ✅ Intégration n8n/LangChain
- ✅ Support MCP (Model Context Protocol)
- ✅ Gestion de sessions

## 🛠️ Support

### Problèmes courants

1. **Kiro CLI non trouvé**
   - Vérifier l'installation : `which kiro`
   - Mettre à jour `KIRO_CLI_PATH` dans `.env`

2. **Erreur d'authentification**
   - Se reconnecter : `kiro auth login`

3. **Timeout**
   - Augmenter `KIRO_CLI_TIMEOUT` dans `.env`

### Obtenir de l'aide

- Consulter [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Vérifier les logs du serveur
- Tester Kiro CLI directement : `kiro chat`

## 📝 Contribuer

Pour améliorer cette documentation :
1. Identifier les sections à améliorer
2. Proposer des modifications
3. Ajouter des exemples pratiques
4. Mettre à jour les références

## 📄 Licence

Cette intégration fait partie du projet AionUI.
Voir le fichier LICENSE à la racine du projet.

## 🔄 Mises à jour

Dernière mise à jour : 2024
Version : 1.0.0

Consultez [CHANGELOG.md](./CHANGELOG.md) pour l'historique complet.
