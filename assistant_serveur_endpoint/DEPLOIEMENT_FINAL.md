# 🚀 Déploiement Final - Serveur des Assistants

## ✅ Solution recommandée: Serveur local (comme provider-bridge)

Le serveur des assistants utilise **Gemini CLI avec OAuth** (comme provider-bridge), il doit donc fonctionner **en local**.

## 📊 Architecture actuelle

```
┌─────────────────────────────────────────────────────────────┐
│                    VOTRE MACHINE LOCALE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Port 25809: Provider Bridge (Gemini CLI + API Keys)        │
│  ├─ http://localhost:25809/cli  (Gemini CLI OAuth)         │
│  └─ http://localhost:25809/v1   (Gemini API Keys)          │
│                                                              │
│  Port 25810: Serveur des Assistants (Gemini CLI OAuth)      │
│  └─ http://localhost:25810/api/v1  (13 assistants)         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## ❌ Pourquoi pas Netlify ?

### Gemini CLI nécessite:
1. ✅ **Installation globale**: `npm install -g @google/gemini-cli`
2. ✅ **Authentification OAuth interactive**: `gemini auth login`
3. ✅ **Processus système**: `child_process.spawn('gemini', [...])`
4. ✅ **Fichiers persistants**: `~/.gemini/oauth_creds.json`
5. ✅ **Environnement stable**: Pas de redémarrage à chaque requête

### Netlify Functions offre:
- ❌ Pas d'installation globale
- ❌ Pas d'authentification interactive
- ❌ Pas de processus persistants
- ❌ Pas de système de fichiers persistant
- ❌ Environnement éphémère (redémarre à chaque requête)

## ✅ Solution: Garder le serveur local

### Avantages
- ✅ Gemini CLI fonctionne parfaitement
- ✅ Mode "auto" disponible
- ✅ OAuth gratuit (pas de consommation d'API keys)
- ✅ Accès aux 13 assistants
- ✅ Compatible avec n8n local

### Configuration actuelle (parfaite!)

**Port 25810** - Serveur des assistants
```bash
# Démarrer
node scripts/server-assistants-standalone.js

# URL pour n8n
http://localhost:25810/api/v1
```

**Port 25809** - Provider Bridge
```bash
# Démarrer
cd provider-bridge
npm run dev

# URL pour n8n (Gemini CLI)
http://localhost:25809/cli
```

## 🌐 Accès depuis n8n cloud ou distant

Si vous utilisez n8n cloud ou sur un autre serveur, vous avez 3 options:

### Option 1: Tunnel (recommandé pour tests)

**ngrok** (gratuit)
```bash
# Installer
npm install -g ngrok

# Exposer le serveur des assistants
ngrok http 25810

# URL publique générée:
# https://abc123.ngrok.io/api/v1
```

**Cloudflare Tunnel** (gratuit)
```bash
# Installer
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared
chmod +x cloudflared

# Exposer
./cloudflared tunnel --url http://localhost:25810
```

### Option 2: VPS avec tunnel inverse

Déployer sur un VPS (DigitalOcean, AWS EC2) et utiliser nginx comme reverse proxy.

**Coût**: ~$6-20/mois  
**Avantages**: URL stable, SSL, contrôle total  
**Voir**: `DEPLOYMENT_OPTIONS.md` pour le guide complet

### Option 3: n8n local

Installer n8n localement sur la même machine:

```bash
# Installer n8n
npm install -g n8n

# Démarrer
n8n start

# Accéder à n8n
http://localhost:5678
```

Puis configurer les endpoints locaux:
- Assistants: `http://localhost:25810/api/v1`
- Provider Bridge CLI: `http://localhost:25809/cli`

## 🎯 Configuration recommandée

### Pour le développement local

```bash
# Terminal 1: Provider Bridge
cd provider-bridge
npm run dev
# → http://localhost:25809

# Terminal 2: Serveur des Assistants
node scripts/server-assistants-standalone.js
# → http://localhost:25810

# Terminal 3: n8n (optionnel)
n8n start
# → http://localhost:5678
```

### Pour exposer temporairement (tests)

```bash
# Terminal 1: Serveur des Assistants
node scripts/server-assistants-standalone.js

# Terminal 2: ngrok
ngrok http 25810
# → https://abc123.ngrok.io
```

### Pour la production

Déployer sur un VPS avec:
- Serveur des Assistants sur port 25810
- nginx comme reverse proxy
- SSL avec Let's Encrypt
- Service systemd pour auto-restart

**Voir**: `DEPLOYMENT_OPTIONS.md` section "VPS/Serveur dédié"

## 📋 Comparaison des options

| Option | Coût | Gemini CLI | Mode auto | Complexité | Recommandé pour |
|--------|------|------------|-----------|------------|-----------------|
| **Local** | Gratuit | ✅ Oui | ✅ Oui | Très faible | Développement |
| **Tunnel (ngrok)** | Gratuit-$8/mois | ✅ Oui | ✅ Oui | Faible | Tests/démo |
| **VPS** | $6-20/mois | ✅ Oui | ✅ Oui | Moyenne | Production |
| **Netlify** | Gratuit-$19/mois | ❌ Non | ❌ Non | N/A | ❌ Impossible |

## 🔗 URLs finales

### En local (actuel)
```
Assistants:      http://localhost:25810/api/v1
Provider Bridge: http://localhost:25809/cli
Swagger:         http://localhost:25810/api-docs
Health:          http://localhost:25810/health
```

### Avec ngrok
```
Assistants:      https://abc123.ngrok.io/api/v1
Swagger:         https://abc123.ngrok.io/api-docs
Health:          https://abc123.ngrok.io/health
```

### Avec VPS
```
Assistants:      https://assistants.votre-domaine.com/api/v1
Swagger:         https://assistants.votre-domaine.com/api-docs
Health:          https://assistants.votre-domaine.com/health
```

## 🎓 Guide rapide: Exposer avec ngrok

### 1. Installer ngrok
```bash
npm install -g ngrok
```

### 2. Démarrer le serveur
```bash
node scripts/server-assistants-standalone.js
```

### 3. Créer le tunnel
```bash
ngrok http 25810
```

### 4. Copier l'URL
```
Forwarding  https://abc123.ngrok.io -> http://localhost:25810
```

### 5. Utiliser dans n8n
```
Base URL: https://abc123.ngrok.io/api/v1
API Key: dummy
```

## ✅ Checklist de déploiement

### Local (actuel)
- [x] Gemini CLI installé et authentifié
- [x] Serveur des Assistants fonctionne sur port 25810
- [x] Mode "auto" configuré
- [x] 13 assistants disponibles
- [x] Compatible avec n8n local

### Avec tunnel (pour tests)
- [ ] ngrok installé
- [ ] Serveur démarré
- [ ] Tunnel créé
- [ ] URL publique copiée
- [ ] Testé avec n8n cloud

### Avec VPS (pour production)
- [ ] VPS créé (DigitalOcean, AWS, etc.)
- [ ] Node.js installé
- [ ] Gemini CLI installé et authentifié
- [ ] Projet déployé
- [ ] Service systemd configuré
- [ ] nginx configuré
- [ ] SSL configuré
- [ ] Domaine pointé

## 🆘 Questions fréquentes

### Q: Puis-je déployer sur Netlify ?
**R**: Non, Gemini CLI nécessite un environnement avec accès système complet.

### Q: Puis-je utiliser l'API REST de Gemini au lieu de CLI ?
**R**: Oui, mais vous perdez:
- Le mode "auto" (sélection automatique du modèle)
- L'authentification OAuth gratuite
- Certaines fonctionnalités spécifiques de Gemini CLI

### Q: Comment exposer mon serveur local à n8n cloud ?
**R**: Utilisez ngrok (gratuit) ou Cloudflare Tunnel.

### Q: Quelle est la meilleure option pour la production ?
**R**: VPS (DigitalOcean, AWS EC2) avec nginx et SSL.

### Q: Le provider-bridge est-il déployé sur Netlify ?
**R**: Non, provider-bridge fonctionne aussi en local (port 25809). Il utilise Gemini CLI avec OAuth, donc même limitation.

### Q: Pourquoi deux serveurs (25809 et 25810) ?
**R**: 
- **25809** (provider-bridge): Multi-provider (Gemini CLI + API Keys)
- **25810** (assistants): Spécialisé pour les 13 assistants avec Gemini CLI

## 📚 Documentation complémentaire

- **[DEPLOYMENT_OPTIONS.md](DEPLOYMENT_OPTIONS.md)** - Options de déploiement détaillées
- **[OPENAI_COMPATIBLE_BASE_URL.md](OPENAI_COMPATIBLE_BASE_URL.md)** - API compatible OpenAI
- **[MEMO_MODE_AUTO.md](MEMO_MODE_AUTO.md)** - Mode "auto" de Gemini CLI
- **[N8N_INTEGRATION_URL.md](N8N_INTEGRATION_URL.md)** - Intégration avec n8n

## 🎯 Conclusion

Le serveur des assistants fonctionne **parfaitement en local** avec Gemini CLI et le mode "auto". Pour l'exposer:
- **Tests/démo**: Utilisez ngrok (gratuit, 2 minutes)
- **Production**: Déployez sur un VPS (~$6/mois)
- **Netlify**: ❌ Impossible avec Gemini CLI

**Votre configuration actuelle est optimale pour le développement local!**

---

**Date**: 1er mars 2026  
**Port**: 25810  
**Modèle**: auto (Gemini CLI OAuth)  
**Assistants**: 13 disponibles  
**Status**: ✅ Opérationnel en local
