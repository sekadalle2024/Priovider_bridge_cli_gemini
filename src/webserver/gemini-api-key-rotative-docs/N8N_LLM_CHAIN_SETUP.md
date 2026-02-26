# 🔗 Configuration LLM Chain dans n8n (OpenAI/Ollama/Grok Compatible)

## 🎯 Objectif

Utiliser votre serveur Gemini API Key Rotative avec les nœuds LLM Chain de n8n (compatibles OpenAI, Ollama, Grok).

## ✅ Configuration pour LangChain Chat Model

### Option 1: Utiliser le nœud "OpenAI Chat Model"

Votre serveur est compatible avec l'API OpenAI, vous pouvez donc utiliser le nœud OpenAI de n8n.

#### Configuration du nœud "OpenAI Chat Model"

**1. Ajouter le nœud "OpenAI Chat Model"**

**2. Configuration:**

| Paramètre | Valeur |
|-----------|--------|
| **Resource** | Chat Model |
| **Authentication** | Custom |
| **Base URL** | `http://127.0.0.1:25808` |
| **API Key** | `dummy-key` (n'importe quoi, non utilisé) |
| **Model** | `gemini-2.5-flash` |

**3. Options avancées:**

```json
{
  "temperature": 0.7,
  "maxTokens": 1000
}
```

### Option 2: Utiliser le nœud "Ollama Chat Model"

Si vous préférez l'interface Ollama:

#### Configuration du nœud "Ollama Chat Model"

| Paramètre | Valeur |
|-----------|--------|
| **Base URL** | `http://127.0.0.1:25808` |
| **Model** | `gemini-2.5-flash` |

**Note:** Vous devrez peut-être ajouter un endpoint `/api/tags` pour lister les modèles.

## 🔧 Ajouter un endpoint compatible OpenAI

Pour une compatibilité totale avec les nœuds LLM Chain, ajoutez ces endpoints à votre serveur:

### Endpoint `/v1/chat/completions` (OpenAI compatible)

Ajoutez ceci à `server-api-key.js`:

```javascript
// OpenAI compatible endpoint
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens, stream } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ 
        error: { message: 'No messages provided', type: 'invalid_request_error' }
      });
    }

    // Obtenir une clé API
    const apiKey = rotationService.getNextKey();
    
    // Utiliser l'API Gemini
    const { GoogleGenAI } = require('@google/genai');
    const client = new GoogleGenAI({ apiKey });
    const modelName = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    
    // Préparer le contenu
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    // Générer la réponse
    const result = await client.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: temperature || 0.7,
        maxOutputTokens: max_tokens,
      },
    });

    // Extraire le texte
    let text = '';
    if (result && result.response) {
      text = result.response.text();
    } else if (result && result.candidates && result.candidates[0]) {
      const candidate = result.candidates[0];
      if (candidate.content && candidate.content.parts) {
        text = candidate.content.parts.map(p => p.text).join('');
      }
    }

    // Format OpenAI
    res.json({
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: modelName,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: text
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      },
      provider: 'gemini_api_key_rotative',
      keyUsed: `Key ${rotationService.currentIndex}/${apiKeys.length}`
    });

  } catch (error) {
    console.error('[OpenAI API] Error:', error);
    res.status(500).json({
      error: {
        message: error.message || 'Internal server error',
        type: 'api_error',
        provider: 'gemini_api_key_rotative'
      }
    });
  }
});

// Liste des modèles (OpenAI compatible)
app.get('/v1/models', (req, res) => {
  res.json({
    object: 'list',
    data: [
      {
        id: 'gemini-2.5-flash',
        object: 'model',
        created: 1677610602,
        owned_by: 'google',
        permission: [],
        root: 'gemini-2.5-flash',
        parent: null
      },
      {
        id: 'gemini-1.5-flash',
        object: 'model',
        created: 1677610602,
        owned_by: 'google',
        permission: [],
        root: 'gemini-1.5-flash',
        parent: null
      },
      {
        id: 'gemini-1.5-pro',
        object: 'model',
        created: 1677610602,
        owned_by: 'google',
        permission: [],
        root: 'gemini-1.5-pro',
        parent: null
      }
    ]
  });
});
```

## 🎯 Configuration dans n8n après ajout des endpoints

### Avec le nœud "OpenAI Chat Model"

**Credentials:**
- Type: OpenAI API
- API Key: `dummy-key` (ou n'importe quoi)
- Base URL: `http://127.0.0.1:25808/v1`

**Dans le nœud:**
- Model: `gemini-2.5-flash`
- Temperature: 0.7

### Workflow exemple avec LangChain

```json
{
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
          "temperature": 0.7
        }
      },
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "position": [460, 300],
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "Gemini Local API"
        }
      }
    },
    {
      "parameters": {
        "prompt": "Quelle est la capitale du Sénégal?"
      },
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "position": [680, 300]
    }
  ]
}
```

## 📊 Voir vos modèles disponibles

### Méthode 1: Via l'API

**Endpoint:**
```
GET http://127.0.0.1:25808/v1/models
```

**Curl:**
```bash
curl http://127.0.0.1:25808/v1/models
```

**Réponse:**
```json
{
  "object": "list",
  "data": [
    {
      "id": "gemini-2.5-flash",
      "object": "model",
      "owned_by": "google"
    },
    {
      "id": "gemini-1.5-flash",
      "object": "model",
      "owned_by": "google"
    },
    {
      "id": "gemini-1.5-pro",
      "object": "model",
      "owned_by": "google"
    }
  ]
}
```

### Méthode 2: Dans n8n

Une fois les credentials configurés, n8n devrait automatiquement lister les modèles disponibles dans le dropdown "Model".

## 🔑 Configuration des Credentials dans n8n

### Créer les credentials "OpenAI API"

1. **Aller dans:** Settings → Credentials → Add Credential
2. **Choisir:** OpenAI API
3. **Configurer:**

```
Name: Gemini Local API
API Key: dummy-key
Base URL: http://127.0.0.1:25808/v1
```

4. **Sauvegarder**

### Utiliser les credentials

Dans n'importe quel nœud LangChain qui supporte OpenAI:
- Sélectionner "Gemini Local API" dans les credentials
- Le modèle `gemini-2.5-flash` sera disponible

## ✅ Test rapide

### Test avec curl

```bash
# Test OpenAI compatible
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer dummy-key" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour!"}
    ],
    "temperature": 0.7
  }'
```

### Test dans n8n

1. Créer un workflow avec "Manual Trigger" → "OpenAI Chat Model"
2. Configurer les credentials
3. Exécuter
4. Vérifier la réponse contient `"provider": "gemini_api_key_rotative"`

## 🎨 Cas d'usage avancés

### Cas 1: RAG (Retrieval Augmented Generation)

```
[Document Loader]
    ↓
[Text Splitter]
    ↓
[Embeddings: OpenAI]
    ↓
[Vector Store]
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
[Tools: Calculator, Wikipedia, etc.]
```

### Cas 3: Chain multiple

```
[Input]
    ↓
[OpenAI Chat Model: Gemini] → Résumé
    ↓
[OpenAI Chat Model: Gemini] → Traduction
    ↓
[OpenAI Chat Model: Gemini] → Analyse sentiment
    ↓
[Output]
```

## 📝 Modèles disponibles

| Modèle | Description | Utilisation |
|--------|-------------|-------------|
| `gemini-2.5-flash` | Rapide et efficace | Recommandé (par défaut) |
| `gemini-1.5-flash` | Version stable | Fallback |
| `gemini-1.5-pro` | Plus puissant | Tâches complexes |

## 🎯 Résumé

**Pour utiliser avec LLM Chain dans n8n:**

1. ✅ Ajouter les endpoints OpenAI à `server-api-key.js`
2. ✅ Redémarrer le serveur
3. ✅ Créer credentials "OpenAI API" dans n8n
4. ✅ Base URL: `http://127.0.0.1:25808/v1`
5. ✅ API Key: `dummy-key`
6. ✅ Utiliser dans n'importe quel nœud LangChain

**Modèles visibles:**
- Via `GET /v1/models`
- Dans le dropdown n8n automatiquement

---

**Prochaine étape:** Ajouter les endpoints OpenAI à votre serveur
