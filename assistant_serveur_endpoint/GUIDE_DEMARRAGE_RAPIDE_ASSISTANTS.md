# 🚀 Guide de Démarrage Rapide - Assistants Microservices

## ⚡ Démarrage en 30 secondes

### 1. Installer les dépendances (si pas déjà fait)

```bash
npm install
```

### 2. Configurer l'environnement

Le fichier `.env` est déjà configuré avec les valeurs par défaut :

```env
ASSISTANTS_ENABLED=true
ASSISTANT_PORT=25810
ASSISTANTS_AUTO_START=true
GEMINI_CLI_PATH=gemini
GEMINI_DEFAULT_MODEL=gemini-2.0-flash-exp
```

### 3. Démarrer l'application

```bash
# Option 1: Mode Desktop (Electron)
npm start

# Option 2: Mode WebUI
npm run webui

# Option 3: Serveur assistants standalone
npm run assistants
```

### 4. Vérifier que ça fonctionne

Ouvrir dans le navigateur :
```
http://localhost:25810
```

Vous devriez voir une belle page avec tous les assistants disponibles ! 🎉

## 📋 Assistants Disponibles

Une fois démarré, vous avez accès à **12 assistants** :

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

## 🎯 Endpoints Principaux

### 1. Gemini CLI par défaut

```bash
curl -X POST http://localhost:25810/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explique-moi les microservices en 3 phrases"
  }'
```

### 2. Utiliser un assistant spécifique

```bash
curl -X POST http://localhost:25810/api/assistant/beautiful-mermaid \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un diagramme de flux pour un processus de connexion"
  }'
```

### 3. Liste des assistants

```bash
curl http://localhost:25810/api/assistants
```

### 4. Health Check

```bash
curl http://localhost:25810/health
```

## 🧪 Tester l'Installation

```bash
npm run test:assistants:integration
```

Ce script teste automatiquement :
- ✅ Health check
- ✅ Liste des assistants
- ✅ Info d'un assistant
- ✅ Statut Gemini CLI
- ✅ Liste des modèles
- ✅ Endpoint Gemini CLI
- ✅ Exécution d'un assistant
- ✅ Gestion des erreurs

## 📚 Documentation Complète

### Swagger UI

```
http://localhost:25810/api-docs
```

Documentation interactive avec tous les endpoints, paramètres et exemples.

### Guides Détaillés

- [Guide complet des microservices](./GUIDE_ASSISTANTS_MICROSERVICES.md)
- [Démarrage des assistants](./DEMARRAGE_ASSISTANTS.md)
- [Intégration n8n](./GUIDE_N8N_INTEGRATION.md)

## 🔧 Configuration Avancée

### Changer le port

```env
ASSISTANT_PORT=8080
```

### Désactiver le démarrage automatique

```env
ASSISTANTS_AUTO_START=false
```

### Utiliser un autre modèle par défaut

```env
GEMINI_DEFAULT_MODEL=gemini-2.5-pro
```

### Spécifier le chemin vers Gemini CLI

```env
GEMINI_CLI_PATH=/usr/local/bin/gemini
```

## 🌐 Intégration avec n8n

### 1. Créer un nœud HTTP Request

- URL : `http://localhost:25810/api/assistant/cowork`
- Méthode : POST
- Body : JSON

### 2. Exemple de body

```json
{
  "prompt": "{{$json.userPrompt}}",
  "model": "gemini-2.0-flash-exp",
  "context": {
    "workspace": "{{$json.workspace}}"
  }
}
```

### 3. Workflows prêts à l'emploi

Consultez le dossier `examples/` pour des workflows n8n complets.

## 🚀 Déploiement

### Vercel

```bash
vercel deploy
```

### Netlify

```bash
netlify deploy --prod
```

### Docker

```bash
docker build -t aionui-assistants .
docker run -p 25810:25810 aionui-assistants
```

## 🐛 Dépannage

### Problème : Gemini CLI non trouvé

```bash
# Vérifier l'installation
which gemini

# Installer si nécessaire
npm install -g @google/generative-ai-cli
```

### Problème : Port déjà utilisé

```bash
# Changer le port
ASSISTANT_PORT=8080 npm run assistants
```

### Problème : Assistants non découverts

```bash
# Vérifier le dossier
ls -la assistant/

# Spécifier le chemin
ASSISTANTS_PATH=/chemin/vers/assistant npm run assistants
```

## 💡 Exemples d'Utilisation

### Créer un diagramme

```bash
curl -X POST http://localhost:25810/api/assistant/beautiful-mermaid \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un diagramme de séquence pour un système de paiement en ligne"
  }'
```

### Générer une présentation

```bash
curl -X POST http://localhost:25810/api/assistant/pptx-generator \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une présentation de 5 slides sur l'\''IA générative",
    "context": {
      "style": "Modern Gradient",
      "audience": "Développeurs"
    }
  }'
```

### Organiser des fichiers

```bash
curl -X POST http://localhost:25810/api/assistant/cowork \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Organise tous les fichiers PDF par date",
    "context": {
      "workspace": "/Users/me/Downloads"
    }
  }'
```

## 🎓 Prochaines Étapes

1. ✅ Explorer la documentation Swagger
2. ✅ Tester tous les assistants
3. ✅ Créer vos propres assistants personnalisés
4. ✅ Intégrer avec n8n ou votre application
5. ✅ Déployer en production

## 🆘 Support

- **GitHub Issues** : https://github.com/iOfficeAI/AionUi/issues
- **Discord** : https://discord.gg/2QAwJn7Egx
- **Documentation** : http://localhost:25810/api-docs

## 🎉 C'est Parti !

Vous êtes maintenant prêt à utiliser les assistants comme microservices !

```bash
npm start
```

Puis ouvrez http://localhost:25810 et commencez à explorer ! 🚀
