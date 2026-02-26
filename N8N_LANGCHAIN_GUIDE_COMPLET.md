# 🎯 Guide Complet: LLM Chain avec Gemini dans n8n

## ✅ Réponses à vos questions

### 1. Dois-je utiliser un nœud Ollama?

**NON!** Utilisez le nœud **"OpenAI Chat Model"** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`).

Votre serveur est compatible OpenAI grâce à l'endpoint `/v1/chat/completions`.

### 2. Quelle URL intégrer?

**Base URL:** `http://127.0.0.1:25808/v1`

**Important:** 
- ✅ Utilisez `127.0.0.1` (pas `localhost`)
- ✅ Terminez par `/v1`
- ✅ Si n8n est dans Docker: `http://host.docker.internal:25808/v1`

### 3. Ai-je besoin d'une clé API?

**OUI, mais n'importe laquelle!** Le serveur ne vérifie pas la clé.

**Exemples valides:**
- `dummy-key`
- `test`
- `abc123`
- `gemini-local`

## 🔧 Configuration Étape par Étape

### Étape 1: Créer les Credentials OpenAI

**Dans n8n:**

1. **Aller dans:** Settings → Credentials
2. **Cliquer sur:** "Add Credential"
3. **Rechercher:** "OpenAI"
4. **Sélectionner:** "OpenAI API"

**Remplir les champs:**

```
┌─────────────────────────────────────────┐
│ OpenAI API Credentials                  │
├─────────────────────────────────────────┤
│ Credential Name: Gemini Local API       │
│                                         │
│ API Key: dummy-key                      │
│                                         │
│ Base URL: http://127.0.0.1:25808/v1    │
│                                         │
│ [Test Connection] [Save]                │
└─────────────────────────────────────────┘
```

**Cliquer sur "Save"**

### Étape 2: Configurer le nœud "Gemini Chat Model"

**Dans votre workflow:**

1. **Cliquer sur le nœud "Gemini Chat Model"**

2. **Configuration:**

```
┌─────────────────────────────────────────┐
│ Gemini Chat Model                       │
├─────────────────────────────────────────┤
│ Credentials: Gemini Local API           │
│                                         │
│ Model: gemini-2.5-flash                 │
│                                         │
│ Options:                                │
│   Temperature: 0.7                      │
│   Max Tokens: 1000                      │
└─────────────────────────────────────────┘
```

3. **Connecter au nœud "Basic LLM Chain"**

### Étape 3: Configurer "Set Question"

**Dans le nœud "Set Question":**

```json
{
  "values": {
    "string": [
      {
        "name": "question",
        "value": "Quelle est la capitale du Sénégal?"
      }
    ]
  }
}
```

### Étape 4: Configurer "Basic LLM Chain"

**Dans le nœud "Basic LLM Chain":**

```
Prompt Type: Define below
Text: ={{ $json.question }}
```

## 🎨 Workflow Complet Corrigé

Voici votre workflow avec les bonnes connexions:

```json
{
  "name": "Gemini LangChain - Simple",
  "nodes": [
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "When clicking 'Execute Workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "question",
              "value": "Quelle est la capitale du Sénégal?"
            }
          ]
        }
      },
      "id": "set-question",
      "name": "Set Question",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "model": "gemini-2.5-flash",
        "options": {
          "temperature": 0.7,
          "maxTokens": 1000
        }
      },
      "id": "gemini-chat-model",
      "name": "Gemini Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "typeVersion": 1,
      "position": [680, 200],
      "credentials": {
        "openAiApi": {
          "id": "YOUR_CREDENTIAL_ID",
          "name": "Gemini Local API"
        }
      }
    },
    {
      "parameters": {
        "promptType": "define",
        "text": "={{ $json.question }}"
      },
      "id": "basic-llm-chain",
      "name": "Basic LLM Chain",
      "type": "@n8n/n8n-nodes-langchain.chainLlm",
      "typeVersion": 1.3,
      "position": [900, 300]
    }
  ],
  "connections": {
    "When clicking 'Execute Workflow'": {
      "main": [
        [
          {
            "node": "Set Question",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set Question": {
      "main": [
        [
          {
            "node": "Basic LLM Chain",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gemini Chat Model": {
      "ai_languageModel": [
        [
          {
            "node": "Basic LLM Chain",
            "type": "ai_languageModel",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🔍 Vérifications

### Vérifier que le serveur fonctionne

```bash
# Test 1: Health check
curl http://127.0.0.1:25808/health

# Test 2: Voir les modèles
curl http://127.0.0.1:25808/v1/models

# Test 3: Test OpenAI endpoint
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Test"}]
  }'
```

### Vérifier les credentials dans n8n

1. **Aller dans:** Settings → Credentials
2. **Trouver:** "Gemini Local API"
3. **Cliquer sur:** "Test Connection"
4. **Résultat attendu:** ✅ Connection successful

## 🎯 Résumé Configuration

| Paramètre | Valeur |
|-----------|--------|
| **Nœud à utiliser** | OpenAI Chat Model (PAS Ollama) |
| **Credentials Type** | OpenAI API |
| **API Key** | `dummy-key` (n'importe quoi) |
| **Base URL** | `http://127.0.0.1:25808/v1` |
| **Model** | `gemini-2.5-flash` |
| **Temperature** | 0.7 (ajustable) |
| **Max Tokens** | 1000 (ajustable) |

## 🚀 Exécution du Workflow

### 1. Cliquer sur "Execute Workflow"

### 2. Résultat attendu

**Dans le nœud "Basic LLM Chain":**

```json
{
  "response": {
    "text": "La capitale du Sénégal est Dakar."
  }
}
```

### 3. Vérifier dans les logs du serveur

Dans le terminal où tourne `node server-api-key.js`:

```
[Rotation] Using key 1/27 (1/5 req/min)
[OpenAI API] Request received
```

## 🎨 Exemples de Prompts

### Exemple 1: Question simple

```
Question: Quelle est la capitale du Mali?
Réponse: La capitale du Mali est Bamako.
```

### Exemple 2: Créatif

```
Question: Écris un haiku sur l'IA
Réponse:
Bits et algorithmes
L'esprit numérique s'éveille
Demain commence ici
```

### Exemple 3: Technique

```
Question: Explique la différence entre IA et ML
Réponse: L'IA (Intelligence Artificielle) est le domaine général...
```

## 🔧 Dépannage

### Problème 1: "Connection refused"

**Solution:** Vérifiez la Base URL

```
✅ Bon: http://127.0.0.1:25808/v1
❌ Mauvais: http://localhost:25808/v1
❌ Mauvais: http://127.0.0.1:25808 (manque /v1)
```

### Problème 2: "Invalid API Key"

**Solution:** Vérifiez que la Base URL se termine par `/v1`

### Problème 3: "Model not found"

**Solution:** Vérifiez que le serveur est démarré

```bash
curl http://127.0.0.1:25808/v1/models
```

### Problème 4: Credentials non trouvés

**Solution:** Recréez les credentials avec le bon nom

## ✅ Checklist

- [ ] Serveur démarré: `node server-api-key.js`
- [ ] Endpoint `/v1/models` fonctionne
- [ ] Credentials "Gemini Local API" créés dans n8n
- [ ] Base URL: `http://127.0.0.1:25808/v1`
- [ ] API Key: `dummy-key` (ou n'importe quoi)
- [ ] Nœud "OpenAI Chat Model" configuré
- [ ] Model: `gemini-2.5-flash`
- [ ] Workflow exécuté avec succès

## 🎉 Prêt!

Votre workflow LangChain est maintenant configuré et prêt à utiliser!

**Avantages:**
- ✅ Utilise les 27 clés API avec rotation
- ✅ Compatible avec tous les nœuds LangChain
- ✅ 135 requêtes/minute de capacité
- ✅ Pas de coût API externe

---

**Serveur:** http://127.0.0.1:25808  
**Endpoint OpenAI:** http://127.0.0.1:25808/v1/chat/completions  
**Modèles:** gemini-2.5-flash, gemini-1.5-flash, gemini-1.5-pro
