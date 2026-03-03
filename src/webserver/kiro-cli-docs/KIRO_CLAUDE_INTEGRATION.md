# Intégration Kiro CLI avec Claude Sonnet 4.5

## Vue d'ensemble

Cette documentation décrit l'intégration de Kiro CLI avec Claude Sonnet 4.5 comme endpoint OpenAI-compatible dans le serveur AionUI.

## Qu'est-ce que Kiro CLI ?

Kiro CLI est un assistant de développement IA qui fonctionne directement dans le terminal. Il offre un accès gratuit à Claude Sonnet 4.5 et d'autres modèles Claude via une interface simple.

**Avantages :**
- ✅ Accès gratuit à Claude Sonnet 4.5
- ✅ Interface OpenAI-compatible
- ✅ Support du streaming
- ✅ Contexte de projet automatique
- ✅ Intégration avec Model Context Protocol (MCP)

## Installation de Kiro CLI

### Windows

```powershell
# Via npm (recommandé)
npm install -g @kirodotdev/cli

# Ou via le script d'installation
irm https://kiro.dev/install.ps1 | iex
```

### Linux/macOS

```bash
# Via npm
npm install -g @kirodotdev/cli

# Ou via curl
curl -fsSL https://kiro.dev/install.sh | sh
```

### Vérification de l'installation

```bash
kiro --version
```

## Configuration

### 1. Authentification Kiro CLI

Avant d'utiliser Kiro CLI, vous devez vous authentifier :

```bash
# Se connecter à Kiro
kiro auth login

# Vérifier le statut
kiro auth status
```

### 2. Configuration du serveur

Les variables d'environnement sont déjà configurées dans `.env` :

```env
KIRO_CLI_ENABLED=true
KIRO_CLI_PATH=kiro
KIRO_CLI_WORKSPACE=./workspace
KIRO_CLI_MODEL=claude-sonnet-4-5
KIRO_CLI_TIMEOUT=300000
KIRO_CLI_AUTO_START=true
KIRO_AVAILABLE_MODELS=claude-sonnet-4-5,claude-opus-4-5,claude-sonnet-3-5,claude-haiku-3-5
```

### 3. Démarrage du serveur

Le serveur Kiro CLI démarre automatiquement avec le serveur principal :

```bash
# Démarrer le serveur
npm run start:assistants

# Ou en mode développement
npm run dev:assistants
```

## Endpoints disponibles

### 1. Endpoint OpenAI-compatible (Recommandé)

**Base URL :** `http://localhost:25810/v1/kiro-cli`

#### Chat Completions

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Explique-moi les closures en JavaScript"}
    ],
    "stream": false
  }'
```

#### Streaming

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Génère un composant React"}
    ],
    "stream": true
  }'
```

### 2. Endpoints natifs Kiro

#### Chat simple

```bash
curl -X POST http://localhost:25810/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

#### Génération de code

```bash
curl -X POST http://localhost:25810/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une fonction pour valider un email",
    "language": "typescript"
  }'
```

#### Statut du service

```bash
curl http://localhost:25810/api/kiro-cli/status
```

### 3. Liste des modèles

```bash
curl http://localhost:25810/v1/kiro-cli/models \
  -H "Authorization: Bearer your-api-key"
```

Réponse :

```json
{
  "object": "list",
  "data": [
    {
      "id": "claude-sonnet-4-5",
      "object": "model",
      "created": 1234567890,
      "owned_by": "anthropic",
      "permission": [],
      "root": "claude-sonnet-4-5",
      "parent": null
    },
    {
      "id": "claude-opus-4-5",
      "object": "model",
      "created": 1234567890,
      "owned_by": "anthropic"
    }
  ]
}
```

## Intégration n8n

### Configuration du nœud HTTP Request

1. **Method**: POST
2. **URL**: `http://localhost:25810/v1/kiro-cli/chat/completions`
3. **Authentication**: Bearer Token (optionnel)
4. **Headers**:
   ```json
   {
     "Content-Type": "application/json"
   }
   ```
5. **Body**:
   ```json
   {
     "model": "claude-sonnet-4-5",
     "messages": [
       {"role": "user", "content": "{{ $json.prompt }}"}
     ],
     "stream": false
   }
   ```

### Configuration LangChain Chat Model

1. **Base URL**: `http://localhost:25810/v1/kiro-cli`
2. **Model**: `claude-sonnet-4-5`
3. **API Key**: Votre clé (optionnel si JWT_SECRET est configuré)

### Exemple de workflow n8n

```json
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "http://localhost:25810/v1/kiro-cli/chat/completions",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "claude-sonnet-4-5"
            },
            {
              "name": "messages",
              "value": "={{ [{\"role\": \"user\", \"content\": $json.prompt}] }}"
            }
          ]
        }
      },
      "name": "Kiro Claude Chat",
      "type": "n8n-nodes-base.httpRequest",
      "position": [250, 300]
    }
  ]
}
```

## Modèles disponibles

| Modèle | Description | Cas d'usage |
|--------|-------------|-------------|
| `claude-sonnet-4-5` | Modèle par défaut, équilibré | Usage général, développement |
| `claude-opus-4-5` | Modèle le plus puissant | Tâches complexes, raisonnement |
| `claude-sonnet-3-5` | Version précédente | Compatibilité |
| `claude-haiku-3-5` | Modèle rapide et léger | Tâches simples, prototypage |

## Fonctionnalités avancées

### 1. Contexte de projet

Kiro CLI maintient automatiquement le contexte du projet :

```javascript
const response = await fetch('http://localhost:25810/api/kiro-cli/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      {
        role: 'user',
        content: 'Analyse le fichier src/index.ts et suggère des améliorations'
      }
    ],
    context: {
      workspace: './workspace',
      files: ['src/index.ts']
    }
  })
});
```

### 2. Streaming avec Server-Sent Events

```javascript
const eventSource = new EventSource(
  'http://localhost:25810/v1/kiro-cli/chat/completions?stream=true',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-api-key'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      messages: [
        { role: 'user', content: 'Génère un composant React' }
      ]
    })
  }
);

eventSource.onmessage = (event) => {
  if (event.data === '[DONE]') {
    eventSource.close();
    return;
  }
  
  const data = JSON.parse(event.data);
  console.log(data.choices[0].delta.content);
};
```

### 3. Paramètres de génération

```json
{
  "model": "claude-sonnet-4-5",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 2000,
  "top_p": 0.9,
  "stream": false
}
```

## Comparaison avec d'autres providers

| Feature | Kiro CLI | Gemini CLI | OpenAI API |
|---------|----------|------------|------------|
| Coût | Gratuit | Gratuit | Payant |
| Modèle | Claude Sonnet 4.5 | Gemini 2.5 Flash | GPT-4 |
| Streaming | ✅ | ✅ | ✅ |
| Contexte projet | ✅ | ✅ | ❌ |
| OpenAI-compatible | ✅ | ✅ | ✅ |
| Rate limits | Modérés | 5 req/min | Variables |

## Dépannage

### Kiro CLI non trouvé

```bash
# Vérifier l'installation
kiro --version

# Réinstaller si nécessaire
npm install -g @kirodotdev/cli
```

### Erreur d'authentification

```bash
# Se reconnecter
kiro auth logout
kiro auth login

# Vérifier le statut
kiro auth status
```

### Timeout

Augmenter le timeout dans `.env` :

```env
KIRO_CLI_TIMEOUT=600000  # 10 minutes
```

### Port déjà utilisé

Modifier le port dans `.env` :

```env
ASSISTANT_PORT=25811
```

### Erreur de workspace

Créer le dossier workspace :

```bash
mkdir -p workspace
```

## Limites et considérations

1. **Performance** : Kiro CLI est conçu pour l'interaction interactive, pas pour des requêtes massives
2. **Contexte** : Nécessite un workspace configuré pour fonctionner correctement
3. **Authentification** : Requiert une session Kiro CLI authentifiée
4. **Concurrence** : Limiter le nombre de requêtes simultanées (recommandé : 5 max)
5. **Quotas** : Respecter les limites d'utilisation de Kiro (vérifier sur kiro.dev)

## Ressources

- [Documentation officielle Kiro](https://kiro.dev/docs/cli/)
- [GitHub Kiro](https://github.com/kirodotdev/Kiro)
- [Kiro CLI Commands](https://kiro.dev/docs/cli/reference/cli-commands)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## Support

Pour toute question ou problème :
1. Consulter la documentation officielle Kiro
2. Vérifier les logs du serveur : `npm run logs:assistants`
3. Tester Kiro CLI directement : `kiro chat`
4. Rejoindre la communauté Discord Kiro

## Exemples d'utilisation

### Exemple 1 : Chat simple avec curl

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "system", "content": "Tu es un expert en JavaScript"},
      {"role": "user", "content": "Explique les promises"}
    ]
  }'
```

### Exemple 2 : Génération de code avec Node.js

```javascript
const fetch = require('node-fetch');

async function generateCode() {
  const response = await fetch('http://localhost:25810/v1/kiro-cli/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      messages: [
        {
          role: 'user',
          content: 'Crée une fonction TypeScript pour valider un email'
        }
      ]
    })
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}

generateCode();
```

### Exemple 3 : Streaming avec Python

```python
import requests
import json

url = "http://localhost:25810/v1/kiro-cli/chat/completions"
headers = {"Content-Type": "application/json"}
data = {
    "model": "claude-sonnet-4-5",
    "messages": [
        {"role": "user", "content": "Génère un composant React"}
    ],
    "stream": True
}

response = requests.post(url, headers=headers, json=data, stream=True)

for line in response.iter_lines():
    if line:
        line = line.decode('utf-8')
        if line.startswith('data: '):
            content = line[6:]
            if content == '[DONE]':
                break
            try:
                chunk = json.loads(content)
                print(chunk['choices'][0]['delta'].get('content', ''), end='')
            except:
                pass
```

## Conclusion

L'intégration de Kiro CLI avec Claude Sonnet 4.5 offre un accès gratuit et puissant à l'un des meilleurs modèles de langage disponibles. Grâce à l'interface OpenAI-compatible, vous pouvez facilement intégrer Kiro dans vos workflows existants avec n8n, LangChain, ou tout autre outil compatible OpenAI.
