# Kiro CLI Integration Documentation

## Vue d'ensemble

Cette documentation décrit l'intégration de Kiro CLI comme provider dans le serveur multi-provider AionUI.

## Qu'est-ce que Kiro CLI ?

Kiro CLI est un assistant de développement IA qui fonctionne directement dans le terminal. Il permet :
- Chat interactif avec contexte de projet
- Génération et modification de code
- Analyse de codebase
- Automatisation de workflows
- Intégration avec Model Context Protocol (MCP)

## Architecture d'intégration

### 1. Service Kiro CLI (`KiroCliService.ts`)

Le service gère l'interaction avec Kiro CLI via des processus enfants Node.js.

**Fonctionnalités :**
- Exécution de commandes Kiro CLI
- Gestion de sessions de chat
- Streaming de réponses
- Gestion du contexte de projet

### 2. Routes API (`kiroCliRoutes.ts`)

Endpoints REST pour interagir avec Kiro CLI :

```
POST /api/kiro-cli/chat
POST /api/kiro-cli/generate
GET /api/kiro-cli/status
POST /api/kiro-cli/execute
```

### 3. Compatibilité OpenAI

Endpoints compatibles avec l'API OpenAI pour intégration dans n8n et LangChain :

```
POST /v1/kiro-cli/chat/completions
POST /v1/kiro-cli/completions
```

## Installation et Configuration

### Prérequis

1. Installer Kiro CLI :
```bash
npm install -g @kirodotdev/cli
# ou
curl -fsSL https://kiro.dev/install.sh | sh
```

2. Configurer Kiro CLI :
```bash
kiro auth login
kiro config set model claude-3-5-sonnet
```

### Variables d'environnement

Ajouter dans `.env` :

```env
# Kiro CLI Configuration
KIRO_CLI_ENABLED=true
KIRO_CLI_PATH=/usr/local/bin/kiro
KIRO_CLI_WORKSPACE=/path/to/workspace
KIRO_CLI_MODEL=claude-3-5-sonnet
KIRO_CLI_TIMEOUT=300000
```

## Utilisation

### 1. Chat simple

```bash
curl -X POST http://localhost:3000/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explique-moi ce fichier",
    "context": {
      "file": "src/index.ts"
    }
  }'
```

### 2. Génération de code

```bash
curl -X POST http://localhost:3000/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une fonction pour valider un email",
    "language": "typescript"
  }'
```

### 3. Format OpenAI (pour n8n/LangChain)

```bash
curl -X POST http://localhost:3000/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "kiro-cli",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

## Intégration n8n

### Configuration du nœud HTTP Request

1. **Method**: POST
2. **URL**: `http://localhost:3000/v1/kiro-cli/chat/completions`
3. **Authentication**: Bearer Token
4. **Body**:
```json
{
  "model": "kiro-cli",
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ],
  "stream": false
}
```

### Configuration LangChain Chat Model

1. **Base URL**: `http://localhost:3000/v1/kiro-cli`
2. **Model**: `kiro-cli`
3. **API Key**: Votre clé configurée

## Fonctionnalités avancées

### 1. Contexte de projet

Kiro CLI maintient automatiquement le contexte du projet :
- Fichiers ouverts
- Historique de conversation
- Structure du projet

### 2. Streaming

Support du streaming pour les réponses longues :

```javascript
const response = await fetch('/api/kiro-cli/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Génère un composant React',
    stream: true
  })
});

const reader = response.body.getReader();
// Lire le stream...
```

### 3. Hooks et automatisation

Kiro CLI supporte les hooks pour automatiser des tâches :
- Pre/post tool execution
- File events
- Custom commands

## Limites et considérations

1. **Performance** : Kiro CLI est conçu pour l'interaction interactive, pas pour des requêtes massives
2. **Contexte** : Nécessite un workspace configuré pour fonctionner correctement
3. **Authentification** : Requiert une session Kiro CLI authentifiée
4. **Concurrence** : Limiter le nombre de requêtes simultanées

## Dépannage

### Kiro CLI non trouvé

```bash
# Vérifier l'installation
which kiro

# Mettre à jour le chemin dans .env
KIRO_CLI_PATH=/chemin/vers/kiro
```

### Erreur d'authentification

```bash
# Se reconnecter
kiro auth logout
kiro auth login
```

### Timeout

Augmenter le timeout dans `.env` :
```env
KIRO_CLI_TIMEOUT=600000  # 10 minutes
```

## Ressources

- [Documentation officielle Kiro](https://kiro.dev/docs/cli/)
- [GitHub Kiro](https://github.com/kirodotdev/Kiro)
- [Kiro CLI Commands](https://kiro.dev/docs/cli/reference/cli-commands)

## Support

Pour toute question ou problème :
1. Consulter la documentation officielle
2. Vérifier les logs du serveur
3. Tester Kiro CLI directement dans le terminal
