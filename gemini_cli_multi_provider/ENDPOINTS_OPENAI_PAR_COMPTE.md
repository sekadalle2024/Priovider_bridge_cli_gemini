# 🎯 Endpoints OpenAI Compatible - Un par Compte

## 📡 URLs Disponibles

Chaque compte Google dispose de son propre endpoint OpenAI compatible:

### Profile 2 - ohada.save@gmail.com
```
Base URL: http://localhost:25815/api/v1/cli/profile2
Endpoint Chat: http://localhost:25815/api/v1/cli/profile2/chat
```

### Profile 3 - ohada.save3@gmail.com
```
Base URL: http://localhost:25815/api/v1/cli/profile3
Endpoint Chat: http://localhost:25815/api/v1/cli/profile3/chat
```

## 🔧 Format de Requête (Compatible OpenAI)

Les endpoints utilisent exactement le même format que l'API OpenAI:

```json
POST /api/v1/cli/profile2/chat
Content-Type: application/json

{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "Votre message ici"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

## 📝 Exemples d'Utilisation

### cURL - Profile 2

```bash
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour depuis profile2"}
    ]
  }'
```

### cURL - Profile 3

```bash
curl -X POST http://localhost:25815/api/v1/cli/profile3/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour depuis profile3"}
    ]
  }'
```

### PowerShell - Profile 2

```powershell
$response = Invoke-RestMethod `
  -Uri "http://localhost:25815/api/v1/cli/profile2/chat" `
  -Method Post `
  -Body (@{
    model = "gemini-2.5-flash"
    messages = @(
      @{role="user"; content="Bonjour depuis profile2"}
    )
  } | ConvertTo-Json -Depth 5) `
  -ContentType "application/json"

$response.choices[0].message.content
```

### PowerShell - Profile 3

```powershell
$response = Invoke-RestMethod `
  -Uri "http://localhost:25815/api/v1/cli/profile3/chat" `
  -Method Post `
  -Body (@{
    model = "gemini-2.5-flash"
    messages = @(
      @{role="user"; content="Bonjour depuis profile3"}
    )
  } | ConvertTo-Json -Depth 5) `
  -ContentType "application/json"

$response.choices[0].message.content
```

### JavaScript/Node.js - Profile 2

```javascript
const response = await fetch('http://localhost:25815/api/v1/cli/profile2/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemini-2.5-flash',
    messages: [
      { role: 'user', content: 'Bonjour depuis profile2' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### JavaScript/Node.js - Profile 3

```javascript
const response = await fetch('http://localhost:25815/api/v1/cli/profile3/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemini-2.5-flash',
    messages: [
      { role: 'user', content: 'Bonjour depuis profile3' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python - Profile 2

```python
import requests

response = requests.post(
    'http://localhost:25815/api/v1/cli/profile2/chat',
    json={
        'model': 'gemini-2.5-flash',
        'messages': [
            {'role': 'user', 'content': 'Bonjour depuis profile2'}
        ]
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
```

### Python - Profile 3

```python
import requests

response = requests.post(
    'http://localhost:25815/api/v1/cli/profile3/chat',
    json={
        'model': 'gemini-2.5-flash',
        'messages': [
            {'role': 'user', 'content': 'Bonjour depuis profile3'}
        ]
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
```

## 🔗 Intégration n8n

### Configuration Profile 2

1. Créer un nœud **HTTP Request**
2. Configurer:
   - **Method**: POST
   - **URL**: `http://localhost:25815/api/v1/cli/profile2/chat`
   - **Authentication**: None
   - **Body Content Type**: JSON
   - **Body**:
     ```json
     {
       "model": "gemini-2.5-flash",
       "messages": [
         {
           "role": "user",
           "content": "{{ $json.message }}"
         }
       ]
     }
     ```

### Configuration Profile 3

Même configuration mais avec l'URL:
```
http://localhost:25815/api/v1/cli/profile3/chat
```

## 🔗 Intégration LangChain

### Profile 2

```javascript
import { ChatOpenAI } from "@langchain/openai";

const chat = new ChatOpenAI({
  modelName: "gemini-2.5-flash",
  openAIApiKey: "dummy-key", // Pas utilisé mais requis
  configuration: {
    baseURL: "http://localhost:25815/api/v1/cli/profile2"
  }
});

const response = await chat.invoke("Bonjour depuis profile2");
console.log(response.content);
```

### Profile 3

```javascript
import { ChatOpenAI } from "@langchain/openai";

const chat = new ChatOpenAI({
  modelName: "gemini-2.5-flash",
  openAIApiKey: "dummy-key", // Pas utilisé mais requis
  configuration: {
    baseURL: "http://localhost:25815/api/v1/cli/profile3"
  }
});

const response = await chat.invoke("Bonjour depuis profile3");
console.log(response.content);
```

## 📊 Format de Réponse (Compatible OpenAI)

```json
{
  "id": "chatcmpl-1772892224495",
  "object": "chat.completion",
  "created": 1772892224,
  "model": "gemini-2.5-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Réponse de Gemini ici"
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

## 🎯 Cas d'Usage

### Utilisation Séparée des Comptes

Vous pouvez maintenant utiliser chaque compte pour des usages différents:

**Profile 2 (ohada.save@gmail.com)**
- Application de production
- Workflows n8n critiques
- Intégrations clients

**Profile 3 (ohada.save3@gmail.com)**
- Environnement de développement
- Tests et expérimentations
- Workflows n8n de test

### Gestion des Quotas

Chaque endpoint a ses propres quotas:
- Profile 2: ~15-60 req/min, ~1-2M tokens/jour
- Profile 3: ~15-60 req/min, ~1-2M tokens/jour

**Total disponible**: ~30-120 req/min, ~2-4M tokens/jour

## 🔍 Monitoring par Compte

### Statistiques Profile 2

```bash
curl http://localhost:25815/api/v1/cli/profiles/profile2
```

Réponse:
```json
{
  "success": true,
  "profile": {
    "id": "profile2",
    "name": "Gemini CLI profile2",
    "account": "ohada.save@gmail.com",
    "port": 25812,
    "enabled": true
  },
  "stats": {
    "requests": 150,
    "errors": 2,
    "avgResponseTime": 850,
    "lastUsed": "2026-03-07T14:30:00.000Z",
    "isAvailable": true
  }
}
```

### Statistiques Profile 3

```bash
curl http://localhost:25815/api/v1/cli/profiles/profile3
```

## 🛠️ Gestion des Endpoints

### Désactiver Profile 2

```bash
curl -X POST http://localhost:25815/api/v1/cli/profiles/profile2/disable
```

L'endpoint `/api/v1/cli/profile2/chat` retournera une erreur jusqu'à réactivation.

### Réactiver Profile 2

```bash
curl -X POST http://localhost:25815/api/v1/cli/profiles/profile2/enable
```

## 📋 Résumé des URLs

| Compte | Base URL | Endpoint Chat |
|--------|----------|---------------|
| ohada.save@gmail.com | `http://localhost:25815/api/v1/cli/profile2` | `http://localhost:25815/api/v1/cli/profile2/chat` |
| ohada.save3@gmail.com | `http://localhost:25815/api/v1/cli/profile3` | `http://localhost:25815/api/v1/cli/profile3/chat` |

## ✅ Avantages

✅ **Un endpoint par compte** - Contrôle total sur quel compte utiliser  
✅ **Compatible OpenAI** - Fonctionne avec tous les outils OpenAI  
✅ **Pas de distribution automatique** - Vous choisissez le compte  
✅ **Monitoring séparé** - Statistiques par compte  
✅ **Gestion indépendante** - Activer/désactiver chaque compte  

## 🚀 Démarrage

Le serveur est déjà en cours d'exécution avec les 2 endpoints disponibles:

```bash
# Vérifier que le serveur tourne
curl http://localhost:25815/health

# Lister les profils disponibles
curl http://localhost:25815/api/v1/cli/profiles

# Tester profile2
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}]}'

# Tester profile3
curl -X POST http://localhost:25815/api/v1/cli/profile3/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}]}'
```

---

**Note**: Le load balancer (`/api/v1/cli/chat`) est toujours disponible si vous souhaitez une distribution automatique, mais vous pouvez l'ignorer et utiliser uniquement les endpoints spécifiques à chaque compte.

