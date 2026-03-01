# 📚 Resource Endpoint — Documentation Provider Bridge

Ce dossier contient toute la documentation et les scripts pour utiliser les endpoints OpenAI-compatibles de Provider Bridge.

---

## 🚀 Démarrage Rapide

| Document | Description |
|----------|-------------|
| [REPONSE_RAPIDE.md](./REPONSE_RAPIDE.md) | ⚡ Réponses aux questions fréquentes (START HERE!) |
| [README_SIMPLE.md](./README_SIMPLE.md) | Guide ultra-simplifié (2 minutes) |
| [COMMENT_LANCER.md](./COMMENT_LANCER.md) | Guide complet de lancement |
| [QUICK_START.md](./QUICK_START.md) | Démarrage en 5 minutes |

---

## 🔗 Configuration n8n

| Document | Description |
|----------|-------------|
| [N8N_BASE_URLS.md](./N8N_BASE_URLS.md) | ⚡ URLs base pour n8n (IMPORTANT!) |
| [ENDPOINTS_SUMMARY.md](./ENDPOINTS_SUMMARY.md) | Résumé de tous les endpoints |
| [GEMINI_CLI_OPENAI_ENDPOINTS.md](./GEMINI_CLI_OPENAI_ENDPOINTS.md) | Guide Gemini CLI OAuth |
| [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) | Guide navigation Swagger |
| [OU_TROUVER_ENDPOINTS_CLI.md](./OU_TROUVER_ENDPOINTS_CLI.md) | ⚡ Où trouver les endpoints CLI dans Swagger |

---

## 🛠️ Scripts de Lancement

| Script | Description | Utilisation |
|--------|-------------|-------------|
| [START.bat](./START.bat) | Lance en mode développement | Double-clic |
| [START-PROD.bat](./START-PROD.bat) | Lance en mode production | Double-clic |
| [TEST.bat](./TEST.bat) | Lance les tests | Double-clic |

---

## 📖 Documentation Complète

| Document | Description |
|----------|-------------|
| [INDEX.md](./INDEX.md) | Navigation complète de la documentation |
| [TASK_8_COMPLETE.md](./TASK_8_COMPLETE.md) | Résumé de la Task 8 |

---

## 🎯 URLs Base pour n8n

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

## 🚀 Lancer le Serveur

### Windows
Double-cliquez sur [START.bat](./START.bat)

### Linux / macOS
```bash
cd provider-bridge
npm run dev
```

📚 Voir [COMMENT_LANCER.md](./COMMENT_LANCER.md) pour plus de détails

---

## ✅ Vérification

Une fois le serveur lancé :

```bash
# Health check
curl http://localhost:25809/health

# Modèles Gemini CLI
curl http://localhost:25809/cli/models

# Modèles API Key Rotative
curl http://localhost:25809/v1/models
```

---

## 📊 Structure de la Documentation

```
resource_endpoint/
├── README.md                          # Ce fichier
├── REPONSE_RAPIDE.md                  # ⚡ FAQ (START HERE!)
├── README_SIMPLE.md                   # Guide ultra-simplifié
├── COMMENT_LANCER.md                  # Guide de lancement complet
├── QUICK_START.md                     # Démarrage en 5 minutes
├── N8N_BASE_URLS.md                   # URLs pour n8n
├── GEMINI_CLI_OPENAI_ENDPOINTS.md     # Guide Gemini CLI
├── ENDPOINTS_SUMMARY.md               # Résumé des endpoints
├── INDEX.md                           # Navigation complète
├── TASK_8_COMPLETE.md                 # Résumé Task 8
├── START.bat                          # Script lancement dev
├── START-PROD.bat                     # Script lancement prod
└── TEST.bat                           # Script de test
```

---

## 💡 Recommandations

### Pour Commencer
1. Lisez [REPONSE_RAPIDE.md](./REPONSE_RAPIDE.md)
2. Lancez le serveur avec [START.bat](./START.bat)
3. Configurez n8n avec [N8N_BASE_URLS.md](./N8N_BASE_URLS.md)

### Pour Approfondir
1. [QUICK_START.md](./QUICK_START.md) — Guide complet
2. [GEMINI_CLI_OPENAI_ENDPOINTS.md](./GEMINI_CLI_OPENAI_ENDPOINTS.md) — Gemini CLI
3. [INDEX.md](./INDEX.md) — Toute la documentation

---

## 🔗 Liens Utiles

| Ressource | URL |
|-----------|-----|
| **Serveur local** | http://localhost:25809 |
| **Swagger UI** | http://localhost:25809/docs |
| **Dashboard Admin** | http://localhost:25809 (admin/admin123) |
| **Health Check** | http://localhost:25809/health |

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
