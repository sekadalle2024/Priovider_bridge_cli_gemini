# 🌉 Provider Bridge

**Centralisez vos CLI Gemini, Kiro et API Keys sous forme d'endpoints API**

Provider Bridge est une application full-stack qui expose Gemini CLI, Kiro CLI et les API Keys Gemini rotatives sous forme d'endpoints API compatibles OpenAI, avec authentification Google OAuth et dashboard d'administration.

## ✨ Fonctionnalités

### 🔐 Authentification
- **Connexion Google OAuth** : Les utilisateurs se connectent avec leur compte Google
- **Credentials Gemini CLI** : Collecte automatique des credentials OAuth pour utiliser Gemini CLI
- **JWT Tokens** : Authentification sécurisée pour les API calls

### 🎛️ Dashboard Admin
- **Gestion des comptes** : Visualisez tous les comptes Google intégrés
- **Statistiques en temps réel** :
  - Nombre de comptes actifs
  - Modèles utilisés
  - Requêtes (24h)
  - API Keys actives
- **Utilisation par compte** : Tokens utilisés, limites, pourcentage d'utilisation
- **Actions admin** : Supprimer des comptes, révoquer des credentials

### 🤖 Endpoints API

#### Gemini CLI (OAuth)
```bash
POST /api/providers/gemini_cli/chat
GET  /api/providers/gemini_cli/models
```
Utilise les credentials Google OAuth de l'utilisateur (pas de consommation d'API key).

#### Gemini API Key Rotative
```bash
POST /api/providers/gemini_api_key_rotative/chat
GET  /api/providers/gemini_api_key_rotative/models
```
Rotation automatique entre plusieurs API keys pour éviter les limites de taux.

#### Kiro CLI
```bash
POST /api/providers/kiro_cli/chat
GET  /api/providers/kiro_cli/models
```
Intégration avec Kiro CLI.

#### OpenAI Compatible
```bash
POST /v1/chat/completions
GET  /v1/models
```
Format compatible avec OpenAI pour intégration facile dans n8n, LangChain, etc.

### 📊 Swagger Documentation
- **Swagger UI** : `/docs`
- **OpenAPI Spec** : `/openapi.json`

## 🚀 Installation

### Prérequis
- Node.js 22+
- npm ou bun
- Gemini CLI installé et configuré (pour OAuth)

### Installation locale

```bash
# Cloner le repo
git clone https://github.com/iOfficeAI/AionUi.git
cd AionUi/provider-bridge

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos credentials

# Build
npm run build

# Démarrer le serveur
npm start

# Ou en mode développement
npm run dev
```

### Configuration `.env`

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:25809/api/auth/google/callback

# JWT
JWT_SECRET=your-random-32-char-secret

# Gemini API Keys (rotation)
GEMINI_API_KEY_1=AIzaSy...
GEMINI_API_KEY_2=AIzaSy...
GEMINI_API_KEY_3=AIzaSy...

# Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
PORT=25809
ALLOW_REMOTE=true
```

## 🌐 Déploiement sur Netlify

Voir le guide complet : [DEPLOYMENT_NETLIFY.md](./DEPLOYMENT_NETLIFY.md)

### Résumé rapide

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Déployer
netlify deploy --prod
```

Configurez les variables d'environnement dans Netlify Dashboard.

## 📖 Utilisation

### 1. Accéder au Dashboard

Ouvrez `http://localhost:25809` (ou votre URL Netlify).

### 2. Se connecter avec Google

Cliquez sur **Se connecter avec Google** et autorisez l'application.

### 3. Dashboard Admin

Une fois connecté, vous accédez au dashboard avec :
- Statistiques globales
- Liste des comptes Google intégrés
- Statistiques d'utilisation par compte

### 4. Utiliser les Endpoints

#### Avec curl

```bash
# Obtenir un token JWT
TOKEN="your-jwt-token"

# Test Gemini CLI
curl -X POST http://localhost:25809/api/providers/gemini_cli/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# Test API Key Rotative
curl -X POST http://localhost:25809/api/providers/gemini_api_key_rotative/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.0-flash-exp",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

#### Avec n8n

1. Créez un **HTTP Request Node**
2. Configurez :
   - **Method** : POST
   - **URL** : `http://localhost:25809/v1/chat/completions`
   - **Authentication** : Header Auth
   - **Header Name** : Authorization
   - **Header Value** : `Bearer YOUR_JWT_TOKEN`
3. Body :
   ```json
   {
     "model": "gemini-2.0-flash-exp",
     "messages": [
       {"role": "user", "content": "Hello!"}
     ]
   }
   ```

## 🏗️ Architecture

```
provider-bridge/
├── src/
│   ├── auth/              # Authentification (Google OAuth, JWT)
│   ├── database/          # SQLite/PostgreSQL
│   ├── routes/            # Routes Express
│   │   ├── auth.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── provider.routes.ts
│   │   └── cli-openai.routes.ts
│   ├── services/          # Services métier
│   │   ├── gemini-cli.service.ts
│   │   ├── api-key-rotation.service.ts
│   │   ├── kiro-cli.service.ts
│   │   └── stats.service.ts
│   ├── swagger/           # Documentation OpenAPI
│   └── server.ts          # Serveur Express principal
├── public/                # Frontend (SPA)
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
├── netlify/
│   └── functions/         # Netlify Functions
│       ├── api.ts
│       └── health.ts
├── netlify.toml           # Configuration Netlify
└── package.json
```

## 🔧 Développement

### Scripts disponibles

```bash
# Développement avec hot-reload
npm run dev

# Build
npm run build

# Démarrer le serveur (production)
npm start

# Démarrer avec accès réseau
npm run start:remote

# Tests
npm test
npm run test:full
```

### Ajouter un nouveau provider

1. Créez un service dans `src/services/`
2. Ajoutez les routes dans `src/routes/`
3. Mettez à jour le Swagger dans `src/swagger/`
4. Testez avec les scripts de test

## 📊 Base de Données

### Tables principales

- **users** : Utilisateurs avec Google ID
- **google_credentials** : Credentials OAuth Google
- **usage_stats** : Statistiques d'utilisation (requêtes, tokens)
- **sessions** : Sessions JWT

### Migration vers PostgreSQL (Production)

Pour la production sur Netlify, utilisez PostgreSQL :

```bash
# Ajouter la variable d'environnement
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Modifier src/database/index.ts pour utiliser pg au lieu de better-sqlite3
```

## 🔐 Sécurité

- **HTTPS** : Obligatoire en production
- **JWT** : Tokens avec expiration
- **CORS** : Configuré pour n8n et autres clients
- **Rate Limiting** : Protection contre les abus
- **Credentials** : Stockés de manière sécurisée (encrypted)

## 📚 Documentation

- [Guide de déploiement Netlify](./DEPLOYMENT_NETLIFY.md)
- [Swagger UI](http://localhost:25809/docs)
- [OpenAPI Spec](http://localhost:25809/openapi.json)

## 🤝 Intégration n8n

### URLs pour n8n

```
Base URL: http://localhost:25809 (ou votre URL Netlify)

# OpenAI Compatible
POST /v1/chat/completions
GET  /v1/models

# Providers spécifiques
POST /api/providers/gemini_cli/chat
POST /api/providers/gemini_api_key_rotative/chat
POST /api/providers/kiro_cli/chat
```

### Configuration n8n

1. Créez un **HTTP Request Node**
2. URL : `http://localhost:25809/v1/chat/completions`
3. Authentication : **Header Auth**
   - Name : `Authorization`
   - Value : `Bearer YOUR_JWT_TOKEN`
4. Body : Format OpenAI standard

## 🐛 Dépannage

### Erreur : "Google OAuth not configured"

Vérifiez que `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` sont définis dans `.env`.

### Erreur : "Database not found"

Exécutez `npm run build` pour initialiser la base de données SQLite.

### Erreur : "CORS error"

Ajoutez votre origine dans `src/server.ts` :

```typescript
const allowedOrigins = [
  'http://localhost:5678', // n8n
  'http://your-domain.com'
];
```

## 📝 Licence

Apache-2.0

## 🙏 Crédits

Basé sur [AionUI](https://github.com/iOfficeAI/AionUi) par iOfficeAI.

## 📞 Support

- GitHub Issues : [AionUI Issues](https://github.com/iOfficeAI/AionUi/issues)
- Discord : [AionUI Discord](https://discord.gg/aionui)

---

**Fait avec ❤️ pour la communauté AionUI**
