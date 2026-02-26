# 🚀 Guide de démarrage rapide - Multi-Provider API

Guide rapide pour démarrer le serveur API multi-provider AionUi.

## ⚡ Installation rapide

### 1. Prérequis

```bash
# Vérifier Node.js (version 22+)
node --version

# Si besoin, installer via nvm
nvm install 22
nvm use 22
```

### 2. Installation

```bash
# Cloner le projet
git clone https://github.com/iOfficeAI/AionUi.git
cd AionUi

# Installer les dépendances
npm install
```

### 3. Configuration

```bash
# Copier le fichier .env
cp .env.example .env

# Éditer .env et ajouter vos clés API Gemini
nano .env
```

**Important**: Ajoutez vos clés API dans `.env`:

```env
# Exemple de configuration minimale
GEMINI_API_KEY_OHADA_FINANCE_A=AIzaSyA3cPcbSfi8OR6X2x5KtaeoW6XfNv1UE60
GEMINI_API_KEY_OHADA_FINANCE_B=AIzaSyAoQJDYmHFrpaE19tWaFMw56blu9pBwqX8
# ... ajoutez toutes vos clés

PORT=25808
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 4. Build

```bash
# Builder les services multi-provider
npm run build:multi-provider
```

### 5. Démarrer le serveur

```bash
# Mode local (127.0.0.1)
npm run server

# Mode remote (0.0.0.0 - accessible depuis le réseau)
npm run server:remote
```

## ✅ Vérification

### Test rapide

```bash
# Dans un autre terminal
curl http://localhost:25808/health
```

**Réponse attendue**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Lister les providers

```bash
curl http://localhost:25808/api/providers
```

### Test complet

```bash
npm run test:multi-provider
```

## 🎯 Utilisation rapide

### Exemple 1: Chat simple

```bash
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Bonjour!"}
    ],
    "stream": false
  }'
```

### Exemple 2: Génération de texte

```bash
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Écris un haiku sur le code",
    "stream": false
  }'
```

### Exemple 3: Statistiques des clés

```bash
curl http://localhost:25808/api/gemini_api_key_rotative/stats
```

## 🔧 Configuration avancée

### Gemini CLI (optionnel)

Pour utiliser le provider Gemini CLI avec OAuth:

```bash
# Installer Gemini CLI
npm install -g @google/generative-ai-cli

# Se connecter
gemini auth login

# Tester
curl -X POST http://localhost:25808/api/gemini_cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": false
  }'
```

### Variables d'environnement importantes

```env
# Port du serveur
PORT=25808

# Accès remote
AIONUI_ALLOW_REMOTE=false

# Modèle par défaut
GEMINI_MODEL=gemini-2.0-flash-exp

# Workspace
WORKSPACE_PATH=./workspace

# Rate limiting
API_RATE_LIMIT_MAX_REQUESTS=100
API_RATE_LIMIT_WINDOW_MS=60000
```

## 📊 Monitoring

### Logs en temps réel

Le serveur affiche automatiquement:
- Sélection des clés API
- Utilisation des quotas
- Erreurs et warnings

### Statistiques d'utilisation

```bash
# Voir l'utilisation des clés API
curl http://localhost:25808/api/gemini_api_key_rotative/stats | jq
```

**Exemple de réponse**:
```json
{
  "totalKeys": 27,
  "availableKeys": 25,
  "usage": [
    {
      "index": 0,
      "requestsThisMinute": 3,
      "tokensToday": 15000,
      "available": true
    }
  ]
}
```

## 🌐 Intégration n8n

### Configuration rapide

1. **Créer un workflow n8n**

2. **Ajouter un nœud "HTTP Request"**

3. **Configurer**:
   - Method: POST
   - URL: `http://localhost:25808/api/gemini_api_key_rotative/chat`
   - Body:
   ```json
   {
     "messages": [
       {"role": "user", "content": "{{ $json.prompt }}"}
     ],
     "stream": false
   }
   ```

4. **Tester**

### Exemple de workflow complet

Voir [MULTI_PROVIDER_API.md](MULTI_PROVIDER_API.md#intégration-n8n) pour un exemple complet.

## 🐛 Dépannage rapide

### Problème: "Aucune clé API trouvée"

**Solution**:
```bash
# Vérifier que les clés sont dans .env
grep GEMINI_API_KEY .env

# Vérifier que .env est chargé
node -e "require('dotenv').config(); console.log(Object.keys(process.env).filter(k => k.startsWith('GEMINI_API_KEY')))"
```

### Problème: "Toutes les clés ont atteint leurs limites"

**Solution**:
- Attendre 1 minute (limite: 5 req/min par clé)
- Ou ajouter plus de clés dans `.env`

### Problème: "Cannot find module"

**Solution**:
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Rebuilder
npm run build:multi-provider
```

### Problème: "Port already in use"

**Solution**:
```bash
# Changer le port dans .env
echo "PORT=25809" >> .env

# Ou tuer le processus existant
lsof -ti:25808 | xargs kill -9
```

## 📚 Documentation complète

- [Documentation complète](MULTI_PROVIDER_API.md)
- [README principal](README.md)
- [Documentation Gemini API](src/webserver/gemini-api-docs/README.md)

## 🎉 Prêt à l'emploi!

Votre serveur API multi-provider est maintenant opérationnel!

**Endpoints disponibles**:
- `POST /api/gemini_api_key_rotative/chat` - Chat avec rotation des clés
- `POST /api/gemini_api_key_rotative/generate` - Génération de texte
- `GET /api/gemini_api_key_rotative/stats` - Statistiques
- `POST /api/gemini_cli/chat` - Chat via Gemini CLI (OAuth)
- `POST /api/gemini_cli/generate` - Génération via Gemini CLI
- `GET /api/providers` - Liste des providers

**Prochaines étapes**:
1. Intégrer avec n8n
2. Déployer sur Netlify/Vercel
3. Ajouter plus de clés API pour augmenter les limites
4. Explorer la documentation complète

## 💬 Support

- GitHub Issues: https://github.com/iOfficeAI/AionUi/issues
- Documentation: [MULTI_PROVIDER_API.md](MULTI_PROVIDER_API.md)
