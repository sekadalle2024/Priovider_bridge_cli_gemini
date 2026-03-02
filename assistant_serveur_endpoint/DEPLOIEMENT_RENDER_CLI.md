# 🚀 Déploiement avec Render CLI - Guide Complet

## ✅ Déploiement automatisé en une commande!

J'ai créé des scripts qui automatisent tout le processus de déploiement sur Render.

## 📦 Scripts créés

1. **`scripts/deploy-render.sh`** - Script Bash (Linux/macOS)
2. **`scripts/deploy-render.ps1`** - Script PowerShell (Windows)

Ces scripts font tout automatiquement:
- ✅ Installent Render CLI si nécessaire
- ✅ Authentifient sur Render
- ✅ Extraient les credentials OAuth Gemini
- ✅ Créent le service sur Render
- ✅ Configurent les variables d'environnement
- ✅ Déclenchent le déploiement

## 🚀 Déploiement en 3 étapes

### Étape 1: Authentifier Gemini CLI (une seule fois)

```bash
# Installer Gemini CLI
npm install -g @google/gemini-cli

# Authentifier
gemini auth login
```

### Étape 2: Exécuter le script de déploiement

#### Sur Linux/macOS:
```bash
# Rendre le script exécutable
chmod +x scripts/deploy-render.sh

# Exécuter
./scripts/deploy-render.sh
```

#### Sur Windows (PowerShell):
```powershell
# Exécuter
.\scripts\deploy-render.ps1
```

### Étape 3: C'est tout! 🎉

Le script va:
1. Installer Render CLI si nécessaire
2. Vous connecter à Render (si pas déjà fait)
3. Extraire vos credentials OAuth Gemini
4. Créer le service sur Render
5. Configurer les secrets
6. Démarrer le déploiement

## 📋 Ce que fait le script

### 1. Vérification de Render CLI

```bash
# Vérifie si Render CLI est installé
if ! command -v render &> /dev/null; then
    npm install -g @render/cli
fi
```

### 2. Authentification

```bash
# Vérifie l'authentification
if ! render whoami &> /dev/null; then
    render login
fi
```

### 3. Extraction des credentials OAuth

```bash
# Lit ~/.gemini/oauth_creds.json
ACCESS_TOKEN=$(cat ~/.gemini/oauth_creds.json | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
REFRESH_TOKEN=$(cat ~/.gemini/oauth_creds.json | grep -o '"refresh_token":"[^"]*"' | cut -d'"' -f4)
```

### 4. Création du service

```bash
# Via Blueprint (render-native.yaml)
render blueprint launch

# Configure les secrets
render env set -s aionui-assistants \
    GEMINI_OAUTH_ACCESS_TOKEN="$ACCESS_TOKEN" \
    GEMINI_OAUTH_REFRESH_TOKEN="$REFRESH_TOKEN"
```

## 🎯 Commandes Render CLI utiles

### Voir les services

```bash
# Lister tous les services
render services list

# Détails d'un service
render services get aionui-assistants
```

### Voir les logs

```bash
# Logs en temps réel
render logs -s aionui-assistants -f

# Dernières 100 lignes
render logs -s aionui-assistants -n 100
```

### Gérer les variables d'environnement

```bash
# Lister les variables
render env list -s aionui-assistants

# Ajouter une variable
render env set -s aionui-assistants KEY=value

# Supprimer une variable
render env unset -s aionui-assistants KEY
```

### Déploiement

```bash
# Déclencher un déploiement manuel
render deploy -s aionui-assistants

# Avec un message
render deploy -s aionui-assistants -m "Update assistants"
```

### Ouvrir le dashboard

```bash
# Ouvrir dans le navigateur
render open -s aionui-assistants
```

### Redémarrer le service

```bash
# Redémarrer
render services restart aionui-assistants
```

## 🔧 Configuration manuelle (alternative)

Si vous préférez configurer manuellement:

### 1. Installer Render CLI

```bash
npm install -g @render/cli
```

### 2. Se connecter

```bash
render login
```

### 3. Créer le service

```bash
# Via Blueprint
render blueprint launch

# Ou manuellement
render services create \
  --name aionui-assistants \
  --type web \
  --env node \
  --region oregon \
  --plan starter \
  --build-command "npm install && npm install -g @google/gemini-cli" \
  --start-command "node scripts/server-assistants-standalone.js"
```

### 4. Configurer les variables

```bash
# Obtenir les tokens OAuth
cat ~/.gemini/oauth_creds.json

# Configurer
render env set -s aionui-assistants \
  NODE_VERSION=20 \
  ASSISTANT_PORT=10000 \
  GEMINI_DEFAULT_MODEL=auto \
  GEMINI_OAUTH_ACCESS_TOKEN="ya29..." \
  GEMINI_OAUTH_REFRESH_TOKEN="1//0g..."
```

### 5. Déployer

```bash
render deploy -s aionui-assistants
```

## 📊 Monitoring avec Render CLI

### Voir le statut en temps réel

```bash
# Status du service
watch -n 2 'render services get aionui-assistants | grep -E "(Status|Health)"'
```

### Voir les métriques

```bash
# CPU et mémoire
render services get aionui-assistants --format json | jq '.metrics'
```

### Alertes

```bash
# Configurer des alertes
render alerts create \
  --service aionui-assistants \
  --type health_check \
  --email votre@email.com
```

## 🆘 Dépannage avec CLI

### Le service ne démarre pas

```bash
# Voir les logs d'erreur
render logs -s aionui-assistants -n 200 | grep -i error

# Vérifier les variables d'environnement
render env list -s aionui-assistants

# Redémarrer
render services restart aionui-assistants
```

### OAuth credentials invalides

```bash
# Réauthentifier Gemini CLI
gemini auth login

# Mettre à jour les tokens
ACCESS_TOKEN=$(cat ~/.gemini/oauth_creds.json | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
REFRESH_TOKEN=$(cat ~/.gemini/oauth_creds.json | grep -o '"refresh_token":"[^"]*"' | cut -d'"' -f4)

render env set -s aionui-assistants \
  GEMINI_OAUTH_ACCESS_TOKEN="$ACCESS_TOKEN" \
  GEMINI_OAUTH_REFRESH_TOKEN="$REFRESH_TOKEN"

# Redéployer
render deploy -s aionui-assistants
```

### Voir les builds

```bash
# Lister les builds
render builds list -s aionui-assistants

# Détails d'un build
render builds get <build-id>
```

## 🔄 Mise à jour du service

### Après un changement de code

```bash
# Commit et push
git add .
git commit -m "Update assistants"
git push

# Le déploiement est automatique si auto-deploy est activé
# Sinon, déclencher manuellement:
render deploy -s aionui-assistants
```

### Forcer un rebuild

```bash
# Rebuild complet
render deploy -s aionui-assistants --clear-cache
```

## 📈 Scaling avec CLI

### Changer de plan

```bash
# Passer au plan Pro
render services update aionui-assistants --plan pro

# Retour au plan Starter
render services update aionui-assistants --plan starter
```

### Changer de région

```bash
# Déplacer vers Frankfurt
render services update aionui-assistants --region frankfurt
```

## 🗑️ Supprimer le service

```bash
# Supprimer le service
render services delete aionui-assistants

# Avec confirmation
render services delete aionui-assistants --yes
```

## 📚 Documentation Render CLI

### Aide en ligne de commande

```bash
# Aide générale
render help

# Aide pour une commande spécifique
render services help
render deploy help
render logs help
```

### Documentation officielle

- **CLI Reference**: https://render.com/docs/cli
- **API Reference**: https://api-docs.render.com
- **GitHub**: https://github.com/render-oss/render-cli

## ✅ Checklist de déploiement CLI

- [ ] Render CLI installé (`npm install -g @render/cli`)
- [ ] Authentifié sur Render (`render login`)
- [ ] Gemini CLI authentifié (`gemini auth login`)
- [ ] Fichier `render-native.yaml` présent
- [ ] Script de déploiement exécuté
- [ ] Service créé sur Render
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Health check OK
- [ ] Logs vérifiés
- [ ] URL testée

## 🎉 Résultat

Après exécution du script, vous aurez:

```
✅ Service déployé sur Render
✅ Gemini CLI avec mode "auto"
✅ OAuth configuré automatiquement
✅ URL publique avec SSL
✅ Déploiement automatique depuis Git
```

**URL:**
```
https://aionui-assistants.onrender.com/api/v1
```

## 🚀 Commandes rapides

```bash
# Déployer
./scripts/deploy-render.sh

# Voir les logs
render logs -s aionui-assistants -f

# Redémarrer
render services restart aionui-assistants

# Ouvrir le dashboard
render open -s aionui-assistants

# Mettre à jour les credentials OAuth
./scripts/deploy-render.sh  # Re-exécuter le script
```

---

**Date**: 1er mars 2026  
**Méthode**: Render CLI (automatisée)  
**Scripts**: deploy-render.sh / deploy-render.ps1  
**Status**: ✅ Déploiement en une commande!
