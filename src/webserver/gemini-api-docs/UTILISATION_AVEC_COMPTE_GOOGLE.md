# 🎯 Utilisation avec votre compte Google (ohada.finance@gmail.com)

## ✅ Votre Configuration Actuelle

D'après les logs, vous avez déjà :
- ✅ Node.js 22.22.0 installé
- ✅ Authentification Google OAuth configurée (ohada.finance@gmail.com)
- ✅ Credentials sauvegardés dans `~/.gemini/oauth_creds.json`
- ✅ Tous les fichiers du projet en place

## 🚀 Démarrage Immédiat

### 1. Démarrer le serveur

```bash
# Démarrer en mode WebUI avec accès réseau
npm run webui:remote
```

Le serveur démarre sur `http://localhost:25808`

### 2. Obtenir votre token JWT

1. Ouvrir http://localhost:25808 dans votre navigateur
2. Se connecter avec vos credentials admin
3. Ouvrir la console développeur (F12)
4. Aller dans l'onglet "Application" ou "Storage"
5. Chercher dans "Cookies" ou "Local Storage"
6. Copier la valeur du token JWT

### 3. Tester l'API

```bash
# Remplacer YOUR_TOKEN par votre token JWT
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Bonjour! Peux-tu me dire quelle heure il est?"}
    ]
  }'
```

## 🔗 Configuration n8n (Local)

### Étape 1 : Créer un workflow

1. Ouvrir n8n (http://localhost:5678 si vous l'avez installé)
2. Créer un nouveau workflow

### Étape 2 : Ajouter un nœud HTTP Request

**Configuration** :
- **URL** : `http://localhost:25808/api/chat`
- **Method** : POST
- **Authentication** : Header Auth
  - **Name** : Authorization
  - **Value** : Bearer YOUR_JWT_TOKEN

**Headers** :
```json
{
  "Content-Type": "application/json"
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

### Étape 3 : Tester

1. Ajouter un nœud "Manual Trigger" avant
2. Ajouter des données de test : `{ "prompt": "Bonjour!" }`
3. Exécuter le workflow
4. Vérifier la réponse

## 🌐 Utilisation avec Ollama dans n8n

Votre endpoint est compatible avec Ollama, donc vous pouvez l'utiliser comme un serveur Ollama local :

### Configuration dans n8n

1. **Installer le nœud Ollama** (si disponible) ou utiliser HTTP Request
2. **URL de base** : `http://localhost:25808`
3. **Modèle** : `gemini-2.0-flash-exp`

### Exemple avec HTTP Request

```json
{
  "url": "http://localhost:25808/api/chat",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "gemini-2.0-flash-exp",
    "messages": [
      {"role": "user", "content": "{{ $json.question }}"}
    ]
  }
}
```

## 📊 Exemples d'Utilisation

### Exemple 1 : Assistant de traduction

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Traduis en anglais : Bonjour, comment allez-vous?"}
    ]
  }'
```

### Exemple 2 : Analyse de données

```bash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Analyse ces données de ventes : [100, 150, 200, 180, 220]"}
    ]
  }'
```

### Exemple 3 : Génération de code

```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prompt": "Écris une fonction Python pour calculer la moyenne d'\''une liste"
  }'
```

## 🔐 Sécurité

### Votre compte Google

Votre authentification Google OAuth est déjà configurée et sécurisée :
- ✅ Credentials stockés localement dans `~/.gemini/oauth_creds.json`
- ✅ Tokens refresh automatiquement
- ✅ Pas besoin de clé API supplémentaire

### Token JWT

Le token JWT est utilisé pour sécuriser l'accès à l'API :
- ⏰ Expire après un certain temps (configurable)
- 🔒 Doit être renouvelé en se reconnectant
- 🚫 Ne jamais partager publiquement

## 🌍 Accès depuis d'autres machines (LAN)

### 1. Trouver votre IP locale

```bash
# Windows
ipconfig

# Chercher "IPv4 Address" (ex: 192.168.1.100)
```

### 2. Démarrer avec --remote

```bash
npm run webui:remote
```

### 3. Accéder depuis une autre machine

```bash
# Remplacer 192.168.1.100 par votre IP
curl -X POST http://192.168.1.100:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

## 📱 Utilisation depuis un smartphone

1. **Connecter le smartphone au même réseau WiFi**
2. **Ouvrir un navigateur** sur le smartphone
3. **Accéder à** : `http://192.168.1.100:25808` (votre IP locale)
4. **Se connecter** et obtenir le token
5. **Utiliser une app REST client** (comme Postman mobile) avec le token

## 🚀 Déploiement sur Internet (Netlify)

Si vous voulez rendre votre API accessible depuis Internet :

### 1. Obtenir une clé API Gemini

Puisque OAuth Google ne fonctionne pas en serverless, vous devez obtenir une clé API :

1. Aller sur https://aistudio.google.com/apikey
2. Se connecter avec ohada.finance@gmail.com
3. Créer une nouvelle clé API
4. Copier la clé

### 2. Déployer sur Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod
```

### 3. Configurer les variables

Dans le dashboard Netlify :
- `GEMINI_API_KEY` : Votre clé API copiée à l'étape 1
- `GEMINI_MODEL` : `gemini-2.0-flash-exp`

### 4. Utiliser

```bash
curl -X POST https://votre-site.netlify.app/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages": [{"role": "user", "content": "Hello!"}]}'
```

## 💡 Conseils

### Performance

- Utilisez `stream: false` pour des réponses complètes plus rapides
- Le modèle `gemini-2.0-flash-exp` est le plus rapide
- Évitez les messages trop longs

### Quota

- Vérifiez votre quota sur https://aistudio.google.com/
- Le compte gratuit a des limites
- Surveillez votre utilisation

### Sécurité

- Ne partagez jamais votre token JWT publiquement
- Renouvelez régulièrement votre token
- Utilisez HTTPS en production (Netlify/Vercel le font automatiquement)

## 🐛 Dépannage

### "Google OAuth authentication not configured"

Normalement vous ne devriez pas avoir cette erreur car vos credentials sont déjà configurés.
Si vous l'avez quand même :

```bash
# Vérifier que le fichier existe
ls ~/.gemini/oauth_creds.json

# Si absent, réauthentifier
gemini
```

### "Unauthorized"

- Votre token JWT a expiré → Se reconnecter à l'interface web
- Le token est invalide → Vérifier le format `Bearer TOKEN`

### "Port already in use"

```bash
# Changer le port
AIONUI_PORT=8080 npm run webui:remote
```

## 📚 Ressources

- **Documentation complète** : [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md)
- **Démarrage rapide** : [GEMINI_API_QUICKSTART_FR.md](./GEMINI_API_QUICKSTART_FR.md)
- **README principal** : [GEMINI_API_README.md](./GEMINI_API_README.md)

## 🎉 Prêt à Utiliser !

Votre configuration est prête ! Vous pouvez maintenant :

1. ✅ Démarrer le serveur : `npm run webui:remote`
2. ✅ Tester l'API : `npm run test:api`
3. ✅ Intégrer dans n8n
4. ✅ Utiliser depuis n'importe quel langage de programmation

**Bon développement ! 🚀**
