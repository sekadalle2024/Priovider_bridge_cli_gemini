# 📦 Installation Complète - Serveur des Assistants

## 🎯 Guide d'Installation Pas à Pas

### Étape 1 : Prérequis

Vous devez avoir :
- Node.js 22+ installé
- npm installé
- Le projet AionUI cloné

### Étape 2 : Installer les Dépendances du Projet

```bash
cd AionUI
npm install
```

Cela installe toutes les dépendances Node.js nécessaires.

### Étape 3 : Installer Gemini CLI (OBLIGATOIRE)

```bash
npm install -g @google/generative-ai-cli
```

### Étape 4 : Authentifier Gemini CLI

```bash
gemini auth login
```

Cela ouvrira votre navigateur pour vous connecter avec votre compte Google.

### Étape 5 : Vérifier l'Installation

```bash
gemini --version
```

Vous devriez voir quelque chose comme :
```
@google/generative-ai-cli version 1.x.x
```

### Étape 6 : Tester Gemini CLI

```bash
gemini --model gemini-3-flash --prompt "Dis bonjour en français"
```

Vous devriez recevoir une réponse de l'IA.

### Étape 7 : Configurer l'Environnement (Optionnel)

Le fichier `.env` est déjà configuré avec les bonnes valeurs par défaut :

```env
ASSISTANT_PORT=25810
GEMINI_CLI_PATH=gemini
GEMINI_DEFAULT_MODEL=gemini-3-flash
ASSISTANTS_ENABLED=true
```

### Étape 8 : Démarrer le Serveur

```bash
npm run assistants
```

Vous devriez voir :

```
============================================================
🤖 AionUI Assistants Microservices API
============================================================
📡 Serveur démarré sur http://localhost:25810
📚 Documentation Swagger: http://localhost:25810/api-docs
💚 Health check: http://localhost:25810/health
============================================================

✅ Gemini CLI: Disponible
📦 13 assistants découverts

============================================================

✅ Serveur prêt à recevoir des requêtes
```

### Étape 9 : Vérifier le Serveur

```bash
curl http://localhost:25810/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "geminiCli": "available",
  "assistantsCount": 13,
  "port": "25810",
  "timestamp": "2026-03-01T22:00:00.000Z"
}
```

### Étape 10 : Tester un Assistant

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

Vous devriez recevoir une réponse JSON avec le contenu généré par l'IA.

## ✅ Checklist d'Installation

- [ ] Node.js 22+ installé
- [ ] Projet AionUI cloné
- [ ] `npm install` exécuté
- [ ] Gemini CLI installé : `npm install -g @google/generative-ai-cli`
- [ ] Gemini CLI authentifié : `gemini auth login`
- [ ] Gemini CLI testé : `gemini --version`
- [ ] Test avec prompt réussi
- [ ] Serveur démarré : `npm run assistants`
- [ ] Health check OK avec "geminiCli": "available"
- [ ] Test d'un assistant réussi

## 🚨 Problèmes Courants

### Gemini CLI non trouvé

**Erreur** :
```
✅ Gemini CLI: Non disponible
```

**Solution** :
```bash
npm install -g @google/generative-ai-cli
gemini auth login
```

### Erreur 503 lors des requêtes

**Erreur** :
```json
{
  "error": {
    "message": "Gemini CLI is not available",
    "type": "service_unavailable",
    "code": "gemini_cli_unavailable"
  }
}
```

**Solution** : Installer Gemini CLI (voir ci-dessus)

### Port déjà utilisé

**Erreur** :
```
Error: listen EADDRINUSE: address already in use :::25810
```

**Solution** :
```bash
# Windows
netstat -ano | findstr :25810
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:25810 | xargs kill -9
```

Ou changez le port dans `.env` :
```env
ASSISTANT_PORT=25811
```

### Gemini CLI ne s'authentifie pas

**Problème** : Le navigateur ne s'ouvre pas lors de `gemini auth login`

**Solution** :
1. Copiez l'URL affichée dans le terminal
2. Ouvrez-la manuellement dans votre navigateur
3. Connectez-vous avec votre compte Google
4. Copiez le code d'autorisation
5. Collez-le dans le terminal

## 📚 Documentation

- **Guide rapide** : `QUICK_START_ASSISTANTS.md`
- **Gemini CLI obligatoire** : `GEMINI_CLI_OBLIGATOIRE.md`
- **Documentation complète** : `assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md`
- **Intégration n8n** : `N8N_ASSISTANTS_ENDPOINT.md`

## 🎯 Commandes Utiles

```bash
# Démarrer le serveur
npm run assistants

# Démarrer en mode développement
npm run assistants:dev

# Tester Gemini 3 Flash
npm run test:gemini-3-flash

# Tester l'intégration
npm run test:assistants:integration

# Voir les logs
# Les logs s'affichent dans le terminal
```

## 🌐 URLs Importantes

- **Serveur** : http://localhost:25810
- **Swagger** : http://localhost:25810/api-docs
- **Health** : http://localhost:25810/health
- **Modèles** : http://localhost:25810/api/v1/models
- **Assistants** : http://localhost:25810/api/v1/assistants

## 🎨 Modèles Disponibles

1. gemini-3-flash (par défaut)
2. gemini-3-pro
3. gemini-2.5-flash
4. gemini-2.5-pro
5. gemini-2.5-flash-lite
6. gemini-2.0-flash
7. gemini-1.5-flash
8. gemini-1.5-pro
9. gemini-exp-1206

## 🤖 Assistants Disponibles

1. beautiful-mermaid
2. cowork
3. data-analyst
4. game-3d
5. human-3-coach
6. moltbook
7. openclaw-setup
8. pdf-to-ppt
9. planning-with-files
10. pptx-generator
11. social-job-publisher
12. story-roleplay
13. ui-ux-pro-max

## 🔗 Intégration n8n

Voir le guide complet : `N8N_ASSISTANTS_ENDPOINT.md`

**URL pour n8n** : `http://localhost:25810/api/v1/chat/completions`

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

## ✨ Prochaines Étapes

1. Explorez la documentation Swagger : http://localhost:25810/api-docs
2. Testez les différents assistants
3. Intégrez avec n8n
4. Créez vos propres workflows

---

**Installation complète** : ✅

**Gemini CLI** : ⚠️ OBLIGATOIRE

**Port** : 25810

**Status** : Production Ready
