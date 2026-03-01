# 🔗 URL pour intégration n8n - Serveur des Assistants

## 📡 Endpoint principal

```
http://localhost:25810/api/v1/chat/completions
```

## 🎯 Configuration n8n - HTTP Request Node

### Méthode: POST

### Headers
```json
{
  "Content-Type": "application/json"
}
```

### Body (JSON)
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Votre message ici"
    }
  ],
  "model": "auto",
  "temperature": 0.7,
  "max_tokens": 2048
}
```

## 🚀 Exemple complet pour n8n

### Configuration du nœud HTTP Request

1. **URL**: `http://localhost:25810/api/v1/chat/completions`
2. **Method**: POST
3. **Authentication**: None
4. **Body Content Type**: JSON
5. **Specify Body**: Using JSON

### Body JSON
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "auto",
  "temperature": 0.7,
  "max_tokens": 2048
}
```

## 🎨 Avec un assistant spécifique

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Analysez ces données"
    }
  ],
  "model": "auto",
  "temperature": 0.7,
  "max_tokens": 2048,
  "assistant": "data-analyst"
}
```

## 📋 Assistants disponibles

- `beautiful-mermaid` - Génération de diagrammes Mermaid
- `cowork` - Assistant de collaboration
- `data-analyst` - Analyse de données
- `game-3d` - Développement de jeux 3D
- `human-3-coach` - Coaching personnel
- `moltbook` - Gestion de livres
- `openclaw-setup` - Configuration OpenClaw
- `pdf-to-ppt` - Conversion PDF vers PowerPoint
- `planning-with-files` - Planification avec fichiers
- `pptx-generator` - Génération de présentations
- `social-job-publisher` - Publication d'offres d'emploi
- `story-roleplay` - Jeu de rôle narratif
- `ui-ux-pro-max` - Design UI/UX professionnel

## 🔍 Autres endpoints utiles

### Liste des modèles disponibles
```
GET http://localhost:25810/api/v1/models
```

### Liste des assistants
```
GET http://localhost:25810/api/v1/assistants
```

### Health check
```
GET http://localhost:25810/health
```

### Documentation Swagger
```
http://localhost:25810/api-docs
```

## 💡 Exemples d'utilisation dans n8n

### Exemple 1: Chat simple avec mode auto

**HTTP Request Node:**
```json
{
  "url": "http://localhost:25810/api/v1/chat/completions",
  "method": "POST",
  "body": {
    "messages": [
      {
        "role": "user",
        "content": "Bonjour, comment vas-tu?"
      }
    ],
    "model": "auto"
  }
}
```

### Exemple 2: Avec variable n8n

**HTTP Request Node:**
```json
{
  "url": "http://localhost:25810/api/v1/chat/completions",
  "method": "POST",
  "body": {
    "messages": [
      {
        "role": "user",
        "content": "{{ $json.userMessage }}"
      }
    ],
    "model": "auto",
    "temperature": 0.7
  }
}
```

### Exemple 3: Conversation avec contexte

**HTTP Request Node:**
```json
{
  "url": "http://localhost:25810/api/v1/chat/completions",
  "method": "POST",
  "body": {
    "messages": [
      {
        "role": "system",
        "content": "Tu es un assistant expert en analyse de données"
      },
      {
        "role": "user",
        "content": "Analyse ces données: {{ $json.data }}"
      }
    ],
    "model": "auto",
    "assistant": "data-analyst"
  }
}
```

## 🎯 Workflow n8n prêt à l'emploi

Un workflow complet est disponible dans:
```
assistant_serveur_endpoint/n8n-workflow-assistants-openapi.json
```

Pour l'importer dans n8n:
1. Ouvrir n8n
2. Cliquer sur "Import from File"
3. Sélectionner le fichier JSON
4. Le workflow est prêt à être utilisé!

## ⚙️ Configuration recommandée

### Pour la production
```json
{
  "model": "auto",
  "temperature": 0.7,
  "max_tokens": 2048
}
```

### Pour le développement/tests
```json
{
  "model": "flash",
  "temperature": 0.5,
  "max_tokens": 1024
}
```

### Pour les tâches complexes
```json
{
  "model": "pro",
  "temperature": 0.8,
  "max_tokens": 4096
}
```

## 🔐 Sécurité

Le serveur écoute uniquement sur `localhost` par défaut. Pour un accès distant:

1. Modifier `.env`:
```env
AIONUI_ALLOW_REMOTE=true
```

2. Ajouter une authentification (recommandé pour la production)

## 📊 Monitoring

### Vérifier que le serveur fonctionne
```bash
curl http://localhost:25810/health
```

Réponse attendue:
```json
{
  "status": "ok",
  "timestamp": "2026-03-01T...",
  "geminiCli": true,
  "assistants": 13
}
```

## 🆘 Dépannage

### Le serveur ne répond pas
```bash
# Vérifier que le serveur est démarré
curl http://localhost:25810/health

# Redémarrer le serveur si nécessaire
node scripts/server-assistants-standalone.js
```

### Erreur de connexion dans n8n
- Vérifier que l'URL est correcte: `http://localhost:25810`
- Vérifier que le serveur est démarré
- Vérifier les logs du serveur

### Le mode "auto" ne fonctionne pas
- Vérifier que Gemini CLI est installé: `gemini --version`
- Vérifier l'authentification: `gemini auth status`
- Vérifier les logs du serveur

## 📚 Documentation complète

- **README principal**: `assistant_serveur_endpoint/README.md`
- **Démarrage simple**: `assistant_serveur_endpoint/DEMARRAGE_SIMPLE.md`
- **Mode auto**: `MODE_AUTO_GEMINI.md`
- **Installation Gemini CLI**: `INSTALLATION_GEMINI_CLI_COMPLETE.md`

---

**Date**: 1er mars 2026  
**Port**: 25810  
**Modèle par défaut**: auto  
**Assistants**: 13 disponibles
