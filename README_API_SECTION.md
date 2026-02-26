## 🔌 NEW: Gemini CLI API Endpoint

**Expose Gemini CLI as a REST API compatible with Ollama!**

AionUi now includes API endpoints to use Gemini CLI as a web service, perfect for:
- 🔗 **n8n Integration** - Use Gemini in your automation workflows
- 🌐 **Serverless Deployment** - Deploy on Netlify or Vercel
- 🔄 **Ollama Compatible** - Works with tools that support Ollama API
- 🔐 **Google OAuth** - Reuses your existing Gemini CLI credentials

### Quick Start

```bash
# 1. Check your setup
npm run diagnose:api

# 2. Start the server
npm run webui:remote

# 3. Test the API
npm run test:api
```

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/chat` | Chat with message history |
| `POST /api/generate` | Simple text generation |
| `GET /api/tags` | List available models |
| `GET /api/version` | API version |

### Example Usage

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### 📚 Full Documentation

- **[Quick Start Guide](./src/webserver/gemini-api-docs/QUICK_START_FR.md)** - Get started in 3 commands
- **[Complete Documentation](./src/webserver/gemini-api-docs/README.md)** - All guides and references
- **[n8n Integration](./src/webserver/gemini-api-docs/GEMINI_API_ENDPOINT.md#utilisation-avec-n8n)** - Use in n8n workflows
- **[Deployment Guide](./src/webserver/gemini-api-docs/GEMINI_API_QUICKSTART_FR.md)** - Deploy to Netlify/Vercel

See **[GEMINI_API_INDEX.md](./GEMINI_API_INDEX.md)** for the complete documentation index.

---
