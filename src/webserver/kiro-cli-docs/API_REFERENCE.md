# Kiro CLI API Reference

## Vue d'ensemble

Cette référence documente tous les endpoints disponibles pour interagir avec Kiro CLI via l'API REST.

## Base URL

```
http://localhost:3000
```

## Authentification

Actuellement, l'API ne nécessite pas d'authentification. Pour ajouter l'authentification, configurez `JWT_SECRET` dans `.env`.

## Endpoints

### 1. Chat

#### POST `/api/kiro-cli/chat`

Envoie un message de chat à Kiro CLI.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user" | "assistant" | "system",
      "content": "string"
    }
  ],
  "stream": boolean (optional, default: false),
  "temperature": number (optional),
  "maxTokens": number (optional)
}
```

**Response (non-streaming):**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "kiro-cli",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Response text"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

**Response (streaming):**
```
data: {"content": "chunk1"}

data: {"content": "chunk2"}

data: [DONE]
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explique-moi les closures en JavaScript"}
    ]
  }'
```

**Codes d'erreur:**
- `400` - Requête invalide (messages manquants)
- `503` - Service non disponible (Kiro CLI non accessible)
- `500` - Erreur serveur interne

---

### 2. Generate Code

#### POST `/api/kiro-cli/generate`

Génère du code avec Kiro CLI.

**Request Body:**
```json
{
  "prompt": "string (required)",
  "language": "string (optional)",
  "context": {
    "key": "value"
  } (optional)
}
```

**Response:**
```json
{
  "success": true,
  "result": "Generated code or text",
  "metadata": {
    "language": "typescript",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une fonction pour valider un email",
    "language": "typescript"
  }'
```

**Codes d'erreur:**
- `400` - Prompt manquant
- `503` - Service non disponible
- `500` - Erreur serveur interne

---

### 3. Status

#### GET `/api/kiro-cli/status`

Obtient le statut du service Kiro CLI.

**Response:**
```json
{
  "provider": "kiro-cli",
  "available": true,
  "version": "1.0.0",
  "model": "claude-3-5-sonnet",
  "workspace": "/path/to/workspace",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Exemple cURL:**
```bash
curl http://localhost:3000/api/kiro-cli/status
```

**Codes d'erreur:**
- `500` - Erreur lors de la vérification du statut

---

### 4. Execute Command

#### POST `/api/kiro-cli/execute`

Exécute une commande Kiro CLI personnalisée.

**Request Body:**
```json
{
  "command": "string (required)",
  "args": ["string"] (optional)
}
```

**Response:**
```json
{
  "success": true,
  "command": "chat",
  "args": ["--help"],
  "result": "Command output",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/api/kiro-cli/execute \
  -H "Content-Type: application/json" \
  -d '{
    "command": "config",
    "args": ["list"]
  }'
```

**Codes d'erreur:**
- `400` - Commande manquante
- `503` - Service non disponible
- `500` - Erreur d'exécution

---

## Endpoints compatibles OpenAI

Ces endpoints suivent le format de l'API OpenAI pour une intégration facile avec n8n, LangChain, etc.

### 5. Chat Completions (OpenAI format)

#### POST `/v1/kiro-cli/chat/completions`

Format compatible avec l'API OpenAI Chat Completions.

**Request Body:**
```json
{
  "model": "kiro-cli",
  "messages": [
    {
      "role": "user" | "assistant" | "system",
      "content": "string"
    }
  ],
  "stream": boolean (optional),
  "temperature": number (optional, 0-2),
  "max_tokens": number (optional)
}
```

**Response (non-streaming):**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "kiro-cli",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Response text"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

**Response (streaming):**
```
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1234567890,"model":"kiro-cli","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1234567890,"model":"kiro-cli","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kiro-cli",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'
```

**Exemple avec streaming:**
```bash
curl -X POST http://localhost:3000/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kiro-cli",
    "messages": [
      {"role": "user", "content": "Écris un poème"}
    ],
    "stream": true
  }'
```

---

### 6. Completions (OpenAI legacy format)

#### POST `/v1/kiro-cli/completions`

Format compatible avec l'API OpenAI Completions (legacy).

**Request Body:**
```json
{
  "prompt": "string (required)",
  "stream": boolean (optional),
  "temperature": number (optional),
  "max_tokens": number (optional)
}
```

**Response:**
```json
{
  "id": "cmpl-xxx",
  "object": "text_completion",
  "created": 1234567890,
  "model": "kiro-cli",
  "choices": [
    {
      "text": "Completion text",
      "index": 0,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/v1/kiro-cli/completions \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Écris une fonction JavaScript pour"
  }'
```

---

## Codes d'erreur

### Format d'erreur standard

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Format d'erreur OpenAI

```json
{
  "error": {
    "message": "Detailed error message",
    "type": "error_type",
    "code": "error_code"
  }
}
```

### Codes HTTP

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 400 | Bad Request | Paramètres invalides |
| 401 | Unauthorized | Authentification requise |
| 403 | Forbidden | Accès refusé |
| 404 | Not Found | Endpoint non trouvé |
| 429 | Too Many Requests | Rate limit dépassé |
| 500 | Internal Server Error | Erreur serveur |
| 503 | Service Unavailable | Service non disponible |

### Types d'erreur

| Type | Description |
|------|-------------|
| `invalid_request_error` | Paramètres de requête invalides |
| `authentication_error` | Problème d'authentification |
| `service_unavailable` | Service non disponible |
| `server_error` | Erreur serveur interne |
| `kiro_cli_error` | Erreur spécifique à Kiro CLI |

---

## Rate Limiting

Actuellement, aucune limite de taux n'est appliquée. Pour des environnements de production, il est recommandé de :

1. Limiter à 3-5 requêtes simultanées
2. Implémenter un système de queue
3. Ajouter des timeouts appropriés

---

## Exemples de code

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function chatWithKiro(message) {
  try {
    const response = await axios.post('http://localhost:3000/api/kiro-cli/chat', {
      messages: [
        { role: 'user', content: message }
      ]
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Utilisation
chatWithKiro('Explique-moi les Promises')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### Python

```python
import requests

def chat_with_kiro(message):
    url = 'http://localhost:3000/api/kiro-cli/chat'
    payload = {
        'messages': [
            {'role': 'user', 'content': message}
        ]
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        raise

# Utilisation
result = chat_with_kiro('Explique-moi les décorateurs Python')
print(result)
```

### cURL avec streaming

```bash
curl -N -X POST http://localhost:3000/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Écris un long texte"}],
    "stream": true
  }'
```

---

## Webhooks et événements

Actuellement non supportés. Fonctionnalité prévue pour une version future.

---

## Versioning

Version actuelle : `v1`

Les endpoints sont préfixés par `/api` ou `/v1` selon le format.

---

## Support

Pour toute question ou problème :
- Consulter la [documentation principale](./README.md)
- Vérifier le [guide de dépannage](./TROUBLESHOOTING.md)
- Consulter les [exemples](./EXAMPLES.md)
