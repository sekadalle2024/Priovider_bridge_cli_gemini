# 🔧 Fix: Erreur de connexion n8n (ECONNREFUSED ::1:25808)

## ❌ Problème

```
connect ECONNREFUSED ::1:25808
```

**Cause:** n8n essaie de se connecter via IPv6 (`::1`) au lieu d'IPv4 (`127.0.0.1`).

## ✅ Solutions

### Solution 1: Utiliser 127.0.0.1 au lieu de localhost

Dans votre nœud HTTP Request n8n, remplacez:

❌ **Mauvais:**
```
http://localhost:25808/api/chat
```

✅ **Bon:**
```
http://127.0.0.1:25808/api/chat
```

### Solution 2: Si n8n est dans Docker

Si n8n tourne dans Docker, utilisez:

```
http://host.docker.internal:25808/api/chat
```

### Solution 3: Forcer le serveur à écouter sur IPv4 et IPv6

Modifier `server-api-key.js` pour écouter sur `0.0.0.0`:

```javascript
// Remplacer cette ligne
const HOST = ALLOW_REMOTE ? '0.0.0.0' : '127.0.0.1';

// Par
const HOST = '0.0.0.0'; // Écoute sur toutes les interfaces
```

## 🧪 Test de connexion

### Test 1: Vérifier que le serveur écoute

```bash
# Windows PowerShell
netstat -an | findstr "25808"

# Devrait afficher:
# TCP    0.0.0.0:25808          0.0.0.0:0              LISTENING
# ou
# TCP    127.0.0.1:25808        0.0.0.0:0              LISTENING
```

### Test 2: Test curl avec IPv4

```bash
curl http://127.0.0.1:25808/health
```

### Test 3: Test curl avec IPv6

```bash
curl http://[::1]:25808/health
```

## 🔧 Configuration n8n corrigée

### Workflow JSON corrigé

```json
{
  "nodes": [
    {
      "parameters": {},
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [0, 0],
      "name": "When clicking 'Execute workflow'"
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
      "name": "Set Prompt",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [176, 112]
    },
    {
      "parameters": {
        "url": "http://127.0.0.1:25808/api/chat",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": []
        },
        "jsonParameters": true,
        "bodyParametersJson": "={\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"{{ $json.prompt }}\"\n    }\n  ],\n  \"stream\": false\n}",
        "options": {
          "timeout": 60000
        }
      },
      "name": "Gemini API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [400, 112]
    },
    {
      "parameters": {
        "jsCode": "// Extraire la réponse\nconst response = $input.item.json;\n\nreturn {\n  json: {\n    prompt: $('Set Prompt').item.json.prompt,\n    response: response.message.content,\n    model: response.model,\n    provider: response.provider,\n    keyUsed: response.keyUsed,\n    timestamp: response.created_at\n  }\n};"
      },
      "name": "Extract Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [624, 112]
    }
  ],
  "connections": {
    "When clicking 'Execute workflow'": {
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

### Changements clés

1. **URL:** `http://127.0.0.1:25808/api/chat` (au lieu de localhost)
2. **Method:** `POST` explicite
3. **sendBody:** `true`
4. **jsonParameters:** `true`
5. **bodyParametersJson:** JSON correct avec template
6. **Code JS:** Utilise `$('Set Prompt').item.json.prompt` au lieu de `items[0]`

## 📋 Checklist de dépannage

- [ ] Serveur démarré: `node server-api-key.js`
- [ ] Serveur écoute sur le bon port: `netstat -an | findstr "25808"`
- [ ] URL utilise `127.0.0.1` (pas `localhost`)
- [ ] n8n peut accéder au réseau local
- [ ] Firewall autorise la connexion
- [ ] Pas de proxy qui bloque

## 🎯 Test rapide dans n8n

### Configuration minimale

**Nœud HTTP Request:**

```
URL: http://127.0.0.1:25808/api/chat
Method: POST
Authentication: None
Send Body: Yes
Body Content Type: JSON
Specify Body: Using JSON

Body:
{
  "messages": [
    {
      "role": "user",
      "content": "Test"
    }
  ],
  "stream": false
}
```

**Résultat attendu:**

```json
{
  "model": "gemini-2.5-flash",
  "provider": "gemini_api_key_rotative",
  "message": {
    "role": "assistant",
    "content": "..."
  },
  "done": true,
  "keyUsed": "Key 1/27"
}
```

## 🚀 Si ça ne marche toujours pas

### Option 1: Redémarrer le serveur avec 0.0.0.0

```bash
# Arrêter le serveur actuel (Ctrl+C)

# Modifier server-api-key.js
# Ligne ~13: const HOST = '0.0.0.0';

# Redémarrer
node server-api-key.js
```

### Option 2: Utiliser l'IP de votre machine

```bash
# Trouver votre IP locale
ipconfig

# Utiliser cette IP dans n8n
http://192.168.X.X:25808/api/chat
```

### Option 3: Tester avec Postman/Insomnia d'abord

Avant de tester dans n8n, vérifiez que l'API fonctionne avec Postman:

```
POST http://127.0.0.1:25808/api/chat
Content-Type: application/json

{
  "messages": [
    {"role": "user", "content": "Test"}
  ],
  "stream": false
}
```

## ✅ Vérification finale

Une fois corrigé, vous devriez voir dans les logs du serveur:

```
[Rotation] Using key 1/27 (1/5 req/min)
```

Et dans n8n:

```json
{
  "provider": "gemini_api_key_rotative",
  "keyUsed": "Key 1/27"
}
```

---

**Résumé:** Utilisez `http://127.0.0.1:25808/api/chat` au lieu de `http://localhost:25808/api/chat`
