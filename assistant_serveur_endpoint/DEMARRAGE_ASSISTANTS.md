# 🚀 Démarrage Rapide - Assistants Microservices

## Installation en 3 étapes

### 1️⃣ Installer les dépendances

```bash
npm install
# ou
bun install
```

### 2️⃣ Configurer l'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Port du serveur des assistants
ASSISTANT_PORT=25810

# Activer le serveur des assistants
ASSISTANTS_ENABLED=true

# Démarrage automatique avec l'application
ASSISTANTS_AUTO_START=true

# Chemin vers Gemini CLI (optionnel)
GEMINI_CLI_PATH=gemini

# Modèle Gemini par défaut
GEMINI_DEFAULT_MODEL=gemini-2.0-flash-exp
```

### 3️⃣ Démarrer le serveur

```bash
# Option 1: Démarrage simple
npm run assistants

# Option 2: Mode développement avec rechargement automatique
npm run assistants:dev

# Option 3: Avec l'application Electron
npm start
```

## ✅ Vérification

### 1. Ouvrir le navigateur

```
http://localhost:25810
```

Vous devriez voir une page d'accueil avec la liste de tous les assistants disponibles.

### 2. Tester l'API

```bash
# Health check
curl http://localhost:25810/health

# Liste des assistants
curl http://localhost:25810/api/assistants
```

### 3. Documentation Swagger

```
http://localhost:25810/api-docs
```

## 📋 Assistants disponibles

Une fois le serveur démarré, vous aurez accès à ces assistants :

| Assistant | Endpoint | Description |
|-----------|----------|-------------|
| **Cowork** | `/api/assistant/cowork` | Exécution autonome de tâches |
| **PPTX Generator** | `/api/assistant/pptx-generator` | Génération de présentations |
| **Beautiful Mermaid** | `/api/assistant/beautiful-mermaid` | Création de diagrammes |
| **PDF to PPT** | `/api/assistant/pdf-to-ppt` | Conversion PDF → PowerPoint |
| **Game 3D** | `/api/assistant/game-3d` | Génération de jeux 3D |
| **UI/UX Pro Max** | `/api/assistant/ui-ux-pro-max` | Design UI/UX professionnel |
| **Planning with Files** | `/api/assistant/planning-with-files` | Planification avec fichiers |
| **Human 3 Coach** | `/api/assistant/human-3-coach` | Coach de développement |
| **Social Job Publisher** | `/api/assistant/social-job-publisher` | Publication d'offres |
| **Moltbook** | `/api/assistant/moltbook` | Réseau social d'agents |
| **OpenClaw Setup** | `/api/assistant/openclaw-setup` | Configuration OpenClaw |
| **Story Roleplay** | `/api/assistant/story-roleplay` | Jeu de rôle narratif |

## 🧪 Exemples d'utilisation

### Exemple 1: Créer un diagramme

```bash
curl -X POST http://localhost:25810/api/assistant/beautiful-mermaid \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un diagramme de flux pour un processus de connexion utilisateur avec authentification OAuth"
  }'
```

### Exemple 2: Générer une présentation

```bash
curl -X POST http://localhost:25810/api/assistant/pptx-generator \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une présentation de 5 slides sur les microservices avec des exemples concrets",
    "context": {
      "style": "Modern Gradient",
      "audience": "Développeurs"
    }
  }'
```

### Exemple 3: Organiser des fichiers

```bash
curl -X POST http://localhost:25810/api/assistant/cowork \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Organise tous les fichiers PDF de mon dossier Downloads par date",
    "context": {
      "workspace": "/Users/me/Downloads"
    }
  }'
```

### Exemple 4: Design UI/UX

```bash
curl -X POST http://localhost:25810/api/assistant/ui-ux-pro-max \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un design de dashboard moderne pour une application de gestion de tâches",
    "context": {
      "stack": "react",
      "style": "Neon Tech"
    }
  }'
```

## 🔧 Tests automatiques

```bash
# Lancer tous les tests
npm run test:assistants
```

Les tests vérifient :
- ✅ Health check du serveur
- ✅ Liste des assistants
- ✅ Informations d'un assistant spécifique
- ✅ Exécution d'un assistant (si Gemini CLI disponible)
- ✅ Gestion des erreurs 404
- ✅ Validation des requêtes

## 🌐 Intégration avec n8n

Les assistants peuvent être utilisés comme nœuds HTTP dans n8n :

1. Créer un nœud HTTP Request
2. URL : `http://localhost:25810/api/assistant/{nom}`
3. Méthode : POST
4. Body : JSON avec `prompt` et `context`

Exemple de workflow n8n :

```json
{
  "nodes": [
    {
      "name": "Trigger",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Assistant Cowork",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:25810/api/assistant/cowork",
        "method": "POST",
        "bodyParameters": {
          "parameters": [
            {
              "name": "prompt",
              "value": "={{$json.prompt}}"
            }
          ]
        }
      }
    }
  ]
}
```

## 🐛 Dépannage

### Problème : Gemini CLI non trouvé

```bash
# Vérifier l'installation
which gemini

# Si non installé, installer via npm
npm install -g @google/generative-ai-cli

# Ou spécifier le chemin dans .env
GEMINI_CLI_PATH=/chemin/vers/gemini
```

### Problème : Port déjà utilisé

```bash
# Changer le port dans .env
ASSISTANT_PORT=25810

# Ou via variable d'environnement
ASSISTANT_PORT=25810 npm run assistants
```

### Problème : Assistants non découverts

```bash
# Vérifier que le dossier assistant existe
ls -la assistant/

# Vérifier les fichiers .md
ls -la assistant/*/

# Spécifier le chemin dans .env
ASSISTANTS_PATH=/chemin/vers/assistant
```

### Problème : Erreur de compilation TypeScript

```bash
# Compiler le projet
npm run build

# Ou utiliser ts-node
npm install -g ts-node
npm run assistants:dev
```

## 📚 Documentation complète

Pour plus de détails, consultez :

- [Guide complet des microservices](./GUIDE_ASSISTANTS_MICROSERVICES.md)
- [Documentation Swagger](http://localhost:25810/api-docs)
- [README principal](./README.md)

## 🆘 Support

- GitHub Issues : https://github.com/iOfficeAI/AionUi/issues
- Discord : https://discord.gg/2QAwJn7Egx
- Documentation : http://localhost:25810/api-docs

## 🎯 Prochaines étapes

Une fois le serveur démarré :

1. ✅ Tester les endpoints avec curl ou Postman
2. ✅ Explorer la documentation Swagger
3. ✅ Intégrer avec votre application
4. ✅ Créer vos propres assistants personnalisés
5. ✅ Déployer sur Vercel/Netlify pour un accès distant

Bon développement ! 🚀
