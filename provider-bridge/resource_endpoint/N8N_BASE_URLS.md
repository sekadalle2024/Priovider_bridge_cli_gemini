# 🔗 URLs Base pour n8n — Provider Bridge

Guide rapide pour configurer les Base URLs dans n8n.

---

## 📍 URLs Base OpenAI-Compatible

### Option 1 : Gemini CLI OAuth (Gratuit, recommandé pour dev)

```
http://localhost:25809/cli
```

**Caractéristiques** :
- ✅ Complètement gratuit
- ✅ Utilise votre compte Google OAuth
- ✅ Aucune clé API consommée
- ✅ Quota OAuth généreux
- ✅ Accès aux derniers modèles Gemini

**Prérequis** :
```bash
npm install -g @google/gemini-cli
gemini auth login
```

**Configuration n8n** :
1. Créer credentials **OpenAI**
2. **API Key** : `dummy` (requis mais non utilisé)
3. **Base URL** : `http://localhost:25809/cli`

---

### Option 2 : Gemini API Key Rotative (Production, 195 req/min)

```
http://localhost:25809
```

**Caractéristiques** :
- ✅ 195 requêtes/minute (13 clés × 15 req/min)
- ✅ Rotation automatique des clés API
- ✅ Pas besoin d'authentification OAuth
- ✅ Production ready
- ✅ 13 clés déjà configurées

**Configuration n8n** :
1. Créer credentials **OpenAI**
2. **API Key** : `dummy` (requis mais non utilisé)
3. **Base URL** : `http://localhost:25809`

---

## 🎯 Tableau Comparatif

| Critère | Gemini CLI OAuth | Gemini API Key Rotative |
|---------|------------------|-------------------------|
| **Base URL** | `http://localhost:25809/cli` | `http://localhost:25809` |
| **Coût** | Gratuit | Gratuit (tier free) |
| **Quota** | Quota OAuth Google | 195 req/min |
| **Setup** | OAuth requis | Clés dans .env |
| **Authentification** | Google OAuth | Aucune |
| **Use case** | Développement | Production |

---

## 📋 Configuration n8n Étape par Étape

### Étape 1 : Créer les Credentials

1. Dans n8n, allez dans **Credentials** → **New**
2. Cherchez **OpenAI**
3. Cliquez sur **OpenAI**

### Étape 2 : Configurer les Credentials

**Pour Gemini CLI OAuth** :
```
Name: Gemini CLI OAuth
API Key: dummy
Base URL: http://localhost:25809/cli
```

**Pour Gemini API Key Rotative** :
```
Name: Gemini API Key Rotative
API Key: dummy
Base URL: http://localhost:25809
```

### Étape 3 : Utiliser dans un Workflow

1. Ajoutez un nœud **OpenAI Chat Model**
2. Sélectionnez les credentials créés
3. Choisissez un modèle (ex: `gemini-2.5-flash`)
4. Testez !

---

## 🧪 Tester les URLs

### Test Gemini CLI OAuth

```bash
# Liste des modèles
curl http://localhost:25809/cli/models

# Chat
curl -X POST http://localhost:25809/cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

### Test Gemini API Key Rotative

```bash
# Liste des modèles
curl http://localhost:25809/v1/models

# Chat
curl -X POST http://localhost:25809/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'

# Statistiques
curl http://localhost:25809/api/providers/gemini_api_key_rotative/stats
```

---

## 🔍 Vérification

### Vérifier que le serveur est lancé

```bash
curl http://localhost:25809/health
```

**Réponse attendue** :
```json
{
  "status": "ok",
  "timestamp": "2026-03-01T...",
  "uptime": 123.45
}
```

### Vérifier Gemini CLI

```bash
curl http://localhost:25809/api/providers/gemini_cli/status
```

**Réponse attendue** :
```json
{
  "available": true,
  "hasOAuth": true,
  "version": "1.x.x",
  "cliPath": "C:\\Users\\...\\npm\\gemini.cmd"
}
```

---

## 💡 Recommandations

### Pour le Développement
**Utilisez Gemini CLI OAuth** : `http://localhost:25809/cli`
- Gratuit
- Quota généreux
- Parfait pour tester

### Pour la Production
**Utilisez Gemini API Key Rotative** : `http://localhost:25809`
- 195 req/min
- Rotation automatique
- Pas de setup OAuth

---

## 🐛 Dépannage

### Erreur : "Cannot connect to server"
```bash
# Vérifier que le serveur est lancé
cd provider-bridge
npm run dev
```

### Erreur : "Gemini CLI not found" (pour /cli)
```bash
npm install -g @google/gemini-cli
gemini auth login
```

### Erreur : "API key rate limited" (pour base URL)
Attendez 1 minute. Le système de rotation automatique gère les limites.

---

## 📚 Documentation Complète

- [QUICK_START.md](./QUICK_START.md) — Démarrage rapide
- [GEMINI_CLI_OPENAI_ENDPOINTS.md](./GEMINI_CLI_OPENAI_ENDPOINTS.md) — Guide Gemini CLI
- [ENDPOINTS_SUMMARY.md](./ENDPOINTS_SUMMARY.md) — Tous les endpoints
- [Swagger UI](http://localhost:25809/docs) — Documentation interactive

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
