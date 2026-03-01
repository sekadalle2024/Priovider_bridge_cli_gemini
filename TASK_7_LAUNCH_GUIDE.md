# 🚀 Task 7 - Lancer le serveur Provider Bridge avec 40 clés API Gemini

## 📋 Vue d'ensemble

Cette task couvre le lancement du serveur **Provider Bridge** (gateway API centralisé) avec :
- ✅ **40 clés API Gemini** avec rotation automatique
- ✅ **Gemini CLI** avec authentification Google OAuth
- ✅ **Kiro CLI** (optionnel)
- ✅ **Endpoints OpenAI-compatibles** pour n8n / LangChain
- ✅ **Dashboard Admin** pour gérer les comptes et statistiques
- ✅ **Base de données PostgreSQL** pour les utilisateurs et statistiques

---

## 📦 Prérequis

### Installé sur votre machine :
- ✅ Node.js 22+ (nvm configuré)
- ✅ npm ou bun
- ✅ Gemini CLI (optionnel mais recommandé)
- ✅ PostgreSQL local ou Supabase (pour la BD)

### À avoir :
- 🔑 **40 clés API Gemini** (créez-les à https://aistudio.google.com/app/apikey)
- 🔐 **Google OAuth credentials** (Client ID + Secret)
- 💾 **Base de données PostgreSQL** (locale ou Supabase)

---

## 🔑 Étape 1 : Préparer les 40 clés API Gemini

### Créer les clés API

1. Allez à https://aistudio.google.com/app/apikey
2. Créez **40 clés API** (ou réutilisez-en d'existantes)
3. **Copie format** : `AIza...XXXXXX` (format Google)

### Créer un fichier `.env` dans `provider-bridge/`

**Important**: Ne pas commiter ce fichier (il est dans `.gitignore`)

```bash
cd provider-bridge

# Copier le modèle
cp .env.example .env

# Éditer .env avec vos clés
nano .env
```

### Contenu du `.env` :

```env
# ============================================================
# Server Configuration
# ============================================================
PORT=25810
NODE_ENV=development
ALLOW_REMOTE=false

# ============================================================
# Authentication
# ============================================================
JWT_SECRET=your-secret-key-here-min-32-chars-required-12345678
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Google OAuth (for Gemini CLI)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ============================================================
# Gemini API Keys (40 keys)
# ============================================================
# Get from: https://aistudio.google.com/app/apikey
# Each key supports: 5 requests/minute
# Total capacity: 40 keys × 5 req/min = 200 req/min

GEMINI_API_KEY_1=AIza_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY_2=AIza_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY_3=AIza_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# ... (continue up to GEMINI_API_KEY_40)
GEMINI_API_KEY_40=AIza_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================================
# Database Configuration
# ============================================================
# PostgreSQL (Supabase)
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# OR Local PostgreSQL
# DATABASE_URL=postgresql://postgres:password@localhost:5432/provider_bridge

# ============================================================
# Features
# ============================================================
ENABLE_GEMINI_CLI=true
ENABLE_API_KEY_ROTATIVE=true
ENABLE_KIRO_CLI=false

# ============================================================
# Advanced Settings
# ============================================================
API_KEY_ROTATION_INTERVAL_MS=60000
API_KEY_MAX_REQUESTS_PER_MINUTE=5
SESSION_EXPIRY_HOURS=24
JWT_EXPIRY_HOURS=24
DEBUG=provider-bridge:*
LOG_LEVEL=info
```

---

## 🗄️ Étape 2 : Configurer PostgreSQL

### Option A : Utiliser Supabase (Recommandé - Zero Setup)

1. Allez à https://supabase.com
2. Créez un nouveau projet
3. Copez la `DATABASE_URL` depuis **Settings → Database → Connection string**
4. Collez dans `.env` sous `DATABASE_URL`

### Option B : PostgreSQL Local

```bash
# macOS avec Homebrew
brew install postgresql@15
brew services start postgresql@15

# Windows avec WSL
# Installer WSL2 puis : sudo apt-get install postgresql

# Linux
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Créer la base de données
psql -U postgres

postgres=# CREATE DATABASE provider_bridge;
postgres=# \q
```

Puis dans `.env` :
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/provider_bridge
```

---

## 📥 Étape 3 : Installation et Build

```bash
# Navigate to provider-bridge
cd provider-bridge

# Clean install
rm -rf node_modules package-lock.json
npm install

# Build TypeScript
npm run build

# Vérifier la compilation
ls -la dist/
```

---

## 🚀 Étape 4 : Lancer le serveur

### Mode développement (hot-reload)

```bash
npm run dev
```

**Output attendu :**
```
═══════════════════════════════════════════════════════════════════
🌉 Provider Bridge Endpoint — Started!
═══════════════════════════════════════════════════════════════════

📍 Server: http://localhost:25810

📚 Documentation:
   Swagger UI:  http://localhost:25810/docs
   OpenAPI:     http://localhost:25810/openapi.json

🔑 Auth:
   Login:       POST http://localhost:25810/api/auth/login
   Google OAuth: GET http://localhost:25810/api/auth/google

🤖 Providers:
   Gemini CLI:   POST /api/providers/gemini_cli/chat
   API Key Rot.: POST /api/providers/gemini_api_key_rotative/chat
   Kiro CLI:     POST /api/providers/kiro_cli/chat

🔗 n8n / LangChain:
   POST http://localhost:25810/v1/chat/completions
   GET  http://localhost:25810/v1/models

🎛️ Admin Dashboard:
   http://localhost:25810
   Default: admin / admin123

═══════════════════════════════════════════════════════════════════
```

### Mode production

```bash
npm run build
npm start

# Avec accès réseau (LAN)
npm start -- --remote
```

---

## ✅ Étape 5 : Vérifier le serveur

### 1. Health check

```bash
curl http://localhost:25810/health
```

**Response :**
```json
{
  "status": "ok",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "uptime": 45.123
}
```

### 2. Voir les providers disponibles

```bash
curl http://localhost:25810/api/providers
```

**Response :**
```json
{
  "providers": [
    {
      "id": "gemini_cli",
      "name": "Gemini CLI",
      "available": true,
      "hasOAuth": false,
      "endpoints": {
        "chat": "POST /api/providers/gemini_cli/chat"
      }
    },
    {
      "id": "gemini_api_key_rotative",
      "name": "Gemini API Key Rotative",
      "available": true,
      "keysLoaded": 40,
      "endpoints": {
        "chat": "POST /api/providers/gemini_api_key_rotative/chat",
        "stats": "GET /api/providers/gemini_api_key_rotative/stats"
      }
    }
  ]
}
```

### 3. Vérifier les statistiques des clés API

```bash
curl http://localhost:25810/api/providers/gemini_api_key_rotative/stats
```

**Response :**
```json
{
  "keysLoaded": 40,
  "keysAvailable": 40,
  "totalRequests": 0,
  "capacityPerMinute": 200,
  "keys": [
    {
      "index": 0,
      "maskedKey": "AIza_xxxx...xxxx",
      "requestsThisMinute": 0,
      "totalRequests": 0,
      "available": true
    },
    // ... (39 more keys)
  ]
}
```

### 4. Tester un chat

```bash
curl -X POST http://localhost:25810/api/providers/gemini_api_key_rotative/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Bonjour, qui es-tu?"}
    ],
    "model": "gemini-2.5-flash"
  }'
```

**Response :**
```json
{
  "model": "gemini-2.5-flash",
  "provider": "gemini_api_key_rotative",
  "created_at": "2024-12-19T10:30:00.000Z",
  "message": {
    "role": "assistant",
    "content": "Bonjour! Je suis Claude, un assistant IA créé par Anthropic..."
  },
  "done": true,
  "keyUsed": "Key 1/40"
}
```

---

## 🔗 Étape 6 : Endpoints OpenAI-compatibles (pour n8n)

### Endpoint pour lister les modèles

```bash
curl http://localhost:25810/v1/models
```

**Response :**
```json
{
  "object": "list",
  "data": [
    {
      "id": "gemini-2.5-flash",
      "object": "model",
      "owned_by": "google",
      "permission": [{"allow": "all"}]
    },
    {
      "id": "gemini-2.5-pro",
      "object": "model",
      "owned_by": "google",
      "permission": [{"allow": "all"}]
    },
    // ... (more models)
  ]
}
```

### Endpoint pour chat

```bash
curl -X POST http://localhost:25810/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Explique les trous noirs"}
    ],
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

**Response :**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1704180600,
  "model": "gemini-2.5-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Les trous noirs sont des régions de l'espace-temps..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 150,
    "total_tokens": 160
  }
}
```

---

## 🎛️ Étape 7 : Dashboard Admin

### Accès

```
URL: http://localhost:25810
Username: admin
Password: admin123
```

### Fonctionnalités

1. **📊 Tableau de bord** : Vue d'ensemble des statistiques
2. **👥 Gestion des utilisateurs** : Ajouter/supprimer des comptes
3. **🔑 Gestion des comptes Google** : Voir les credentials liées
4. **📈 Statistiques d'utilisation** : Par provider, modèle, utilisateur
5. **⚙️ Paramètres** : Configuration du serveur

---

## 🔐 Étape 8 : Configuration Gemini CLI (Optionnel)

Si vous voulez utiliser le provider Gemini CLI :

```bash
# 1. Installer Gemini CLI globalement
npm install -g @google/gemini-cli

# 2. Authentifier avec Google
gemini

# Follow the OAuth flow

# 3. Vérifier dans Provider Bridge
curl http://localhost:25810/api/providers
# gemini_cli doit avoir "available": true et "hasOAuth": true
```

---

## 🎯 Étape 9 : Intégration avec n8n

### 1. Créer des credentials OpenAI

Dans n8n :
- Créer une nouvelle **Credential** "OpenAI API"
- **API Key** : `dummy-key` (n'importe quelle valeur)
- **Base URL** : `http://127.0.0.1:25810/v1`

### 2. Utiliser dans un workflow

Ajouter un nœud **"OpenAI Chat Model"** :
- Sélectionner les credentials créées
- **Model** : `gemini-2.5-flash`
- **Temperature** : 0.7

### 3. Tester

Envoyer un message → vérifier la réponse de Gemini

---

## 📊 Étape 10 : Monitoring et Logs

### Voir les logs en temps réel

```bash
# Mode développement (déjà visibles dans le terminal)
npm run dev

# Mode production avec logs
npm start 2>&1 | tee server.log

# Filtrer par niveau
DEBUG=provider-bridge:* npm run dev
```

### Formats des logs

```
✅ [INFO] Server started on port 25810
🔑 [KEY-ROTATION] Using key 1/40 (1/5 requests/min)
📝 [DATABASE] User 'admin' logged in
🚀 [CHAT] Gemini API Key Rotative - gemini-2.5-flash
⚠️  [WARN] API key rate limit approaching (4/5 requests)
❌ [ERROR] Database connection failed: ECONNREFUSED
```

---

## 🐛 Troubleshooting

### Erreur : "Cannot find module 'pg'"

```bash
npm install pg @types/pg
npm run build
```

### Erreur : "DATABASE_URL not configured"

```bash
# Vérifier que .env existe
ls -la .env

# Vérifier la variable
grep DATABASE_URL .env

# Si vide, configurer :
echo "DATABASE_URL=postgresql://..." >> .env
```

### Erreur : "ECONNREFUSED 127.0.0.1:5432" (PostgreSQL)

```bash
# Vérifier que PostgreSQL est lancé
# macOS
brew services list

# Linux
sudo service postgresql status

# Démarrer si arrêté
brew services start postgresql@15
# ou
sudo service postgresql start
```

### Les 40 clés ne sont pas chargées

```bash
# Vérifier que les clés sont dans .env
grep "GEMINI_API_KEY" .env | wc -l
# Doit afficher 40

# Vérifier que les clés sont valides (pas vides)
grep "GEMINI_API_KEY.*=AIza" .env | wc -l
# Doit afficher 40 (pas de "replace-with...")
```

### Erreur : "Port 25810 already in use"

```bash
# Trouver le processus
lsof -i :25810
# ou
netstat -tulpn | grep 25810

# Tuer le processus
kill -9 <PID>

# Ou utiliser un port différent
PORT=25810 npm start
```

---

## 📈 Capacité et Limitations

### Par clé API Gemini

| Métrique | Valeur |
|----------|--------|
| Requêtes/minute | 5 |
| Requêtes/jour | ~7,200 |
| Tokens/minute | ~40,000 |

### Avec 40 clés

| Métrique | Valeur |
|----------|--------|
| Requêtes/minute | **200** |
| Requêtes/jour | **~288,000** |
| Tokens/minute | **~1,600,000** |

### Modèles disponibles

- ✅ `gemini-2.5-pro` - Le plus puissant
- ✅ `gemini-2.5-flash` - Rapide et efficace (recommandé)
- ✅ `gemini-2.5-flash-lite` - Ultra-rapide
- ✅ `gemini-2.0-flash` - Ancien mais stable
- ⭐ Plus de modèles à venir

---

## 🎯 Procédures d'exploitation

### Redémarrer le serveur (prod)

```bash
# 1. Arrêter le serveur actuel
pkill -f "node dist/server.js"
# ou Ctrl+C dans le terminal

# 2. Attendre 2 secondes
sleep 2

# 3. Relancer
npm start
```

### Ajouter une nouvelle clé API

```bash
# 1. Éditer .env
nano .env

# 2. Ajouter : GEMINI_API_KEY_41=AIza_xxx...

# 3. Redémarrer le serveur
pkill -f "node dist/server.js"
sleep 2
npm start
```

### Consulter les statistiques d'utilisation

```bash
# Via API
curl http://localhost:25810/api/providers/gemini_api_key_rotative/stats

# Via Dashboard
# http://localhost:25810 → Admin → Statistics
```

### Sauvegarder la base de données

```bash
# PostgreSQL (local)
pg_dump provider_bridge > backup.sql

# Supabase
# Via interface web: https://supabase.com/dashboard
```

---

## ✨ Prochaines étapes (Task 8+)

- [ ] Implémentation endpoints v1 complets
- [ ] Frontend React pour dashboard
- [ ] Authentification Google OAuth
- [ ] Webhooks pour n8n
- [ ] Logging et monitoring avancé
- [ ] Déploiement Netlify/Vercel

---

## 📞 Support

En cas de problème :

1. Consultez les logs : `tail -f server.log`
2. Testez avec curl : `curl http://localhost:25810/health`
3. Vérifiez la base de données : `psql provider_bridge`
4. Consultez la documentation : `http://localhost:25810/docs`

---

**Status : ✅ OPERATIONAL**

Serveur lancé et prêt à servir 40 clés API Gemini!