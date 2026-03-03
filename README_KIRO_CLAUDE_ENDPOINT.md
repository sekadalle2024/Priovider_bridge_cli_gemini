# 🚀 Kiro CLI - Endpoint OpenAI Compatible avec Claude Sonnet 4.5

## 📖 Vue d'ensemble

Ce projet expose **Kiro CLI** avec **Claude Sonnet 4.5** via un endpoint compatible avec l'API OpenAI, permettant une intégration facile avec n8n, LangChain, et tous les outils supportant l'API OpenAI.

### 🎯 Pourquoi Kiro CLI ?

- ✅ **Gratuit** : Accès gratuit à Claude Sonnet 4.5
- ✅ **Puissant** : Un des meilleurs modèles pour le code
- ✅ **Compatible** : API OpenAI standard
- ✅ **Contexte** : Maintient le contexte du projet
- ✅ **Streaming** : Support du streaming en temps réel

## 🚀 Démarrage en 3 minutes

### 1. Installation

```bash
# Installer Kiro CLI
npm install -g @kirodotdev/cli

# S'authentifier
kiro auth login
```

### 2. Configuration

Les variables sont déjà configurées dans `.env` :

```env
KIRO_CLI_ENABLED=true
KIRO_CLI_MODEL=claude-sonnet-4-5
```

### 3. Démarrage

```bash
# Démarrer le serveur
npm run start:assistants

# Tester
node scripts/test-kiro-claude.js
```

## 🔗 Endpoints

### Base URL

```
http://localhost:25810/v1/kiro-cli
```

### Endpoints principaux

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/v1/kiro-cli/chat/completions` | POST | Chat avec Claude |
| `/v1/kiro-cli/models` | GET | Liste des modèles |
| `/api/kiro-cli/status` | GET | Statut du service |
| `/api/kiro-cli/generate` | POST | Génération de code |

## 💻 Exemples d'utilisation

### cURL

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Explique les closures en JavaScript"}
    ]
  }'
```

### JavaScript

```javascript
const response = await fetch('http://localhost:25810/v1/kiro-cli/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    messages: [
      { role: 'user', content: 'Hello!' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:25810/v1/kiro-cli/chat/completions',
    json={
        'model': 'claude-sonnet-4-5',
        'messages': [
            {'role': 'user', 'content': 'Hello!'}
        ]
    }
)

print(response.json()['choices'][0]['message']['content'])
```

## 🎨 Modèles disponibles

| Modèle | Description | Cas d'usage |
|--------|-------------|-------------|
| `claude-sonnet-4-5` | ⭐ Par défaut | Usage général |
| `claude-opus-4-5` | 🚀 Plus puissant | Tâches complexes |
| `claude-sonnet-3-5` | 📦 Précédent | Compatibilité |
| `claude-haiku-3-5` | ⚡ Rapide | Prototypage |

## 📝 Configuration n8n

### HTTP Request Node

1. **Method**: POST
2. **URL**: `http://localhost:25810/v1/kiro-cli/chat/completions`
3. **Body**:
```json
{
  "model": "claude-sonnet-4-5",
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ]
}
```

### LangChain Chat Model

1. **Base URL**: `http://localhost:25810/v1/kiro-cli`
2. **Model**: `claude-sonnet-4-5`

### Workflow prêt à l'emploi

Importez `n8n-workflow-kiro-claude.json` dans n8n pour un workflow complet avec :
- Chat simple
- Streaming
- Génération de code
- Liste des modèles
- Vérification du statut

## 🧪 Tests

### Test automatique complet

```bash
node scripts/test-kiro-claude.js
```

Ce script teste :
- ✅ Statut du service
- ✅ Liste des modèles
- ✅ Chat simple
- ✅ Streaming
- ✅ Génération de code
- ✅ Conversation multi-tours

### Test manuel

```bash
# Vérifier le statut
curl http://localhost:25810/api/kiro-cli/status

# Lister les modèles
curl http://localhost:25810/v1/kiro-cli/models

# Chat simple
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-sonnet-4-5","messages":[{"role":"user","content":"Hello"}]}'
```

## 📚 Documentation

### Guides

- 📖 [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md)
- 📘 [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)
- 📗 [Rapport de tâche](./TACHE_3_KIRO_CLAUDE_COMPLETE.md)
- 📙 [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- 📕 [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)

### Ressources externes

- [Documentation officielle Kiro](https://kiro.dev/docs/cli/)
- [GitHub Kiro](https://github.com/kirodotdev/Kiro)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

## 🔧 Configuration

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

# Port
ASSISTANT_PORT=25810
```

### Personnalisation

#### Changer le modèle par défaut

```env
KIRO_CLI_MODEL=claude-opus-4-5
```

#### Augmenter le timeout

```env
KIRO_CLI_TIMEOUT=600000  # 10 minutes
```

#### Changer le port

```env
ASSISTANT_PORT=25811
```

## 🐛 Dépannage

### Kiro CLI non trouvé

```bash
# Vérifier
kiro --version

# Réinstaller
npm install -g @kirodotdev/cli
```

### Erreur d'authentification

```bash
kiro auth logout
kiro auth login
kiro auth status
```

### Service non disponible

```bash
# Vérifier le statut
curl http://localhost:25810/api/kiro-cli/status

# Vérifier les logs
npm run logs:assistants

# Tester directement
kiro chat
```

### Port déjà utilisé

```bash
# Windows
netstat -ano | findstr :25810

# Linux/Mac
lsof -i :25810

# Ou changer le port dans .env
ASSISTANT_PORT=25811
```

## 📊 Comparaison

| Feature | Kiro CLI | Gemini CLI | OpenAI |
|---------|----------|------------|--------|
| Coût | 🆓 Gratuit | 🆓 Gratuit | 💰 Payant |
| Modèle | Claude 4.5 | Gemini 2.5 | GPT-4 |
| Code | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Streaming | ✅ | ✅ | ✅ |
| Contexte | ✅ | ✅ | ❌ |
| OpenAI API | ✅ | ✅ | ✅ |

## 🎯 Cas d'usage

### 1. Développement de code

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Crée une API REST en Express.js"}
    ]
  }'
```

### 2. Code review

```bash
curl -X POST http://localhost:25810/api/kiro-cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Analyse src/index.ts et suggère des améliorations"}
    ],
    "context": {
      "workspace": "./workspace"
    }
  }'
```

### 3. Documentation

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Génère la documentation pour cette API"}
    ]
  }'
```

## 🚀 Fonctionnalités avancées

### Streaming

```javascript
const response = await fetch('http://localhost:25810/v1/kiro-cli/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    messages: [{ role: 'user', content: 'Compte de 1 à 10' }],
    stream: true
  })
});

for await (const chunk of response.body) {
  const lines = chunk.toString().split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') break;
      
      const parsed = JSON.parse(data);
      process.stdout.write(parsed.choices[0].delta.content || '');
    }
  }
}
```

### System Prompt

```json
{
  "model": "claude-sonnet-4-5",
  "messages": [
    {
      "role": "system",
      "content": "Tu es un expert en JavaScript et TypeScript."
    },
    {
      "role": "user",
      "content": "Explique les promises"
    }
  ]
}
```

### Paramètres de génération

```json
{
  "model": "claude-sonnet-4-5",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 2000,
  "top_p": 0.9
}
```

## 📦 Structure du projet

```
.
├── .env                                    # Configuration
├── src/
│   └── webserver/
│       ├── services/
│       │   └── KiroCliService.ts          # Service Kiro CLI
│       ├── routes/
│       │   └── kiroCliRoutes.ts           # Routes API
│       └── kiro-cli-docs/
│           ├── README.md                   # Documentation
│           ├── KIRO_CLAUDE_INTEGRATION.md # Guide complet
│           ├── API_REFERENCE.md           # Référence API
│           └── INTEGRATION_N8N.md         # Guide n8n
├── scripts/
│   └── test-kiro-claude.js                # Tests automatisés
├── n8n-workflow-kiro-claude.json          # Workflow n8n
├── KIRO_CLAUDE_QUICK_START.md             # Démarrage rapide
├── TACHE_3_KIRO_CLAUDE_COMPLETE.md        # Rapport de tâche
└── README_KIRO_CLAUDE_ENDPOINT.md         # Ce fichier
```

## ✅ Checklist

- [x] Kiro CLI installé
- [x] Authentification configurée
- [x] Variables d'environnement
- [x] Service implémenté
- [x] Routes API créées
- [x] Documentation complète
- [x] Tests automatisés
- [x] Workflow n8n
- [x] Guide de démarrage

## 🎉 Prochaines étapes

1. **Démarrer** : `npm run start:assistants`
2. **Tester** : `node scripts/test-kiro-claude.js`
3. **Intégrer** : Importer le workflow n8n
4. **Utiliser** : Créer vos propres workflows

## 📞 Support

### Problèmes courants

1. **Service non disponible** → Vérifier installation et authentification
2. **Timeout** → Augmenter `KIRO_CLI_TIMEOUT`
3. **Port occupé** → Changer `ASSISTANT_PORT`
4. **Erreur 404** → Vérifier que le serveur est démarré

### Obtenir de l'aide

1. Consulter la [documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)
2. Exécuter `node scripts/test-kiro-claude.js`
3. Vérifier les logs
4. Tester `kiro chat` directement

## 📄 Licence

Ce projet utilise Kiro CLI qui est soumis à ses propres conditions d'utilisation. Consultez [kiro.dev](https://kiro.dev) pour plus d'informations.

## 🙏 Remerciements

- [Kiro](https://kiro.dev) pour l'accès gratuit à Claude Sonnet 4.5
- [Anthropic](https://anthropic.com) pour Claude
- La communauté open source

---

**Version** : 1.0.0  
**Date** : 2 mars 2026  
**Statut** : ✅ Opérationnel

Pour plus d'informations, consultez la [documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md).
