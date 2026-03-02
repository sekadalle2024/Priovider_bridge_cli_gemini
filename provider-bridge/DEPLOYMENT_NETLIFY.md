# 🚀 Déploiement Provider Bridge sur Netlify

Guide complet pour déployer Provider Bridge sur Netlify avec toutes les fonctionnalités.

## 📋 Prérequis

- Compte Netlify (gratuit)
- Compte GitHub
- Node.js 22+ installé localement
- Gemini CLI configuré localement (pour tester)

## 🏗️ Architecture

Provider Bridge est une application full-stack :
- **Frontend** : SPA vanilla JS (login Google + dashboard admin)
- **Backend** : API Express avec routes serverless Netlify Functions
- **Base de données** : SQLite (locale) ou PostgreSQL (production recommandée)
- **Authentification** : Google OAuth + JWT

## 📦 Étape 1 : Préparation du Projet

### 1.1 Build du projet

```bash
cd provider-bridge
npm install
npm run build
```

### 1.2 Vérifier la structure

```
provider-bridge/
├── dist/                 # Backend compilé
├── public/              # Frontend statique
│   ├── index.html
│   ├── css/
│   └── js/
├── netlify/
│   └── functions/       # Serverless functions
├── netlify.toml         # Configuration Netlify
└── package.json
```

## 🌐 Étape 2 : Configuration Netlify

### 2.1 Créer netlify.toml

Le fichier `netlify.toml` est déjà configuré avec :

```toml
[build]
  command = "npm run build"
  publish = "public"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "22"

[functions]
  node_bundler = "esbuild"
  external_node_modules = ["@google/genai", "better-sqlite3"]
```

### 2.2 Créer les Netlify Functions

Créez les fonctions serverless dans `netlify/functions/` :

#### `netlify/functions/api.ts` (Handler principal)

```typescript
import { Handler } from '@netlify/functions';
import serverless from 'serverless-http';
import app from '../../dist/server.js';

export const handler: Handler = serverless(app);
```

## 🔐 Étape 3 : Configuration Google OAuth

### 3.1 Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet : "Provider Bridge"
3. Activez les APIs :
   - Google+ API
   - Generative Language API

### 3.2 Configurer OAuth 2.0

1. Allez dans **APIs & Services** > **Credentials**
2. Créez des **OAuth 2.0 Client IDs**
3. Type : **Web application**
4. Authorized redirect URIs :
   ```
   https://votre-site.netlify.app/api/auth/google/callback
   http://localhost:25809/api/auth/google/callback
   ```
5. Notez le **Client ID** et **Client Secret**

## 🚀 Étape 4 : Déploiement sur Netlify

### 4.1 Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialiser le site
netlify init

# Déployer
netlify deploy --prod
```

### 4.2 Via GitHub (Recommandé)

1. Pushez votre code sur GitHub
2. Allez sur [Netlify](https://app.netlify.com/)
3. **New site from Git** > Sélectionnez votre repo
4. Configuration :
   - **Build command** : `npm run build`
   - **Publish directory** : `public`
   - **Functions directory** : `netlify/functions`

### 4.3 Configuration des Variables d'Environnement

Dans Netlify Dashboard > **Site settings** > **Environment variables**, ajoutez :

```bash
# Google OAuth
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_REDIRECT_URI=https://votre-site.netlify.app/api/auth/google/callback

# JWT
JWT_SECRET=votre-secret-jwt-aleatoire-32-caracteres

# Gemini API Keys (rotation)
GEMINI_API_KEY_1=AIzaSy...
GEMINI_API_KEY_2=AIzaSy...
GEMINI_API_KEY_3=AIzaSy...

# Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
PORT=25809
ALLOW_REMOTE=true
NODE_ENV=production
```

## 📊 Étape 5 : Base de Données (Production)

### Option A : PostgreSQL (Recommandé pour production)

1. Créez une base PostgreSQL sur [Supabase](https://supabase.com/) ou [Neon](https://neon.tech/)
2. Ajoutez la variable d'environnement :
   ```bash
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   ```
3. Modifiez `src/database/index.ts` pour utiliser PostgreSQL

### Option B : SQLite (Développement uniquement)

SQLite fonctionne en local mais **ne persiste pas** sur Netlify (filesystem éphémère).

## 🧪 Étape 6 : Tests

### 6.1 Test local

```bash
# Démarrer en mode développement
npm run dev

# Tester l'API
curl http://localhost:25809/health
curl http://localhost:25809/api/admin/stats
```

### 6.2 Test sur Netlify

```bash
# URL de votre site
SITE_URL=https://votre-site.netlify.app

# Health check
curl $SITE_URL/health

# Test authentification
curl $SITE_URL/api/auth/google

# Test endpoints (avec token)
curl -H "Authorization: Bearer YOUR_TOKEN" $SITE_URL/api/admin/stats
```

## 🔗 Étape 7 : Intégration n8n

### 7.1 URLs des Endpoints

Une fois déployé, vos endpoints sont disponibles à :

```
Base URL: https://votre-site.netlify.app

# Gemini CLI (OAuth)
POST /api/providers/gemini_cli/chat
GET  /api/providers/gemini_cli/models

# Gemini API Key Rotative
POST /api/providers/gemini_api_key_rotative/chat
GET  /api/providers/gemini_api_key_rotative/models

# Kiro CLI
POST /api/providers/kiro_cli/chat

# OpenAI Compatible
POST /v1/chat/completions
GET  /v1/models
```

### 7.2 Configuration n8n

Dans n8n, créez un **HTTP Request Node** :

```json
{
  "method": "POST",
  "url": "https://votre-site.netlify.app/v1/chat/completions",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "headers": {
    "Authorization": "Bearer YOUR_JWT_TOKEN"
  },
  "body": {
    "model": "gemini-2.0-flash-exp",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }
}
```

## 📝 Étape 8 : Obtenir l'URL du Serveur

Après déploiement, Netlify vous donne :

```
Site URL: https://provider-bridge-xyz.netlify.app
```

### URLs Finales pour n8n

```bash
# Base URL
https://provider-bridge-xyz.netlify.app

# OpenAPI Spec (pour import dans n8n)
https://provider-bridge-xyz.netlify.app/openapi.json

# Swagger UI
https://provider-bridge-xyz.netlify.app/docs

# Dashboard Admin
https://provider-bridge-xyz.netlify.app/

# Health Check
https://provider-bridge-xyz.netlify.app/health
```

## 🎯 Étape 9 : Utilisation

### 9.1 Connexion au Dashboard

1. Ouvrez `https://votre-site.netlify.app`
2. Cliquez sur **Se connecter avec Google**
3. Autorisez l'application
4. Vous êtes redirigé vers le dashboard admin

### 9.2 Ajouter des Comptes Google

Les utilisateurs peuvent se connecter avec leur compte Google pour :
- Utiliser Gemini CLI via OAuth (pas de consommation d'API key)
- Voir leurs statistiques d'utilisation
- Gérer leurs credentials

### 9.3 Dashboard Admin

L'admin peut :
- Voir tous les comptes Google intégrés
- Supprimer des comptes
- Voir les statistiques d'utilisation par compte, modèle, tokens
- Monitorer les API keys rotatives

## 🔧 Dépannage

### Problème : "Function timeout"

Augmentez le timeout dans `netlify.toml` :

```toml
[functions]
  timeout = 30
```

### Problème : "Database not found"

SQLite ne fonctionne pas sur Netlify. Utilisez PostgreSQL.

### Problème : "OAuth redirect mismatch"

Vérifiez que l'URL de callback dans Google Cloud Console correspond exactement à :
```
https://votre-site.netlify.app/api/auth/google/callback
```

### Problème : "CORS error"

Ajoutez votre domaine Netlify dans les origines autorisées (`src/server.ts`).

## 📚 Ressources

- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Gemini API](https://ai.google.dev/docs)
- [n8n HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)

## ✅ Checklist Finale

- [ ] Code buildé et testé localement
- [ ] Google OAuth configuré
- [ ] Variables d'environnement ajoutées sur Netlify
- [ ] Site déployé sur Netlify
- [ ] Health check fonctionne
- [ ] Dashboard accessible
- [ ] Connexion Google fonctionne
- [ ] Endpoints testés avec curl/Postman
- [ ] Intégration n8n testée
- [ ] Documentation mise à jour avec les URLs finales

## 🎉 Félicitations !

Votre Provider Bridge est maintenant déployé sur Netlify et prêt à être utilisé avec n8n !

**URL du serveur** : `https://votre-site.netlify.app`
**OpenAPI Endpoint** : `https://votre-site.netlify.app/openapi.json`
