# 🚀 Guide Complet - Déploiement sur Render

## ⚠️ Note importante: Render CLI

Render n'a pas de CLI officielle publique comme Netlify ou Vercel. Le déploiement se fait via:
1. **Interface Web** (recommandé - le plus simple)
2. **API REST** (pour l'automatisation)
3. **Git Push** (déploiement automatique)

## 🎯 Méthode recommandée: Interface Web

C'est la méthode la plus simple et la plus fiable.

### Étape 1: Préparer les credentials OAuth

Sur votre machine locale:

```bash
# Authentifier Gemini CLI
gemini auth login

# Afficher les credentials
cat ~/.gemini/oauth_creds.json
```

Vous verrez:
```json
{
  "access_token": "ya29.a0AfB_byABC123...",
  "refresh_token": "1//0gKXYZ789...",
  "token_type": "Bearer",
  "expiry_date": 1709251200000
}
```

**Copiez** les valeurs de `access_token` et `refresh_token`.

### Étape 2: Créer un compte Render

1. Allez sur https://render.com
2. Cliquez sur "Get Started"
3. Inscrivez-vous avec GitHub (recommandé)

### Étape 3: Connecter votre repo GitHub

1. Dans Render Dashboard, cliquez sur "New +"
2. Sélectionnez "Web Service"
3. Connectez votre compte GitHub
4. Sélectionnez votre repo `Aionui_provider_cli`

### Étape 4: Configurer le service

#### Informations de base

| Champ | Valeur |
|-------|--------|
| **Name** | `aionui-assistants` |
| **Region** | Oregon (ou Frankfurt pour l'Europe) |
| **Branch** | `main` |
| **Root Directory** | (laisser vide) |

#### Build & Deploy

| Champ | Valeur |
|-------|--------|
| **Runtime** | Node |
| **Build Command** | `npm install && npm install -g @google/gemini-cli && node scripts/setup-gemini-oauth.js` |
| **Start Command** | `node scripts/server-assistants-standalone.js` |

#### Plan

- **Free** (pour tester) - Se met en veille après 15 min
- **Starter** ($7/mois) - Recommandé pour production

### Étape 5: Configurer les variables d'environnement

Cliquez sur "Advanced" puis ajoutez ces variables:

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `20` |
| `ASSISTANT_PORT` | `10000` |
| `GEMINI_DEFAULT_MODEL` | `auto` |
| `GEMINI_OAUTH_ACCESS_TOKEN` | `ya29.a0AfB_...` (votre token) |
| `GEMINI_OAUTH_REFRESH_TOKEN` | `1//0gK...` (votre token) |
| `ASSISTANTS_PATH` | `./assistant` |
| `ASSISTANTS_ENABLED` | `true` |

**Important**: Marquez les tokens OAuth comme "Secret" (icône de cadenas).

### Étape 6: Créer le service

1. Cliquez sur "Create Web Service"
2. Render va:
   - Cloner votre repo
   - Installer Node.js 20
   - Exécuter la build command
   - Installer Gemini CLI
   - Configurer OAuth
   - Démarrer le serveur

### Étape 7: Vérifier le déploiement

Dans le Dashboard Render:

1. **Logs** - Vérifiez que tout s'est bien passé:
   ```
   ✅ Gemini CLI version: 0.31.0
   ✅ OAuth credentials saved
   ✅ Gemini CLI: Disponible
   📦 13 assistants découverts
   ✅ Serveur prêt à recevoir des requêtes
   ```

2. **URL** - Votre service sera disponible à:
   ```
   https://aionui-assistants.onrender.com
   ```

3. **Test** - Testez le health check:
   ```bash
   curl https://aionui-assistants.onrender.com/health
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

## 🔄 Déploiement automatique

Une fois configuré, chaque push sur `main` déclenche automatiquement un déploiement:

```bash
git add .
git commit -m "Update assistants"
git push origin main
```

Render détecte le push et redéploie automatiquement.

## 📊 Monitoring

### Dans le Dashboard Render

1. **Logs** - Logs en temps réel
2. **Metrics** - CPU, RAM, requêtes
3. **Events** - Historique des déploiements
4. **Shell** - Accès SSH au conteneur

### Logs en temps réel

Dans le Dashboard:
- Onglet "Logs"
- Filtrer par niveau (info, error, etc.)
- Rechercher dans les logs

## 🔧 Maintenance

### Mettre à jour les credentials OAuth

Si les tokens expirent:

1. Sur votre machine:
   ```bash
   gemini auth login
   cat ~/.gemini/oauth_creds.json
   ```

2. Dans Render Dashboard:
   - Aller dans "Environment"
   - Mettre à jour `GEMINI_OAUTH_ACCESS_TOKEN`
   - Mettre à jour `GEMINI_OAUTH_REFRESH_TOKEN`
   - Cliquer sur "Save Changes"

3. Render redémarre automatiquement le service

### Redémarrer le service

Dans le Dashboard:
- Onglet "Manual Deploy"
- Cliquer sur "Clear build cache & deploy"

Ou:
- Onglet "Settings"
- Section "Service"
- Cliquer sur "Suspend" puis "Resume"

### Changer de plan

Dans le Dashboard:
- Onglet "Settings"
- Section "Plan"
- Sélectionner "Starter" ou "Pro"
- Confirmer

## 🆘 Dépannage

### Le service ne démarre pas

**Vérifier les logs:**
1. Dashboard → Logs
2. Chercher les erreurs

**Causes communes:**
- Credentials OAuth manquants
- Port incorrect (doit être 10000)
- Build command incorrecte

**Solution:**
1. Vérifier les variables d'environnement
2. Vérifier la build command
3. Redéployer

### Gemini CLI ne fonctionne pas

**Symptôme dans les logs:**
```
❌ Gemini CLI not found
```

**Solution:**
Vérifier la build command:
```bash
npm install && npm install -g @google/gemini-cli && node scripts/setup-gemini-oauth.js
```

### OAuth credentials invalides

**Symptôme dans les logs:**
```
Error: Gemini CLI exited with code 1: check OAuth credentials
```

**Solution:**
1. Réauthentifier localement: `gemini auth login`
2. Copier les nouveaux tokens
3. Mettre à jour dans Render
4. Redéployer

### Le service se met en veille (plan Free)

**Symptôme:**
Le service ne répond pas après 15 min d'inactivité

**Solution:**
- Passer au plan Starter ($7/mois)
- Ou utiliser un service de ping (UptimeRobot)

## 💰 Coûts

### Plan Free
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ⚠️ Se met en veille après 15 min
- ⚠️ 750 heures/mois
- ✅ Bon pour les tests

### Plan Starter ($7/mois) - Recommandé
- ✅ 512 MB RAM
- ✅ 0.5 CPU
- ✅ Pas de mise en veille
- ✅ Déploiements illimités
- ✅ SSL automatique
- ✅ Domaine personnalisé

### Plan Pro ($25/mois)
- ✅ 2 GB RAM
- ✅ 1 CPU
- ✅ Scaling automatique
- ✅ Support prioritaire

## 🔐 Sécurité

### Variables d'environnement

Les tokens OAuth sont stockés de manière sécurisée:
- Chiffrés au repos
- Jamais affichés dans les logs
- Accessibles uniquement par votre service

### HTTPS

- SSL automatique avec Let's Encrypt
- Certificat renouvelé automatiquement
- HTTPS forcé par défaut

### Domaine personnalisé

Dans le Dashboard:
1. Onglet "Settings"
2. Section "Custom Domain"
3. Ajouter votre domaine
4. Configurer les DNS

## 📈 Scaling

### Vertical Scaling

Changer de plan pour plus de ressources:
- Free → Starter → Pro

### Horizontal Scaling

Render supporte le scaling horizontal:
1. Dashboard → Settings
2. Section "Scaling"
3. Augmenter le nombre d'instances

## 🎯 Checklist de déploiement

- [ ] Compte Render créé
- [ ] Repo GitHub connecté
- [ ] Service créé (Web Service)
- [ ] Runtime: Node
- [ ] Build command configurée
- [ ] Start command configurée
- [ ] Variables d'environnement ajoutées
- [ ] Tokens OAuth configurés
- [ ] Plan sélectionné (Free ou Starter)
- [ ] Déploiement réussi
- [ ] Logs vérifiés
- [ ] Health check OK
- [ ] URL testée
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
✅ Monitoring intégré
✅ Logs en temps réel
```

**URL:**
```
https://aionui-assistants.onrender.com/api/v1
```

## 📚 Documentation Render

- **Documentation**: https://render.com/docs
- **Node.js Guide**: https://render.com/docs/deploy-node-express-app
- **Environment Variables**: https://render.com/docs/environment-variables
- **Custom Domains**: https://render.com/docs/custom-domains

## 🚀 Prochaines étapes

1. **Tester l'API**:
   ```bash
   curl https://aionui-assistants.onrender.com/health
   ```

2. **Configurer n8n**:
   - Base URL: `https://aionui-assistants.onrender.com/api/v1`
   - API Key: `dummy`

3. **Tester avec un assistant**:
   ```bash
   curl -X POST https://aionui-assistants.onrender.com/api/v1/chat/completions \
     -H "Content-Type: application/json" \
     -d '{
       "model": "auto",
       "messages": [{"role": "user", "content": "Hello"}],
       "assistant": "data-analyst"
     }'
   ```

---

**Date**: 1er mars 2026  
**Méthode**: Interface Web Render  
**Mode**: auto (Gemini CLI OAuth)  
**Coût**: $7/mois (Starter) ou Gratuit  
**Status**: ✅ Production-ready!
