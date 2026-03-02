# 🚀 Commandes Essentielles - Assistants Microservices

## 📋 Commandes de base

### Installation

```bash
# Installer toutes les dépendances
npm install

# Ou avec bun
bun install

# Installer uniquement swagger-ui-express
npm install swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

### Démarrage

```bash
# Démarrer le serveur des assistants
npm run assistants

# Mode développement avec rechargement automatique
npm run assistants:dev

# Avec un port personnalisé
ASSISTANT_PORT=25810 npm run assistants

# Avec TypeScript directement
ts-node src/webserver/server-assistants.ts
```

### Tests

```bash
# Lancer tous les tests
npm run test:assistants

# Tests manuels avec curl
curl http://localhost:25809/health
curl http://localhost:25809/api/assistants
```

---

## 🔧 Configuration

### Créer le fichier .env

```bash
# Copier l'exemple
cp .env.example .env

# Éditer avec votre éditeur préféré
nano .env
# ou
code .env
```

### Variables d'environnement importantes

```bash
# Activer/désactiver le serveur
export ASSISTANTS_ENABLED=true

# Changer le port
export ASSISTANT_PORT=25809

# Chemin vers Gemini CLI
export GEMINI_CLI_PATH=gemini

# Modèle par défaut
export GEMINI_DEFAULT_MODEL=gemini-2.0-flash-exp
```

---

## 🧪 Tests et vérification

### Health check

```bash
# Vérifier que le serveur fonctionne
curl http://localhost:25809/health

# Avec jq pour formater
curl http://localhost:25809/health | jq
```

### Liste des assistants

```bash
# Obtenir la liste complète
curl http://localhost:25809/api/assistants

# Compter les assistants
curl -s http://localhost:25809/api/assistants | jq '.count'

# Lister les noms
curl -s http://localhost:25809/api/assistants | jq '.assistants[].name'
```

### Info d'un assistant

```bash
# Obtenir les infos de cowork
curl http://localhost:25809/api/assistant/cowork/info

# Avec formatage
curl http://localhost:25809/api/assistant/cowork/info | jq
```

### Exécuter un assistant

```bash
# Exemple simple
curl -X POST http://localhost:25809/api/assistant/beautiful-mermaid \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Crée un diagramme simple"}'
