# 🔧 Configuration n8n - Exemple complet

## Configuration du nœud HTTP Request pour Gemini API Key Rotative

### ⚙️ Configuration de base

```
Node Type: HTTP Request
Name: Gemini API Chat
```

### 📝 Paramètres principaux

**Authentication:**
```
Authentication: None
```

**Request Method:**
```
POST
```

**URL:**
```
http://localhost:25808/api/chat
```

**Si n8n est dans Docker:**
```
http://host.docker.internal:25808/api/chat
```

### 📋 Headers

Ajouter ces headers:

| Name | Value |
|------|-------|
| Content-Type | application/json |
| Accept | application/json |

### 📦 Body

**Send Body:** Yes  
**Body Content Type:** JSON  
**Specify Body:** Using JSON

**JSON Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "stream": false,
  "options": {
    "temperature": 0.7
  }
}
```

### 🔄 Options

**Response:**
- Response Format: JSON
- Full Response: No (seulement le body)

**Pagination:**
- Pagination: Off

**Options:**
- Ignore SSL Issues: No
- Timeout: 60000 (60 secondes)

**Retry On Fail:**
- Retry On Fail: Yes
- Max Tries: 3
- Wait Between Tries: 1000ms

## 📊 Exemple de workflow complet

### Workflow JSON (à importer dans n8n)

```json
{
  "name": "Gemini API Key Rotative - Test",
  "nodes": [
    {
      "parameters": {},
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "prompt",
              "value": "Quelle est la capitale du Sénégal?"
            }
          ]
        },
        "options": {}
      },
      "name": "Set Prompt",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "http://localhost:25808/api/chat",
        "authentication": "none",
        "requestMethod": "POST",
        "jsonParameters": true,
        "bodyParametersJson": "={\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"{{ $json.prompt }}\"\n    }\n  ],\n  \"stream\": false,\n  \"options\": {\n    \"temperature\": 0.7\n  }\n}",
        "options": {
          "timeout": 60000
        }
      },
      "name": "Gemini API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "// Extraire la réponse\nconst response = $input.item.json;\n\nreturn {\n  json: {\n    prompt: items[0].json.prompt,\n    response: response.message.content,\n    model: response.model,\n    provider: response.provider,\n    keyUsed: response.keyUsed,\n    timestamp: response.created_at\n  }\n};"
      },
      "name": "Extract Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 300]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{"node": "Set Prompt", "type": "main", "index": 0}]]
    },
    "Set Prompt": {
      "main": [[{"node": "Gemini API", "type": "main", "index": 0}]]
    },
    "Gemini API": {
      "main": [[{"node": "Extract Response", "type": "main", "index": 0}]]
    }
  }
}
```

## 🎯 Test rapide

### 1. Copier la configuration

Copier le JSON ci-dessus

### 2. Importer dans n8n

1. Ouvrir n8n
2. Cliquer sur "Workflows" → "Import from File" ou "Import from URL"
3. Coller le JSON
4. Cliquer sur "Import"

### 3. Tester

1. Cliquer sur "Execute Workflow"
2. Vérifier le résultat dans "Extract Response"

**Résultat attendu:**
```json
{
  "prompt": "Quelle est la capitale du Sénégal?",
  "response": "La capitale du Sénégal est Dakar.",
  "model": "gemini-2.5-flash",
  "provider": "gemini_api_key_rotative",
  "keyUsed": "Key 1/27",
  "timestamp": "2026-02-26T20:20:00.000Z"
}
```

## 🔄 Variations

### Variation 1: Avec paramètres dynamiques

**Body JSON:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "stream": false,
  "model": "{{ $json.model || 'gemini-2.5-flash' }}",
  "options": {
    "temperature": {{ $json.temperature || 0.7 }},
    "max_tokens": {{ $json.max_tokens || 1000 }}
  }
}
```

**Nœud Set:**
```json
{
  "prompt": "Écris un haiku sur l'IA",
  "temperature": 0.9,
  "max_tokens": 500,
  "model": "gemini-2.5-flash"
}
```

### Variation 2: Endpoint Generate

**URL:**
```
http://localhost:25808/api/generate
```

**Body JSON:**
```json
{
  "prompt": "{{ $json.prompt }}",
  "stream": false,
  "options": {
    "temperature": 0.7
  }
}
```

### Variation 3: Avec conversation

**Body JSON:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Bonjour!"
    },
    {
      "role": "assistant",
      "content": "Bonjour! Comment puis-je vous aider?"
    },
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "stream": false
}
```

## 📊 Monitoring

### Ajouter un nœud Stats

**Configuration:**
```
Method: GET
URL: http://localhost:25808/api/stats
```

**Utilisation:**
- Vérifier les clés disponibles
- Monitorer l'utilisation
- Déclencher des alertes si nécessaire

## 🎨 Cas d'usage avancés

### Cas 1: Traitement batch avec délai

```
[Manual Trigger]
    ↓
[Function: Create Array of Prompts]
    ↓
[Split In Batches: Batch Size 5]
    ↓
[HTTP Request: Gemini API]
    ↓
[Wait: 1 second]
    ↓
[Loop Back to Split In Batches]
    ↓
[Merge]
```

### Cas 2: Avec webhook

```
[Webhook: POST /gemini]
    ↓
[Set: Extract prompt from webhook]
    ↓
[HTTP Request: Gemini API]
    ↓
[Respond to Webhook]
```

**Webhook Body attendu:**
```json
{
  "prompt": "Votre question ici"
}
```

### Cas 3: Avec base de données

```
[Schedule Trigger: Every hour]
    ↓
[Postgres: Get pending questions]
    ↓
[HTTP Request: Gemini API]
    ↓
[Postgres: Update with responses]
```

## ✅ Vérification

### Checklist avant utilisation

- [ ] Serveur démarré
- [ ] URL correcte (localhost ou host.docker.internal)
- [ ] Headers configurés
- [ ] Body JSON valide
- [ ] Timeout suffisant (60s recommandé)
- [ ] Retry configuré (3 tentatives)

### Test de validation

**Commande curl équivalente:**
```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Test"}
    ],
    "stream": false
  }'
```

**Réponse attendue:**
```json
{
  "model": "gemini-2.5-flash",
  "provider": "gemini_api_key_rotative",
  "message": {
    "role": "assistant",
    "content": "..."
  },
  "done": true,
  "keyUsed": "Key X/27"
}
```

## 🎉 Prêt à l'emploi!

Votre configuration n8n est maintenant prête à utiliser le serveur Gemini API Key avec rotation automatique!

---

**Documentation complète**: [GUIDE_N8N_INTEGRATION.md](GUIDE_N8N_INTEGRATION.md)
