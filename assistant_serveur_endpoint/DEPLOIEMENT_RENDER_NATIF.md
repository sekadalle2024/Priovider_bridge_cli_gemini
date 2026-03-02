# 🚀 Déploiement Render Natif (sans Docker) - Serveur des Assistants

## ✅ Déploiement Node.js natif - Plus simple que Docker!

Render supporte le déploiement Node.js natif, ce qui est **plus simple et plus rapide** que Docker.

## 🎯 Avantages du déploiement natif

| Caractéristique | Natif Node.js | Docker |
|-----------------|---------------|--------|
| **Simplicité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Vitesse de build** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Gemini CLI** | ✅ OUI | ✅ OUI |
| **Mode "auto"** | ✅ OUI | ✅ OUI |
| **Configuration** | Très simple | Moyenne |

## 📦 Fichiers créés

1. **`render-native.yaml`** - Configuration Render (Node.js natif)
2. **`scripts/setup-gemini-oauth.js`** - Script de configuration OAuth
3. **Ce guide** - Documentation complète

## 🚀 Déploiement en 4 étapes

### Étape 1: Obtenir les tokens OAuth

Sur votre machine locale:

```bash
# Authentifier Gemini CLI
gemini auth login

# Lire les credentials
cat ~/.gemini/oauth_creds.json
```

Vous verrez quelque chose comme:
```json
{
  "access_token": "ya29.a0AfB_...",
  "refresh_token": "1//0gK...",
  "token_type": "Bearer",
  "expiry_date": 1709251200000
}
```

Copiez les valeurs de `access_token` et `refresh_token`.

### Étape 2: Créer le service sur Render

#### Via le Dashboard (recommandé)

1. Allez sur https://render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repo GitHub
4. Configurez:
   - **Name**: `aionui-assistants`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm install -g @google/gemini-cli && node scripts/setup-gemini-oauth.js`
   - **Start Command**: `node scripts/server-assistants-standalone.js`
   - **Plan**: Starter ($7/mois) ou Free

5. Ajoutez les variables d'environnement:
   ```
   NODE_VERSION = 20
   ASSISTANT_PORT = 10000
   GEMINI_DEFAULT_MODEL = auto
   GEMINI_OAUTH_ACCESS_TOKEN = ya29.a0AfB_...
   GEMINI_OAUTH_REFRESH_TOKEN = 1//0gK...
   ```

6. Cliquez sur "Create Web Service"

#### Via Blueprint (automatique)

1. Ajoutez `render-native.yaml` à votre repo
2. Sur Render: "New +" → "Blueprint"
3. Connectez votre repo
4. Render détecte automatiquement la config
5. Ajoutez les secrets OAuth
6. Cliquez sur "Apply"

### Étape 3: Vérifier le déploiement

Render va:
1. ✅ Cloner votre repo
2. ✅ Installer Node.js 20
3. ✅ Exécuter `npm install`
4. ✅ Installer Gemini CLI globalement
5. ✅ Configurer les credentials OAuth
6. ✅ Démarrer le serveur

Vérifiez les logs pour voir:
```
🔐 Setting up Gemini OAuth credentials...
✅ OAuth credentials saved to: /opt/render/.gemini/oauth_creds.json
🎉 Gemini CLI is ready to use!
✅ Gemini CLI: Disponible
📦 13 assistants découverts
✅ Serveur prêt à recevoir des requêtes
```

### Étape 4: Tester

```bash
# Health check
curl https://aionui-assistants.onrender.com/health

# Test avec mode auto
curl -X POST https://aionui-assistants.onrender.com/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## 🔗 URLs après déploiement

```
Base URL:    https://aionui-assistants.onrender.com/api/v1
Health:      https://aionui-assistants.onrender.com/health
Swagger:     https://aionui-assistants.onrender.com/api-docs
Models:      https://aionui-assistants.onrender.com/api/v1/models
Assistants:  https://aionui-assistants.onrender.com/api/v1/assistants
```

## 🎨 Configuration n8n

```
Credentials: OpenAI
API Key: dummy
Base URL: https://aionui-assistants.onrender.com/api/v1
```

## ⚙️ Variables d'environnement

### Obligatoires

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_VERSION` | `20` | Version de Node.js |
| `ASSISTANT_PORT` | `10000` | Port (Render utilise 10000) |
| `GEMINI_OAUTH_ACCESS_TOKEN` | `ya29...` | Token d'accès OAuth |
| `GEMINI_OAUTH_REFRESH_TOKEN` | `1//0g...` | Token de rafraîchissement |

### Optionnelles

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `GEMINI_DEFAULT_MODEL` | `auto` | Modèle par défaut |
| `ASSISTANTS_PATH` | `./assistant` | Chemin des assistants |
| `GEMINI_AVAILABLE_MODELS` | `auto,pro,flash,...` | Modèles disponibles |

## 📊 Comparaison: Natif vs Docker

| Aspect | Node.js Natif | Docker |
|--------|---------------|--------|
| **Build time** | ~2-3 min | ~5-7 min |
| **Complexité** | Très simple | Moyenne |
| **Fichiers requis** | 2 (yaml + script) | 3 (yaml + Dockerfile + entrypoint) |
| **Debugging** | Plus facile | Plus complexe |
| **Gemini CLI** | ✅ Fonctionne | ✅ Fonctionne |
| **Recommandé** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 💰 Coûts Render

### Plan Starter ($7/mois) - Recommandé
- ✅ 512 MB RAM
- ✅ 0.5 CPU
- ✅ Déploiements illimités
- ✅ SSL automatique
- ✅ Domaine personnalisé
- ✅ Pas de cold start

### Plan Free (gratuit)
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ⚠️ Se met en veille après 15 min
- ⚠️ Redémarre en ~30 secondes
- ✅ Bon pour les tests

## 🔧 Commandes de build

### Build Command (Render)
```bash
npm install && npm install -g @google/gemini-cli && node scripts/setup-gemini-oauth.js
```

Cette commande:
1. Installe les dépendances npm
2. Installe Gemini CLI globalement
3. Configure les credentials OAuth depuis les variables d'environnement

### Start Command (Render)
```bash
node scripts/server-assistants-standalone.js
```

## 🆘 Dépannage

### Erreur: "Gemini CLI not found"

**Cause**: Gemini CLI n'est pas installé globalement

**Solution**: Vérifier la build command:
```bash
npm install && npm install -g @google/gemini-cli && node scripts/setup-gemini-oauth.js
```

### Erreur: "OAuth credentials not found"

**Cause**: Variables d'environnement manquantes

**Solution**: Ajouter dans Render Dashboard:
```
GEMINI_OAUTH_ACCESS_TOKEN = ya29...
GEMINI_OAUTH_REFRESH_TOKEN = 1//0g...
```

### Erreur: "Port already in use"

**Cause**: Variable PORT incorrecte

**Solution**: Utiliser `ASSISTANT_PORT=10000` (Render utilise le port 10000)

### Le serveur se met en veille (plan Free)

**Cause**: Inactivité de 15 minutes sur le plan gratuit

**Solution**: 
- Passer au plan Starter ($7/mois)
- Ou utiliser un service de ping (ex: UptimeRobot)

## 🔄 Renouveler les credentials OAuth

Les tokens OAuth expirent. Pour les renouveler:

### 1. Sur votre machine locale
```bash
# Réauthentifier
gemini auth login

# Copier les nouveaux tokens
cat ~/.gemini/oauth_creds.json
```

### 2. Dans Render Dashboard
- Aller dans "Environment"
- Mettre à jour:
  - `GEMINI_OAUTH_ACCESS_TOKEN`
  - `GEMINI_OAUTH_REFRESH_TOKEN`
- Redémarrer le service

### 3. Automatisation (optionnel)

Créer un script qui renouvelle automatiquement:
```javascript
// scripts/renew-oauth.js
// À exécuter périodiquement (ex: cron job)
```

## 📈 Monitoring

### Logs en temps réel

Via Dashboard Render:
- Section "Logs"
- Filtrer par niveau (info, error, etc.)

Via CLI:
```bash
# Installer Render CLI
npm install -g @render/cli

# Se connecter
render login

# Voir les logs
render logs -s aionui-assistants -f
```

### Métriques

Dashboard Render affiche:
- CPU usage
- Memory usage
- Request count
- Response time
- Error rate

## 🚀 Déploiement automatique

### Via Git Push

1. Connecter votre repo GitHub à Render
2. Activer "Auto-Deploy"
3. Chaque push sur `main` déclenche un déploiement

### Via Render CLI

```bash
# Déployer manuellement
render deploy -s aionui-assistants

# Avec un message
render deploy -s aionui-assistants -m "Update assistants"
```

## ✅ Checklist de déploiement

- [ ] Compte Render créé
- [ ] Repo GitHub connecté
- [ ] `render-native.yaml` ajouté au repo
- [ ] `scripts/setup-gemini-oauth.js` créé
- [ ] Credentials OAuth obtenus (access_token + refresh_token)
- [ ] Service créé sur Render
- [ ] Variables d'environnement configurées
- [ ] Build réussi
- [ ] Health check OK
- [ ] Test avec curl réussi
- [ ] Configuration n8n mise à jour

## 🎉 Résultat final

Après déploiement, vous aurez:

```
✅ Serveur des assistants en production
✅ Gemini CLI avec mode "auto"
✅ OAuth gratuit (pas d'API keys)
✅ 13 assistants disponibles
✅ URL publique avec SSL
✅ Déploiement automatique depuis Git
✅ Logs en temps réel
✅ Monitoring intégré
```

**URL exemple:**
```
https://aionui-assistants.onrender.com/api/v1
```

## 📚 Documentation complémentaire

- **[DEPLOIEMENT_RENDER_DOCKER.md](DEPLOIEMENT_RENDER_DOCKER.md)** - Version Docker
- **[DEPLOIEMENT_NETLIFY_EXPLIQUE.md](DEPLOIEMENT_NETLIFY_EXPLIQUE.md)** - Version Netlify
- **[OPENAI_COMPATIBLE_BASE_URL.md](OPENAI_COMPATIBLE_BASE_URL.md)** - API
- **[MEMO_MODE_AUTO.md](MEMO_MODE_AUTO.md)** - Mode "auto"

## 🎯 Pourquoi choisir le déploiement natif?

### ✅ Avantages
1. **Plus simple** - Pas de Dockerfile à maintenir
2. **Plus rapide** - Build en 2-3 minutes
3. **Moins de fichiers** - Configuration minimale
4. **Debugging facile** - Logs directs
5. **Même résultat** - Gemini CLI + mode "auto" fonctionnent

### ⚠️ Quand utiliser Docker?
- Dépendances système complexes
- Besoin de contrôle total sur l'environnement
- Déploiement multi-plateforme

**Pour le serveur des assistants, le déploiement natif est recommandé!**

---

**Date**: 1er mars 2026  
**Plateforme**: Render.com  
**Type**: Node.js natif (sans Docker)  
**Mode**: auto (OAuth)  
**Coût**: $7/mois (Starter) ou Gratuit  
**Status**: ✅ Production-ready!
