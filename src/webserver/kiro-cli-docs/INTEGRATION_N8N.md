# Intégration Kiro CLI avec n8n

## Vue d'ensemble

Ce guide explique comment intégrer Kiro CLI dans vos workflows n8n via les endpoints API.

## Configuration préalable

### 1. Installation de Kiro CLI

```bash
# Via npm
npm install -g @kirodotdev/cli

# Via script d'installation
curl -fsSL https://kiro.dev/install.sh | sh

# Vérifier l'installation
kiro --version
```

### 2. Authentification Kiro CLI

```bash
# Se connecter
kiro auth login

# Configurer le modèle par défaut
kiro config set model claude-3-5-sonnet
```

### 3. Configuration du serveur

Ajouter dans `.env` :

```env
# Kiro CLI
KIRO_CLI_ENABLED=true
KIRO_CLI_PATH=/usr/local/bin/kiro
KIRO_CLI_WORKSPACE=/path/to/your/workspace
KIRO_CLI_MODEL=claude-3-5-sonnet
KIRO_CLI_TIMEOUT=300000
```

### 4. Démarrer le serveur

```bash
npm run start:multi-provider
```

## Endpoints disponibles

### 1. Chat simple

**Endpoint**: `POST /api/kiro-cli/chat`

**Body**:
```json
{
  "messages": [
    {"role": "user", "content": "Explique-moi ce code"}
  ],
  "stream": false
}
```

### 2. Génération de code

**Endpoint**: `POST /api/kiro-cli/generate`

**Body**:
```json
{
  "prompt": "Crée une fonction pour valider un email",
  "language": "typescript"
}
```

### 3. Format OpenAI (recommandé pour n8n)

**Endpoint**: `POST /v1/kiro-cli/chat/completions`

**Body**:
```json
{
  "model": "kiro-cli",
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "stream": false
}
```

### 4. Statut

**Endpoint**: `GET /api/kiro-cli/status`

## Configuration n8n

### Méthode 1 : HTTP Request Node

1. **Ajouter un nœud HTTP Request**
2. **Configurer** :
   - Method: `POST`
   - URL: `http://localhost:3000/v1/kiro-cli/chat/completions`
   - Authentication: `None` (ou Bearer Token si configuré)
   - Body Content Type: `JSON`

3. **Body** :
```json
{
  "model": "kiro-cli",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "stream": false
}
```

4. **Extraire la réponse** :
```javascript
// Dans un nœud Code
const response = $input.item.json;
return {
  json: {
    answer: response.choices[0].message.content
  }
};
```

### Méthode 2 : LangChain Chat Model

1. **Ajouter un nœud LangChain Chat Model**
2. **Configurer** :
   - Model: `OpenAI Chat Model`
   - Base URL: `http://localhost:3000/v1/kiro-cli`
   - Model Name: `kiro-cli`
   - API Key: `dummy` (si pas d'authentification)

3. **Utiliser dans une chaîne LangChain**

## Exemples de workflows n8n

### Exemple 1 : Chat simple

```json
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "http://localhost:3000/v1/kiro-cli/chat/completions",
        "options": {},
        "bodyParametersJson": "={\n  \"model\": \"kiro-cli\",\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"{{ $json.question }}\"\n    }\n  ]\n}"
      },
      "name": "Kiro CLI Chat",
      "type": "n8n-nodes-base.httpRequest",
      "position": [250, 300]
    }
  ]
}
```

### Exemple 2 : Génération de code

```json
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "http://localhost:3000/api/kiro-cli/generate",
        "options": {},
        "bodyParametersJson": "={\n  \"prompt\": \"{{ $json.codeRequest }}\",\n  \"language\": \"typescript\"\n}"
      },
      "name": "Generate Code",
      "type": "n8n-nodes-base.httpRequest",
      "position": [250, 300]
    }
  ]
}
```

### Exemple 3 : LangChain avec Kiro CLI

```json
{
  "nodes": [
    {
      "parameters": {
        "model": "kiro-cli",
        "options": {
          "baseURL": "http://localhost:3000/v1/kiro-cli",
          "temperature": 0.7
        }
      },
      "name": "Kiro CLI Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "position": [250, 300]
    },
    {
      "parameters": {
        "prompt": "={{ $json.userInput }}"
      },
      "name": "LLM Chain",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "position": [450, 300]
    }
  ]
}
```

## Cas d'usage

### 1. Analyse de code

```javascript
// Workflow n8n
{
  "prompt": "Analyse ce code et suggère des améliorations",
  "context": {
    "file": "src/index.ts",
    "code": "{{ $json.codeContent }}"
  }
}
```

### 2. Génération de tests

```javascript
{
  "prompt": "Génère des tests unitaires pour cette fonction",
  "language": "typescript",
  "context": {
    "function": "{{ $json.functionCode }}"
  }
}
```

### 3. Documentation automatique

```javascript
{
  "prompt": "Génère la documentation JSDoc pour ce code",
  "context": {
    "code": "{{ $json.sourceCode }}"
  }
}
```

### 4. Refactoring

```javascript
{
  "prompt": "Refactorise ce code pour améliorer la lisibilité",
  "language": "javascript",
  "context": {
    "code": "{{ $json.legacyCode }}"
  }
}
```

## Gestion des erreurs

### Erreur : Kiro CLI non disponible

**Réponse** :
```json
{
  "error": {
    "message": "Kiro CLI is not available",
    "type": "service_unavailable",
    "code": "kiro_cli_unavailable"
  }
}
```

**Solution** :
1. Vérifier que Kiro CLI est installé : `which kiro`
2. Vérifier l'authentification : `kiro auth status`
3. Vérifier la configuration dans `.env`

### Erreur : Timeout

**Solution** :
Augmenter le timeout dans `.env` :
```env
KIRO_CLI_TIMEOUT=600000  # 10 minutes
```

### Erreur : Workspace non configuré

**Solution** :
Définir le workspace dans `.env` :
```env
KIRO_CLI_WORKSPACE=/path/to/your/project
```

## Bonnes pratiques

1. **Contexte** : Fournir un contexte clair dans vos prompts
2. **Timeout** : Ajuster le timeout selon la complexité des tâches
3. **Streaming** : Utiliser `stream: true` pour les réponses longues
4. **Cache** : Mettre en cache les réponses fréquentes
5. **Monitoring** : Surveiller les logs pour détecter les problèmes

## Limitations

1. **Concurrence** : Limiter à 3-5 requêtes simultanées
2. **Contexte** : Kiro CLI nécessite un workspace configuré
3. **Authentification** : Session Kiro CLI doit être active
4. **Performance** : Optimisé pour l'interaction, pas pour le batch

## Support

- [Documentation Kiro CLI](https://kiro.dev/docs/cli/)
- [Exemples de workflows](../examples/)
- [Dépannage](./TROUBLESHOOTING.md)
