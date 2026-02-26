# ⚡ n8n Quick Setup - Copier-Coller

Configuration ultra-rapide pour n8n. Copiez-collez directement!

## 🎯 Configuration HTTP Request dans n8n

### Étape 1: Créer le nœud HTTP Request

1. Ajouter un nœud "HTTP Request"
2. Copier-coller les configurations ci-dessous

### Étape 2: Configuration de base

**Method:** `POST`

**URL:** 
```
http://localhost:25808/api/chat
```

**Si n8n est dans Docker:**
```
http://host.docker.internal:25808/api/chat
```

### Étape 3: Body (JSON)

**Activer:** "Send Body" → Yes  
**Type:** JSON

**Copier-coller ce JSON:**

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

### Étape 4: Ajouter un nœud Set avant

**Values to Set:**

| Name | Type | Value |
|------|------|-------|
| prompt | String | Quelle est la capitale du Sénégal? |

## 🧪 Test rapide

### Option 1: Test avec curl dans n8n

Si vous voulez tester avec curl dans un nœud "Execute Command":

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Bonjour"}],"stream":false}'
```

### Option 2: Test direct

**Workflow minimal:**

```
[Manual Trigger] → [Set: prompt] → [HTTP Request: Gemini API]
```

**Configuration Set:**
```json
{
  "prompt": "Quelle est la capitale du Mali?"
}
```

**Configuration HTTP Request:**
- URL: `http://localhost:25808/api/chat`
- Method: POST
- Body: (voir JSON ci-dessus)

## 📊 Résultat attendu

```json
{
  "model": "gemini-2.5-flash",
  "provider": "gemini_api_key_rotative",
  "created_at": "2026-02-26T20:20:00.000Z",
  "message": {
    "role": "assistant",
    "content": "La capitale du Mali est Bamako."
  },
  "done": true,
  "keyUsed": "Key 1/27"
}
```

## 🎨 Exemples de prompts

### Exemple 1: Question simple

**Prompt:**
```
Quelle est la capitale du Sénégal?
```

**Réponse:**
```
La capitale du Sénégal est Dakar.
```

### Exemple 2: Génération de code

**Prompt:**
```
Écris une fonction Python pour calculer la suite de Fibonacci
```

**Body JSON:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Écris une fonction Python pour calculer la suite de Fibonacci"
    }
  ],
  "stream": false,
  "options": {
    "temperature": 0.3
  }
}
```

### Exemple 3: Créatif

**Prompt:**
```
Écris un haiku sur l'intelligence artificielle
```

**Body JSON:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Écris un haiku sur l'intelligence artificielle"
    }
  ],
  "stream": false,
  "options": {
    "temperature": 0.9
  }
}
```

## 🔄 Workflow complet (JSON à importer)

**Copier ce JSON et l'importer dans n8n:**

```json
{
  "name": "Gemini API - Quick Test",
  "nodes": [
    {
      "parameters": {},
      "name": "Start",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300],
      "typeVersion": 1
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
        }
      },
      "name": "Set",
      "type": "n8n-nodes-base.set",
      "position": [450, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "http://localhost:25808/api/chat",
        "requestMethod": "POST",
        "jsonParameters": true,
        "bodyParametersJson": "={\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"{{ $json.prompt }}\"\n    }\n  ],\n  \"stream\": false,\n  \"options\": {\n    \"temperature\": 0.7\n  }\n}",
        "options": {}
      },
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300],
      "typeVersion": 3
    }
  ],
  "connections": {
    "Start": {
      "main": [[{"node": "Set", "type": "main", "index": 0}]]
    },
    "Set": {
      "main": [[{"node": "HTTP Request", "type": "main", "index": 0}]]
    }
  }
}
```

## ✅ Vérification

### Vérifier que ça fonctionne

1. **Exécuter le workflow**
2. **Vérifier la réponse** contient:
   - ✅ `"provider": "gemini_api_key_rotative"`
   - ✅ `"keyUsed": "Key X/27"`
   - ✅ `"model": "gemini-2.5-flash"`
   - ✅ Une réponse dans `message.content`

### Vérifier les logs du serveur

Dans le terminal où tourne `node server-api-key.js`:

```
[Rotation] Using key 1/27 (1/5 req/min)
```

## 🎯 Prêt!

Vous pouvez maintenant utiliser Gemini dans n8n avec rotation automatique des 27 clés API!

**Capacité**: 135 requêtes/minute

---

**Plus d'exemples**: [GUIDE_N8N_INTEGRATION.md](GUIDE_N8N_INTEGRATION.md)  
**Configuration avancée**: [n8n-config-example.md](n8n-config-example.md)
