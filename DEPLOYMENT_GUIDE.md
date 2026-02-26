# 🚀 Guide de déploiement - AionUi Multi-Provider API

Guide complet pour déployer le serveur API multi-provider sur différentes plateformes.

## 📋 Table des matières

- [Déploiement local](#déploiement-local)
- [Déploiement sur Netlify](#déploiement-sur-netlify)
- [Déploiement sur Vercel](#déploiement-sur-vercel)
- [Déploiement sur VPS](#déploiement-sur-vps)
- [Configuration Docker](#configuration-docker)

## 🏠 Déploiement local

### Mode développement

```bash
# Installer les dépendances
npm install

# Builder les services
npm run build:multi-provider

# Démarrer en mode local
npm run server
```

### Mode production

```bash
# Démarrer en mode production
NODE_ENV=production npm run server

# Ou avec accès remote
NODE_ENV=production npm run server:remote
```

### Avec PM2 (recommandé pour production)

```bash
# Installer PM2
npm install -g pm2

# Démarrer avec PM2
pm2 start server.js --name aionui-api

# Configurer le démarrage automatique
pm2 startup
pm2 save

# Voir les logs
pm2 logs aionui-api

# Redémarrer
pm2 restart aionui-api
```

## ☁️ Déploiement sur Netlify

### Prérequis

- Compte Netlify
- Repository GitHub/GitLab
- Clés API Gemini

### Étapes

1. **Connecter votre repository**

   - Aller sur https://app.netlify.com
   - Cliquer sur "Add new site" → "Import an existing project"
   - Sélectionner votre repository

2. **Configurer le build**

   Build settings (déjà configurés dans `netlify.toml`):
   ```
   Build command: npm run build && npm run build:multi-provider
   Publish directory: dist
   Functions directory: netlify/functions
   ```

3. **Configurer les variables d'environnement**

   Dans Netlify UI → Site settings → Environment variables:

   ```
   GEMINI_API_KEY_OHADA_FINANCE_A=AIzaSyA3cPcbSfi8OR6X2x5KtaeoW6XfNv1UE60
   GEMINI_API_KEY_OHADA_FINANCE_B=AIzaSyAoQJDYmHFrpaE19tWaFMw56blu9pBwqX8
   GEMINI_API_KEY_OHADA_SAVE_A=AIzaSyBkQT5cPXo3vv0EnI1lQ04gzOX6wwGvmS4
   # ... ajoutez toutes vos clés
   
   GEMINI_MODEL=gemini-2.0-flash-exp
   NODE_VERSION=22
   ```

4. **Déployer**

   ```bash
   # Via Git
   git push origin main
   
   # Ou via Netlify CLI
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

5. **Tester**

   ```bash
   # Votre URL Netlify
   curl https://your-site.netlify.app/health
   
   # Test API
   curl -X POST https://your-site.netlify.app/api/gemini_api_key_rotative/chat \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"Hello"}],"stream":false}'
   ```

### Limitations Netlify

- **Pas de streaming**: Les fonctions Netlify ne supportent pas le streaming HTTP
- **Timeout**: 10 secondes max par fonction (26 secondes avec Pro)
- **Pas d'OAuth**: Gemini CLI avec OAuth ne fonctionne pas (utiliser API Key)

### Recommandations Netlify

- Utiliser uniquement le provider `gemini_api_key_rotative`
- Configurer au moins 10-15 clés API pour éviter les limites
- Activer le cache Netlify pour les réponses fréquentes

## ▲ Déploiement sur Vercel

### Prérequis

- Compte Vercel
- Repository GitHub/GitLab
- Clés API Gemini

### Configuration

1. **Créer `vercel.json`**

   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/**/*.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/gemini_api_key_rotative/chat",
         "dest": "/api/gemini-api-key-chat.ts"
       },
       {
         "src": "/api/gemini_api_key_rotative/generate",
         "dest": "/api/gemini-api-key-generate.ts"
       },
       {
         "src": "/api/providers",
         "dest": "/api/providers.ts"
       },
       {
         "src": "/health",
         "dest": "/api/health.ts"
       }
     ],
     "env": {
       "NODE_VERSION": "22"
     }
   }
   ```

2. **Créer les fonctions API**

   Copier les fonctions de `netlify/functions/` vers `api/`:
   ```bash
   mkdir -p api
   cp netlify/functions/gemini-api-key-chat.ts api/
   cp netlify/functions/providers.ts api/
   cp netlify/functions/health.ts api/
   ```

3. **Déployer**

   ```bash
   # Via Vercel CLI
   npm install -g vercel
   vercel login
   vercel --prod
   
   # Ou via Git
   git push origin main
   ```

4. **Configurer les variables d'environnement**

   Dans Vercel Dashboard → Settings → Environment Variables:
   ```
   GEMINI_API_KEY_OHADA_FINANCE_A=...
   GEMINI_API_KEY_OHADA_FINANCE_B=...
   # ... toutes vos clés
   
   GEMINI_MODEL=gemini-2.0-flash-exp
   ```

### Limitations Vercel

- **Timeout**: 10 secondes (Hobby), 60 secondes (Pro)
- **Pas de streaming** en mode serverless
- **Cold starts**: Première requête peut être lente

## 🖥️ Déploiement sur VPS

### Prérequis

- VPS (Ubuntu 22.04+ recommandé)
- Node.js 22+
- Nginx (optionnel, pour reverse proxy)

### Installation

1. **Préparer le serveur**

   ```bash
   # Se connecter au VPS
   ssh user@your-vps-ip
   
   # Installer Node.js 22
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Installer PM2
   sudo npm install -g pm2
   ```

2. **Déployer l'application**

   ```bash
   # Cloner le projet
   git clone https://github.com/iOfficeAI/AionUi.git
   cd AionUi
   
   # Installer les dépendances
   npm install
   
   # Configurer .env
   cp .env.example .env
   nano .env  # Ajouter vos clés API
   
   # Builder
   npm run build:multi-provider
   ```

3. **Démarrer avec PM2**

   ```bash
   # Démarrer
   pm2 start server.js --name aionui-api -- --remote
   
   # Configurer le démarrage automatique
   pm2 startup
   pm2 save
   
   # Voir les logs
   pm2 logs aionui-api
   ```

4. **Configurer Nginx (optionnel)**

   ```nginx
   # /etc/nginx/sites-available/aionui-api
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:25808;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

   ```bash
   # Activer le site
   sudo ln -s /etc/nginx/sites-available/aionui-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Configurer SSL avec Let's Encrypt**

   ```bash
   # Installer Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Obtenir un certificat
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Monitoring VPS

```bash
# Voir les processus
pm2 list

# Voir les logs
pm2 logs aionui-api

# Voir les métriques
pm2 monit

# Redémarrer
pm2 restart aionui-api

# Arrêter
pm2 stop aionui-api
```

## 🐳 Configuration Docker

### Dockerfile

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Builder les services
RUN npm run build:multi-provider

# Exposer le port
EXPOSE 25808

# Variables d'environnement par défaut
ENV PORT=25808
ENV NODE_ENV=production

# Démarrer le serveur
CMD ["node", "server.js", "--remote"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  aionui-api:
    build: .
    ports:
      - "25808:25808"
    environment:
      - PORT=25808
      - NODE_ENV=production
      - GEMINI_MODEL=gemini-2.0-flash-exp
      # Ajouter vos clés API
      - GEMINI_API_KEY_OHADA_FINANCE_A=${GEMINI_API_KEY_OHADA_FINANCE_A}
      - GEMINI_API_KEY_OHADA_FINANCE_B=${GEMINI_API_KEY_OHADA_FINANCE_B}
    restart: unless-stopped
    volumes:
      - ./workspace:/app/workspace
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:25808/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Utilisation Docker

```bash
# Builder l'image
docker build -t aionui-api .

# Démarrer avec docker-compose
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Redémarrer
docker-compose restart
```

## 🔒 Sécurité en production

### Variables d'environnement

- **Ne jamais** commiter les clés API dans Git
- Utiliser des secrets managers (AWS Secrets Manager, HashiCorp Vault)
- Rotation régulière des clés

### Rate Limiting

Configurer dans `.env`:
```env
API_RATE_LIMIT_MAX_REQUESTS=100
API_RATE_LIMIT_WINDOW_MS=60000
```

### HTTPS

- **Toujours** utiliser HTTPS en production
- Utiliser Let's Encrypt pour les certificats gratuits
- Configurer HSTS headers

### Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 📊 Monitoring

### Logs

```bash
# PM2
pm2 logs aionui-api

# Docker
docker-compose logs -f

# Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Métriques

- Utiliser PM2 Plus pour monitoring avancé
- Configurer des alertes pour les erreurs
- Monitorer l'utilisation des clés API

## 🔄 Mises à jour

### VPS

```bash
cd AionUi
git pull origin main
npm install
npm run build:multi-provider
pm2 restart aionui-api
```

### Docker

```bash
docker-compose down
git pull origin main
docker-compose build
docker-compose up -d
```

### Netlify/Vercel

Les mises à jour sont automatiques via Git push.

## 🐛 Dépannage

### Problème: Port déjà utilisé

```bash
# Trouver le processus
lsof -ti:25808

# Tuer le processus
kill -9 $(lsof -ti:25808)
```

### Problème: Permissions

```bash
# Donner les permissions
chmod +x server.js
chmod +x scripts/*.js
```

### Problème: Mémoire insuffisante

```bash
# Augmenter la limite Node.js
NODE_OPTIONS="--max-old-space-size=4096" node server.js
```

## 📚 Ressources

- [Documentation Netlify](https://docs.netlify.com/)
- [Documentation Vercel](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 💬 Support

- GitHub Issues: https://github.com/iOfficeAI/AionUi/issues
- Documentation: [MULTI_PROVIDER_API.md](MULTI_PROVIDER_API.md)
