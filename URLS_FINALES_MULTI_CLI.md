# 🎯 URLs Finales - Multi-CLI Gemini API

## ✅ Serveur Opérationnel

Le serveur Multi-CLI Gemini est en ligne avec 2 profils authentifiés!

## 🌐 URL Principale

```
http://localhost:25815
```

## 📚 Documentation Swagger UI

### URL de Test Interactive

```
http://localhost:25815/api-docs
```

**Fonctionnalités:**
- ✅ Documentation interactive complète
- ✅ Test en direct de tous les endpoints
- ✅ Exemples de requêtes et réponses
- ✅ Génération de code cURL
- ✅ Compatible OpenAPI 3.0

## 📡 Endpoints de Chat (OpenAI Compatible)

### Profile 2 - ohada.save@gmail.com

```
POST http://localhost:25815/api/v1/cli/profile2/chat
```

**Exemple de requête:**
```bash
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour"}]
  }'
```

### Profile 3 - ohada.save3@gmail.com

```
POST http://localhost:25815/api/v1/cli/profile3/chat
```

**Exemple de requête:**
```bash
curl -X POST http://localhost:25815/api/v1/cli/profile3/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour"}]
  }'
```

### Load Balancer (Distribution Automatique)

```
POST http://localhost:25815/api/v1/cli/chat
```

**Note:** Distribue automatiquement entre profile2 et profile3 (round-robin)

## 🔍 Endpoints de Gestion

### Liste des Profils

```
GET http://localhost:25815/api/v1/cli/profiles
```

### Détails d'un Profil

```
GET http://localhost:25815/api/v1/cli/profiles/profile2
GET http://localhost:25815/api/v1/cli/profiles/profile3
```

### Statistiques

```
GET http://localhost:25815/api/v1/cli/profiles/stats
```

### Health Check

```
GET http://localhost:25815/health
```

## 🧪 Test Rapide

### Ouvrir Swagger UI

```bash
start http://localhost:25815/api-docs
```

Ou dans votre navigateur: **http://localhost:25815/api-docs**

### Tester Profile 2

```powershell
Invoke-RestMethod -Uri "http://localhost:25815/api/v1/cli/profile2/chat" `
  -Method Post `
  -Body (@{
    model = "gemini-2.5-flash"
    messages = @(@{role="user"; content="Test profile2"})
  } | ConvertTo-Json -Depth 5) `
  -ContentType "application/json"
```

### Tester Profile 3

```powershell
Invoke-RestMethod -Uri "http://localhost:25815/api/v1/cli/profile3/chat" `
  -Method Post `
  -Body (@{
    model = "gemini-2.5-flash"
    messages = @(@{role="user"; content="Test profile3"})
  } | ConvertTo-Json -Depth 5) `
  -ContentType "application/json"
```

## 🔗 Intégration n8n

### Configuration HTTP Request

**Pour Profile 2:**
- Method: `POST`
- URL: `http://localhost:25815/api/v1/cli/profile2/chat`
- Body:
```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "{{ $json.message }}"}
  ]
}
```

**Pour Profile 3:**
- Method: `POST`
- URL: `http://localhost:25815/api/v1/cli/profile3/chat`
- Body: (même format)

## 📊 Résumé des URLs

| Type | URL | Description |
|------|-----|-------------|
| **Documentation** | http://localhost:25815/api-docs | Swagger UI interactive |
| **Health** | http://localhost:25815/health | État du serveur |
| **Profils** | http://localhost:25815/api/v1/cli/profiles | Liste des profils |
| **Stats** | http://localhost:25815/api/v1/cli/profiles/stats | Statistiques |
| **Chat Profile 2** | http://localhost:25815/api/v1/cli/profile2/chat | ohada.save@gmail.com |
| **Chat Profile 3** | http://localhost:25815/api/v1/cli/profile3/chat | ohada.save3@gmail.com |
| **Load Balancer** | http://localhost:25815/api/v1/cli/chat | Distribution auto |

## 🎯 Cas d'Usage

### 1. Test Interactif

Utilisez Swagger UI pour tester rapidement:
```
http://localhost:25815/api-docs
```

### 2. Intégration Application

Utilisez les endpoints spécifiques:
- Profile 2: Production
- Profile 3: Développement

### 3. Monitoring

Vérifiez les statistiques:
```
http://localhost:25815/api/v1/cli/profiles/stats
```

## 📚 Documentation Complète

- **[SWAGGER_DOCUMENTATION_MULTI_CLI.md](SWAGGER_DOCUMENTATION_MULTI_CLI.md)** - Guide Swagger
- **[ENDPOINTS_OPENAI_PAR_COMPTE.md](ENDPOINTS_OPENAI_PAR_COMPTE.md)** - Guide complet
- **[MULTI_CLI_FINAL_SUMMARY.md](MULTI_CLI_FINAL_SUMMARY.md)** - Vue d'ensemble

## ✅ Checklist

- [x] Serveur démarré sur port 25815
- [x] 2 profils authentifiés (profile2, profile3)
- [x] Documentation Swagger disponible
- [x] Endpoints OpenAI compatibles
- [x] Tests fonctionnels
- [x] Monitoring disponible

## 🚀 Commandes Rapides

```bash
# Démarrer le serveur
npm run multi-cli

# Ouvrir Swagger UI
start http://localhost:25815/api-docs

# Tester health check
curl http://localhost:25815/health

# Voir les profils
curl http://localhost:25815/api/v1/cli/profiles

# Tester profile2
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}]}'
```

---

**URL de Test Principale**: http://localhost:25815/api-docs  
**Serveur**: http://localhost:25815  
**Status**: ✅ En ligne  
**Profils**: 2 actifs (profile2, profile3)

