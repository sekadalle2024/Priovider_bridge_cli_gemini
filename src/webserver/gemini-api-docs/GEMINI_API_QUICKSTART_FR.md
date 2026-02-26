# 🚀 Démarrage Rapide - Gemini CLI API

Guide rapide pour exposer Gemini CLI comme endpoint API dans AionUI.

## ⚡ Installation Rapide (Local)

### 1. Authentification Google

```bash
# Lancer Gemini CLI pour s'authentifier
gemini

# Suivre les instructions dans le navigateur
# Les credentials seront sauvegardés automatiquement
```

### 2. Démarrer le serveur

```bash
# Démarrer AionUI en mode WebUI avec accès réseau
npm run webui:remote

# Le serveur démarre sur http://localhost:25808
```

### 3. Obtenir un token

1. Ouvrir http://localhost:25808
2. Se connecter avec admin/password (ou vos credentials)
3. Le token JWT est dans les cookies

### 4. Tester l'API

```bash
# Remplacer YOUR_TOKEN par votre token JWT
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Bonjour!"}
    ]
  }'
```

## 🎯 Utilisation avec n8n (Local)

### Configuration du nœud HTTP Request

**URL** : `http://localhost:25808/api/chat`

**Méthode** : POST

**Headers** :
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_TOKEN"
}
```

**Body** :
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ]
}
```

## ☁️ Déploiement Netlify

### 1. Déployer

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod
```

### 2. Configurer les variables

Dans Netlify Dashboard → Site settings → Environment variables :

```
GEMINI_API_KEY=votre_cle_api_gemini
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 3. Utiliser

```bash
curl -X POST https://votre-site.netlify.app/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

## 🚀 Déploiement Vercel

### 1. Déployer

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### 2. Configurer les variables

Dans Vercel Dashboard → Settings → Environment Variables :

```
GEMINI_API_KEY=votre_cle_api_gemini
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 3. Utiliser

```bash
curl -X POST https://votre-projet.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

## 📋 Endpoints Disponibles

| Endpoint | Description | Exemple |
|----------|-------------|---------|
| `POST /api/chat` | Chat avec historique | Voir ci-dessus |
| `POST /api/generate` | Génération simple | `{"prompt": "Hello"}` |
| `GET /api/tags` | Liste des modèles | - |
| `GET /api/version` | Version de l'API | - |

## 🔧 Variables d'Environnement

### Local

```bash
# Optionnel - Par défaut utilise OAuth Google
export GEMINI_API_KEY=votre_cle_api
export GEMINI_MODEL=gemini-2.0-flash-exp
export AIONUI_PORT=25808
```

### Netlify/Vercel

Configurer dans le dashboard :
- `GEMINI_API_KEY` : Votre clé API Gemini
- `GEMINI_MODEL` : Modèle à utiliser (défaut: gemini-2.0-flash-exp)

## 🐛 Dépannage Rapide

### "Google OAuth authentication not configured"

```bash
# S'authentifier avec Gemini CLI
gemini
```

### "Unauthorized"

- Vérifier que le token JWT est valide
- Se reconnecter à l'interface web pour obtenir un nouveau token

### "Port already in use"

```bash
# Changer le port
AIONUI_PORT=8080 npm run webui:remote
```

## 📚 Documentation Complète

Voir [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md) pour :
- Exemples détaillés
- Configuration avancée
- Intégration n8n complète
- Sécurité et bonnes pratiques

## 🎉 C'est tout !

Vous avez maintenant Gemini CLI exposé comme API compatible Ollama, utilisable dans n8n et déployable sur Netlify/Vercel !

**Questions ?** Consultez la [documentation complète](./GEMINI_API_ENDPOINT.md) ou ouvrez une [issue GitHub](https://github.com/iOfficeAI/AionUi/issues).
