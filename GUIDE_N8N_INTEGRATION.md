# 🔗 Guide d'intégration n8n - Gemini API Key Rotative

Guide complet pour utiliser votre serveur Gemini API Key avec rotation dans n8n.

## 🎯 Prérequis

- ✅ Serveur démarré: `node server-api-key.js`
- ✅ n8n installé et accessible
- ✅ 27 clés API configurées

## 📋 Configuration dans n8n

### Méthode 1: HTTP Request (Recommandée)

#### Étape 1: Créer un workflow

1. Ouvrir n8n
2. Créer un nouveau workflow
3. Ajouter un nœud "Manual Trigger" ou "Webhook"

#### Étape 2: Ajouter le nœud HTTP Request

1. Cliquer sur "+" pour ajouter un nœud
2. Chercher "HTTP Request"
3. Sélectionner "HTTP Request"

#### Étape 3: Configuration du nœud

**Configuration de base:**

```
Authentication: None
Request Method: POST
URL: http://localhost:25808/api/chat
```

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON):**
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

**Options:**
- Response Format: JSON
- JSON/RAW Parameters: JSON

#### Étape 4: Ajouter un nœud Set (pour le prompt)

Avant le nœud HTTP Request, ajouter un nœud "Set":

**Configuration:**
```
Keep Only Set: false

Values to Set:
- Name: prompt
  Type: String
  Value: Quelle est la capitale du Sénégal?
```

#### Étape 5: Tester

1. Cliquer sur "Execute Workflow"
2. Vérifier la réponse dans le nœud HTTP Request

**Réponse attendue:**
```json
{
  "model": "gemini-2.5-flash",
  "provider": "gemini_api_key_rotative",
  "created_at": "2026-02-26T20:20:00.000Z",
  "message": {
    "role": "assistant",
    "content": "La capitale du Sénégal est Dakar."
  },
  "done": true,
  "keyUsed": "Key 1/27"
}
```

### Méthode 2: Avec paramètres dynamiques

#### Configuration avancée du Body:

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

#### Nœud Set avec paramètres:

```
Values to Set:
- Name: prompt
  Type: String
  Value: Écris un haiku sur l'IA

- Name: temperature
  Type: Number
  Value: 0.9

- Name: max_tokens
  Type: Number
  Value: 500
```

## 🔄 Workflow complet exemple

### Workflow 1: Chat simple

```
[Manual Trigger] 
    ↓
[Set: Define Prompt]
    ↓
[HTTP Request: Gemini API]
    ↓
[Code: Extract Response]
```

**Nœud Code (pour extraire la réponse):**
```javascript
// Extraire uniquement le contenu de la réponse
const response = $input.item.json;

return {
  json: {
    prompt: items[0].json.prompt,
    response: response.message.content,
    model: response.model,
    provider: response.provider,
    keyUsed: response.keyUsed
  }
};
```

### Workflow 2: Traitement batch

```
[Manual Trigger]
    ↓
[Set: Multiple Prompts]
    ↓
[Split In Batches]
    ↓
[HTTP Request: Gemini API]
    ↓
[Merge]
    ↓
[Code: Format Results]
```

**Nœud Set (Multiple Prompts):**
```json
{
  "prompts": [
    "Quelle est la capitale de la France?",
    "Quelle est la capitale du Sénégal?",
    "Quelle est la capitale du Mali?"
  ]
}
```

### Workflow 3: Avec retry et error handling

```
[Manual Trigger]
    ↓
[Set: Define Prompt]
    ↓
[HTTP Request: Gemini API]
  (Settings: Retry On Fail: 3 times, Wait: 1000ms)
    ↓
[IF: Check Success]
    ├─ True → [Code: Extract Response]
    └─ False → [Set: Error Message]
```

## 📊 Monitoring dans n8n

### Vérifier les statistiques

Ajouter un nœud HTTP Request pour les stats:

**Configuration:**
```
Method: GET
URL: http://localhost:25808/api/stats
```

**Réponse:**
```json
{
  "totalKeys": 27,
  "availableKeys": 25,
  "usage": [
    {
      "index": 0,
      "requestsThisMinute": 3,
      "available": true
    }
  ]
}
```

## 🎨 Exemples de cas d'usage

### Cas 1: Génération de contenu

**Prompt:**
```
Écris un article de blog de 500 mots sur l'intelligence artificielle
```

**Configuration:**
```json
{
  "messages": [{"role": "user", "content": "{{ $json.prompt }}"}],
  "stream": false,
  "options": {
    "temperature": 0.8,
    "max_tokens": 2000
  }
}
```

### Cas 2: Analyse de données

**Prompt:**
```
Analyse ces données et donne-moi un résumé: {{ $json.data }}
```

**Workflow:**
```
[Webhook: Receive Data]
    ↓
[Set: Format Prompt with Data]
    ↓
[HTTP Request: Gemini API]
    ↓
[Respond to Webhook]
```

### Cas 3: Traduction

**Prompt:**
```
Traduis ce texte en anglais: {{ $json.text }}
```

**Configuration:**
```json
{
  "messages": [{"role": "user", "content": "Traduis ce texte en anglais: {{ $json.text }}"}],
  "stream": false,
  "options": {
    "temperature": 0.3
  }
}
```

## 🔧 Configuration avancée

### Utiliser avec Docker n8n

Si n8n tourne dans Docker, utiliser:

```
URL: http://host.docker.internal:25808/api/chat
```

Au lieu de:
```
URL: http://localhost:25808/api/chat
```

### Authentification (optionnel)

Si vous ajoutez une authentification au serveur, configurer dans n8n:

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

### Rate Limiting

Le serveur a une capacité de **135 requêtes/minute** (27 clés × 5 req/min).

Pour éviter les erreurs:
- Ajouter un délai entre les requêtes batch
- Utiliser "Split In Batches" avec un délai
- Monitorer `/api/stats` régulièrement

## 🐛 Dépannage

### Erreur: "Failed to connect"

**Solution:**
```bash
# Vérifier que le serveur est démarré
curl http://localhost:25808/health

# Si Docker, utiliser host.docker.internal
```

### Erreur: "All API keys have reached their limits"

**Solution:**
- Attendre 1 minute
- Vérifier les stats: `curl http://localhost:25808/api/stats`
- Ajouter plus de clés dans `.env`

### Erreur: "Invalid response"

**Solution:**
- Vérifier le format du Body JSON
- Vérifier que `messages` est un array
- Vérifier que `content` n'est pas vide

## 📚 Ressources

### Endpoints disponibles

- **Chat**: `POST /api/chat`
- **Generate**: `POST /api/generate`
- **Stats**: `GET /api/stats`
- **Health**: `GET /health`
- **Version**: `GET /api/version`

### Documentation

- **Swagger**: http://localhost:25808/docs
- **OpenAPI**: http://localhost:25808/openapi.json

### Exemples de prompts

```javascript
// Génération de code
"Écris une fonction Python pour calculer la suite de Fibonacci"

// Résumé
"Résume ce texte en 3 points: {{ $json.text }}"

// Question-Réponse
"Réponds à cette question: {{ $json.question }}"

// Créatif
"Écris une histoire courte sur un robot"

// Analyse
"Analyse ces données et donne des insights: {{ $json.data }}"
```

## ✅ Checklist d'intégration

- [ ] Serveur démarré (`node server-api-key.js`)
- [ ] Health check OK (`curl http://localhost:25808/health`)
- [ ] Workflow n8n créé
- [ ] Nœud HTTP Request configuré
- [ ] URL correcte (localhost ou host.docker.internal)
- [ ] Body JSON valide
- [ ] Test réussi
- [ ] Réponse contient `provider: gemini_api_key_rotative`
- [ ] Réponse contient `keyUsed: Key X/27`

## 🎉 Félicitations!

Vous pouvez maintenant utiliser votre serveur Gemini API Key avec rotation dans n8n!

**Capacité totale**: 135 requêtes/minute avec 27 clés API

---

**Support**: Voir [SYNTHESE_IMPLEMENTATION_FR.md](SYNTHESE_IMPLEMENTATION_FR.md) pour plus d'informations.
