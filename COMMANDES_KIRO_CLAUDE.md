# 🚀 Commandes Essentielles - Kiro CLI avec Claude Sonnet 4.5

## 📋 Commandes rapides

### Installation

```bash
# Installer Kiro CLI
npm install -g @kirodotdev/cli

# Vérifier l'installation
kiro --version
```

### Authentification

```bash
# Se connecter
kiro auth login

# Vérifier le statut
kiro auth status

# Se déconnecter
kiro auth logout
```

### Serveur

```bash
# Démarrer le serveur
npm run start:assistants

# Mode développement
npm run dev:assistants

# Arrêter le serveur
# Ctrl+C dans le terminal
```

### Tests

```bash
# Test complet automatisé
node scripts/test-kiro-claude.js

# Test manuel - Statut
curl http://localhost:25810/api/kiro-cli/status

# Test manuel - Liste des modèles
curl http://localhost:25810/v1/kiro-cli/models

# Test manuel - Chat simple
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-sonnet-4-5","messages":[{"role":"user","content":"Hello"}]}'
```

## 🔧 Configuration

### Variables d'environnement

```bash
# Éditer .env
code .env

# Variables importantes
KIRO_CLI_ENABLED=true
KIRO_CLI_MODEL=claude-sonnet-4-5
ASSISTANT_PORT=25810
```

### Changer le modèle par défaut

```bash
# Dans .env
KIRO_CLI_MODEL=claude-opus-4-5
```

### Changer le port

```bash
# Dans .env
ASSISTANT_PORT=25811
```

## 🧪 Tests et diagnostic

### Test complet

```bash
# Exécuter tous les tests
node scripts/test-kiro-claude.js
```

### Tests individuels

```bash
# Statut du service
curl http://localhost:25810/api/kiro-cli/status

# Liste des modèles
curl http://localhost:25810/v1/kiro-cli/models

# Chat simple
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Explique les closures"}
    ]
  }'

# Génération de code
curl -X POST http://localhost:25810/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une fonction pour valider un email",
    "language": "typescript"
  }'
```

### Streaming

```bash
# Chat avec streaming
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Compte de 1 à 10"}
    ],
    "stream": true
  }'
```

## 🐛 Dépannage

### Vérifier Kiro CLI

```bash
# Version
kiro --version

# Statut d'authentification
kiro auth status

# Test direct
kiro chat
```

### Vérifier le serveur

```bash
# Statut du service
curl http://localhost:25810/api/kiro-cli/status

# Vérifier si le port est utilisé (Windows)
netstat -ano | findstr :25810

# Vérifier si le port est utilisé (Linux/Mac)
lsof -i :25810
```

### Logs

```bash
# Voir les logs du serveur
npm run logs:assistants

# Ou si le serveur tourne dans le terminal
# Les logs s'affichent directement
```

### Réinstaller Kiro CLI

```bash
# Désinstaller
npm uninstall -g @kirodotdev/cli

# Réinstaller
npm install -g @kirodotdev/cli

# Vérifier
kiro --version
```

### Réinitialiser l'authentification

```bash
# Se déconnecter
kiro auth logout

# Se reconnecter
kiro auth login

# Vérifier
kiro auth status
```

## 📝 Exemples de requêtes

### Chat simple

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Bonjour!"}
    ]
  }'
```

### Chat avec system prompt

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "system", "content": "Tu es un expert en JavaScript"},
      {"role": "user", "content": "Explique les promises"}
    ]
  }'
```

### Chat avec paramètres

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Génère du code"}
    ],
    "temperature": 0.7,
    "max_tokens": 2000
  }'
```

### Génération de code

```bash
curl -X POST http://localhost:25810/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une fonction pour valider un email",
    "language": "typescript"
  }'
```

### Liste des modèles

```bash
curl http://localhost:25810/v1/kiro-cli/models
```

### Statut du service

```bash
curl http://localhost:25810/api/kiro-cli/status
```

## 🔄 Workflow complet

### Première installation

```bash
# 1. Installer Kiro CLI
npm install -g @kirodotdev/cli

# 2. S'authentifier
kiro auth login

# 3. Vérifier
kiro --version
kiro auth status

# 4. Démarrer le serveur
npm run start:assistants

# 5. Tester (dans un autre terminal)
node scripts/test-kiro-claude.js
```

### Utilisation quotidienne

```bash
# 1. Démarrer le serveur
npm run start:assistants

# 2. Utiliser l'API
# Via n8n, cURL, ou votre application

# 3. Arrêter le serveur
# Ctrl+C
```

### Mise à jour

```bash
# 1. Mettre à jour Kiro CLI
npm update -g @kirodotdev/cli

# 2. Vérifier la version
kiro --version

# 3. Redémarrer le serveur
npm run start:assistants
```

## 📊 Commandes de monitoring

### Vérifier la santé du service

```bash
# Statut
curl http://localhost:25810/api/kiro-cli/status

# Devrait retourner
{
  "provider": "kiro-cli",
  "available": true,
  "version": "x.x.x",
  "model": "claude-sonnet-4-5",
  "workspace": "./workspace"
}
```

### Tester la latence

```bash
# Mesurer le temps de réponse
time curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-sonnet-4-5","messages":[{"role":"user","content":"Hi"}]}'
```

### Vérifier les modèles disponibles

```bash
# Liste complète
curl http://localhost:25810/v1/kiro-cli/models | jq

# Compter les modèles
curl -s http://localhost:25810/v1/kiro-cli/models | jq '.data | length'
```

## 🎯 Commandes par cas d'usage

### Développement

```bash
# Mode développement avec hot-reload
npm run dev:assistants

# Test rapide
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-sonnet-4-5","messages":[{"role":"user","content":"Test"}]}'
```

### Production

```bash
# Démarrer en production
npm run start:assistants

# Vérifier la santé
curl http://localhost:25810/api/kiro-cli/status

# Monitorer les logs
npm run logs:assistants
```

### Debugging

```bash
# Vérifier Kiro CLI
kiro --version
kiro auth status

# Vérifier le serveur
curl http://localhost:25810/api/kiro-cli/status

# Test complet
node scripts/test-kiro-claude.js

# Logs détaillés
npm run dev:assistants
```

## 📚 Commandes de documentation

### Ouvrir la documentation

```bash
# README principal
code README_KIRO_CLAUDE_ENDPOINT.md

# Guide de démarrage rapide
code KIRO_CLAUDE_QUICK_START.md

# Documentation complète
code src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md

# Index
code INDEX_KIRO_CLAUDE_DOCUMENTATION.md
```

### Rechercher dans la documentation

```bash
# Rechercher un terme (Linux/Mac)
grep -r "streaming" *.md

# Rechercher un terme (Windows PowerShell)
Select-String -Pattern "streaming" -Path *.md
```

## 🔐 Sécurité

### Vérifier les credentials

```bash
# Statut d'authentification
kiro auth status

# Tester l'accès
kiro chat
```

### Régénérer les credentials

```bash
# Se déconnecter
kiro auth logout

# Se reconnecter
kiro auth login
```

## 🚀 Commandes avancées

### Utiliser un modèle spécifique

```bash
# Claude Opus 4.5 (plus puissant)
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-opus-4-5",
    "messages": [{"role": "user", "content": "Tâche complexe"}]
  }'

# Claude Haiku 3.5 (plus rapide)
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-haiku-3-5",
    "messages": [{"role": "user", "content": "Tâche simple"}]
  }'
```

### Conversation multi-tours

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Je m'\''appelle Alice"},
      {"role": "assistant", "content": "Bonjour Alice!"},
      {"role": "user", "content": "Quel est mon nom?"}
    ]
  }'
```

## 📞 Aide rapide

### Commandes de base

```bash
kiro --help              # Aide Kiro CLI
kiro auth --help         # Aide authentification
kiro chat --help         # Aide chat
```

### URLs importantes

```bash
# Base URL
http://localhost:25810/v1/kiro-cli

# Endpoints
http://localhost:25810/v1/kiro-cli/chat/completions
http://localhost:25810/v1/kiro-cli/models
http://localhost:25810/api/kiro-cli/status
```

### Documentation

```bash
# Démarrage rapide
cat KIRO_CLAUDE_QUICK_START.md

# Index
cat INDEX_KIRO_CLAUDE_DOCUMENTATION.md

# Réponse finale
cat REPONSE_FINALE_KIRO_CLAUDE.md
```

---

**Astuce** : Ajoutez ces commandes à vos favoris ou créez des alias pour un accès rapide !

```bash
# Exemple d'alias (Linux/Mac - ajouter à ~/.bashrc ou ~/.zshrc)
alias kiro-start="npm run start:assistants"
alias kiro-test="node scripts/test-kiro-claude.js"
alias kiro-status="curl http://localhost:25810/api/kiro-cli/status"
```

```powershell
# Exemple d'alias (Windows PowerShell - ajouter à $PROFILE)
function Kiro-Start { npm run start:assistants }
function Kiro-Test { node scripts/test-kiro-claude.js }
function Kiro-Status { curl http://localhost:25810/api/kiro-cli/status }
```
