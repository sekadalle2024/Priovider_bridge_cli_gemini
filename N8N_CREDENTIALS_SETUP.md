# 🔑 Configuration des Credentials n8n - Guide Complet

## 🎯 Objectif

Configurer n8n pour utiliser votre serveur Gemini avec les nœuds LangChain (OpenAI Chat Model).

## 📋 Prérequis

- ✅ Serveur démarré: `node server-api-key.js`
- ✅ Serveur accessible sur `http://127.0.0.1:25808`
- ✅ Endpoints OpenAI disponibles: `/v1/chat/completions` et `/v1/models`

## 🔧 Étape 1: Créer les Credentials OpenAI

### Dans n8n:

1. **Aller dans:** Settings → Credentials
2. **Cliquer sur:** "Add Credential"
3. **Rechercher:** "OpenAI"
4. **Sélectionner:** "OpenAI API"

### Configuration:

| Champ | Valeur |
|-------|--------|
| **Credential Name** | `Gemini Local API` |
| **API Key** | `dummy-key` |
| **Base URL** | `http://127.0.0.1:25808/v1` |

**Important:** 
- L'API Key peut être n'importe quoi (elle n'est pas vérifiée)
- La Base URL doit se terminer par `/v1`
- Utilisez `127.0.0.1` (pas `localhost`) pour éviter les problèmes IPv6

### Capture d'écran de configuration:

```
┌─────────────────────────────────────────┐
│ OpenAI API Credentials                  │
├─────────────────────────────────────────┤
│ Credential Name: Gemini Local API       │
│ API Key: dummy-key                      │
│ Base URL: http://127.0.0.1:25808/v1    │
│                                         │
│ [Test Connection] [Save]                │
└─────────────────────────────────────────┘
```

## 🧪 Étape 2: Tester les Credentials

### Test 1: Vérifier la connexion

Cliquer sur "Test Connection" dans n8n.

**Résultat attendu:** ✅ Connection successful

### Test 2: Vérifier les modèles disponibles

Les modèles devraient apparaître automatiquement dans le dropdown:
- `gemini-2.5-flash`
- `gemini-1.5-flash`
- `gemini-1.5-pro`

## 🎨 Étape 3: Utiliser dans un Workflow

### Workflow simple avec OpenAI Chat Model

```
[Manual Trigger] → [OpenAI Chat Model] → [Output]
```

### Configuration du nœud "OpenAI Chat Model"

**1. Ajouter le nœud:**
- Rechercher "OpenAI Chat Model"
- Ajouter au workflow

**2. Configuration:**

| Paramètre | Valeur |
|-----------|--------|
| **Credentials** | Gemini Local API |
| **Model** | gemini-2.5-flash |
| **Temperature** | 0.7 |
| **Max Tokens** | 1000 |

**3. Connecter à un nœud de prompt:**

Ajouter un nœud "AI Agent" ou "Basic LLM Chain" avant.

### Exemple complet de workflow

```json
{
  "name": "Gemini LangChain Test",
  "nodes": [
    {
      "parameters": {},
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [240, 300]
    },
    {
      "parameters": {
        "model": "gemini-2.5-flash",
        "options": {
          "temperature": 0.7,
          "maxTokens": 1000
        }
      },
      "name": "Gemini Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "position": [460, 300],
      "credentials": {
        "openAiApi": {
          "name": "Gemini Local API"
        }
      }
    },
    {
      "parameters": {
        "text": "=Quelle est la capitale du Sénégal?"
      },
      "name": "Prompt",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "position": [680, 300]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{"node": "Gemini Chat Model", "type": "main", "index": 0}]]
    },
    "Gemini Chat Model": {
      "ai_languageModel": [[{"node": "Prompt", "type": "ai_languageModel", "index": 0}]]
    }
  }
}
```

## 🔄 Étape 4: Workflow avec HTTP Request (Alternative)

Si vous préférez utiliser HTTP Request au lieu de LangChain:

### Configuration HTTP Request

**URL:** `http://127.0.0.1:25808/api/chat`

**Method:** POST

**Body:**
```json
{
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ],
  "stream": false,
  "options": {
    "temperature": 0.7
  }
}
```

### Workflow complet

```
[Manual Trigger] → [Set: prompt] → [HTTP Request] → [Extract Response]
```

## 📊 Étape 5: Vérifier que ça fonctionne

### Vérifications dans la réponse

La réponse doit contenir:

```json
{
  "provider": "gemini_api_key_rotative",
  "keyUsed": "Key X/27",
  "model": "gemini-2.5-flash"
}
```

### Vérifications dans les logs du serveur

Dans le terminal où tourne `node server-api-key.js`:

```
[Rotation] Using key 1/27 (1/5 req/min)
```

## 🎯 Cas d'usage avancés

### Cas 1: RAG avec Vector Store

```
[Document Loader]
    ↓
[Text Splitter]
    ↓
[Embeddings: OpenAI] (utiliser Gemini Local API)
    ↓
[Vector Store: Pinecone/Qdrant]
    ↓
[Retriever]
    ↓
[OpenAI Chat Model: Gemini]
    ↓
[Output]
```

### Cas 2: Agent avec outils

```
[Manual Trigger]
    ↓
[OpenAI Chat Model: Gemini]
    ↓
[AI Agent]
    ↓
[Tools: Calculator, Wikipedia, HTTP Request]
    ↓
[Output]
```

### Cas 3: Conversation avec mémoire

```
[Webhook]
    ↓
[Memory: Buffer Memory]
    ↓
[OpenAI Chat Model: Gemini]
    ↓
[Conversation Chain]
    ↓
[Respond to Webhook]
```

## 🔍 Dépannage

### Problème 1: "Connection refused"

**Solution:** Utilisez `127.0.0.1` au lieu de `localhost`

```
Base URL: http://127.0.0.1:25808/v1
```

### Problème 2: "Invalid API Key"

**Solution:** Vérifiez que la Base URL se termine par `/v1`

```
✅ Bon: http://127.0.0.1:25808/v1
❌ Mauvais: http://127.0.0.1:25808
```

### Problème 3: "Model not found"

**Solution:** Vérifiez que le serveur est démarré et que `/v1/models` fonctionne

```bash
curl http://127.0.0.1:25808/v1/models
```

### Problème 4: n8n dans Docker

**Solution:** Utilisez `host.docker.internal` au lieu de `127.0.0.1`

```
Base URL: http://host.docker.internal:25808/v1
```

## ✅ Checklist finale

- [ ] Credentials créés dans n8n
- [ ] Base URL: `http://127.0.0.1:25808/v1`
- [ ] API Key: `dummy-key` (ou n'importe quoi)
- [ ] Test de connexion réussi
- [ ] Modèles visibles dans le dropdown
- [ ] Workflow de test créé
- [ ] Réponse contient `provider: gemini_api_key_rotative`
- [ ] Logs du serveur montrent la rotation

## 🎉 Prêt!

Vous pouvez maintenant utiliser tous les nœuds LangChain de n8n avec votre serveur Gemini local!

**Avantages:**
- ✅ 27 clés API avec rotation automatique
- ✅ 135 requêtes/minute de capacité
- ✅ Compatible avec tous les nœuds LangChain
- ✅ Pas de coût API externe
- ✅ Contrôle total sur les requêtes

---

**Documentation complète:**
- [N8N_LLM_CHAIN_SETUP.md](N8N_LLM_CHAIN_SETUP.md) - Configuration LLM Chain
- [N8N_CONNECTION_FIX.md](N8N_CONNECTION_FIX.md) - Fix erreur de connexion
- [TEST_ENDPOINTS.md](TEST_ENDPOINTS.md) - Tests des endpoints
