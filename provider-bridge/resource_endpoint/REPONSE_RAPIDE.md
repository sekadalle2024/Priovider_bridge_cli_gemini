# ⚡ Réponse Rapide — Questions Fréquentes

---

## 1️⃣ Quelles sont les URLs base pour n8n ?

### 🎯 Réponse Courte

**Gemini CLI OAuth (Gratuit)** :
```
http://localhost:25809/cli
```

**Gemini API Key Rotative (Production)** :
```
http://localhost:25809
```

### 📋 Configuration n8n

1. Dans n8n, créez des credentials **OpenAI**
2. Configurez :
   - **API Key** : `dummy` (requis mais non utilisé)
   - **Base URL** : (choisir une des URLs ci-dessus)
3. Utilisez le nœud **OpenAI Chat Model**

### 📊 Tableau Comparatif

| Provider | Base URL | Coût | Quota | Setup |
|----------|----------|------|-------|-------|
| **Gemini CLI OAuth** | `http://localhost:25809/cli` | Gratuit | Quota OAuth | OAuth requis |
| **Gemini API Key Rotative** | `http://localhost:25809` | Gratuit | 195 req/min | Clés dans .env |

📚 **Documentation complète** : [N8N_BASE_URLS.md](./N8N_BASE_URLS.md)

---

## 2️⃣ Comment lancer le projet Provider Bridge ?

### 🎯 Réponse Courte

**OUI**, c'est bien `npm run dev` dans le dossier du projet !

### ⚡ Méthode la Plus Rapide

**Windows** — Double-cliquez sur :
```
START.bat
```

**Linux/Mac** — Dans le terminal :
```bash
cd provider-bridge
npm run dev
```

### 📋 Étapes Détaillées

```bash
# 1. Aller dans le dossier
cd provider-bridge

# 2. Installer les dépendances (première fois seulement)
npm install

# 3. Lancer le serveur
npm run dev
```

### ✅ Vérification

Le serveur est lancé quand vous voyez :
```
🌉 Provider Bridge Endpoint — Started!
📍 Server: http://localhost:25809
```

Testez avec :
```bash
curl http://localhost:25809/health
```

📚 **Documentation complète** : [COMMENT_LANCER.md](./COMMENT_LANCER.md)

---

## 🚀 Scripts Disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| **Développement** | `npm run dev` | Mode dev avec hot-reload |
| **Production** | `npm start` | Mode production |
| **Build** | `npm run build` | Compiler TypeScript |
| **Tests** | `npm test` | Lancer les tests |

### Scripts Windows (.bat)

| Fichier | Description |
|---------|-------------|
| `START.bat` | Lance en mode développement |
| `START-PROD.bat` | Lance en mode production |
| `TEST.bat` | Lance les tests |

---

## 🔗 URLs Importantes

Une fois lancé, accédez à :

| URL | Description |
|-----|-------------|
| http://localhost:25809 | Dashboard admin |
| http://localhost:25809/health | Health check |
| http://localhost:25809/docs | Documentation Swagger |
| http://localhost:25809/cli/models | Modèles Gemini CLI |
| http://localhost:25809/v1/models | Modèles API Key Rotative |

---

## 🧪 Test Rapide

```bash
# Test health check
curl http://localhost:25809/health

# Test Gemini CLI
curl http://localhost:25809/cli/models

# Test API Key Rotative
curl http://localhost:25809/v1/models

# OU utiliser le script de test
node scripts/test-gemini-cli-openai.js
```

---

## 💡 Résumé Ultra-Rapide

### Pour lancer le serveur :
```bash
cd provider-bridge
npm run dev
```

### URLs pour n8n :
- **Gemini CLI** : `http://localhost:25809/cli`
- **API Key Rotative** : `http://localhost:25809`

### Configuration n8n :
- Credentials : **OpenAI**
- API Key : `dummy`
- Base URL : (choisir ci-dessus)

---

## 📚 Documentation Complète

| Document | Contenu |
|----------|---------|
| [N8N_BASE_URLS.md](./N8N_BASE_URLS.md) | URLs pour n8n en détail |
| [COMMENT_LANCER.md](./COMMENT_LANCER.md) | Guide de lancement complet |
| [QUICK_START.md](./QUICK_START.md) | Démarrage rapide 5 min |
| [INDEX.md](./INDEX.md) | Navigation documentation |

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
