# 🤖 AionUI Assistants Microservices - README Complet

## 🎯 Vue d'Ensemble

Le serveur des assistants transforme tous les assistants du dossier `assistant/` en microservices accessibles via une API REST. Chaque assistant devient un endpoint avec documentation Swagger complète.

## ⚡ Démarrage Ultra-Rapide

```bash
# 1. Démarrer l'application
npm start

# 2. Ouvrir dans le navigateur
open http://localhost:25810

# 3. Tester un assistant
curl -X POST http://localhost:25810/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Bonjour!"}'
```

C'est tout ! Le serveur démarre automatiquement avec l'application. 🎉

## 📚 Documentation

### Guides Disponibles

| Guide | Description | Niveau |
|-------|-------------|--------|
| [Guide de Démarrage Rapide](./GUIDE_DEMARRAGE_RAPIDE_ASSISTANTS.md) | Démarrage en 30 secondes | ⭐ Débutant |
| [Résumé de l'Implémentation](./RESUME_IMPLEMENTATION_ASSISTANTS.md) | Vue d'ensemble complète | ⭐ Débutant |
| [Intégration Complète](./INTEGRATION_ASSISTANTS_COMPLETE.md) | Documentation détaillée | 🔧 Intermédiaire |
| [Plan d'Intégration](./PLAN_INTEGRATION_ASSISTANTS.md) | Architecture technique | 🚀 Avancé |
| [Index de la Documentation](./INDEX_DOCUMENTATION_ASSISTANTS.md) | Navigation complète | 📚 Tous niveaux |
| [Commandes Essentielles](./COMMANDES_ESSENTIELLES.md) | Référence des commandes | 🔧 Tous niveaux |

### Documentation Interactive

- **Swagger UI** : http://localhost:25810/api-docs
- **Page d'accueil** : http://localhost:25810
- **Health Check** : http://localhost:25810/health

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Application AionUI              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐      ┌──────────┐        │
│  │ Electron │      │  WebUI   │        │
│  │  (GUI)   │      │ (25808)  │        │
│  └────┬─────┘      └────┬─────┘        │
│       │                 │               │
│       └────────┬────────┘               │
│                │                        │
│       ┌────────▼────────┐               │
│       │   Assistants    │               │
│       │   Server        │               │
│       │   (25810)       │               │
│       │                 │               │
│       │ • Gemini CLI    │               │
│       │ • 12 Assistants │               │
│       │ • Swagger Docs  │               │
│       └─────────────────┘               │
│                                         │
└─────────────────────────────────────────┘
```

## 🚀 Fonctionnalités

### ✅ Déjà Implémenté

- ✅ Démarrage automatique avec l'application
- ✅ Endpoint Gemini CLI par défaut
- ✅ 12 assistants accessibles via API
- ✅ Documentation Swagger interactive
- ✅ Tests automatiques complets
- ✅ Configuration via variables d'environnement
- ✅ Gestion propre des erreurs
- ✅ Health check endpoint
- ✅ Page d'accueil HTML élégante
- ✅ Support n8n, Vercel, Netlify

### 🎯 Endpoints Principaux

#### Gemini CLI

```bash
# Chat par défaut
POST /api/gemini/chat
{
  "prompt": "Votre question",
  "model": "gemini-2.0-flash-exp"
}

# Liste des modèles
GET /api/gemini/models

# Statut
GET /api/gemini/status
```

#### Assistants

```bash
# Liste des assistants
GET /api/assistants

# Exécuter un assistant
POST /api/assistant/:name
{
  "prompt": "Votre requête",
  "context": {...}
}

# Info d'un assistant
GET /api/assistant/:name/info
```

#### Système

```bash
# Page d'accueil
GET /

# Documentation Swagger
GET /api-docs

# Health check
GET /health
```

## 📦 12 Assistants Disponibles

| # | Assistant | Description | Endpoint |
|---|-----------|-------------|----------|
| 1 | **Cowork** | Exécution autonome de tâches | `/api/assistant/cowork` |
| 2 | **PPTX Generator** | Génération de présentations PowerPoint | `/api/assistant/pptx-generator` |
| 3 | **Beautiful Mermaid** | Création de diagrammes Mermaid | `/api/assistant/beautiful-mermaid` |
| 4 | **PDF to PPT** | Conversion PDF vers PowerPoint | `/api/assistant/pdf-to-ppt` |
| 5 | **Game 3D** | Génération de jeux 3D | `/api/assistant/game-3d` |
| 6 | **UI/UX Pro Max** | Design UI/UX professionnel | `/api/assistant/ui-ux-pro-max` |
| 7 | **Planning with Files** | Planification avec gestion de fichiers | `/api/assistant/planning-with-files` |
| 8 | **Human 3 Coach** | Coach de développement personnel | `/api/assistant/human-3-coach` |
| 9 | **Social Job Publisher** | Publication d'offres d'emploi | `/api/assistant/social-job-publisher` |
| 10 | **Moltbook** | Réseau social d'agents IA | `/api/assistant/moltbook` |
| 11 | **OpenClaw Setup** | Configuration OpenClaw | `/api/assistant/openclaw-setup` |
| 12 | **Story Roleplay** | Jeu de rôle narratif interactif | `/api/assistant/story-roleplay` |

## 🎓 Exemples d'Utilisation

### Exemple 1 : Chat Simple

```bash
curl -X POST http://localhost:25810/api/gemini/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explique-moi les microservices en 3 phrases"
  }'
```

### Exemple 2 : Créer un Diagramme

```bash
curl -X POST http://localhost:25810/api/assistant/beautiful-mermaid \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un diagramme de séquence pour un système de paiement en ligne avec authentification, validation de carte et confirmation"
  }'
```

### Exemple 3 : Générer une Présentation

```bash
curl -X POST http://localhost:25810/api/assistant/pptx-generator \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une présentation de 5 slides sur l'\''intelligence artificielle générative avec des exemples concrets",
    "context": {
      "style": "Modern Gradient",
      "audience": "Développeurs"
    }
  }'
```

### Exemple 4 : Organiser des Fichiers

```bash
curl -X POST http://localhost:25810/api/assistant/cowork \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Organise tous les fichiers PDF de mon dossier Downloads par date et crée des sous-dossiers par mois",
    "context": {
      "workspace": "/Users/me/Downloads"
    }
  }'
```

### Exemple 5 : Design UI/UX

```bash
curl -X POST http://localhost:25810/api/assistant/ui-ux-pro-max \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un design de dashboard moderne pour une application de gestion de tâches avec dark mode",
    "context": {
      "stack": "react",
      "style": "Neon Tech"
    }
  }'
```

## ⚙️ Configuration

### Variables d'Environnement

Fichier `.env` :

```env
# Activer le serveur des assistants
ASSISTANTS_ENABLED=true

# Port du serveur (défaut: 25810)
ASSISTANT_PORT=25810

# Démarrage automatique avec l'application
ASSISTANTS_AUTO_START=true

# Chemin vers le dossier des assistants
ASSISTANTS_PATH=./assistant

# Chemin vers Gemini CLI
GEMINI_CLI_PATH=gemini

# Modèle Gemini par défaut
GEMINI_DEFAULT_MODEL=gemini-2.0-flash-exp
```

### Personnalisation

#### Changer le Port

```env
ASSISTANT_PORT=8080
```

#### Désactiver le Démarrage Automatique

```env
ASSISTANTS_AUTO_START=false
```

Puis démarrer manuellement :
```bash
npm run assistants
```

#### Utiliser un Autre Modèle

```env
GEMINI_DEFAULT_MODEL=gemini-2.5-pro
```

## 🧪 Tests

### Lancer les Tests

```bash
# Tests de base
npm run test:assistants

# Tests d'intégration complets
npm run test:assistants:integration
```

### Ce qui est Testé

- ✅ Health check du serveur
- ✅ Liste des assistants
- ✅ Informations d'un assistant
- ✅ Statut de Gemini CLI
- ✅ Liste des modèles Gemini
- ✅ Endpoint Gemini CLI
- ✅ Exécution d'un assistant
- ✅ Gestion des erreurs 404
- ✅ Validation des requêtes

### Résultat Attendu

```
✅ Tests réussis: 9
❌ Tests échoués: 0
📈 Taux de réussite: 100%
🎉 Tous les tests sont passés avec succès!
```

## 🌐 Intégrations

### n8n

1. Créer un nœud "HTTP Request"
2. Configurer :
   - URL : `http://localhost:25810/api/assistant/cowork`
   - Méthode : POST
   - Body : `{"prompt": "{{$json.prompt}}"}`

Voir [Démarrage des Assistants](./DEMARRAGE_ASSISTANTS.md) pour plus de détails.

### Vercel / Netlify

Les endpoints sont prêts pour le déploiement serverless.

Fichiers de configuration :
- `netlify/functions/`
- `api/`
- `netlify.toml`

### Docker

```dockerfile
FROM node:22
WORKDIR /app
COPY . .
RUN npm install
ENV ASSISTANTS_ENABLED=true
ENV ASSISTANT_PORT=25810
EXPOSE 25810
CMD ["npm", "run", "assistants"]
```

## 🔧 Développement

### Ajouter un Nouvel Assistant

1. Créer un dossier dans `assistant/` :
   ```bash
   mkdir assistant/mon-assistant
   ```

2. Créer le fichier de configuration :
   ```bash
   touch assistant/mon-assistant/mon-assistant.md
   ```

3. Ajouter les instructions dans le fichier `.md` :
   ```markdown
   # Mon Assistant
   
   Description de l'assistant
   
   ## Capacité 1
   
   Description de la capacité 1
   
   ## Capacité 2
   
   Description de la capacité 2
   ```

4. Redémarrer le serveur :
   ```bash
   npm run assistants
   ```

L'assistant est automatiquement découvert et accessible via `/api/assistant/mon-assistant` !

### Structure d'un Assistant

```
assistant/mon-assistant/
├── mon-assistant.md          # Instructions principales
├── mon-assistant.zh-CN.md    # Version chinoise (optionnel)
├── skills/                   # Compétences spécifiques (optionnel)
└── data/                     # Données de référence (optionnel)
```

## 🐛 Dépannage

### Le Serveur ne Démarre Pas

1. Vérifier que le port n'est pas utilisé :
   ```bash
   lsof -i :25810
   ```

2. Changer le port :
   ```env
   ASSISTANT_PORT=8080
   ```

### Gemini CLI Non Trouvé

1. Vérifier l'installation :
   ```bash
   which gemini
   ```

2. Installer si nécessaire :
   ```bash
   npm install -g @google/generative-ai-cli
   ```

3. Spécifier le chemin :
   ```env
   GEMINI_CLI_PATH=/usr/local/bin/gemini
   ```

### Assistants Non Découverts

1. Vérifier le dossier :
   ```bash
   ls -la assistant/
   ```

2. Vérifier les fichiers `.md` :
   ```bash
   ls -la assistant/*/
   ```

3. Spécifier le chemin :
   ```env
   ASSISTANTS_PATH=/chemin/vers/assistant
   ```

### Port Déjà Utilisé

```bash
# Trouver le processus
lsof -ti:25810

# Tuer le processus
kill -9 $(lsof -ti:25810)

# Ou changer le port
ASSISTANT_PORT=8080 npm run assistants
```

## 📊 Monitoring

### Health Check

```bash
# Simple
curl http://localhost:25810/health

# Avec watch (mise à jour toutes les 5 secondes)
watch -n 5 'curl -s http://localhost:25810/health | jq'
```

### Statistiques

```bash
# Liste des assistants
curl -s http://localhost:25810/api/assistants | jq

# Info d'un assistant
curl -s http://localhost:25810/api/assistant/cowork/info | jq

# Statut Gemini CLI
curl -s http://localhost:25810/api/gemini/status | jq
```

## 🎯 Commandes Utiles

```bash
# Démarrage
npm start                              # Application complète
npm run webui                          # Mode WebUI
npm run assistants                     # Serveur standalone

# Tests
npm run test:assistants                # Tests de base
npm run test:assistants:integration    # Tests complets

# Développement
npm run assistants:dev                 # Mode dev avec hot-reload

# Monitoring
curl http://localhost:25810/health     # Health check
curl http://localhost:25810/api/assistants  # Liste
```

## 📚 Ressources

### Documentation

- [Guide de Démarrage Rapide](./GUIDE_DEMARRAGE_RAPIDE_ASSISTANTS.md)
- [Intégration Complète](./INTEGRATION_ASSISTANTS_COMPLETE.md)
- [Index de la Documentation](./INDEX_DOCUMENTATION_ASSISTANTS.md)
- [Commandes Essentielles](./COMMANDES_ESSENTIELLES.md)
- [Swagger UI](http://localhost:25810/api-docs)

### Support

- **GitHub** : https://github.com/iOfficeAI/AionUi
- **Discord** : https://discord.gg/2QAwJn7Egx
- **Documentation** : http://localhost:25810/api-docs

## 🎉 Conclusion

Le serveur des assistants est maintenant complètement intégré et fonctionnel. Tous les assistants sont accessibles via une API REST bien documentée avec Swagger.

**Pour commencer** :

```bash
npm start
```

**Puis ouvrir** :

```
http://localhost:25810
```

Bon développement ! 🚀

---

**AionUI Assistants Microservices v1.0.0**
