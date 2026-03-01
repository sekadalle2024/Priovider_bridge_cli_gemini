# 🌉 Provider Bridge — Quick Start Guide

**Launch the unified API gateway for Gemini CLI, Gemini API Key Rotative, and Kiro CLI**

---

## ⚡ 30-Second Setup

```bash
cd provider-bridge

# 1. Configure
cp .env.example .env
# Edit .env with your 40 Gemini API keys

# 2. Install
npm install

# 3. Launch
npm run dev
```

✅ Server running at `http://localhost:25810`

---

## 📋 Prerequisites

- ✅ Node.js 22+ (check with `node -v`)
- ✅ 40 Gemini API keys from https://aistudio.google.com/app/apikey
- ✅ PostgreSQL or Supabase for database

---

## 🔑 Step 1: Configure API Keys

### Create `.env` file

```bash
cd provider-bridge
cp .env.example .env
nano .env  # or use your preferred editor
```

### Add 40 Gemini API Keys

In `.env`, replace the placeholder keys with your actual keys:

```env
GEMINI_API_KEY_1=AIza_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY_2=AIza_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY_3=AIza_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# ... continue up to GEMINI_API_KEY_40
```

### Configure Database

Choose one option:

**Option A: Supabase (Recommended)**
```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Option B: Local PostgreSQL**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/provider_bridge
```

**Option C: SQLite (Development)**
```env
DATABASE_TYPE=sqlite
DATABASE_PATH=./provider-bridge.db
```

### Essential Variables

```env
PORT=25810
NODE_ENV=development
JWT_SECRET=your-secret-key-here-minimum-32-characters-required
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## 📦 Step 2: Install Dependencies

```bash
npm install
```

Verify installation:
```bash
npm list
npm list typescript express
```

---

## 🚀 Step 3: Launch Server

### Development Mode (Hot-reload)

```bash
npm run dev
```

**Expected Output:**
```
═══════════════════════════════════════════════════════════════════
🌉 Provider Bridge Endpoint — Started!
═══════════════════════════════════════════════════════════════════

📍 Server: http://localhost:25810

📚 Documentation:
   Swagger UI:  http://localhost:25810/docs
   OpenAPI:     http://localhost:25810/openapi.json

🤖 Providers:
   Gemini CLI:   POST /api/providers/gemini_cli/chat
   API Key Rot.: POST /api/providers/gemini_api_key_rotative/chat
   Kiro CLI:     POST /api/providers/kiro_cli/chat

🔗 n8n / LangChain:
   POST http://localhost:25810/v1/chat/completions
   GET  http://localhost:25810/v1/models

🎛️  Admin Dashboard:
   http://localhost:25810
   Default: admin / admin123
```

### Production Mode

```bash
npm run build
npm start
```

### Remote Access (LAN)

```bash
npm start -- --remote
```

---

## ✅ Step 4: Verify Server

### Health Check

```bash
curl http://localhost:25810/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 45.123
}
```

### List Providers

```bash
curl http://localhost:25810/api/providers
```

### Check API Keys

```bash
curl http://localhost:25810/api/providers/gemini_api_key_rotative/stats
```

**Response shows:**
- Total keys loaded: 40
- Keys available: 40
- Capacity: 200 requests/minute (40 keys × 5 req/min)

### Test Chat

```bash
curl -X POST http://localhost:25810/api/providers/gemini_api_key_rotative/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "model": "gemini-2.5-flash"
  }'
```

---

## 🎯 Using with n8n

### 1. Create OpenAI Credentials

In n8n:
- Type: **OpenAI API**
- API Key: `dummy-key`
- Base URL: `http://127.0.0.1:25810/v1`

### 2. Add OpenAI Chat Model Node

- Credentials: Select the ones you created
- Model: `gemini-2.5-flash`
- Temperature: 0.7

### 3. Test the Workflow

Send a message → See Gemini response

---

## 📊 Available Models

| Model | Provider | Speed | Power |
|-------|----------|-------|-------|
| `gemini-2.5-pro` | API Key Rotative | Medium | Highest |
| `gemini-2.5-flash` | API Key Rotative | Fast | High ⭐ |
| `gemini-2.5-flash-lite` | API Key Rotative | Very Fast | Medium |
| `gemini-2.0-flash` | API Key Rotative | Fast | High |

---

## 📚 API Endpoints

### Provider-specific Endpoints

```
POST   /api/providers/gemini_api_key_rotative/chat
POST   /api/providers/gemini_api_key_rotative/generate
GET    /api/providers/gemini_api_key_rotative/stats
POST   /api/providers/gemini_cli/chat
POST   /api/providers/gemini_cli/generate
POST   /api/providers/kiro_cli/chat
POST   /api/providers/kiro_cli/generate
```

### OpenAI-Compatible Endpoints (for n8n/LangChain)

```
GET    /v1/models
POST   /v1/chat/completions
```

### Admin & Utility

```
GET    /health
GET    /api/providers
GET    /api/providers/models
GET    /docs
GET    /openapi.json
POST   /api/auth/login
GET    /api/auth/google
```

---

## 🎛️ Dashboard Admin

**Access:** http://localhost:25810

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

**Features:**
- 📊 Usage statistics by provider, model, user
- 👥 User management
- 🔑 Google OAuth credentials management
- ⚙️ Server settings

---

## 🧪 Testing

### Quick Test All Endpoints

```bash
npm run test
```

Or manually:

```bash
# Health
curl http://localhost:25810/health

# Providers
curl http://localhost:25810/api/providers

# Models
curl http://localhost:25810/v1/models

# Chat
curl -X POST http://localhost:25810/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Hello"}]}'
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Check if PostgreSQL is running
# macOS:
brew services list

# Linux:
sudo service postgresql status

# If not running:
brew services start postgresql@15
# or
sudo service postgresql start
```

### Error: "Port 25810 already in use"

```bash
# Find process using the port
lsof -i :25810

# Kill it
kill -9 <PID>

# Or use different port
PORT=25810 npm run dev
```

### Error: "GEMINI_API_KEY not configured"

```bash
# Check .env file exists
ls -la .env

# Verify keys are loaded
grep "GEMINI_API_KEY_" .env | wc -l
# Should show: 40

# Verify keys have values (not placeholder text)
grep "GEMINI_API_KEY_.*=AIza" .env | wc -l
# Should show: 40 (or your number of actual keys)
```

### Error: "Cannot find module"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📈 Performance Specs

### Per API Key
- **Rate Limit:** 5 requests/minute
- **Daily Capacity:** ~7,200 requests
- **Token Limit:** ~40,000 tokens/minute

### With 40 Keys
- **Total Rate Limit:** 200 requests/minute ⭐
- **Daily Capacity:** ~288,000 requests
- **Token Limit:** ~1,600,000 tokens/minute

---

## 🔄 Key Rotation Mechanism

The server automatically rotates through your 40 API keys:

1. **Request arrives** → Check next key's rate limit
2. **Within limit?** → Use that key, increment request count
3. **Limit exceeded?** → Move to next key (round-robin)
4. **Every 60 seconds** → Reset request counters for all keys

**Example:**
```
Request 1  → Key 1/40 (1/5 requests/min)
Request 2  → Key 2/40 (1/5 requests/min)
Request 3  → Key 3/40 (1/5 requests/min)
...
Request 40 → Key 40/40 (1/5 requests/min)
Request 41 → Key 1/40 (2/5 requests/min)  ← Back to Key 1
```

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build TypeScript
npm run build

# Run production server
npm start

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

---

## 🌐 Deployment

### Netlify

```bash
npm run build
npx netlify deploy --prod
```

### Vercel

```bash
npx vercel --prod
```

### Docker

```bash
docker build -t provider-bridge:latest .
docker run -p 25810:25810 \
  -e DATABASE_URL=postgresql://... \
  -e GEMINI_API_KEY_1=... \
  # ... (add all 40 keys)
  provider-bridge:latest
```

---

## 📖 Documentation

| Resource | Location |
|----------|----------|
| Full Setup Guide | `TASK_7_LAUNCH_GUIDE.md` |
| Gemini API Docs | `../src/webserver/gemini-api-key-rotative-docs/` |
| n8n Integration | `../src/webserver/gemini-api-key-rotative-docs/N8N_QUICK_SETUP.md` |
| Project Overview | `CLAUDE.md` |

---

## 🎓 Next Steps

1. ✅ Server running locally
2. ⬜ Integrate with n8n workflows
3. ⬜ Deploy to cloud (Netlify/Vercel)
4. ⬜ Configure custom models
5. ⬜ Set up webhooks

---

## 💬 Support

Having issues? Check:

1. **Logs:** `npm run dev` shows real-time logs
2. **Docs:** http://localhost:25810/docs
3. **Health:** curl http://localhost:25810/health
4. **Database:** Verify connection in `.env`
5. **API Keys:** Check they're in `.env` with correct format

---

## 📊 Status

```
✅ Database: PostgreSQL/Supabase/SQLite
✅ Auth: JWT + Google OAuth
✅ API Keys: 40 keys with rotation
✅ Models: Gemini 2.5 Pro/Flash, etc.
✅ Endpoints: OpenAI-compatible
✅ Admin: Dashboard included
✅ Docs: Swagger UI + OpenAPI
```

---

**Created:** 2024-01-15  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

Happy coding! 🚀