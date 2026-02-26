# 🎯 Commandes essentielles - AionUi Multi-Provider API

Guide de référence rapide des commandes les plus utilisées.

## 🚀 Installation et démarrage

### Installation initiale

```bash
# Installer les dépendances (déjà fait)
npm install

# Builder les services multi-provider
npm run build:multi-provider
```

### Démarrer le serveur

```bash
# Mode local (127.0.0.1 uniquement)
npm run server

# Mode remote (accessible depuis le réseau)
npm run server:remote

# Avec PM2 (production)
pm2 start server.js --name aionui-api -- --remote
pm2 save
```

### Arrêter le serveur

```bash
# Ctrl+C dans le terminal

# Ou avec PM2
pm2 stop aionui-api
pm2 delete aionui-api
```

## 🧪 Tests

### Test automatisé complet

```bash
npm run test:multi-provider
```

### Tests manuels

```bash
# Health check
curl http://localhost:25808/health

# Liste des providers
curl http://localhost:25808/api/providers

# Statistiques des clés API
curl http://localhost:25808/api/gemini_api_key_rotative/stats

# Test chat
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Bonjour"}],"stream":false}'

# Test génération
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Écris un haiku","stream":false}'
```

## 🌐 Déploiement

### Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod

# Configurer les variables d'environnement
netlify env:set GEMINI_API_KEY_OHADA_FINANCE_A "AIzaSy..."
# Répéter pour toutes les 27 clés
```

### Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### Docker

```bash
# Builder l'image
docker build -t aionui-api .

# Démarrer avec docker-compose
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## 🔧 Maintenance

### Voir les logs

```bash
# Logs du serveur (si lancé avec npm)
# Les logs s'affichent dans le terminal

# Logs PM2
pm2 logs aionui-api

# Logs Docker
docker-compose logs -f aionui-api
```

### Redémarrer le serveur

```bash
# Avec PM2
pm2 restart aionui-api

# Avec Docker
docker-compose restart

# Manuel
# Ctrl+C puis npm run server
```

### Mettre à jour

```bash
# Récupérer les dernières modifications
git pull origin main

# Réinstaller les dépendances
npm install

# Rebuilder
npm run build:multi-provider

# Redémarrer
pm2 restart aionui-api
# ou
docker-compose restart
```

## 📊 Monitoring

### Statistiques en temps réel

```bash
# Statistiques des clés API
curl http://localhost:25808/api/gemini_api_key_rotative/stats | jq

# Avec watch (mise à jour toutes les 5 secondes)
watch -n 5 'curl -s http://localhost:25808/api/gemini_api_key_rotative/stats | jq'
```

### Métriques PM2

```bash
# Liste des processus
pm2 list

# Monitoring en temps réel
pm2 monit

# Statistiques
pm2 show aionui-api
```

## 🐛 Dépannage

### Vérifier la configuration

```bash
# Vérifier les clés API dans .env
grep GEMINI_API_KEY .env | wc -l
# Doit afficher: 27

# Vérifier que le serveur écoute
lsof -i :25808

# Vérifier les processus Node.js
ps aux | grep node
```

### Nettoyer et réinstaller

```bash
# Supprimer node_modules et dist
rm -rf node_modules dist

# Réinstaller
npm install

# Rebuilder
npm run build:multi-provider
```

### Tuer un processus bloqué

```bash
# Trouver le processus sur le port 25808
lsof -ti:25808

# Tuer le processus
kill -9 $(lsof -ti:25808)

# Ou changer le port
echo "PORT=25809" >> .env
```

## 🔑 Gestion des clés API

### Vérifier les clés

```bash
# Compter les clés
grep GEMINI_API_KEY .env | wc -l

# Lister les clés (sans afficher les valeurs)
grep GEMINI_API_KEY .env | cut -d'=' -f1

# Tester une clé spécifique
curl "https://generativelanguage.googleapis.com/v1/models?key=AIzaSy..."
```

### Ajouter une nouvelle clé

```bash
# Éditer .env
nano .env

# Ajouter la ligne
echo "GEMINI_API_KEY_NEW_KEY=AIzaSy..." >> .env

# Redémarrer le serveur
pm2 restart aionui-api
```

## 📝 Logs et debugging

### Activer les logs détaillés

```bash
# Avec variable d'environnement
DEBUG=* npm run server

# Ou dans .env
echo "DEBUG=*" >> .env
```

### Voir les logs Netlify

```bash
# Via CLI
netlify logs

# Ou dans Netlify UI
# Site → Functions → Logs
```

## 🔄 Scripts npm disponibles

```bash
# Serveur
npm run server                    # Démarrer (local)
npm run server:remote             # Démarrer (remote)

# Build
npm run build:multi-provider      # Builder les services

# Tests
npm run test:multi-provider       # Tests automatisés
npm run test:api                  # Tests API Gemini
npm run diagnose:api              # Diagnostic API

# Documentation
npm run docs:api                  # Ouvrir la doc API
```

## 🎯 Commandes pour n8n

### Tester l'endpoint depuis n8n

Dans un nœud "HTTP Request":

**URL**: `http://localhost:25808/api/gemini_api_key_rotative/chat`

**Method**: POST

**Body**:
```json
{
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ],
  "stream": false
}
```

### Importer le workflow exemple

```bash
# Le fichier est dans examples/n8n-workflow-example.json
# Dans n8n: Workflows → Import from File → Sélectionner le fichier
```

## 🌐 URLs importantes

### Local

```
http://localhost:25808                                    # Accueil
http://localhost:25808/health                             # Health check
http://localhost:25808/api/providers                      # Liste providers
http://localhost:25808/api/gemini_api_key_rotative/chat  # Chat
http://localhost:25808/api/gemini_api_key_rotative/stats # Stats
```

### Netlify (après déploiement)

```
https://your-site.netlify.app/health
https://your-site.netlify.app/api/providers
https://your-site.netlify.app/api/gemini_api_key_rotative/chat
```

## 📚 Documentation

```bash
# Ouvrir la documentation
cat SYNTHESE_IMPLEMENTATION_FR.md
cat QUICK_START_MULTI_PROVIDER.md
cat MULTI_PROVIDER_API.md
cat DEPLOYMENT_GUIDE.md
```

## 🔒 Sécurité

### Vérifier les permissions

```bash
# Vérifier les permissions des fichiers
ls -la .env
# Doit être: -rw------- (600)

# Corriger si nécessaire
chmod 600 .env
```

### Sauvegarder les clés

```bash
# Sauvegarder .env (ATTENTION: contient des secrets)
cp .env .env.backup

# Ou utiliser un gestionnaire de secrets
# Ne jamais commiter .env dans Git!
```

## 🎉 Commandes de vérification rapide

### Tout vérifier en une fois

```bash
# Script de vérification rapide
echo "=== Vérification du système ==="
echo "Clés API: $(grep GEMINI_API_KEY .env | wc -l)"
echo "Serveur: $(curl -s http://localhost:25808/health | jq -r .status)"
echo "Providers: $(curl -s http://localhost:25808/api/providers | jq -r '.providers | length')"
echo "Stats: $(curl -s http://localhost:25808/api/gemini_api_key_rotative/stats | jq -r '.availableKeys')/27 clés disponibles"
```

## 💡 Astuces

### Alias utiles

Ajouter dans `~/.bashrc` ou `~/.zshrc`:

```bash
# Alias pour AionUi
alias aionui-start='cd /path/to/AionUi && npm run server'
alias aionui-test='cd /path/to/AionUi && npm run test:multi-provider'
alias aionui-stats='curl -s http://localhost:25808/api/gemini_api_key_rotative/stats | jq'
alias aionui-health='curl -s http://localhost:25808/health | jq'
```

### Fonction de test rapide

```bash
# Ajouter dans ~/.bashrc ou ~/.zshrc
aionui-chat() {
  curl -X POST http://localhost:25808/api/gemini_api_key_rotative/chat \
    -H "Content-Type: application/json" \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"$1\"}],\"stream\":false}" \
    | jq -r '.message.content'
}

# Utilisation:
# aionui-chat "Bonjour, comment vas-tu?"
```

## 📞 Support

Si une commande ne fonctionne pas:

1. Vérifier que le serveur est démarré
2. Vérifier les logs
3. Consulter la documentation
4. Ouvrir une issue sur GitHub

---

**Référence rapide créée pour AionUi Multi-Provider API v1.9.0**
