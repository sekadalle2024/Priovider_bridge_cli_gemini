# 🚀 Comment Lancer Provider Bridge

Guide complet pour démarrer le serveur Provider Bridge.

---

## ⚡ Méthode Rapide (Recommandée)

### Windows

Double-cliquez sur le fichier :
```
START.bat
```

C'est tout ! Le serveur démarre automatiquement.

### Linux / macOS

```bash
chmod +x scripts/start.sh
./scripts/start.sh dev
```

---

## 📋 Méthodes Détaillées

### Méthode 1 : Script Automatique (Windows)

**Développement** (avec hot-reload) :
```
START.bat
```

**Production** (build + start) :
```
START-PROD.bat
```

**Tests** :
```
TEST.bat
```

### Méthode 2 : Commandes npm

**Développement** :
```bash
cd provider-bridge
npm run dev
```

**Production** :
```bash
cd provider-bridge
npm run build
npm start
```

**Tests** :
```bash
cd provider-bridge
npm test
```

### Méthode 3 : Commandes Manuelles

**Étape 1 : Installation**
```bash
cd provider-bridge
npm install
```

**Étape 2 : Configuration**
```bash
# Copier .env.example vers .env (si nécessaire)
copy .env.example .env
```

**Étape 3 : Lancement**
```bash
# Mode développement
npm run dev

# OU mode production
npm run build
npm start
```

---

## 🎯 Vérification du Lancement

### 1. Vérifier que le serveur est lancé

Ouvrez votre navigateur et allez sur :
```
http://localhost:25809/health
```

Vous devriez voir :
```json
{
  "status": "ok",
  "timestamp": "2026-03-01T...",
  "uptime": 123.45
}
```

### 2. Vérifier les endpoints

**Gemini CLI OAuth** :
```
http://localhost:25809/cli/models
```

**Gemini API Key Rotative** :
```
http://localhost:25809/v1/models
```

### 3. Accéder au Dashboard

```
http://localhost:25809
```

Login : `admin` / `admin123`

---

## 📊 Modes de Lancement

### Mode Développement (Recommandé pour dev)

**Commande** : `npm run dev` ou `START.bat`

**Caractéristiques** :
- ✅ Hot-reload automatique
- ✅ Logs détaillés
- ✅ Redémarre à chaque modification de code
- ✅ Parfait pour le développement

**Quand l'utiliser** :
- Développement local
- Tests et debugging
- Modifications du code

### Mode Production

**Commande** : `npm start` ou `START-PROD.bat`

**Caractéristiques** :
- ✅ Code compilé (TypeScript → JavaScript)
- ✅ Optimisé pour les performances
- ✅ Pas de hot-reload
- ✅ Prêt pour déploiement

**Quand l'utiliser** :
- Déploiement en production
- Tests de performance
- Environnement stable

---

## 🔗 URLs Importantes

Une fois le serveur lancé, vous avez accès à :

| URL | Description |
|-----|-------------|
| `http://localhost:25809` | Dashboard admin |
| `http://localhost:25809/health` | Health check |
| `http://localhost:25809/docs` | Documentation Swagger |
| `http://localhost:25809/cli/models` | Modèles Gemini CLI |
| `http://localhost:25809/v1/models` | Modèles API Key Rotative |

---

## 🔗 Base URLs pour n8n

### Gemini CLI OAuth (Gratuit)
```
http://localhost:25809/cli
```

### Gemini API Key Rotative (Production)
```
http://localhost:25809
```

**Configuration n8n** :
1. Créer credentials **OpenAI**
2. **API Key** : `dummy`
3. **Base URL** : (choisir une des URLs ci-dessus)

📚 Voir [N8N_BASE_URLS.md](./N8N_BASE_URLS.md) pour plus de détails

---

## 🛑 Arrêter le Serveur

### Dans le terminal
Appuyez sur `Ctrl + C`

### Forcer l'arrêt (si bloqué)

**Windows** :
```bash
# Trouver le PID
netstat -ano | findstr :25809

# Tuer le processus
taskkill /F /PID <PID>
```

**Linux / macOS** :
```bash
# Trouver et tuer le processus
lsof -ti:25809 | xargs kill -9
```

---

## 🐛 Problèmes Courants

### Erreur : "Port 25809 already in use"

**Solution** :
```bash
# Windows
netstat -ano | findstr :25809
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:25809 | xargs kill -9
```

### Erreur : "Cannot find module"

**Solution** :
```bash
cd provider-bridge
npm install
```

### Erreur : ".env file not found"

**Solution** :
```bash
copy .env.example .env
# Puis éditez .env avec vos clés API
```

### Erreur : "Gemini CLI not found"

**Solution** :
```bash
npm install -g @google/gemini-cli
gemini auth login
```

---

## 📝 Logs

### Voir les logs en temps réel

Les logs s'affichent directement dans le terminal.

### Fichier de logs

```bash
# Voir les derniers logs
tail -f provider-bridge/server.log

# Windows
type provider-bridge\server.log
```

---

## 🧪 Tester Après le Lancement

### Test automatique complet

```bash
# Windows
TEST.bat

# Linux/Mac
node scripts/test-gemini-cli-openai.js
```

### Tests manuels

```bash
# Health check
curl http://localhost:25809/health

# Modèles Gemini CLI
curl http://localhost:25809/cli/models

# Modèles API Key Rotative
curl http://localhost:25809/v1/models

# Chat test
curl -X POST http://localhost:25809/cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Bonjour!"}]}'
```

---

## 💡 Conseils

### Pour le Développement
- Utilisez `START.bat` ou `npm run dev`
- Le hot-reload vous fait gagner du temps
- Les logs sont plus détaillés

### Pour la Production
- Utilisez `START-PROD.bat` ou `npm start`
- Faites un build avant : `npm run build`
- Configurez les variables d'environnement dans `.env`

### Pour les Tests
- Utilisez `TEST.bat` pour tester tous les endpoints
- Vérifiez `/health` régulièrement
- Consultez les stats : `/api/providers/gemini_api_key_rotative/stats`

---

## 📚 Documentation Complète

- [N8N_BASE_URLS.md](./N8N_BASE_URLS.md) — URLs pour n8n
- [QUICK_START.md](./QUICK_START.md) — Démarrage rapide
- [README.md](./README.md) — Documentation complète
- [INDEX.md](./INDEX.md) — Navigation documentation

---

## 🎉 Prochaines Étapes

Une fois le serveur lancé :

1. ✅ Vérifiez le health check : http://localhost:25809/health
2. ✅ Consultez la documentation : http://localhost:25809/docs
3. ✅ Testez les endpoints : `TEST.bat`
4. ✅ Configurez n8n avec les base URLs
5. ✅ Créez votre premier workflow !

---

**Besoin d'aide ?** Consultez [INDEX.md](./INDEX.md) pour toute la documentation.

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
