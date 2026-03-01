# 🌐 URLs du Serveur des Assistants

## 📍 URLs Principales

### Serveur Principal
```
http://localhost:25810
```

### Documentation Swagger (Interactive)
```
http://localhost:25810/api-docs
```

### Health Check
```
http://localhost:25810/health
```

### Page d'Accueil
```
http://localhost:25810/
```

## 📡 Endpoints API

### Format OpenAPI (Recommandé pour n8n)

#### Chat Completions
```
POST http://localhost:25810/api/v1/chat/completions
```

#### Liste des Modèles
```
GET http://localhost:25810/api/v1/models
```

#### Liste des Assistants
```
GET http://localhost:25810/api/v1/assistants
```

#### Chat avec Assistant Spécifique
```
POST http://localhost:25810/api/v1/assistants/{assistant_id}/chat
```

### Format Classique

#### Gemini CLI Direct
```
POST http://localhost:25810/api/gemini/chat
GET  http://localhost:25810/api/gemini/models
GET  http://localhost:25810/api/gemini/status
```

#### Assistants
```
GET  http://localhost:25810/api/assistants
POST http://localhost:25810/api/assistant/{name}
GET  http://localhost:25810/api/assistant/{name}/info
```

## 🎯 Exemples d'URLs Complètes

### Assistants Spécifiques

```
POST http://localhost:25810/api/v1/assistants/cowork/chat
POST http://localhost:25810/api/v1/assistants/beautiful-mermaid/chat
POST http://localhost:25810/api/v1/assistants/pptx-generator/chat
POST http://localhost:25810/api/v1/assistants/ui-ux-pro-max/chat
POST http://localhost:25810/api/v1/assistants/game-3d/chat
POST http://localhost:25810/api/v1/assistants/pdf-to-ppt/chat
POST http://localhost:25810/api/v1/assistants/planning-with-files/chat
POST http://localhost:25810/api/v1/assistants/human-3-coach/chat
POST http://localhost:25810/api/v1/assistants/social-job-publisher/chat
POST http://localhost:25810/api/v1/assistants/moltbook/chat
POST http://localhost:25810/api/v1/assistants/openclaw-setup/chat
POST http://localhost:25810/api/v1/assistants/story-roleplay/chat
```

## 🧪 URLs de Test

### Health Check
```bash
curl http://localhost:25810/health
```

### Liste des Modèles
```bash
curl http://localhost:25810/api/v1/models
```

### Liste des Assistants
```bash
curl http://localhost:25810/api/v1/assistants
```

### Test Chat
```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Bonjour"}],"model":"gemini-3-flash"}'
```

## 📝 Configuration n8n

### URL pour HTTP Request Node
```
http://localhost:25810/api/v1/chat/completions
```

### URL pour OpenAI Node (Base URL)
```
http://localhost:25810/api/v1
```

## 🔧 Configuration

### Variable d'Environnement
```env
ASSISTANT_PORT=25810
```

### Changer le Port
```bash
# Dans .env
ASSISTANT_PORT=8080

# Ou via variable d'environnement
ASSISTANT_PORT=8080 npm start
```

## 🌐 Accès Réseau

### Local (par défaut)
```
http://localhost:25810
http://127.0.0.1:25810
```

### Réseau Local (si configuré)
```
http://[votre-ip]:25810
```

Exemple :
```
http://192.168.1.100:25810
```

## 📊 Résumé

| Service | URL |
|---------|-----|
| **Serveur** | http://localhost:25810 |
| **Swagger** | http://localhost:25810/api-docs |
| **Health** | http://localhost:25810/health |
| **Chat OpenAPI** | http://localhost:25810/api/v1/chat/completions |
| **Modèles** | http://localhost:25810/api/v1/models |
| **Assistants** | http://localhost:25810/api/v1/assistants |

## 🆘 Dépannage

### Serveur ne répond pas
```bash
# Vérifier que le serveur est démarré
curl http://localhost:25810/health

# Vérifier le port
lsof -i :25810
```

### Port déjà utilisé
```bash
# Changer le port
ASSISTANT_PORT=25811 npm start
```

### Accès depuis un autre ordinateur
```bash
# Trouver votre IP
ipconfig  # Windows
ifconfig  # Linux/Mac

# Utiliser l'IP
http://[votre-ip]:25810
```

---

**Port par défaut** : 25810

**Documentation Swagger** : http://localhost:25810/api-docs

**Status** : ✅ ACTIF

**Version** : 1.1.0
