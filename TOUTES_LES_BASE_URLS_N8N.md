# 🔗 Toutes les Base URLs pour n8n

## ✅ Serveurs Disponibles

Vous avez 3 serveurs Gemini opérationnels, chacun avec ses avantages:

---

## 1️⃣ Serveur Multi-CLI Gemini (Recommandé pour n8n)

**Base URL:**
```
http://127.0.0.1:25815/api/v1/cli
```

**Commande:**
```bash
npm run multi-cli
```

**Avantages:**
- ✅ Load balancing automatique (2 comptes)
- ✅ Haute disponibilité avec failover
- ✅ 6 modèles disponibles (dont "auto")
- ✅ 30-120 requêtes/minute
- ✅ 2-4M tokens/jour
- ✅ Format OpenAI 100% compatible

**Modèles:**
- auto (Qualité maximale)
- gemini-2.5-flash (Rapidité)
- gemini-2.5-pro
- gemini-2.0-flash
- gemini-1.5-flash
- gemini-1.5-pro

**Swagger:** http://127.0.0.1:25815/api-docs

---

## 2️⃣ Serveur Assistants Gemini

**Base URL:**
```
http://127.0.0.1:25810/api/v1/assistants
```

**Commande:**
```bash
npm run assistants
```

**Avantages:**
- ✅ Assistants personnalisés (data-analyst, cowork, etc.)
- ✅ Mode "auto" (sélection automatique du meilleur modèle)
- ✅ 15-60 requêtes/minute
- ✅ 1-2M tokens/jour
- ✅ Spécialisé pour les assistants

**Modèles:**
- auto (Recommandé)
- gemini-2.5-flash
- gemini-2.5-pro
- gemini-2.0-flash
- gemini-1.5-flash
- gemini-1.5-pro

**Swagger:** http://127.0.0.1:25810/api-docs

---

## 3️⃣ Serveur API Keys Gemini (Quotas Maximaux)

**Base URL:**
```
http://127.0.0.1:25808/api/v1/gemini-api-key
```

**Commande:**
```bash
npm run api-key
```

**Avantages:**
- ✅ 27 API keys en rotation
- ✅ Quotas maximaux: 135 requêtes/minute
- ✅ 6.75M tokens/jour
- ✅ Rotation automatique des clés
- ✅ Idéal pour production haute charge

**Modèles:**
- gemini-2.5-flash (Par défaut)
- gemini-2.5-pro
- gemini-2.0-flash
- gemini-1.5-flash
- gemini-1.5-pro

**Swagger:** http://127.0.0.1:25808/api-docs

---

## 📊 Comparaison Rapide

| Serveur | Port | Base URL | Profils/Keys | Req/min | Tokens/jour | Spécialité |
|---------|------|----------|--------------|---------|-------------|------------|
| **Multi-CLI** | 25815 | `/api/v1/cli` | 2 profils | 30-120 | 2-4M | Load balancing |
| **Assistants** | 25810 | `/api/v1/assistants` | 1 profil | 15-60 | 1-2M | Assistants |
| **API Keys** | 25808 | `/api/v1/gemini-api-key` | 27 keys | 135 | 6.75M | Haute charge |

---

## 🎯 Quelle Base URL Choisir?

### Pour n8n (Recommandé)
```
http://127.0.0.1:25815/api/v1/cli
```
**Pourquoi?** Load balancing, haute disponibilité, 6 modèles

### Pour Assistants Personnalisés
```
http://127.0.0.1:25810/api/v1/assistants
```
**Pourquoi?** Assistants spécialisés, mode "auto"

### Pour Production Haute Charge
```
http://127.0.0.1:25808/api/v1/gemini-api-key
```
**Pourquoi?** Quotas maximaux, 27 API keys

---

## 🔧 Configuration n8n

### Credential OpenAI
- **Type:** OpenAI account
- **Base URL:** (Choisir une des 3 ci-dessus)
- **API Key:** `dummy` (requis mais non utilisé)

### Model
Sélectionnez dans la liste déroulante:
- **auto** (Multi-CLI et Assistants uniquement)
- **gemini-2.5-flash** (Recommandé pour rapidité)
- gemini-2.5-pro
- gemini-2.0-flash
- gemini-1.5-flash
- gemini-1.5-pro

---

## 🚀 Démarrage des Serveurs

### Démarrer Tous les Serveurs
```bash
# Terminal 1 - Multi-CLI (Port 25815)
npm run multi-cli

# Terminal 2 - Assistants (Port 25810)
npm run assistants

# Terminal 3 - API Keys (Port 25808)
npm run api-key
```

### Démarrer un Seul Serveur
```bash
# Recommandé pour n8n
npm run multi-cli
```

---

## 🧪 Tester les Endpoints

### Multi-CLI
```bash
curl http://127.0.0.1:25815/health
curl http://127.0.0.1:25815/api/v1/cli/models
```

### Assistants
```bash
curl http://127.0.0.1:25810/health
curl http://127.0.0.1:25810/api/v1/assistants/models
```

### API Keys
```bash
curl http://127.0.0.1:25808/health
curl http://127.0.0.1:25808/api/v1/gemini-api-key/models
```

---

## 📚 Documentation Complète

### Multi-CLI
- **Guide:** [SYNTHESE_FINALE_MULTI_CLI.md](SYNTHESE_FINALE_MULTI_CLI.md)
- **n8n:** [N8N_READY_CHAT_COMPLETIONS.md](N8N_READY_CHAT_COMPLETIONS.md)
- **Dossier:** [gemini_cli_multi_provider/](gemini_cli_multi_provider/)

### Assistants
- **Guide:** [CONFIGURATION_FINALE_ASSISTANTS.md](CONFIGURATION_FINALE_ASSISTANTS.md)
- **n8n:** [N8N_QUICK_SETUP_ASSISTANTS.md](N8N_QUICK_SETUP_ASSISTANTS.md)
- **Dossier:** [assistant_serveur_endpoint/](assistant_serveur_endpoint/)

### API Keys
- **Guide:** [GEMINI_API_README.md](GEMINI_API_README.md)
- **n8n:** [QUICK_N8N_GEMINI_SETUP.md](QUICK_N8N_GEMINI_SETUP.md)
- **Dossier:** [src/webserver/gemini-api-key-rotative-docs/](src/webserver/gemini-api-key-rotative-docs/)

---

## 💡 Recommandations

### Développement et Tests
```
Base URL: http://127.0.0.1:25815/api/v1/cli
Model: gemini-2.5-flash
```

### Production Normale
```
Base URL: http://127.0.0.1:25815/api/v1/cli
Model: auto
```

### Production Haute Charge
```
Base URL: http://127.0.0.1:25808/api/v1/gemini-api-key
Model: gemini-2.5-flash
```

### Assistants Spécialisés
```
Base URL: http://127.0.0.1:25810/api/v1/assistants
Model: auto
```

---

## ✅ Résumé

**3 serveurs disponibles:**
1. ✅ Multi-CLI (25815) - Load balancing, haute disponibilité
2. ✅ Assistants (25810) - Assistants personnalisés
3. ✅ API Keys (25808) - Quotas maximaux

**Tous compatibles avec n8n!**

**Recommandation:** Utilisez le serveur Multi-CLI (port 25815) pour n8n car il offre le meilleur équilibre entre disponibilité, performance et simplicité.

---

**Base URL Recommandée:** `http://127.0.0.1:25815/api/v1/cli`  
**Commande:** `npm run multi-cli`  
**Status:** ✅ Tous les serveurs opérationnels!
