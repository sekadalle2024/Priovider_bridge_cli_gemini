# 🔗 URL OpenAPI pour n8n - Serveur des Assistants

## 📍 URL Principale pour n8n

```
http://localhost:25810/api/v1/chat/completions
```

## 🎯 Configuration n8n

### Méthode HTTP
```
POST
```

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (Format OpenAI Compatible)

#### Chat Simple avec Gemini 3 Flash (Modèle par défaut)

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

#### Chat avec Paramètres Avancés

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Tu es un assistant utile"
    },
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

#### Chat avec un Assistant Spécifique

```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-3-flash",
  "assistant": "cowork"
}
```

## 🎨 Modèles Disponibles

Le modèle par défaut est maintenant **gemini-3-flash**.

Liste complète des modèles :

1. **gemini-3-flash** ⭐ (Par défaut - Ultra-rapide)
2. **gemini-3-pro** (Haute qualité)
3. **gemini-2.5-flash** (Équilibré)
4. **gemini-2.5-pro** (Premium)
5. **gemini-2.5-flash-lite** (Léger)
6. **gemini-2.0-flash** (Standard)
7. **gemini-1.5-flash** (Stable)
8. **gemini-1.5-pro** (Très haute qualité)
9. **gemini-exp-1206** (Expérimental)

## 📋 Endpoints Complémentaires

### Liste des Modèles
```
GET http://localhost:25810/api/v1/models
```

### Liste des Assistants
```
GET http://localhost:25810/api/v1/assistants
```

### Chat avec Assistant Spécifique
```
POST http://localhost:25810/api/v1/assistants/{assistant_id}/chat
```

## 🤖 Assistants Disponibles

Pour utiliser un assistant spécifique, ajoutez le paramètre `"assistant"` dans le body :

1. **beautiful-mermaid** - Création de diagrammes
2. **cowork** - Automatisation de tâches
3. **data-analyst** - Analyse de données
4. **game-3d** - Jeux 3D
5. **human-3-coach** - Coaching
6. **moltbook** - Réseau social IA
7. **openclaw-setup** - Configuration
8. **pdf-to-ppt** - Conversion PDF
9. **planning-with-files** - Planification
10. **pptx-generator** - Présentations PowerPoint
11. **social-job-publisher** - Offres d'emploi
12. **story-roleplay** - Jeu de rôle
13. **ui-ux-pro-max** - Design UI/UX

## 📝 Exemple Complet pour n8n

### Configuration du Nœud HTTP Request

**URL** : `http://localhost:25810/api/v1/chat/completions`

**Method** : `POST`

**Body** :
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.question }}"
    }
  ],
  "model": "gemini-3-flash",
  "temperature": 0.7
}
```

**Response** :
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
        "content": "Voici ma réponse..."
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

### Extraction de la Réponse dans n8n

Pour extraire le contenu de la réponse :

```javascript
{{ $json.choices[0].message.content }}
```

## 🧪 Test de l'Endpoint

### Avec curl

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Bonjour, comment vas-tu ?"
      }
    ],
    "model": "gemini-3-flash"
  }'
```

### Avec le Script de Test

```bash
npm run test:gemini-3-flash
```

## 🔍 Vérification du Serveur

### Health Check
```bash
curl http://localhost:25810/health
```

Réponse :
```json
{
  "status": "ok",
  "geminiCli": "available",
  "assistantsCount": 13,
  "port": "25810",
  "timestamp": "2026-03-01T21:00:00.000Z"
}
```

### Documentation Swagger
```
http://localhost:25810/api-docs
```

## 🚀 Démarrage du Serveur

```bash
npm run assistants
```

Le serveur démarre sur le port **25810** avec **gemini-3-flash** comme modèle par défaut.

## 📊 Format de Réponse OpenAI Compatible

Le serveur retourne un format 100% compatible avec l'API OpenAI, ce qui permet une intégration transparente avec n8n et d'autres outils qui supportent le format OpenAI.

### Structure de la Réponse

```typescript
{
  id: string;              // ID unique de la completion
  object: "chat.completion";
  created: number;         // Timestamp Unix
  model: string;           // Modèle utilisé
  choices: [
    {
      index: number;
      message: {
        role: "assistant";
        content: string;   // Réponse de l'IA
      };
      finish_reason: "stop" | "length" | "content_filter";
    }
  ];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }
}
```

## 🎯 Cas d'Usage n8n

### 1. Chatbot Simple

**Workflow** : Webhook → HTTP Request (Assistants) → Respond to Webhook

### 2. Analyse de Données

**Workflow** : Spreadsheet → HTTP Request (data-analyst assistant) → Email

### 3. Génération de Contenu

**Workflow** : Schedule → HTTP Request (Assistants) → Database

### 4. Support Client

**Workflow** : Email Trigger → HTTP Request (Assistants) → Send Email

## 🔐 Sécurité

Pour l'instant, le serveur n'a pas d'authentification. Pour une utilisation en production, ajoutez :

1. API Key dans les headers
2. Rate limiting
3. HTTPS
4. Firewall rules

## 📚 Documentation Complète

- **Guide complet** : `assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md`
- **Swagger** : http://localhost:25810/api-docs
- **Tests** : `npm run test:gemini-3-flash`

---

**URL pour n8n** : `http://localhost:25810/api/v1/chat/completions`

**Modèle par défaut** : `gemini-3-flash`

**Port** : `25810`

**Format** : OpenAI Compatible

**Status** : ✅ Production Ready
