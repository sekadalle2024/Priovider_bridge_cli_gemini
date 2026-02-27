# 🌉 Provider Bridge Endpoint

Sous-projet indépendant du projet AionUi — un gateway API centralisé pour **Gemini CLI**, **Gemini API Key Rotative** et **Kiro CLI**.

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd provider-bridge
npm install
```

### 2. Configuration

```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

### 3. Lancement

```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm run build
npm start

# Mode remote (accessible depuis le réseau)
npm start -- --remote
```

### 4. Accès

| URL | Description |
|-----|-------------|
| `http://localhost:25809` | Dashboard admin |
| `http://localhost:25809/docs` | Documentation Swagger |
| `http://localhost:25809/api/providers` | Liste des providers |
| `http://localhost:25809/v1/chat/completions` | Endpoint OpenAI-compatible (n8n) |

**Login par défaut** : `admin` / `admin123`

---

## 📦 Architecture

```
provider-bridge/
├── public/              # Frontend SPA (HTML/CSS/JS)
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
├── src/
│   ├── server.ts        # Point d'entrée Express
│   ├── database/        # SQLite (better-sqlite3)
│   ├── auth/            # JWT + Google OAuth
│   ├── services/        # Gemini CLI, API Key Rotation, Kiro CLI
│   ├── routes/          # Auth, Admin, Provider routes
│   └── swagger/         # OpenAPI 3.0 spec
├── netlify/             # Netlify Functions adapter
├── netlify.toml         # Netlify config
├── vercel.json          # Vercel config
└── package.json
```

---

## 🤖 Providers disponibles

### Gemini CLI
- Utilise l'authentification Google OAuth (credentials Gemini CLI)
- `POST /api/providers/gemini_cli/chat`
- `POST /api/providers/gemini_cli/generate`

### Gemini API Key Rotative
- Rotation automatique des clés API (5 req/min par clé)
- Configurer les clés dans `.env` : `GEMINI_API_KEY_1=...`, `GEMINI_API_KEY_2=...`
- `POST /api/providers/gemini_api_key_rotative/chat`
- `GET /api/providers/gemini_api_key_rotative/stats`

### Kiro CLI
- Amazon Kiro via CLI
- `POST /api/providers/kiro_cli/chat`

---

## 🔗 Intégration n8n / LangChain

Utilisez les endpoints OpenAI-compatibles :

```
Base URL: http://localhost:25809
POST /v1/chat/completions
GET  /v1/models
```

Exemple avec curl :

```bash
curl -X POST http://localhost:25809/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

---

## ☁️ Déploiement

### Netlify

```bash
# Build puis déploiement
npm run build
npx netlify deploy --prod
```

### Vercel

```bash
npx vercel --prod
```

---

## 📋 Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `PORT` | Port du serveur | `25809` |
| `JWT_SECRET` | Secret pour les tokens JWT | — |
| `ADMIN_USERNAME` | Email/username admin | `admin` |
| `ADMIN_PASSWORD` | Mot de passe admin | `admin123` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID | — |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | — |
| `GEMINI_API_KEY_*` | Clés API Gemini (rotation) | — |
| `KIRO_CLI_PATH` | Chemin vers Kiro CLI | auto-detect |

---

## 📄 Licence

Apache-2.0 — [AionUi](https://github.com/iOfficeAI/AionUi)
