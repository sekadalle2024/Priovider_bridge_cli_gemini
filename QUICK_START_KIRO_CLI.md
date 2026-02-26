# 🚀 Démarrage Rapide - Kiro CLI Integration

## Installation en 5 minutes

### Étape 1: Installer Kiro CLI

```bash
# Option A: Via npm
npm install -g @kirodotdev/cli

# Option B: Via script
curl -fsSL https://kiro.dev/install.sh | sh

# Vérifier l'installation
kiro --version
```

### Étape 2: Authentifier Kiro CLI

```bash
kiro auth login
```

Suivez les instructions pour vous connecter.

### Étape 3: Configurer le serveur

Le fichier `.env` est déjà configuré avec :

```env
KIRO_CLI_ENABLED=true
KIRO_CLI_PATH=/usr/local/bin/kiro
KIRO_CLI_WORKSPACE=./workspace
KIRO_CLI_MODEL=claude-3-5-sonnet
KIRO_CLI_TIMEOUT=300000
```

Si Kiro est installé ailleurs, mettez à jour `KIRO_CLI_PATH` :

```bash
# Trouver le chemin
which kiro

# Mettre à jour .env
KIRO_CLI_PATH=/votre/chemin/vers/kiro
```

### Étape 4: Démarrer le serveur

```bash
npm run start:multi-provider
```

Vous devriez voir :

```
🚀 AionUI Multi-Provider API Server
📡 Serveur démarré sur http://localhost:25808
✅ Kiro CLI initialisé avec succès
```

### Étape 5: Tester

```bash
# Test rapide
curl http://localhost:25808/api/kiro-cli/status

# Test de chat
curl -X POST http://localhost:25808/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'

# Ou utiliser le script de test
npm run test:kiro-cli
```

## 🎯 Premiers tests

### Test 1: Chat simple

```bash
curl -X POST http://localhost:25808/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explique-moi les closures en JavaScript en une phrase"}
    ]
  }'
```

### Test 2: Génération de code

```bash
curl -X POST http://localhost:25808/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une fonction JavaScript pour additionner deux nombres",
    "language": "javascript"
  }'
```

### Test 3: Format OpenAI

```bash
curl -X POST http://localhost:25808/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kiro-cli",
    "messages": [
      {"role": "user", "content": "Dis bonjour"}
    ]
  }'
```

## 🔌 Intégration n8n en 2 minutes

### 1. Créer un workflow n8n

1. Ouvrir n8n
2. Créer un nouveau workflow
3. Ajouter un nœud "HTTP Request"

### 2. Configurer le nœud

- **Method**: POST
- **URL**: `http://localhost:25808/v1/kiro-cli/chat/completions`
- **Body Content Type**: JSON
- **Body**:

```json
{
  "model": "kiro-cli",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ]
}
```

### 3. Tester

Ajouter un nœud "Set" avant avec :
```json
{
  "prompt": "Explique-moi Node.js"
}
```

Exécuter le workflow !

## 📊 Tous les endpoints

### Kiro CLI

| Endpoint | Description | Exemple |
|----------|-------------|---------|
| `GET /api/kiro-cli/status` | Statut | `curl http://localhost:25808/api/kiro-cli/status` |
| `POST /api/kiro-cli/chat` | Chat | Voir exemples ci-dessus |
| `POST /api/kiro-cli/generate` | Code | Voir exemples ci-dessus |
| `POST /v1/kiro-cli/chat/completions` | OpenAI | Voir exemples ci-dessus |

### Autres providers

| Provider | Endpoint Chat | Endpoint OpenAI |
|----------|---------------|-----------------|
| Gemini CLI | `/api/gemini-cli/chat` | `/v1/gemini-cli/chat/completions` |
| Gemini API Key | `/api/gemini-api-key/chat` | `/v1/gemini-api-key/chat/completions` |

### Endpoints globaux

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/providers` | Liste des providers |
| `GET /` | Documentation web |

## 🎨 Exemples pratiques

### Exemple 1: Analyser du code

```bash
curl -X POST http://localhost:25808/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Analyse ce code:\n\nfunction add(a,b){return a+b}\n\nSuggère des améliorations"
      }
    ]
  }'
```

### Exemple 2: Générer des tests

```bash
curl -X POST http://localhost:25808/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Génère des tests Jest pour une fonction qui valide un email",
    "language": "javascript"
  }'
```

### Exemple 3: Refactoring

```bash
curl -X POST http://localhost:25808/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Refactorise ce code pour le rendre plus lisible:\n\nconst x=(a,b)=>a>b?a:b"
      }
    ]
  }'
```

### Exemple 4: Documentation

```bash
curl -X POST http://localhost:25808/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Génère la documentation JSDoc pour une fonction qui calcule la moyenne d un tableau",
    "language": "javascript"
  }'
```

## 🐛 Problèmes courants

### ❌ "Kiro CLI is not available"

**Cause**: Kiro CLI n'est pas installé ou pas dans le PATH

**Solution**:
```bash
# Vérifier l'installation
which kiro

# Si non installé
npm install -g @kirodotdev/cli

# Mettre à jour .env
KIRO_CLI_PATH=$(which kiro)
```

### ❌ "Authentication error"

**Cause**: Session Kiro CLI expirée

**Solution**:
```bash
kiro auth logout
kiro auth login
```

### ❌ "Timeout"

**Cause**: Requête trop longue

**Solution**:
```env
# Dans .env
KIRO_CLI_TIMEOUT=600000  # 10 minutes
```

### ❌ "Port already in use"

**Cause**: Port 25808 déjà utilisé

**Solution**:
```bash
# Changer le port
export PORT=3001
npm run start:multi-provider
```

## 📚 Documentation complète

- [README Kiro CLI](./src/webserver/kiro-cli-docs/README.md)
- [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)
- [README Multi-Provider](./README_MULTI_PROVIDER_KIRO.md)
- [Rapport complet](./KIRO_CLI_INTEGRATION_COMPLETE.md)

## 🎯 Prochaines étapes

1. ✅ Tester tous les endpoints
2. ✅ Intégrer dans n8n
3. ✅ Créer vos premiers workflows
4. ✅ Explorer les cas d'usage avancés
5. ✅ Consulter la documentation complète

## 💡 Astuces

### Astuce 1: Utiliser le streaming

Pour les réponses longues, activez le streaming :

```json
{
  "messages": [...],
  "stream": true
}
```

### Astuce 2: Contexte de projet

Kiro CLI utilise automatiquement le contexte du workspace configuré dans `KIRO_CLI_WORKSPACE`.

### Astuce 3: Multi-turn conversations

Envoyez plusieurs messages pour maintenir le contexte :

```json
{
  "messages": [
    {"role": "user", "content": "Je vais te poser une question"},
    {"role": "assistant", "content": "D'accord"},
    {"role": "user", "content": "Explique-moi les Promises"}
  ]
}
```

### Astuce 4: Tester rapidement

Utilisez le script de test :

```bash
npm run test:kiro-cli
```

## 🚀 Vous êtes prêt !

Votre serveur multi-provider avec Kiro CLI est maintenant opérationnel.

Commencez à créer vos workflows et automatisations !

---

**Besoin d'aide ?**
- Consulter la [documentation complète](./KIRO_CLI_INTEGRATION_COMPLETE.md)
- Vérifier les [exemples n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)
- Lire l'[API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
