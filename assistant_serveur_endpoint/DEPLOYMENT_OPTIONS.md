# 🚀 Options de déploiement - Serveur des Assistants

## ❌ Pourquoi pas Netlify ?

Le serveur des assistants **ne peut PAS être déployé sur Netlify** car:

### Dépendance critique: Gemini CLI
Le serveur utilise **Gemini CLI** qui nécessite:
- ✅ Installation globale: `npm install -g @google/gemini-cli`
- ✅ Authentification OAuth interactive: `gemini auth login`
- ✅ Exécution de processus système: `child_process.spawn()`
- ✅ Stockage persistant: `~/.gemini/oauth_creds.json`
- ✅ Accès au système de fichiers

### Limitations de Netlify Functions
Les fonctions serverless Netlify:
- ❌ Pas d'installation de packages globaux
- ❌ Pas de processus système persistants
- ❌ Pas de système de fichiers persistant
- ❌ Pas d'authentification OAuth interactive
- ❌ Timeout: 10s (gratuit) / 26s (payant)
- ❌ Environnement éphémère (redémarre à chaque requête)

## ✅ Solutions de déploiement

### Option 1: VPS/Serveur dédié (recommandé pour production)

#### Plateformes compatibles

##### 1. DigitalOcean Droplet
```bash
# Coût: ~$6/mois (1GB RAM)
# Avantages: Simple, fiable, bon support
# Installation:
ssh root@your-droplet-ip
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g @google/gemini-cli
gemini auth login
git clone your-repo
cd your-repo
npm install
node scripts/server-assistants-standalone.js
```

##### 2. Railway.app
```bash
# Coût: $5/mois + usage
# Avantages: Déploiement Git automatique, facile
# Limitations: Gemini CLI nécessite configuration spéciale
# Note: Nécessite un buildpack personnalisé pour Gemini CLI
```

##### 3. Render.com
```bash
# Coût: Gratuit (avec limitations) / $7/mois
# Avantages: Déploiement Git, SSL gratuit
# Limitations: Gemini CLI nécessite configuration
```

##### 4. AWS EC2
```bash
# Coût: Variable (~$10-20/mois)
# Avantages: Très flexible, scalable
# Installation similaire à DigitalOcean
```

##### 5. Google Cloud Compute Engine
```bash
# Coût: Variable (~$10-20/mois)
# Avantages: Intégration native avec Gemini
# Installation similaire à DigitalOcean
```

#### Configuration type pour VPS

**1. Installer Node.js et Gemini CLI**
```bash
# Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Gemini CLI
npm install -g @google/gemini-cli

# Authentification
gemini auth login
```

**2. Cloner et configurer le projet**
```bash
git clone https://github.com/your-repo/aionui.git
cd aionui
npm install
cp .env.example .env
nano .env  # Configurer les variables
```

**3. Configurer comme service systemd**
```bash
# Créer le service
sudo nano /etc/systemd/system/assistants.service
```

```ini
[Unit]
Description=AionUI Assistants Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/aionui
ExecStart=/usr/bin/node /root/aionui/scripts/server-assistants-standalone.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
# Activer et démarrer
sudo systemctl enable assistants
sudo systemctl start assistants
sudo systemctl status assistants
```

**4. Configurer nginx (reverse proxy)**
```bash
sudo apt-get install nginx

sudo nano /etc/nginx/sites-available/assistants
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:25810;
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
sudo ln -s /etc/nginx/sites-available/assistants /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**5. Configurer SSL avec Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Version API REST (sans Gemini CLI)

Créer une version qui utilise l'API REST de Gemini au lieu de Gemini CLI.

#### Avantages
- ✅ Déployable sur Netlify/Vercel
- ✅ Pas besoin d'authentification OAuth
- ✅ Pas de processus système
- ✅ Serverless compatible

#### Inconvénients
- ❌ Perd les fonctionnalités spécifiques de Gemini CLI
- ❌ Pas de mode "auto" (doit spécifier le modèle)
- ❌ Configuration différente

#### Implémentation

**netlify/functions/assistants-chat.ts**
```typescript
import { Handler } from '@netlify/functions';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages, model = 'gemini-2.5-flash', temperature = 0.7 } = JSON.parse(event.body || '{}');

    // Convertir les messages au format Gemini
    const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');

    // Appeler l'API Gemini
    const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: 2048
        }
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    // Format compatible OpenAI
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [{
          index: 0,
          message: { role: 'assistant', content },
          finish_reason: 'stop'
        }]
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

**netlify.toml**
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/v1/chat/completions"
  to = "/.netlify/functions/assistants-chat"
  status = 200

[[redirects]]
  from = "/api/v1/models"
  to = "/.netlify/functions/assistants-models"
  status = 200
```

### Option 3: Tunnel local (pour tests/développement)

Exposer votre serveur local via un tunnel sécurisé.

#### ngrok (recommandé)
```bash
# Installation
npm install -g ngrok

# Démarrer le serveur local
node scripts/server-assistants-standalone.js

# Créer le tunnel
ngrok http 25810

# URL publique générée:
# https://abc123.ngrok.io
```

#### Cloudflare Tunnel
```bash
# Installation
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared

# Démarrer le tunnel
./cloudflared tunnel --url http://localhost:25810
```

#### localtunnel
```bash
# Installation
npm install -g localtunnel

# Démarrer le tunnel
lt --port 25810 --subdomain my-assistants
```

### Option 4: Docker + Cloud Run

Déployer avec Docker sur Google Cloud Run.

**Dockerfile**
```dockerfile
FROM node:20-slim

# Installer Gemini CLI
RUN npm install -g @google/gemini-cli

# Copier le projet
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Variables d'environnement
ENV NODE_ENV=production
ENV ASSISTANT_PORT=8080

# Exposer le port
EXPOSE 8080

# Démarrer le serveur
CMD ["node", "scripts/server-assistants-standalone.js"]
```

**Déploiement**
```bash
# Build
docker build -t assistants-server .

# Test local
docker run -p 25810:8080 assistants-server

# Push vers Google Container Registry
docker tag assistants-server gcr.io/your-project/assistants-server
docker push gcr.io/your-project/assistants-server

# Déployer sur Cloud Run
gcloud run deploy assistants-server \
  --image gcr.io/your-project/assistants-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 📊 Comparaison des options

| Option | Coût | Complexité | Gemini CLI | Recommandé pour |
|--------|------|------------|------------|-----------------|
| VPS (DigitalOcean) | $6-20/mois | Moyenne | ✅ Oui | Production |
| Railway.app | $5+/mois | Faible | ⚠️ Avec config | Prototypage |
| API REST (Netlify) | Gratuit-$19/mois | Faible | ❌ Non | Serverless |
| Tunnel (ngrok) | Gratuit-$8/mois | Très faible | ✅ Oui | Développement |
| Docker + Cloud Run | Variable | Moyenne | ⚠️ Avec config | Scalabilité |

## 🎯 Recommandation

### Pour la production
**VPS (DigitalOcean ou AWS EC2)**
- ✅ Contrôle total
- ✅ Gemini CLI fonctionne parfaitement
- ✅ Performances prévisibles
- ✅ Coût fixe et raisonnable

### Pour le développement/tests
**Tunnel local (ngrok)**
- ✅ Gratuit
- ✅ Configuration en 2 minutes
- ✅ Parfait pour tester avec n8n
- ✅ Pas de déploiement nécessaire

### Pour serverless (sans Gemini CLI)
**Version API REST sur Netlify**
- ✅ Gratuit (avec limitations)
- ✅ Déploiement automatique
- ✅ Scalabilité automatique
- ❌ Perd les fonctionnalités de Gemini CLI

## 🚀 Guide de déploiement rapide (DigitalOcean)

### 1. Créer un Droplet
```bash
# Sur DigitalOcean:
# - Choisir Ubuntu 22.04
# - 1GB RAM ($6/mois)
# - Région proche de vous
# - Ajouter votre clé SSH
```

### 2. Se connecter et installer
```bash
ssh root@your-droplet-ip

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git

# Installer Gemini CLI
npm install -g @google/gemini-cli

# Authentifier (nécessite interaction)
gemini auth login
```

### 3. Déployer le projet
```bash
# Cloner
git clone https://github.com/your-repo/aionui.git
cd aionui

# Installer les dépendances
npm install

# Configurer
cp .env.example .env
nano .env  # Ajuster les variables

# Tester
node scripts/server-assistants-standalone.js
```

### 4. Configurer comme service
```bash
# Créer le service systemd (voir section VPS ci-dessus)
sudo systemctl enable assistants
sudo systemctl start assistants
```

### 5. Configurer le domaine (optionnel)
```bash
# Installer nginx
sudo apt-get install nginx

# Configurer (voir section VPS ci-dessus)
# Ajouter SSL avec Let's Encrypt
```

## 📝 Checklist de déploiement

- [ ] Choisir la plateforme de déploiement
- [ ] Créer le serveur/compte
- [ ] Installer Node.js 20+
- [ ] Installer Gemini CLI
- [ ] Authentifier Gemini CLI
- [ ] Cloner le projet
- [ ] Installer les dépendances
- [ ] Configurer les variables d'environnement
- [ ] Tester le serveur
- [ ] Configurer comme service (VPS)
- [ ] Configurer le reverse proxy (optionnel)
- [ ] Configurer SSL (optionnel)
- [ ] Tester l'accès public
- [ ] Mettre à jour la documentation n8n

## 🆘 Dépannage

### Gemini CLI ne fonctionne pas sur le serveur
```bash
# Vérifier l'installation
gemini --version

# Vérifier l'authentification
gemini auth status

# Réauthentifier si nécessaire
gemini auth logout
gemini auth login
```

### Le serveur ne démarre pas
```bash
# Vérifier les logs
journalctl -u assistants -f

# Vérifier le port
netstat -tulpn | grep 25810

# Tester manuellement
node scripts/server-assistants-standalone.js
```

### Erreur de permissions
```bash
# Donner les permissions
chmod +x scripts/server-assistants-standalone.js

# Vérifier le propriétaire
chown -R $USER:$USER /path/to/aionui
```

## 📚 Documentation complémentaire

- **[OPENAI_COMPATIBLE_BASE_URL.md](OPENAI_COMPATIBLE_BASE_URL.md)** - API compatible OpenAI
- **[MEMO_MODE_AUTO.md](MEMO_MODE_AUTO.md)** - Mode auto
- **[INDEX_DOCUMENTATION.md](INDEX_DOCUMENTATION.md)** - Index complet

---

**Conclusion**: Le serveur des assistants nécessite un environnement avec accès système complet. Un VPS est la meilleure option pour la production. Pour le développement, un tunnel local (ngrok) est parfait.

**Date**: 1er mars 2026  
**Recommandation**: VPS (DigitalOcean) pour production, ngrok pour développement
