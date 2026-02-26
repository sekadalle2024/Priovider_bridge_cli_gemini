# ⚡ Réponses Rapides

## Question 1: URL et API Key pour voir les modèles

### 🔗 URL pour voir vos modèles:

```
http://127.0.0.1:25808/v1/models
```

### 🔑 Configuration dans n8n (OpenAI Chat Model):

**Credentials OpenAI API:**
```
API Key: dummy-key
Base URL: http://127.0.0.1:25808/v1
```

**Modèles disponibles:**
- `gemini-2.5-flash` ⭐ (recommandé)
- `gemini-1.5-flash`
- `gemini-1.5-pro`

### 🧪 Test rapide:

```bash
curl http://127.0.0.1:25808/v1/models
```

## Question 2: Fix erreur workflow (ECONNREFUSED ::1:25808)

### ❌ Problème:
```
connect ECONNREFUSED ::1:25808
```

### ✅ Solution:

**Dans votre nœud HTTP Request n8n, utilisez:**

```
✅ BON: http://127.0.0.1:25808/api/chat
❌ MAUVAIS: http://localhost:25808/api/chat
```

**Si n8n est dans Docker:**
```
http://host.docker.internal:25808/api/chat
```

### 🔧 Configuration HTTP Request corrigée:

```json
{
  "url": "http://127.0.0.1:25808/api/chat",
  "method": "POST",
  "body": {
    "messages": [
      {"role": "user", "content": "{{ $json.prompt }}"}
    ],
    "stream": false
  }
}
```

## 🎯 Résumé

### Serveur mis à jour avec:
- ✅ Endpoint `/v1/models` (liste des modèles)
- ✅ Endpoint `/v1/chat/completions` (OpenAI compatible)
- ✅ Écoute sur `0.0.0.0` (fix IPv6)

### Prêt pour n8n:
- ✅ HTTP Request (Ollama style)
- ✅ OpenAI Chat Model (LangChain)
- ✅ 27 clés API avec rotation
- ✅ 135 requêtes/minute

## 📋 Workflow prêt à importer

**Fichier:** `n8n-workflow-gemini-ready.json`

**Importer dans n8n:**
1. Ouvrir n8n
2. Workflows → Import from File
3. Sélectionner `n8n-workflow-gemini-ready.json`
4. Exécuter le workflow

**Ce workflow teste les 2 méthodes:**
- HTTP Request (Ollama style)
- HTTP Request (OpenAI style)

## 🚀 Démarrage rapide

### 1. Vérifier le serveur:
```bash
curl http://127.0.0.1:25808/health
```

### 2. Voir les modèles:
```bash
curl http://127.0.0.1:25808/v1/models
```

### 3. Tester le chat:
```bash
curl -X POST http://127.0.0.1:25808/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}],"stream":false}'
```

### 4. Configurer n8n:
- Créer credentials "OpenAI API"
- API Key: `dummy-key`
- Base URL: `http://127.0.0.1:25808/v1`

### 5. Utiliser dans un workflow:
- Ajouter nœud "OpenAI Chat Model"
- Sélectionner credentials
- Model: `gemini-2.5-flash`

## ✅ Vérification

**La réponse doit contenir:**
```json
{
  "provider": "gemini_api_key_rotative",
  "keyUsed": "Key X/27",
  "model": "gemini-2.5-flash"
}
```

**Les logs du serveur doivent montrer:**
```
[Rotation] Using key 1/27 (1/5 req/min)
```

## 📚 Documentation complète

- `INTEGRATION_N8N_COMPLETE.md` - Résumé complet
- `REPONSES_QUESTIONS.md` - Réponses détaillées
- `N8N_CREDENTIALS_SETUP.md` - Configuration credentials
- `TEST_ENDPOINTS.md` - Tests des endpoints

---

**Status:** ✅ OPERATIONAL  
**Serveur:** http://0.0.0.0:25808  
**Clés:** 27/27  
**Capacité:** 135 req/min
