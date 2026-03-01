# ⚡ Configuration Rapide n8n - Serveur des Assistants

## 🎯 En 3 Étapes

### 0️⃣ Prérequis : Installer Gemini CLI

**OBLIGATOIRE** pour que les assistants fonctionnent :

```bash
npm install -g @google/generative-ai-cli
gemini auth login
```

Vérification :
```bash
gemini --version
```

### 1️⃣ Démarrer le Serveur

```bash
npm run assistants
```

Serveur disponible sur : http://localhost:25810

### 2️⃣ Configurer n8n

#### Ajouter un Nœud "HTTP Request"

**URL** :
```
http://localhost:25810/api/v1/chat/completions
```

**Method** : `POST`

**Body** :
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-3-flash"
}
```

### 3️⃣ Extraire la Réponse

Dans le nœud suivant, utilisez :

```javascript
{{ $json.choices[0].message.content }}
```

---

## 🎨 Exemples de Workflows n8n

### Chatbot Simple

```
Webhook → HTTP Request → Respond to Webhook
```

**HTTP Request Body** :
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.body.message }}"
    }
  ],
  "model": "gemini-3-flash"
}
```

### Avec Assistant Spécifique

```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.task }}"
    }
  ],
  "model": "gemini-3-flash",
  "assistant": "cowork"
}
```

### Avec Contexte

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Tu es un expert en {{ $json.domain }}"
    },
    {
      "role": "user",
      "content": "{{ $json.question }}"
    }
  ],
  "model": "gemini-3-flash",
  "temperature": 0.7,
  "max_tokens": 2048
}
```

---

## 🤖 Assistants Disponibles

Ajoutez `"assistant": "nom"` dans le body pour utiliser un assistant :

| Assistant | Usage |
|-----------|-------|
| `cowork` | Automatisation de tâches |
| `data-analyst` | Analyse de données |
| `beautiful-mermaid` | Création de diagrammes |
| `pptx-generator` | Présentations PowerPoint |
| `pdf-to-ppt` | Conversion PDF |
| `ui-ux-pro-max` | Design UI/UX |
| `planning-with-files` | Planification |
| `human-3-coach` | Coaching |
| `social-job-publisher` | Offres d'emploi |
| `moltbook` | Réseau social IA |
| `openclaw-setup` | Configuration |
| `story-roleplay` | Jeu de rôle |
| `game-3d` | Jeux 3D |

---

## 🎨 Modèles Disponibles

| Modèle | Description |
|--------|-------------|
| `gemini-3-flash` ⭐ | Par défaut - Ultra-rapide |
| `gemini-3-pro` | Haute qualité |
| `gemini-2.5-flash` | Équilibré |
| `gemini-2.5-pro` | Premium |
| `gemini-2.5-flash-lite` | Léger |
| `gemini-2.0-flash` | Standard |
| `gemini-1.5-flash` | Stable |
| `gemini-1.5-pro` | Très haute qualité |
| `gemini-exp-1206` | Expérimental |

---

## 🧪 Test Rapide

### Avec curl

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Dis bonjour"
      }
    ],
    "model": "gemini-3-flash"
  }'
```

### Avec le Script

```bash
npm run test:gemini-3-flash
```

---

## 📊 Réponse Type

```json
{
  "id": "chatcmpl-1234567890",
  "object": "chat.completion",
  "created": 1772400000,
  "model": "gemini-3-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Bonjour ! Comment puis-je vous aider ?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 12,
    "total_tokens": 17
  }
}
```

---

## 🔍 Vérifications

### Serveur actif ?

```bash
curl http://localhost:25810/health
```

### Voir la documentation

```
http://localhost:25810/api-docs
```

### Liste des modèles

```bash
curl http://localhost:25810/api/v1/models
```

### Liste des assistants

```bash
curl http://localhost:25810/api/v1/assistants
```

---

## 💡 Conseils

1. **Modèle par défaut** : Si vous omettez `"model"`, `gemini-3-flash` sera utilisé
2. **Assistants** : Ajoutez `"assistant": "nom"` pour des capacités spécialisées
3. **Température** : 0.7 par défaut (0 = déterministe, 2 = créatif)
4. **Max tokens** : 2048 par défaut

---

## 🚨 Dépannage

### Le serveur ne démarre pas ?

```bash
# Vérifier le port
netstat -ano | findstr :25810

# Redémarrer
npm run assistants
```

### Erreur "Gemini CLI unavailable" ?

**C'EST NORMAL SI GEMINI CLI N'EST PAS INSTALLÉ !**

Gemini CLI est OBLIGATOIRE pour que les assistants fonctionnent.

Installation :
```bash
npm install -g @google/generative-ai-cli
gemini auth login
```

Vérification :
```bash
gemini --version
```

### Erreur 503 lors des requêtes ?

Cela signifie que Gemini CLI n'est pas disponible. Installez-le (voir ci-dessus).

---

## 📚 Documentation Complète

- **Guide complet** : `N8N_ASSISTANTS_ENDPOINT.md`
- **Swagger** : http://localhost:25810/api-docs
- **Documentation** : `assistant_serveur_endpoint/`

---

**URL** : `http://localhost:25810/api/v1/chat/completions`

**Modèle** : `gemini-3-flash`

**Port** : `25810`

**Status** : ✅ Ready
