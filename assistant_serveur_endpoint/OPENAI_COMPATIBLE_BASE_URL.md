# 🔗 Base URL Compatible OpenAI - Serveur des Assistants

## 🎯 Base URL pour n8n et autres clients OpenAI

```
http://localhost:25810/api/v1
```

## 📡 Endpoints compatibles OpenAI

### 1. Chat Completions (principal)
```
POST http://localhost:25810/api/v1/chat/completions
```

### 2. Liste des modèles
```
GET http://localhost:25810/api/v1/models
```

### 3. Liste des assistants
```
GET http://localhost:25810/api/v1/assistants
```

## 🤖 Modèles disponibles

Le serveur expose **13 modèles Gemini** via l'API compatible OpenAI:

### Alias intelligents (recommandés)
| Modèle | Description | Modèle réel | Usage |
|--------|-------------|-------------|-------|
| `auto` | Sélection automatique | gemini-2.5-pro → gemini-3-pro-preview | ✅ Production |
| `pro` | Modèle le plus puissant | gemini-2.5-pro | Tâches complexes |
| `flash` | Rapide et efficace | gemini-2.5-flash | Développement |
| `flash-lite` | Version légère | gemini-2.5-flash-lite | Tâches simples |

### Modèles Gemini 3 (nouveaux)
| Modèle | Description | Disponibilité |
|--------|-------------|---------------|
| `gemini-3-flash` | Gemini 3 Flash | Preview |
| `gemini-3-pro` | Gemini 3 Pro | Preview |

### Modèles Gemini 2.5
| Modèle | Description | Contexte |
|--------|-------------|----------|
| `gemini-2.5-flash` | Flash rapide | 1M tokens |
| `gemini-2.5-pro` | Pro puissant | 1M tokens |
| `gemini-2.5-flash-lite` | Flash léger | 1M tokens |

### Modèles Gemini 2.0
| Modèle | Description | Contexte |
|--------|-------------|----------|
| `gemini-2.0-flash` | Flash stable | 1M tokens |

### Modèles Gemini 1.5
| Modèle | Description | Contexte |
|--------|-------------|----------|
| `gemini-1.5-flash` | Flash classique | 1M tokens |
| `gemini-1.5-pro` | Pro classique | 2M tokens |

### Modèles expérimentaux
| Modèle | Description | Note |
|--------|-------------|------|
| `gemini-exp-1206` | Expérimental | Instable |

## 🎯 Configuration pour n8n

### Option 1: Utiliser le nœud "OpenAI"

Dans n8n, vous pouvez utiliser le nœud **OpenAI** avec une base URL personnalisée:

1. **Ajouter un nœud OpenAI**
2. **Credentials:**
   - API Key: `dummy` (pas utilisé mais requis)
   - Base URL: `http://localhost:25810/api/v1`
3. **Resource:** Chat
4. **Operation:** Message a Model
5. **Model:** Sélectionner dans la liste ou utiliser `auto`

### Option 2: Utiliser le nœud "HTTP Request"

Configuration du nœud HTTP Request:

```json
{
  "method": "POST",
  "url": "http://localhost:25810/api/v1/chat/completions",
  "authentication": "None",
  "bodyContentType": "json",
  "body": {
    "model": "auto",
    "messages": [
      {
        "role": "user",
        "content": "{{ $json.prompt }}"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 2048
  }
}
```

## 📋 Exemples de requêtes

### Exemple 1: Avec le mode "auto" (recommandé)

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ]
  }'
```

### Exemple 2: Avec un modèle spécifique

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing"
      }
    ],
    "temperature": 0.7,
    "max_tokens": 2048
  }'
```

### Exemple 3: Avec un assistant spécifique

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [
      {
        "role": "user",
        "content": "Analyze this data: [1,2,3,4,5]"
      }
    ],
    "assistant": "data-analyst"
  }'
```

### Exemple 4: Conversation avec contexte

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant"
      },
      {
        "role": "user",
        "content": "What is AI?"
      }
    ],
    "temperature": 0.8,
    "max_tokens": 1024
  }'
```

## 🔍 Lister les modèles disponibles

### Requête
```bash
curl http://localhost:25810/api/v1/models
```

### Réponse
```json
{
  "object": "list",
  "data": [
    {
      "id": "auto",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "pro",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "flash",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "flash-lite",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-3-flash",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-3-pro",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-2.5-flash",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-2.5-pro",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-2.5-flash-lite",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-2.0-flash",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-1.5-flash",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-1.5-pro",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    },
    {
      "id": "gemini-exp-1206",
      "object": "model",
      "created": 1709251200,
      "owned_by": "gemini-cli"
    }
  ]
}
```

## 🎨 Configuration recommandée par cas d'usage

### Production (recommandé)
```json
{
  "model": "auto",
  "temperature": 0.7,
  "max_tokens": 2048
}
```
✅ Sélection automatique du meilleur modèle  
✅ Mise à jour automatique vers Gemini 3  
✅ Performances optimales

### Développement/Tests
```json
{
  "model": "flash",
  "temperature": 0.5,
  "max_tokens": 1024
}
```
✅ Rapide et économique  
✅ Bon pour les tests  
✅ Réponses cohérentes

### Tâches complexes
```json
{
  "model": "pro",
  "temperature": 0.8,
  "max_tokens": 4096
}
```
✅ Meilleure qualité  
✅ Raisonnement avancé  
✅ Contexte étendu

### Tâches simples
```json
{
  "model": "flash-lite",
  "temperature": 0.5,
  "max_tokens": 512
}
```
✅ Très rapide  
✅ Économique  
✅ Suffisant pour tâches basiques

## 🔄 Format de réponse (compatible OpenAI)

```json
{
  "id": "chatcmpl-1709251200000",
  "object": "chat.completion",
  "created": 1709251200,
  "model": "auto",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Réponse de l'assistant"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 50,
    "total_tokens": 60
  }
}
```

## 🛠️ Intégration avec différents outils

### n8n (nœud OpenAI)
```
Base URL: http://localhost:25810/api/v1
API Key: dummy
Model: auto
```

### LangChain
```python
from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(
    base_url="http://localhost:25810/api/v1",
    api_key="dummy",
    model="auto"
)
```

### OpenAI SDK (Python)
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:25810/api/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="auto",
    messages=[
        {"role": "user", "content": "Hello"}
    ]
)
```

### OpenAI SDK (Node.js)
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:25810/api/v1',
  apiKey: 'dummy'
});

const response = await client.chat.completions.create({
  model: 'auto',
  messages: [
    { role: 'user', content: 'Hello' }
  ]
});
```

## 📊 Comparaison des modèles

| Modèle | Vitesse | Qualité | Coût | Contexte | Recommandé pour |
|--------|---------|---------|------|----------|-----------------|
| `auto` | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Variable | 1M | Production |
| `pro` | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Élevé | 1M | Tâches complexes |
| `flash` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Moyen | 1M | Développement |
| `flash-lite` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Faible | 1M | Tâches simples |
| `gemini-3-flash` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Moyen | 1M | Nouveau (preview) |
| `gemini-3-pro` | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Élevé | 1M | Nouveau (preview) |
| `gemini-2.5-flash` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Moyen | 1M | Stable |
| `gemini-2.5-pro` | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Élevé | 1M | Stable |
| `gemini-1.5-pro` | ⭐⭐⭐ | ⭐⭐⭐⭐ | Élevé | 2M | Contexte long |

## 🆘 Dépannage

### Erreur: "Model not available"
```bash
# Vérifier les modèles disponibles
curl http://localhost:25810/api/v1/models

# Utiliser un modèle de la liste
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "auto", "messages": [{"role": "user", "content": "test"}]}'
```

### Erreur: "Gemini CLI not available"
```bash
# Vérifier Gemini CLI
gemini --version
gemini auth status

# Redémarrer le serveur
node scripts/server-assistants-standalone.js
```

### Le serveur ne répond pas
```bash
# Vérifier que le serveur est démarré
curl http://localhost:25810/health

# Vérifier les logs du serveur
# Le serveur affiche les requêtes en temps réel
```

## 📚 Documentation complémentaire

- **[MEMO_MODE_AUTO.md](MEMO_MODE_AUTO.md)** - Mémo sur le mode "auto"
- **[N8N_INTEGRATION_URL.md](N8N_INTEGRATION_URL.md)** - Intégration n8n détaillée
- **[INDEX_DOCUMENTATION.md](INDEX_DOCUMENTATION.md)** - Index complet
- **[MODE_AUTO_GEMINI.md](../MODE_AUTO_GEMINI.md)** - Documentation complète du mode auto

## 🎯 Points clés à retenir

1. **Base URL**: `http://localhost:25810/api/v1`
2. **13 modèles disponibles** (4 alias + 9 modèles spécifiques)
3. **Mode "auto" recommandé** pour la production
4. **Compatible OpenAI** - fonctionne avec tous les clients OpenAI
5. **Pas d'API key requise** en local (utiliser "dummy" si requis)

## ✅ Checklist d'intégration

- [ ] Serveur démarré sur le port 25810
- [ ] Base URL configurée: `http://localhost:25810/api/v1`
- [ ] Modèle sélectionné (recommandé: `auto`)
- [ ] Test avec curl réussi
- [ ] Intégration dans n8n/LangChain configurée
- [ ] Documentation consultée

---

**Date**: 1er mars 2026  
**Base URL**: `http://localhost:25810/api/v1`  
**Modèles**: 13 disponibles  
**Modèle par défaut**: `auto`  
**Compatible**: OpenAI API v1  
**Status**: ✅ Opérationnel
