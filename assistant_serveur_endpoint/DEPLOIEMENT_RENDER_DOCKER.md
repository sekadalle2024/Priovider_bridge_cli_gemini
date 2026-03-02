# 🐳 Déploiement Docker sur Render - Serveur des Assistants

## ✅ OUI! Avec Docker sur Render, vous pouvez utiliser Gemini CLI + mode "auto"!

Contrairement à Netlify (serverless), Render permet d'exécuter des conteneurs Docker complets où vous pouvez installer Gemini CLI.

## 🎯 Avantages de Render avec Docker

| Caractéristique | Render Docker | Netlify Functions |
|-----------------|---------------|-------------------|
| **Gemini CLI** | ✅ OUI | ❌ NON |
| **Mode "auto"** | ✅ OUI | ❌ NON |
| **OAuth gratuit** | ✅ OUI | ❌ NON |
| **Installation globale** | ✅ OUI | ❌ NON |
| **Processus persistants** | ✅ OUI | ❌ NON |
| **Coût** | $7/mois (ou gratuit) | Gratuit |

## 📦 Fichiers créés

J'ai créé tous les fichiers nécessaires:

1. **`Dockerfile.assistants`** - Image Docker avec Gemini CLI
2. **`docker-entrypoint.sh`** - Script de démarrage
3. **`render.yaml`** - Configuration Render (Blueprint)
4. **`.dockerignore`** - Fichiers à exclure du build

## 🚀 Déploiement en 3 étapes

### Étape 1: Obtenir les credentials OAuth

Sur votre machine locale:

```bash
# Authentifier Gemini CLI
gemini auth login

# Copier les credentials
cat ~/.gemini/oauth_creds.json
```

Copiez le contenu JSON complet.

### Étape 2: Créer le service sur Render

#### Option A: Via le Dashboard (recommandé)

1. Allez sur https://render.com
2. Cliquez sur "New +" → "Blueprint"
3. Connectez votre repo GitHub
4. Render détectera automatiquement `render.yaml`
5. Dans les variables d'environnement, ajoutez:
   ```
   GEMINI_OAUTH_CREDS = {contenu de oauth_creds.json}
   ```
6. Cliquez sur "Apply"

#### Option B: Via CLI

```bash
# Installer Render CLI
npm install -g @render/cli

# Se connecter
render login

# Déployer
render blueprint launch
```

### Étape 3: Configurer les variables d'environnement

Dans le Dashboard Render, ajoutez:

```
GEMINI_OAUTH_CREDS = {"access_token":"...","refresh_token":"..."}
```

## 📋 Configuration complète

### Variables d'environnement Render

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Mode production |
| `ASSISTANT_PORT` | `10000` | Port (Render utilise 10000) |
| `GEMINI_DEFAULT_MODEL` | `auto` | Mode auto activé |
| `GEMINI_OAUTH_CREDS` | `{...}` | Credentials OAuth (secret) |
| `ASSISTANTS_PATH` | `/app/assistant` | Chemin des assistants |

### Dockerfile.assistants

```dockerfile
FROM node:20-slim

# Installer Gemini CLI
RUN npm install -g @google/gemini-cli

# Copier l'application
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY scripts/ ./scripts/
COPY assistant/ ./assistant/

# Configuration
ENV ASSISTANT_PORT=10000
ENV GEMINI_DEFAULT_MODEL=auto

EXPOSE 10000
CMD ["node", "scripts/server-assistants-standalone.js"]
```

### docker-entrypoint.sh

```bash
#!/bin/bash
# Vérifier Gemini CLI
gemini --version

# Créer les credentials OAuth depuis la variable d'environnement
if [ ! -z "$GEMINI_OAUTH_CREDS" ]; then
    mkdir -p /root/.gemini
    echo "$GEMINI_OAUTH_CREDS" > /root/.gemini/oauth_creds.json
fi

# Démarrer le serveur
exec "$@"
```

## 🔗 URLs après déploiement

Render vous donnera une URL comme:

```
https://aionui-assistants.onrender.com
```

### Endpoints disponibles

```
POST   https://aionui-assistants.onrender.com/api/v1/chat/completions
GET    https://aionui-assistants.onrender.com/api/v1/models
GET    https://aionui-assistants.onrender.com/api/v1/assistants
GET    https://aionui-assistants.onrender.com/health
GET    https://aionui-assistants.onrender.com/api-docs
```

## 🎨 Configuration n8n

```
Credentials: OpenAI
API Key: dummy
Base URL: https://aionui-assistants.onrender.com/api/v1
```

## 💰 Coûts Render

### Plan Starter ($7/mois)
- ✅ 512 MB RAM
- ✅ 0.5 CPU
- ✅ Déploiements illimités
- ✅ SSL automatique
- ✅ Domaine personnalisé
- ✅ Parfait pour les assistants

### Plan Free (gratuit)
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ⚠️ Se met en veille après 15 min d'inactivité
- ⚠️ Redémarre en ~30 secondes
- ✅ Bon pour les tests

## 🧪 Test local avec Docker

Avant de déployer, testez localement:

```bash
# Build l'image
docker build -f Dockerfile.assistants -t assistants-server .

# Obtenir les credentials OAuth
OAUTH_CREDS=$(cat ~/.gemini/oauth_creds.json)

# Lancer le conteneur
docker run -p 10000:10000 \
  -e GEMINI_OAUTH_CREDS="$OAUTH_CREDS" \
  -e GEMINI_DEFAULT_MODEL=auto \
  assistants-server

# Tester
curl http://localhost:10000/health
```

## 📊 Comparaison des options de déploiement

| Option | Gemini CLI | Mode auto | Coût | Complexité | Recommandé |
|--------|------------|-----------|------|------------|------------|
| **Render Docker** | ✅ OUI | ✅ OUI | $7/mois | Moyenne | ⭐⭐⭐⭐⭐ Production |
| **Netlify** | ❌ NON | ❌ NON | Gratuit | Faible | ⭐⭐⭐ Serverless |
| **VPS** | ✅ OUI | ✅ OUI | $6-20/mois | Élevée | ⭐⭐⭐⭐ Contrôle total |
| **Local** | ✅ OUI | ✅ OUI | Gratuit | Très faible | ⭐⭐⭐⭐⭐ Développement |

## 🎯 Pourquoi Render Docker est idéal

### ✅ Avantages
1. **Gemini CLI fonctionne** - Installation globale possible
2. **Mode "auto"** - Sélection automatique du meilleur modèle
3. **OAuth gratuit** - Pas de consommation d'API keys
4. **Déploiement simple** - Push Git → déploiement automatique
5. **SSL automatique** - HTTPS inclus
6. **Domaine personnalisé** - Gratuit
7. **Logs en temps réel** - Dashboard complet
8. **Auto-restart** - Si le serveur crash

### ⚠️ Limitations
1. **Coût** - $7/mois (vs gratuit pour Netlify)
2. **Cold start** - Sur le plan gratuit (15 min d'inactivité)
3. **Credentials OAuth** - Doivent être configurés manuellement

## 🔧 Maintenance

### Mettre à jour Gemini CLI

Le Dockerfile installe toujours la dernière version. Pour forcer une mise à jour:

```bash
# Trigger un nouveau build sur Render
git commit --allow-empty -m "Rebuild to update Gemini CLI"
git push
```

### Renouveler les credentials OAuth

Si les credentials expirent:

1. Sur votre machine locale:
   ```bash
   gemini auth login
   cat ~/.gemini/oauth_creds.json
   ```

2. Dans Render Dashboard:
   - Aller dans Environment
   - Mettre à jour `GEMINI_OAUTH_CREDS`
   - Redémarrer le service

### Voir les logs

```bash
# Via CLI
render logs -s aionui-assistants

# Ou dans le Dashboard Render
# Section "Logs"
```

## 🆘 Dépannage

### Le serveur ne démarre pas

**Vérifier les logs:**
```bash
render logs -s aionui-assistants
```

**Causes communes:**
- Credentials OAuth manquants ou invalides
- Port incorrect (doit être 10000 sur Render)
- Erreur dans le Dockerfile

### Gemini CLI ne fonctionne pas

**Vérifier l'installation:**
```bash
# Dans les logs, vous devriez voir:
# ✅ Gemini CLI version: 0.31.0
```

**Si absent:**
- Vérifier que `npm install -g @google/gemini-cli` est dans le Dockerfile
- Rebuild l'image

### OAuth credentials invalides

**Symptôme:**
```
Error: Gemini CLI exited with code 1: check OAuth credentials
```

**Solution:**
1. Réauthentifier localement: `gemini auth login`
2. Copier les nouveaux credentials
3. Mettre à jour `GEMINI_OAUTH_CREDS` dans Render
4. Redémarrer le service

## 📚 Documentation complémentaire

- **[DEPLOIEMENT_NETLIFY_EXPLIQUE.md](DEPLOIEMENT_NETLIFY_EXPLIQUE.md)** - Déploiement Netlify (API Keys)
- **[DEPLOYMENT_OPTIONS.md](DEPLOYMENT_OPTIONS.md)** - Toutes les options
- **[OPENAI_COMPATIBLE_BASE_URL.md](OPENAI_COMPATIBLE_BASE_URL.md)** - API compatible OpenAI
- **[MEMO_MODE_AUTO.md](MEMO_MODE_AUTO.md)** - Mode "auto"

## ✅ Checklist de déploiement

- [ ] Fichiers Docker créés (`Dockerfile.assistants`, `docker-entrypoint.sh`)
- [ ] `render.yaml` configuré
- [ ] Credentials OAuth obtenus (`~/.gemini/oauth_creds.json`)
- [ ] Compte Render créé
- [ ] Repo GitHub connecté
- [ ] Blueprint déployé
- [ ] Variable `GEMINI_OAUTH_CREDS` configurée
- [ ] Service démarré
- [ ] Health check OK (`/health`)
- [ ] Test avec curl réussi
- [ ] Configuration n8n mise à jour

## 🎉 Résultat final

Après déploiement, vous aurez:

```
✅ Serveur des assistants en production
✅ Gemini CLI avec mode "auto"
✅ OAuth gratuit (pas d'API keys consommées)
✅ 13 assistants disponibles
✅ URL publique avec SSL
✅ Compatible avec n8n cloud
✅ Déploiement automatique depuis Git
```

**URL exemple:**
```
https://aionui-assistants.onrender.com/api/v1
```

## 🚀 Commandes rapides

```bash
# Build local
docker build -f Dockerfile.assistants -t assistants-server .

# Test local
docker run -p 10000:10000 \
  -e GEMINI_OAUTH_CREDS="$(cat ~/.gemini/oauth_creds.json)" \
  assistants-server

# Déployer sur Render
git add .
git commit -m "Deploy assistants server"
git push

# Voir les logs
render logs -s aionui-assistants
```

---

**Date**: 1er mars 2026  
**Plateforme**: Render.com  
**Technologie**: Docker + Gemini CLI  
**Mode**: auto (OAuth)  
**Coût**: $7/mois (Starter) ou Gratuit  
**Status**: ✅ Production-ready avec mode "auto"!
