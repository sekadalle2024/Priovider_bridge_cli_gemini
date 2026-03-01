# 🔌 Guide d'Intégration n8n - Assistants OpenAPI

Guide complet pour intégrer les assistants AionUI avec n8n en utilisant les endpoints OpenAPI compatibles.

## 🎯 Nouveautés

✅ **Port mis à jour** : 25810 (évite conflit avec provider-bridge:25810)
✅ **Endpoints OpenAPI** : Format compatible OpenAI pour n8n
✅ **Support multi-modèles** : 9 modèles Gemini disponibles
✅ **Format standardisé** : Compatible avec tous les outils n8n

## 📡 Endpoints Disponibles

### 1. Format OpenAPI (Recommandé pour n8n)

#### Chat Completions (Format OpenAI)
```
POST http://localhost:25810/api/v1/chat/completions
```

#### Liste des Modèles
```
GET http://localhost:25810/api/v1/models
```

#### Liste des Assistants
```
GET http://localhost:25810/api/v1/assistants
```

#### Chat avec un Assistant Spécifique
```
POST http://localhost:25810/api/v1/assistants/{assistant_id}/chat
```

### 2. Format Classique (Compatible)

#### Gemini CLI Direct
```
POST http://localhost:25810/api/gemini/chat
```

#### Assistant Spécifique
```
POST http://localhost:25810/api/assistant/{name}
```

## 🎨 Modèles Gemini Disponibles

| Modèle | Description | Vitesse | Qualité |
|--------|-------------|---------|---------|
| `gemini-3-flash` | Nouveau modèle ultra-rapide | ⚡⚡⚡ | ⭐⭐⭐ |
| `gemini-3-pro` | Nouveau modèle haute qualité | ⚡⚡ | ⭐⭐⭐⭐⭐ |
| `gemini-2.5-flash` | Rapide et efficace | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| `gemini-2.5-pro` | Haute qualité | ⚡⚡ | ⭐⭐⭐⭐⭐ |
| `gemini-2.5-flash-lite` | Ultra-léger | ⚡⚡⚡⚡ | ⭐⭐ |
| `gemini-2.0-flash` | Équilibré | ⚡⚡⚡ | ⭐⭐⭐ |
| `gemini-1.5-flash` | Stable et rapide | ⚡⚡⚡ | ⭐⭐⭐ |
| `gemini-1.5-pro` | Très haute qualité | ⚡ | ⭐⭐⭐⭐⭐ |
| `gemini-exp-1206` | Expérimental | ⚡⚡ | ⭐⭐⭐⭐ |

## 🚀 Configuration n8n

### Méthode 1 : HTTP Request Node (OpenAPI)

#### Configuration du Nœud

1. **Ajouter un nœud "HTTP Request"**
2. **Configurer** :
   - **Method** : POST
   - **URL** : `http://localhost:25810/api/v1/chat/completions`
   - **Authentication** : None
   - **Send Body** : Yes
   - **Body Content Type** : JSON

#### Body JSON

```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-3-flash",
  "temperature": 0.7,
  "max_tokens": 2048
}
```

#### Avec un Assistant Spécifique

```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-2.5-pro",
  "assistant": "cowork"
}
```

### Méthode 2 : OpenAI Node (Compatible)

1. **Ajouter un nœud "OpenAI"**
2. **Configurer** :
   - **Resource** : Chat
   - **Operation** : Message
   - **Base URL** : `http://localhost:25810/api/v1`
   - **Model** : Sélectionner dans la liste

n8n détectera automatiquement les modèles disponibles !

### Méthode 3 : LangChain Node

1. **Ajouter un nœud "LangChain Chat Model"**
2. **Configurer** :
   - **Model** : OpenAI Chat Model
   - **Base URL** : `http://localhost:25810/api/v1`
   - **Model Name** : `gemini-3-flash`

## 📝 Exemples de Workflows

### Exemple 1 : Chat Simple avec Sélection de Modèle

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "chat",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Chat Gemini",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:25810/api/v1/chat/completions",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "messages",
              "value": "=[{\"role\":\"user\",\"content\":\"{{$json.prompt}}\"}]"
            },
            {
              "name": "model",
              "value": "={{$json.model || 'gemini-3-flash'}}"
            }
          ]
        }
      }
    },
    {
      "name": "Respond",
      "type": "n8n-nodes-base.respondToWebhook",
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{$json}}"
      }
    }
  ]
}
```

### Exemple 2 : Assistant Spécifique avec Multi-Modèles

```json
{
  "nodes": [
    {
      "name": "Trigger",
      "type": "n8n-nodes-base.manualTrigger"
    },
    {
      "name": "Beautiful Mermaid",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:25810/api/v1/assistants/beautiful-mermaid/chat",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "messages",
              "value": "=[{\"role\":\"user\",\"content\":\"Crée un diagramme de flux\"}]"
            },
            {
              "name": "model",
              "value": "gemini-2.5-pro"
            }
          ]
        }
      }
    }
  ]
}
```

### Exemple 3 : Comparaison Multi-Modèles

```json
{
  "nodes": [
    {
      "name": "Input",
      "type": "n8n-nodes-base.manualTrigger"
    },
    {
      "name": "Split Models",
      "type": "n8n-nodes-base.splitInBatches",
      "parameters": {
        "batchSize": 1,
        "options": {
          "reset": false
        }
      }
    },
    {
      "name": "Test Each Model",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:25810/api/v1/chat/completions",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "messages",
              "value": "=[{\"role\":\"user\",\"content\":\"Explique l'IA en une phrase\"}]"
            },
            {
              "name": "model",
              "value": "={{$json.model}}"
            }
          ]
        }
      }
    }
  ],
  "connections": {
    "Input": {
      "main": [
        [
          {
            "node": "Split Models",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 🎯 Cas d'Usage par Assistant

### 1. Cowork - Automatisation de Tâches

```bash
curl -X POST http://localhost:25810/api/v1/assistants/cowork/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Organise mes fichiers par date"}
    ],
    "model": "gemini-3-flash"
  }'
```

### 2. Beautiful Mermaid - Diagrammes

```bash
curl -X POST http://localhost:25810/api/v1/assistants/beautiful-mermaid/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Crée un diagramme de séquence pour un système de paiement"}
    ],
    "model": "gemini-2.5-pro"
  }'
```

### 3. PPTX Generator - Présentations

```bash
curl -X POST http://localhost:25810/api/v1/assistants/pptx-generator/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Crée une présentation de 5 slides sur l'\''IA"}
    ],
    "model": "gemini-2.5-flash"
  }'
```

### 4. UI/UX Pro Max - Design

```bash
curl -X POST http://localhost:25810/api/v1/assistants/ui-ux-pro-max/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Design un dashboard moderne"}
    ],
    "model": "gemini-3-pro"
  }'
```

## 🔧 Configuration Avancée

### Sélection Dynamique du Modèle

Dans n8n, vous pouvez créer un nœud "Set" pour choisir le modèle :

```javascript
// Node: Set Model
return [
  {
    json: {
      model: $input.item.json.task === 'quick' ? 'gemini-3-flash' : 'gemini-3-pro',
      prompt: $input.item.json.prompt
    }
  }
];
```

### Gestion des Erreurs

```javascript
// Node: Error Handler
if ($input.item.json.error) {
  // Retry avec un modèle différent
  return [
    {
      json: {
        model: 'gemini-2.5-flash', // Fallback
        prompt: $input.item.json.prompt
      }
    }
  ];
}
```

### Streaming (Futur)

```json
{
  "messages": [...],
  "model": "gemini-3-flash",
  "stream": true
}
```

## 📊 Comparaison des Formats

| Format | Avantage | Cas d'Usage |
|--------|----------|-------------|
| **OpenAPI** | Compatible avec tous les outils n8n | Intégrations complexes |
| **Classique** | Simple et direct | Tests rapides |
| **OpenAI Node** | Interface native n8n | Workflows standards |
| **LangChain** | Chaînage avancé | Pipelines IA |

## 🧪 Tests

### Test de Tous les Modèles

```bash
# Script de test
for model in gemini-3-flash gemini-3-pro gemini-2.5-flash gemini-2.5-pro gemini-2.5-flash-lite gemini-2.0-flash gemini-1.5-flash gemini-1.5-pro gemini-exp-1206; do
  echo "Testing $model..."
  curl -X POST http://localhost:25810/api/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Bonjour\"}],\"model\":\"$model\"}" \
    | jq -r '.choices[0].message.content'
  echo ""
done
```

### Test des Assistants

```bash
# Liste des assistants
curl http://localhost:25810/api/v1/assistants | jq

# Test d'un assistant
curl -X POST http://localhost:25810/api/v1/assistants/cowork/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}],"model":"gemini-3-flash"}' \
  | jq
```

## 📚 Documentation

- **Swagger UI** : http://localhost:25810/api-docs
- **Page d'accueil** : http://localhost:25810
- **Health Check** : http://localhost:25810/health

## 🎯 Checklist d'Intégration

- [ ] Serveur démarré sur le port 25810
- [ ] Tester l'endpoint `/api/v1/models`
- [ ] Tester l'endpoint `/api/v1/chat/completions`
- [ ] Configurer le nœud HTTP Request dans n8n
- [ ] Tester avec différents modèles
- [ ] Tester les assistants spécifiques
- [ ] Créer un workflow de production
- [ ] Configurer la gestion des erreurs

## 💡 Conseils

1. **Choisir le bon modèle** :
   - `gemini-3-flash` : Tâches rapides
   - `gemini-3-pro` : Tâches complexes
   - `gemini-2.5-flash` : Équilibre qualité/vitesse

2. **Optimiser les coûts** :
   - Utiliser `gemini-2.5-flash-lite` pour les tests
   - Réserver `gemini-3-pro` pour la production

3. **Gérer les erreurs** :
   - Toujours avoir un modèle de fallback
   - Implémenter des retries avec backoff

## 🆘 Dépannage

### Le serveur ne répond pas

```bash
# Vérifier que le serveur est démarré
curl http://localhost:25810/health

# Vérifier le port
lsof -i :25810
```

### Modèle non disponible

```bash
# Lister les modèles disponibles
curl http://localhost:25810/api/v1/models | jq '.data[].id'
```

### Erreur dans n8n

1. Vérifier l'URL : `http://localhost:25810/api/v1/chat/completions`
2. Vérifier le format du body
3. Vérifier que le modèle existe

## 🚀 Prochaines Étapes

1. Tester tous les endpoints
2. Créer vos workflows n8n
3. Intégrer avec vos applications
4. Déployer en production

---

**Guide créé pour AionUI Assistants v1.0.0 avec support OpenAPI**

Port : 25810 | Modèles : 9 | Format : OpenAPI compatible
