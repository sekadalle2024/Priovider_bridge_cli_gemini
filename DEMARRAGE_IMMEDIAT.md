# ⚡ Démarrage immédiat - AionUi Multi-Provider API

## 🎯 Objectif

Démarrer le serveur API et l'utiliser dans n8n en **moins de 5 minutes**.

## ✅ Étape 1: Builder (30 secondes)

```bash
npm run build:multi-provider
```

**Résultat attendu**:
```
✨ All builds completed successfully!
📁 Output files:
   - dist/multi-provider-routes.js
   - dist/api-key-rotation-service.js
   - dist/gemini-api-key-service.js
```

## ✅ Étape 2: Démarrer (10 secondes)

```bash
npm run server
```

**Résultat attendu**:
```
🚀 AionUi Multi-Provider API Server Started!
📍 Server listening on:
   Local:   http://localhost:25808

🤖 Available Providers:
   1. Gemini CLI (Google OAuth)
   2. Gemini API Key Rotative (✓ Configured)
      - 27 API keys loaded
```

## ✅ Étape 3: Tester (30 secondes)

### Test 1: Health check

```bash
curl http://localhost:25808/health
```

**Résultat attendu**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 5.123
}
```

### Test 2: Chat simple

```bash
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Dis bonjour en français"}
    ],
    "stream": false
  }'
```

**Résultat attendu**:
```json
{
  "model": "gemini-2.0-flash-exp",
  "provider": "gemini_api_key_rotative",
  "created_at": "2025-01-01T00:00:00.000Z",
  "message": {
    "role": "assistant",
    "content": "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
  },
  "done": true
}
```

### Test 3: Statistiques

```bash
curl http://localhost:25808/api/gemini_api_key_rotative/stats
```

**Résultat attendu**:
```json
{
  "totalKeys": 27,
  "availableKeys": 27,
  "usage": [...]
}
```

## ✅ Étape 4: Intégrer dans n8n (2 minutes)

### 4.1 Créer un workflow

1. Ouvrir n8n
2. Créer un nouveau workflow
3. Ajouter un nœud "Manual Trigger"

### 4.2 Ajouter le nœud HTTP Request

1. Ajouter un nœud "HTTP Request"
2. Configurer:

**URL**:
```
http://localhost:25808/api/gemini_api_key_rotative/chat
```

**Method**: `POST`

**Body Parameters** (JSON):
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Écris un haiku sur l'intelligence artificielle"
    }
  ],
  "stream": false
}
```

### 4.3 Tester

1. Cliquer sur "Execute Node"
2. Voir la réponse dans l'output

**Résultat attendu**:
```json
{
  "message": {
    "content": "Bits et neurones dansent\nL'esprit numérique s'éveille\nFutur en devenir"
  }
}
```

### 4.4 Rendre dynamique

Remplacer le contenu par:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "stream": false
}
```

Ajouter un nœud "Set" avant pour définir `prompt`.

## ✅ Étape 5: Workflow complet (optionnel)

### Importer l'exemple

1. Dans n8n: Workflows → Import from File
2. Sélectionner: `examples/n8n-workflow-example.json`
3. Activer le workflow
4. Tester

## 🎉 C'est terminé!

Vous avez maintenant:

- ✅ Serveur API démarré
- ✅ 27 clés API actives
- ✅ Rotation automatique fonctionnelle
- ✅ Intégration n8n opérationnelle

## 📊 Vérification rapide

### Commande tout-en-un

```bash
echo "=== Vérification du système ==="
echo "1. Health: $(curl -s http://localhost:25808/health | jq -r .status)"
echo "2. Clés disponibles: $(curl -s http://localhost:25808/api/gemini_api_key_rotative/stats | jq -r .availableKeys)/27"
echo "3. Providers: $(curl -s http://localhost:25808/api/providers | jq -r '.providers | length')"
echo "✅ Système opérationnel!"
```

## 🚀 Prochaines étapes

### Utilisation avancée

1. **Créer des workflows complexes** dans n8n
2. **Monitorer les statistiques** régulièrement
3. **Déployer sur Netlify** pour un accès distant

### Déploiement Netlify (5 minutes)

```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Se connecter
netlify login

# 3. Déployer
netlify deploy --prod

# 4. Configurer les variables d'environnement
# Dans Netlify UI: Site settings → Environment variables
# Copier toutes les clés depuis .env
```

## 💡 Astuces

### Alias pour tester rapidement

Ajouter dans `~/.bashrc` ou `~/.zshrc`:

```bash
# Test rapide
alias aionui-test='curl -s http://localhost:25808/health | jq'

# Chat rapide
aionui-chat() {
  curl -s -X POST http://localhost:25808/api/gemini_api_key_rotative/chat \
    -H "Content-Type: application/json" \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"$1\"}],\"stream\":false}" \
    | jq -r '.message.content'
}

# Stats rapides
alias aionui-stats='curl -s http://localhost:25808/api/gemini_api_key_rotative/stats | jq'
```

**Utilisation**:
```bash
aionui-test
aionui-chat "Bonjour!"
aionui-stats
```

## 🐛 Problèmes courants

### Le serveur ne démarre pas

```bash
# Vérifier si le port est utilisé
lsof -i :25808

# Tuer le processus si nécessaire
kill -9 $(lsof -ti:25808)

# Ou changer le port
echo "PORT=25810" >> .env
```

### "Cannot find module"

```bash
# Réinstaller et rebuilder
npm install
npm run build:multi-provider
```

### "Aucune clé API trouvée"

```bash
# Vérifier .env
grep GEMINI_API_KEY .env | wc -l
# Doit afficher: 27
```

### n8n ne peut pas se connecter

```bash
# Vérifier que le serveur est démarré
curl http://localhost:25808/health

# Si vous utilisez Docker pour n8n, utiliser:
# http://host.docker.internal:25808/api/...
```

## 📚 Documentation

Pour aller plus loin:

- **[SYNTHESE_IMPLEMENTATION_FR.md](SYNTHESE_IMPLEMENTATION_FR.md)** - Vue d'ensemble complète
- **[COMMANDES_ESSENTIELLES.md](COMMANDES_ESSENTIELLES.md)** - Toutes les commandes
- **[MULTI_PROVIDER_API.md](MULTI_PROVIDER_API.md)** - Documentation API
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Guide de déploiement

## 🎯 Checklist de démarrage

- [ ] Build réussi (`npm run build:multi-provider`)
- [ ] Serveur démarré (`npm run server`)
- [ ] Health check OK (`curl http://localhost:25808/health`)
- [ ] Test chat réussi
- [ ] Stats affichées (27 clés disponibles)
- [ ] Workflow n8n créé
- [ ] Test n8n réussi

## 🎉 Félicitations!

Votre serveur API multi-provider est opérationnel avec:

- 🚀 **135 requêtes/minute** de capacité
- 💾 **6.75M tokens/jour** de quota
- 🔄 **Rotation automatique** des 27 clés
- ✅ **Intégration n8n** fonctionnelle

**Vous êtes prêt à automatiser avec l'IA!**

---

**Temps total**: ~5 minutes  
**Difficulté**: Facile  
**Prérequis**: Node.js 22+, npm

Pour toute question, consulter la documentation ou ouvrir une issue sur GitHub.
