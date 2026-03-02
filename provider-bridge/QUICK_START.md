# ⚡ Provider Bridge — Démarrage Rapide

Guide ultra-rapide pour démarrer Provider Bridge en 5 minutes.

## 🎯 Objectif

Exposer Gemini CLI, Kiro CLI et API Keys Gemini sous forme d'endpoints API avec dashboard admin.

## 📦 Installation (2 minutes)

```bash
# 1. Aller dans le dossier
cd provider-bridge

# 2. Installer les dépendances
npm install

# 3. Copier la configuration
cp .env.example .env

# 4. Build
npm run build
```

## 🔐 Configuration Google OAuth (3 minutes)

### Option A : Mode Développement (sans OAuth)

Utilisez le compte admin par défaut :
- Email : `admin@provider-bridge.local`
- Password : `admin123`

### Option B : Avec Google OAuth (recommandé)

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet
3. Activez **Google+ API** et **Generative Language API**
4. Créez des **OAuth 2.0 credentials**
5. Ajoutez l'URL de callback : `http://localhost:25809/api/auth/google/callback`
6. Copiez le **Client ID** et **Client Secret** dans `.env` :

```bash
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_REDIRECT_URI=http://localhost:25809/api/auth/google/callback
```

## 🚀 Démarrage (30 secondes)

```bash
# Démarrer le serveur
npm start

# Ou en mode développement avec hot-reload
npm run dev
```

Le serveur démarre sur `http://localhost:25809`

## 🎨 Accéder au Dashboard

1. Ouvrez votre navigateur : `http://localhost:25809`
2. Cliquez sur **Se connecter avec Google**
3. Autorisez l'application
4. Vous êtes sur le dashboard ! 🎉

## 🧪 Tester les Endpoints

### 1. Obtenir un token JWT

Après connexion, le token est dans `localStorage` :

```javascript
// Dans la console du navigateur
localStorage.getItem('token')
```

Ou via l'API :

```bash
curl -X POST http://localhost:25809/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@provider-bridge.local", "password": "admin123"}'
```

### 2. Tester Gemini CLI

```bash
TOKEN="votre-jwt-token"

curl -X POST http://localhost:25809/api/providers/gemini_cli/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

### 3. Tester API Key Rotative

```bash
curl -X POST http://localhost:25809/api/providers/gemini_api_key_rotative/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### 4. Format OpenAI (pour n8n)

```bash
curl -X POST http://localhost:25809/v1/chat/completions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "messages": [{"role": "user", "content": "Hi!"}]
  }'
```

## 🔗 Intégration n8n (1 minute)

### Configuration HTTP Request Node

```json
{
  "method": "POST",
  "url": "http://localhost:25809/v1/chat/completions",
  "authentication": "headerAuth",
  "headerAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_JWT_TOKEN"
  },
  "body": {
    "model": "gemini-2.0-flash-exp",
    "messages": [
      {"role": "user", "content": "={{$json.query}}"}
    ]
  }
}
```

## 📊 Dashboard Features

### Statistiques en temps réel
- 👥 Comptes Google intégrés
- 🤖 Modèles actifs
- 💬 Requêtes (24h)
- 🔑 API Keys actives

### Gestion des comptes
- Voir tous les comptes Google
- Supprimer des comptes
- Voir l'utilisation par compte

### Statistiques d'utilisation
- Tokens utilisés par compte
- Limites de tokens
- Pourcentage d'utilisation
- Requêtes par modèle

## 🌐 Déployer sur Netlify (5 minutes)

```bash
# 1. Installer Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Déployer
netlify deploy --prod
```

Voir le guide complet : [DEPLOYMENT_NETLIFY.md](./DEPLOYMENT_NETLIFY.md)

## 📚 Documentation

- **Swagger UI** : http://localhost:25809/docs
- **OpenAPI Spec** : http://localhost:25809/openapi.json
- **Health Check** : http://localhost:25809/health

## 🔧 Commandes Utiles

```bash
# Démarrer en mode développement
npm run dev

# Build
npm run build

# Démarrer en production
npm start

# Démarrer avec accès réseau
npm run start:remote

# Tests
npm test
```

## 🎯 URLs Importantes

```
Dashboard:     http://localhost:25809
Swagger:       http://localhost:25809/docs
OpenAPI:       http://localhost:25809/openapi.json
Health:        http://localhost:25809/health

API Endpoints:
  Gemini CLI:  POST /api/providers/gemini_cli/chat
  API Keys:    POST /api/providers/gemini_api_key_rotative/chat
  Kiro CLI:    POST /api/providers/kiro_cli/chat
  OpenAI:      POST /v1/chat/completions
```

## ❓ Problèmes Courants

### "Port 25809 already in use"

Changez le port dans `.env` :
```bash
PORT=25810
```

### "Google OAuth not configured"

Utilisez le compte admin par défaut ou configurez Google OAuth (voir ci-dessus).

### "Database not found"

Exécutez `npm run build` pour initialiser la base de données.

## 🎉 C'est tout !

Vous avez maintenant :
- ✅ Un serveur API fonctionnel
- ✅ Un dashboard admin
- ✅ Des endpoints compatibles OpenAI
- ✅ Une authentification Google OAuth
- ✅ Des statistiques en temps réel

**Prochaines étapes** :
1. Ajoutez vos API Keys Gemini dans `.env`
2. Configurez Google OAuth pour la production
3. Déployez sur Netlify
4. Intégrez avec n8n

**Besoin d'aide ?** Consultez le [README.md](./README.md) complet.
