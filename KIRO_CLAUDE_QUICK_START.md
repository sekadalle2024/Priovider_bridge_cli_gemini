# 🚀 Démarrage Rapide - Kiro CLI avec Claude Sonnet 4.5

## Vue d'ensemble

Ce guide vous permet de démarrer rapidement avec Kiro CLI et Claude Sonnet 4.5 comme endpoint OpenAI-compatible.

## ✅ Prérequis

- Node.js 22+ (déjà installé via nvm)
- npm ou yarn
- Git
- Compte Kiro (gratuit sur [kiro.dev](https://kiro.dev))

## 📦 Installation en 3 étapes

### Étape 1 : Installer Kiro CLI

```bash
# Via npm (recommandé)
npm install -g @kirodotdev/cli

# Vérifier l'installation
kiro --version
```

### Étape 2 : Authentification

```bash
# Se connecter à Kiro
kiro auth login

# Suivre les instructions dans le navigateur
# Vérifier le statut
kiro auth status
```

### Étape 3 : Démarrer le serveur

```bash
# Le serveur démarre automatiquement avec Kiro CLI activé
npm run start:assistants

# Ou en mode développement
npm run dev:assistants
```

## 🎯 Test rapide

### Test 1 : Vérifier que tout fonctionne

```bash
# Exécuter le script de test complet
node scripts/test-kiro-claude.js
```

### Test 2 : Premier appel API

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Bonjour, qui es-tu ?"}
    ]
  }'
```

### Test 3 : Liste des modèles

```bash
curl http://localhost:25810/v1/kiro-cli/models
```

## 🔗 URLs importantes

| Service | URL | Description |
|---------|-----|-------------|
| **Base URL OpenAI** | `http://localhost:25810/v1/kiro-cli` | Pour n8n, LangChain, etc. |
| **Chat Completions** | `http://localhost:25810/v1/kiro-cli/chat/completions` | Endpoint principal |
| **Models** | `http://localhost:25810/v1/kiro-cli/models` | Liste des modèles |
| **Status** | `http://localhost:25810/api/kiro-cli/status` | Statut du service |
| **Swagger** | `http://localhost:25810/api-docs` | Documentation interactive |

## 📝 Configuration n8n

### Méthode 1 : HTTP Request Node

1. Créer un nœud **HTTP Request**
2. Configurer :
   - **Method**: POST
   - **URL**: `http://localhost:25810/v1/kiro-cli/chat/completions`
   - **Body**: JSON
   ```json
   {
     "model": "claude-sonnet-4-5",
     "messages": [
       {"role": "user", "content": "{{ $json.prompt }}"}
     ]
   }
   ```

### Méthode 2 : LangChain Chat Model

1. Créer un nœud **LangChain Chat Model**
2. Configurer :
   - **Base URL**: `http://localhost:25810/v1/kiro-cli`
   - **Model**: `claude-sonnet-4-5`
   - **API Key**: (optionnel)

## 🎨 Modèles disponibles

| Modèle | Description | Cas d'usage |
|--------|-------------|-------------|
| `claude-sonnet-4-5` | ⭐ Par défaut, équilibré | Usage général |
| `claude-opus-4-5` | 🚀 Le plus puissant | Tâches complexes |
| `claude-sonnet-3-5` | 📦 Version précédente | Compatibilité |
| `claude-haiku-3-5` | ⚡ Rapide et léger | Prototypage |

## 💡 Exemples d'utilisation

### Exemple 1 : Chat simple

```javascript
const response = await fetch('http://localhost:25810/v1/kiro-cli/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    messages: [
      { role: 'user', content: 'Explique les closures en JavaScript' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Exemple 2 : Streaming

```javascript
const response = await fetch('http://localhost:25810/v1/kiro-cli/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    messages: [
      { role: 'user', content: 'Génère un composant React' }
    ],
    stream: true
  })
});

const reader = response.body;
for await (const chunk of reader) {
  const lines = chunk.toString().split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') break;
      
      try {
        const parsed = JSON.parse(data);
        process.stdout.write(parsed.choices[0].delta.content || '');
      } catch (e) {}
    }
  }
}
```

### Exemple 3 : Génération de code

```bash
curl -X POST http://localhost:25810/api/kiro-cli/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une fonction pour valider un email",
    "language": "typescript"
  }'
```

## 🔧 Configuration avancée

### Variables d'environnement (.env)

```env
# Kiro CLI
KIRO_CLI_ENABLED=true
KIRO_CLI_PATH=kiro
KIRO_CLI_WORKSPACE=./workspace
KIRO_CLI_MODEL=claude-sonnet-4-5
KIRO_CLI_TIMEOUT=300000
KIRO_CLI_AUTO_START=true

# Modèles disponibles
KIRO_AVAILABLE_MODELS=claude-sonnet-4-5,claude-opus-4-5,claude-sonnet-3-5,claude-haiku-3-5

# Port du serveur
ASSISTANT_PORT=25810
```

### Changer le modèle par défaut

```env
# Dans .env
KIRO_CLI_MODEL=claude-opus-4-5
```

### Augmenter le timeout

```env
# Pour les tâches longues (10 minutes)
KIRO_CLI_TIMEOUT=600000
```

## 🐛 Dépannage

### Problème : Kiro CLI non trouvé

```bash
# Vérifier l'installation
kiro --version

# Réinstaller
npm install -g @kirodotdev/cli
```

### Problème : Erreur d'authentification

```bash
# Se reconnecter
kiro auth logout
kiro auth login
```

### Problème : Port déjà utilisé

```bash
# Modifier le port dans .env
ASSISTANT_PORT=25811

# Redémarrer le serveur
npm run start:assistants
```

### Problème : Service non disponible

```bash
# Vérifier le statut
curl http://localhost:25810/api/kiro-cli/status

# Vérifier les logs
npm run logs:assistants

# Tester Kiro CLI directement
kiro chat
```

## 📊 Comparaison avec Gemini CLI

| Feature | Kiro CLI (Claude) | Gemini CLI |
|---------|-------------------|------------|
| **Coût** | 🆓 Gratuit | 🆓 Gratuit |
| **Modèle** | Claude Sonnet 4.5 | Gemini 2.5 Flash |
| **Qualité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Streaming** | ✅ | ✅ |
| **Contexte** | ✅ Excellent | ✅ Bon |
| **Code** | ✅ Excellent | ✅ Très bon |
| **Rate limits** | Modérés | 5 req/min |

## 🎯 Cas d'usage recommandés

### 1. Développement de code
```bash
# Kiro excelle dans la génération de code
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Crée une API REST complète en Express.js"}
    ]
  }'
```

### 2. Analyse de code
```bash
# Excellent pour le code review
curl -X POST http://localhost:25810/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Analyse ce fichier et suggère des améliorations"},
      {"role": "user", "content": "src/index.ts"}
    ],
    "context": {
      "workspace": "./workspace"
    }
  }'
```

### 3. Documentation
```bash
# Génération de documentation
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Génère une documentation complète pour cette API"}
    ]
  }'
```

## 📚 Ressources

- [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)
- [Documentation officielle Kiro](https://kiro.dev/docs/cli/)
- [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- [Exemples n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)

## 🆘 Support

### Problèmes courants

1. **Service non disponible** → Vérifier que Kiro CLI est installé et authentifié
2. **Timeout** → Augmenter `KIRO_CLI_TIMEOUT` dans `.env`
3. **Erreur 404** → Vérifier que le serveur est démarré sur le bon port
4. **Pas de réponse** → Vérifier les logs avec `npm run logs:assistants`

### Obtenir de l'aide

1. Consulter la [documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)
2. Exécuter le script de diagnostic : `node scripts/test-kiro-claude.js`
3. Vérifier les logs du serveur
4. Tester Kiro CLI directement : `kiro chat`

## ✅ Checklist de démarrage

- [ ] Kiro CLI installé (`kiro --version`)
- [ ] Authentifié (`kiro auth status`)
- [ ] Variables d'environnement configurées (`.env`)
- [ ] Serveur démarré (`npm run start:assistants`)
- [ ] Test réussi (`node scripts/test-kiro-claude.js`)
- [ ] Premier appel API fonctionnel
- [ ] Intégration n8n configurée (optionnel)

## 🎉 Prochaines étapes

Une fois que tout fonctionne :

1. **Intégrer dans n8n** : Créer vos premiers workflows
2. **Explorer les modèles** : Tester Claude Opus 4.5 pour les tâches complexes
3. **Optimiser** : Ajuster les paramètres selon vos besoins
4. **Automatiser** : Créer des scripts pour vos tâches récurrentes

---

**Besoin d'aide ?** Consultez la [documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md) ou exécutez `node scripts/test-kiro-claude.js` pour diagnostiquer les problèmes.
