# 🚀 Provider Bridge — Démarrage Rapide

Guide de démarrage en 5 minutes pour utiliser les endpoints OpenAI-compatibles de Gemini CLI et Gemini API Key Rotative.

---

## ✅ Prérequis

- Node.js 22+ installé
- npm ou yarn

---

## 📦 Installation

```bash
cd provider-bridge
npm install
```

---

## ⚙️ Configuration

Le fichier `.env` est déjà configuré avec 13 clés API Gemini valides.

**Vérifiez la configuration** :
```bash
cat .env | grep GEMINI_API_KEY
```

Vous devriez voir 13 clés configurées (GEMINI_API_KEY_1 à GEMINI_API_KEY_13).

---

## 🚀 Lancement du serveur

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:25809`

**Vérification** :
```bash
curl http://localhost:25809/health
```

---

## 🎯 Option 1 : Gemini CLI OAuth (Gratuit)

### Installation de Gemini CLI

```bash
npm install -g @google/gemini-cli
```

### Authentification Google

```bash
gemini auth login
```

Suivez les instructions pour vous connecter avec votre compte Google.

### Test de l'endpoint

```bash
curl -X POST http://localhost:25809/cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [{"role": "user", "content": "Dis bonjour en français"}]
  }'
```

### Configuration n8n

1. Créez des credentials **OpenAI**
2. Configurez :
   - **API Key** : `dummy`
   - **Base URL** : `http://localhost:25809/cli`
3. Utilisez le nœud **OpenAI Chat Model**

**✅ Avantages** :
- Complètement gratuit
- Aucune clé API consommée
- Quota OAuth généreux

---

## 🎯 Option 2 : Gemini API Key Rotative (Production)

### Test de l'endpoint

```bash
curl -X POST http://localhost:25809/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Dis bonjour en français"}]
  }'
```

### Vérifier les statistiques

```bash
curl http://localhost:25809/api/providers/gemini_api_key_rotative/stats
```

### Configuration n8n

1. Créez des credentials **OpenAI**
2. Configurez :
   - **API Key** : `dummy`
   - **Base URL** : `http://localhost:25809`
3. Utilisez le nœud **OpenAI Chat Model**

**✅ Avantages** :
- 195 req/min de capacité (13 clés × 15 req/min)
- Rotation automatique des clés
- Pas besoin d'authentification OAuth

---

## 📋 Liste des modèles disponibles

### Gemini CLI

```bash
curl http://localhost:25809/cli/models
```

### Gemini API Key Rotative

```bash
curl http://localhost:25809/v1/models
```

---

## 🧪 Tests automatisés

```bash
node scripts/test-gemini-cli-openai.js
```

Ce script teste tous les endpoints et affiche un rapport détaillé.

---

## 📊 Tableau de bord Admin

**URL** : http://localhost:25809

**Login par défaut** :
- Username : `admin`
- Password : `admin123`

Le dashboard permet de :
- Voir les statistiques d'utilisation
- Gérer les utilisateurs
- Consulter les logs

---

## 🔍 Vérification du statut

### Health check

```bash
curl http://localhost:25809/health
```

### Status Gemini CLI

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

### Stats API Key Rotative

```bash
curl http://localhost:25809/api/providers/gemini_api_key_rotative/stats
```

**Réponse attendue** :
```json
{
  "totalKeys": 13,
  "activeKeys": 13,
  "totalRequests": 0,
  "requestsPerMinute": 195,
  "keyStats": [...]
}
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Documentation complète du projet |
| [GEMINI_CLI_OPENAI_ENDPOINTS.md](./GEMINI_CLI_OPENAI_ENDPOINTS.md) | Guide détaillé Gemini CLI |
| [ENDPOINTS_SUMMARY.md](./ENDPOINTS_SUMMARY.md) | Résumé de tous les endpoints |
| [Swagger UI](http://localhost:25809/docs) | Documentation interactive |

---

## 🐛 Dépannage

### Erreur : "Gemini CLI not found"

```bash
npm install -g @google/gemini-cli
```

### Erreur : "OAuth credentials not found"

```bash
gemini auth login
```

### Erreur : "Port 25809 already in use"

```bash
# Windows
netstat -ano | findstr :25809
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:25809 | xargs kill -9
```

### Erreur : "API key rate limited"

Les clés API ont une limite de 15 req/min. Le système de rotation automatique gère cela, mais si toutes les clés sont limitées, attendez 1 minute.

---

## 🎉 Prochaines étapes

1. **Testez dans n8n** : Créez un workflow simple avec le nœud OpenAI
2. **Explorez les modèles** : Testez différents modèles Gemini (3 Flash, 2.5 Pro, etc.)
3. **Consultez les stats** : Surveillez l'utilisation dans le dashboard admin
4. **Déployez** : Utilisez Netlify ou Vercel pour un déploiement en production

---

## 💡 Conseils

- **Développement** : Utilisez Gemini CLI OAuth (gratuit, quota généreux)
- **Production** : Utilisez Gemini API Key Rotative (195 req/min, rotation automatique)
- **Monitoring** : Consultez régulièrement `/api/providers/gemini_api_key_rotative/stats`
- **Sécurité** : Changez le mot de passe admin dans `.env` (ADMIN_PASSWORD)

---

**Besoin d'aide ?** Consultez la [documentation complète](./README.md) ou ouvrez une issue sur GitHub.

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
