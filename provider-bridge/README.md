# 🌉 Provider Bridge Endpoint

Sous-projet indépendant du projet AionUi — un gateway API centralisé pour **Gemini CLI**, **Gemini API Key Rotative** et **Kiro CLI**.

---

## 📚 Documentation

**Toute la documentation est dans le dossier** : [`resource_endpoint/`](./resource_endpoint/)

### 🚀 Démarrage Rapide

| Document | Description |
|----------|-------------|
| [resource_endpoint/REPONSE_RAPIDE.md](./resource_endpoint/REPONSE_RAPIDE.md) | ⚡ FAQ - START HERE! |
| [resource_endpoint/README_SIMPLE.md](./resource_endpoint/README_SIMPLE.md) | Guide ultra-simplifié (2 min) |
| [resource_endpoint/COMMENT_LANCER.md](./resource_endpoint/COMMENT_LANCER.md) | Guide de lancement complet |

### 🔗 Configuration n8n

| Document | Description |
|----------|-------------|
| [resource_endpoint/N8N_BASE_URLS.md](./resource_endpoint/N8N_BASE_URLS.md) | ⚡ URLs base pour n8n |
| [resource_endpoint/ENDPOINTS_SUMMARY.md](./resource_endpoint/ENDPOINTS_SUMMARY.md) | Résumé des endpoints |

### 🛠️ Scripts

| Script | Description |
|--------|-------------|
| [resource_endpoint/START.bat](./resource_endpoint/START.bat) | Lance en mode développement (Windows) |
| [resource_endpoint/START-PROD.bat](./resource_endpoint/START-PROD.bat) | Lance en mode production (Windows) |
| [resource_endpoint/TEST.bat](./resource_endpoint/TEST.bat) | Lance les tests (Windows) |

📚 **Index complet** : [resource_endpoint/INDEX.md](./resource_endpoint/INDEX.md)

---

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd provider-bridge
npm install
```

### 2. Configuration

Le fichier `.env` est déjà configuré avec 13 clés API Gemini.

### 3. Lancement

**Windows** — Double-cliquez sur :
```
resource_endpoint/START.bat
```

**Linux/Mac** — Dans le terminal :
```bash
npm run dev
```

### 4. Accès

| URL | Description |
|-----|-------------|
| `http://localhost:25809` | Dashboard admin |
| `http://localhost:25809/docs` | Documentation Swagger |
| `http://localhost:25809/health` | Health check |

**Login par défaut** : `admin` / `admin123`

---

## 🔗 URLs Base pour n8n

### Gemini CLI OAuth (Gratuit)
```
http://localhost:25809/cli
```

### Gemini API Key Rotative (Production, 195 req/min)
```
http://localhost:25809
```

**Configuration n8n** :
1. Créer credentials **OpenAI**
2. **API Key** : `dummy`
3. **Base URL** : (choisir une des URLs ci-dessus)

📚 Voir [resource_endpoint/N8N_BASE_URLS.md](./resource_endpoint/N8N_BASE_URLS.md)

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

### Gemini CLI (Nouveau ! OAuth gratuit)
- Utilise l'authentification Google OAuth (credentials Gemini CLI)
- **Endpoints OpenAI-compatibles** :
  - `GET /cli/models` ou `/cli/v1/models`
  - `POST /cli/chat/completions` ou `/cli/v1/chat/completions`
- **Base URL n8n** : `http://localhost:25809/cli`
- ✅ Gratuit, aucune clé API consommée
- ✅ Quota OAuth généreux
- 📚 [Documentation détaillée](./resource_endpoint/GEMINI_CLI_OPENAI_ENDPOINTS.md)

### Gemini API Key Rotative
- Rotation automatique des clés API (15 req/min par clé)
- Configurer les clés dans `.env` : `GEMINI_API_KEY_1=...`, `GEMINI_API_KEY_2=...`
- **Endpoints OpenAI-compatibles** :
  - `GET /v1/models`
  - `POST /v1/chat/completions`
- **Base URL n8n** : `http://localhost:25809`
- `GET /api/providers/gemini_api_key_rotative/stats`

### Kiro CLI
- Amazon Kiro via CLI
- `POST /api/providers/kiro_cli/chat`

---

## 🔗 Intégration n8n / LangChain

### Option 1 : Gemini CLI OAuth (Gratuit, recommandé)

**Base URL** : `http://localhost:25809/cli`

Utilisez les endpoints OpenAI-compatibles :

```
GET  /cli/models
POST /cli/chat/completions
```

**Configuration n8n** :
1. Créez des credentials **OpenAI**
2. **API Key** : `dummy` (non utilisé mais requis)
3. **Base URL** : `http://localhost:25809/cli`

**Avantages** :
- ✅ Complètement gratuit (OAuth Google)
- ✅ Aucune clé API consommée
- ✅ Quota OAuth généreux
- ✅ Accès aux derniers modèles Gemini

**Prérequis** :
```bash
npm install -g @google/gemini-cli
gemini auth login
```

📚 [Documentation complète Gemini CLI](./GEMINI_CLI_OPENAI_ENDPOINTS.md)

---

### Option 2 : Gemini API Key Rotative (Production)

**Base URL** : `http://localhost:25809`

Utilisez les endpoints OpenAI-compatibles :

```
GET  /v1/models
POST /v1/chat/completions
```

**Configuration n8n** :
1. Créez des credentials **OpenAI**
2. **API Key** : `dummy` (non utilisé mais requis)
3. **Base URL** : `http://localhost:25809`

**Avantages** :
- ✅ 195 req/min (13 clés × 15 req/min)
- ✅ Rotation automatique
- ✅ Pas d'authentification OAuth requise

---

### Exemple avec curl :

**Gemini CLI OAuth** :
```bash
curl -X POST http://localhost:25809/cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

**Gemini API Key Rotative** :
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
