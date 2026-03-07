# 📚 Documentation Serveur Multi-CLI Gemini

## 🎯 Serveur Multi-Comptes Gemini CLI

Ce dossier contient toute la documentation du serveur Multi-CLI Gemini qui permet d'utiliser plusieurs comptes Google avec des endpoints OpenAI compatibles.

**Serveur:** http://localhost:25815  
**Swagger UI:** http://localhost:25815/api-docs

## 🚀 Démarrage Rapide

### 1. Lire en Premier
- **[00_LIRE_EN_PREMIER_PROFILE4.md](00_LIRE_EN_PREMIER_PROFILE4.md)** - Point d'entrée

### 2. Action Immédiate
- **[ACTION_PROFILE4.md](ACTION_PROFILE4.md)** - Activer profile4 maintenant

### 3. Guides Complets
- **[MULTI_CLI_QUICK_START.md](MULTI_CLI_QUICK_START.md)** - Démarrage rapide
- **[MULTI_CLI_ENDPOINTS_GUIDE.md](MULTI_CLI_ENDPOINTS_GUIDE.md)** - Guide des endpoints

## 📋 Documentation par Thème

### Configuration et Activation
- [MULTI_CLI_IMPLEMENTATION_COMPLETE.md](MULTI_CLI_IMPLEMENTATION_COMPLETE.md)
- [MULTI_CLI_ACTIVATION_COMPLETE.md](MULTI_CLI_ACTIVATION_COMPLETE.md)
- [MULTI_CLI_ACTIVATION_RESULTAT.md](MULTI_CLI_ACTIVATION_RESULTAT.md)

### Profile4 (ohada.save6@gmail.com)
- [PROFILE4_READY.md](PROFILE4_READY.md) - Synthèse
- [PROFILE4_INTEGRATION_GUIDE.md](PROFILE4_INTEGRATION_GUIDE.md) - Guide détaillé
- [INTEGRATION_PROFILE4_COMPLETE.md](INTEGRATION_PROFILE4_COMPLETE.md) - Complet
- [REPONSE_FINALE_PROFILE4.md](REPONSE_FINALE_PROFILE4.md) - Synthèse finale
- [RECAP_FINAL_INTEGRATION_PROFILE4.md](RECAP_FINAL_INTEGRATION_PROFILE4.md) - Récapitulatif

### Authentification des Profils
- [AUTH_PROFILE2_SUCCESS.md](AUTH_PROFILE2_SUCCESS.md) - Profile2 (ohada.save@gmail.com)
- [AUTH_PROFILE3_SUCCESS.md](AUTH_PROFILE3_SUCCESS.md) - Profile3 (ohada.save3@gmail.com)

### Endpoints et URLs
- [URLS_FINALES_PAR_COMPTE.md](URLS_FINALES_PAR_COMPTE.md) - URLs par compte
- [URLS_FINALES_MULTI_CLI.md](URLS_FINALES_MULTI_CLI.md) - URLs complètes
- [ENDPOINTS_OPENAI_PAR_COMPTE.md](ENDPOINTS_OPENAI_PAR_COMPTE.md) - Endpoints OpenAI

### Documentation Technique
- [SWAGGER_DOCUMENTATION_MULTI_CLI.md](SWAGGER_DOCUMENTATION_MULTI_CLI.md) - Swagger UI
- [MULTI_COMPTES_GEMINI_CLI.md](MULTI_COMPTES_GEMINI_CLI.md) - Comparaison API Keys vs CLI

### Synthèses et Index
- [MULTI_CLI_INDEX.md](MULTI_CLI_INDEX.md) - Index général
- [MULTI_CLI_FINAL_SUMMARY.md](MULTI_CLI_FINAL_SUMMARY.md) - Synthèse finale
- [INDEX_PROFILE4_DOCUMENTATION.md](INDEX_PROFILE4_DOCUMENTATION.md) - Index profile4

## 🔗 Endpoints Disponibles

### Load Balancer
```
POST http://localhost:25815/api/v1/cli/chat
```

### Endpoints par Compte
```
POST http://localhost:25815/api/v1/cli/profile2/chat  # ohada.save@gmail.com
POST http://localhost:25815/api/v1/cli/profile3/chat  # ohada.save3@gmail.com
POST http://localhost:25815/api/v1/cli/profile4/chat  # ohada.save6@gmail.com
```

### Gestion
```
GET http://localhost:25815/api/v1/cli/profiles
GET http://localhost:25815/api/v1/cli/profiles/stats
```

### Documentation
```
GET http://localhost:25815/api-docs  # Swagger UI
GET http://localhost:25815/health
```

## 📊 Configuration Actuelle

### Profils
- **Profile2:** ohada.save@gmail.com (Port 25812) ✅
- **Profile3:** ohada.save3@gmail.com (Port 25813) ✅
- **Profile4:** ohada.save6@gmail.com (Port 25814) ⏳

### Quotas
- Requêtes/minute: 45-180 (avec 3 profils)
- Tokens/jour: 3-6M (avec 3 profils)

## 🚀 Commandes Essentielles

### Authentifier Profile4
```powershell
.\scripts\auth-profile4.ps1
```

### Démarrer le Serveur
```bash
npm run multi-cli
```

### Tester
```bash
npm run test:multi-cli
```

## 📚 Scripts Disponibles

Dans le dossier `../scripts/`:
- `auth-profile4.ps1` - Authentification profile4
- `auth-profiles-simple.ps1` - Authentification simplifiée
- `auth-multi-profiles.ps1` - Authentification multiple
- `setup-multi-cli-profiles.ps1` - Configuration profils
- `start-multi-cli-server.js` - Démarrage serveur
- `test-multi-cli.js` - Tests automatisés
- `test-multi-cli-chat.js` - Tests chat

## 🎯 Prochaine Action

**Activer profile4 maintenant:**

```powershell
.\scripts\auth-profile4.ps1
```

Voir: [ACTION_PROFILE4.md](ACTION_PROFILE4.md)

---

**Serveur:** http://localhost:25815  
**Swagger:** http://localhost:25815/api-docs  
**Documentation:** Ce dossier
