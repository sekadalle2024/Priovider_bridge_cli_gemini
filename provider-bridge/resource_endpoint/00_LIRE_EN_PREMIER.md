# 📖 LIRE EN PREMIER

Bienvenue dans la documentation Provider Bridge !

---

## ⚡ Réponses Rapides

### 1️⃣ URLs Base pour n8n

**Gemini CLI OAuth (Gratuit)** :
```
http://localhost:25809/cli
```

**Gemini API Key Rotative (Production)** :
```
http://localhost:25809
```

📚 Détails : [N8N_BASE_URLS.md](./N8N_BASE_URLS.md)

---

### 2️⃣ Comment Lancer le Serveur

**Windows** — Double-cliquez sur :
```
START.bat
```

**Linux/Mac** — Dans le terminal :
```bash
cd provider-bridge
npm run dev
```

📚 Détails : [COMMENT_LANCER.md](./COMMENT_LANCER.md)

---

## 📚 Documentation par Niveau

### 🟢 Débutant

1. [README_SIMPLE.md](./README_SIMPLE.md) — Guide ultra-simplifié (2 min)
2. [REPONSE_RAPIDE.md](./REPONSE_RAPIDE.md) — FAQ
3. [COMMENT_LANCER.md](./COMMENT_LANCER.md) — Comment lancer le serveur

### 🟡 Intermédiaire

1. [QUICK_START.md](./QUICK_START.md) — Démarrage en 5 minutes
2. [N8N_BASE_URLS.md](./N8N_BASE_URLS.md) — Configuration n8n
3. [ENDPOINTS_SUMMARY.md](./ENDPOINTS_SUMMARY.md) — Tous les endpoints

### 🔴 Avancé

1. [GEMINI_CLI_OPENAI_ENDPOINTS.md](./GEMINI_CLI_OPENAI_ENDPOINTS.md) — Guide Gemini CLI
2. [INDEX.md](./INDEX.md) — Navigation complète
3. [TASK_8_COMPLETE.md](./TASK_8_COMPLETE.md) — Résumé technique

---

## 🛠️ Scripts Disponibles

| Script | Action |
|--------|--------|
| [START.bat](./START.bat) | Lance en mode développement |
| [START-PROD.bat](./START-PROD.bat) | Lance en mode production |
| [TEST.bat](./TEST.bat) | Lance les tests |

---

## 🎯 Parcours Recommandé

### Pour Démarrer Rapidement (5 minutes)

1. Double-cliquez sur [START.bat](./START.bat)
2. Ouvrez http://localhost:25809/health
3. Lisez [N8N_BASE_URLS.md](./N8N_BASE_URLS.md)
4. Configurez n8n avec les URLs

### Pour Comprendre en Profondeur (30 minutes)

1. Lisez [README_SIMPLE.md](./README_SIMPLE.md)
2. Lisez [QUICK_START.md](./QUICK_START.md)
3. Lisez [GEMINI_CLI_OPENAI_ENDPOINTS.md](./GEMINI_CLI_OPENAI_ENDPOINTS.md)
4. Explorez [INDEX.md](./INDEX.md)

---

## 📊 Structure de la Documentation

```
resource_endpoint/
├── 00_LIRE_EN_PREMIER.md          # ⚡ Ce fichier (START HERE!)
├── README.md                       # Index du dossier
│
├── 🟢 Débutant
│   ├── README_SIMPLE.md            # Guide ultra-simplifié
│   ├── REPONSE_RAPIDE.md           # FAQ
│   └── COMMENT_LANCER.md           # Guide de lancement
│
├── 🟡 Intermédiaire
│   ├── QUICK_START.md              # Démarrage 5 min
│   ├── N8N_BASE_URLS.md            # URLs pour n8n
│   └── ENDPOINTS_SUMMARY.md        # Résumé endpoints
│
├── 🔴 Avancé
│   ├── GEMINI_CLI_OPENAI_ENDPOINTS.md  # Guide Gemini CLI
│   ├── INDEX.md                    # Navigation complète
│   └── TASK_8_COMPLETE.md          # Résumé technique
│
└── 🛠️ Scripts
    ├── START.bat                   # Lancement dev
    ├── START-PROD.bat              # Lancement prod
    └── TEST.bat                    # Tests
```

---

## 💡 Conseils

### Pour le Développement
- Utilisez [START.bat](./START.bat)
- Base URL n8n : `http://localhost:25809/cli` (Gemini CLI OAuth, gratuit)

### Pour la Production
- Utilisez [START-PROD.bat](./START-PROD.bat)
- Base URL n8n : `http://localhost:25809` (API Key Rotative, 195 req/min)

---

## 🔗 Liens Utiles

| Ressource | URL |
|-----------|-----|
| **Serveur** | http://localhost:25809 |
| **Swagger** | http://localhost:25809/docs |
| **Health** | http://localhost:25809/health |
| **Admin** | http://localhost:25809 (admin/admin123) |

---

**Prochaine étape** : Lisez [README_SIMPLE.md](./README_SIMPLE.md) ou lancez [START.bat](./START.bat) !

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
