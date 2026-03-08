# 📚 Documentation Serveur Multi-CLI Gemini

## 🎯 Serveur Multi-Comptes Gemini CLI

Ce dossier contient toute la documentation du serveur Multi-CLI Gemini qui permet d'utiliser plusieurs comptes Google avec des endpoints OpenAI compatibles.

**Serveur:** http://localhost:25815  
**Swagger UI:** http://localhost:25815/api-docs  
**Commande:** `npm run multi-cli`

## 🚀 Démarrage Rapide

### 1. Lire en Premier
- **[SYNTHESE_FINALE.md](SYNTHESE_FINALE.md)** - Synthèse complète du projet
- **[REPONSE_FINALE_N8N.md](REPONSE_FINALE_N8N.md)** - Réponse aux questions n8n

### 2. ⭐⭐⭐ NOUVEAU - Correction Prompts Longs (2026-03-08)
- **[../ACTION_IMMEDIATE_CORRECTION.md](../ACTION_IMMEDIATE_CORRECTION.md)** ⚡⚡⚡ - 3 commandes pour corriger
- **[../INDEX_CORRECTION_MULTI_CLI.md](../INDEX_CORRECTION_MULTI_CLI.md)** 📚 - Index complet de la correction
- **[CORRECTION_PROMPTS_LONGS.md](CORRECTION_PROMPTS_LONGS.md)** ⭐ - Solution pour prompts >8000 caractères
- **[DEMARRAGE_RAPIDE_PROMPTS_LONGS.md](DEMARRAGE_RAPIDE_PROMPTS_LONGS.md)** - Démarrage en 3 étapes

### 3. Intégration n8n
- **[N8N_INTEGRATION_MULTI_CLI.md](N8N_INTEGRATION_MULTI_CLI.md)** - Guide complet n8n
- **[QUICK_START_N8N.md](QUICK_START_N8N.md)** - Démarrage rapide n8n

### 4. Guides Complets
- **[MULTI_CLI_QUICK_START.md](MULTI_CLI_QUICK_START.md)** - Démarrage rapide
- **[MULTI_CLI_ENDPOINTS_GUIDE.md](MULTI_CLI_ENDPOINTS_GUIDE.md)** - Guide des endpoints

## 📋 Documentation par Thème

### Configuration et État
- [ETAT_FINAL_PROFILES.md](ETAT_FINAL_PROFILES.md) - État des profils (2/3 actifs)
- [MULTI_CLI_IMPLEMENTATION_COMPLETE.md](MULTI_CLI_IMPLEMENTATION_COMPLETE.md) - Implémentation
- [MULTI_CLI_ACTIVATION_COMPLETE.md](MULTI_CLI_ACTIVATION_COMPLETE.md) - Activation
- [MULTI_CLI_ACTIVATION_RESULTAT.md](MULTI_CLI_ACTIVATION_RESULTAT.md) - Résultats

### Authentification des Profils
- [AUTH_PROFILE2_SUCCESS.md](AUTH_PROFILE2_SUCCESS.md) - Profile2 (ohada.save@gmail.com) ✅
- [AUTH_PROFILE3_SUCCESS.md](AUTH_PROFILE3_SUCCESS.md) - Profile3 (ohada.save3@gmail.com) ✅

### Profile4 - Problèmes
- [PROFILE4_TIMEOUT_ANALYSE.md](PROFILE4_TIMEOUT_ANALYSE.md) - Analyse du timeout
- [PROFILE4_SAVE12_VERIFICATION_REQUISE.md](PROFILE4_SAVE12_VERIFICATION_REQUISE.md) - ohada.save12@gmail.com
- [PROFILE4_VERIFICATION_REQUISE.md](PROFILE4_VERIFICATION_REQUISE.md) - ohada.save6@gmail.com
- [PROFILE4_ACTIVATION_SUCCES.md](PROFILE4_ACTIVATION_SUCCES.md) - ohada.save10@gmail.com (abandonné)

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

## 🔗 Endpoints Disponibles

### Load Balancer (Recommandé)
```
POST http://localhost:25815/api/v1/cli/chat
```
Distribution automatique entre profile2 et profile3

### Endpoints par Compte
```
POST http://localhost:25815/api/v1/cli/profile2/chat  # ohada.save@gmail.com ✅
POST http://localhost:25815/api/v1/cli/profile3/chat  # ohada.save3@gmail.com ✅
```

### Gestion
```
GET http://localhost:25815/api/v1/cli/profiles
GET http://localhost:25815/api/v1/cli/profiles/stats
GET http://localhost:25815/health
```

### Documentation
```
GET http://localhost:25815/api-docs  # Swagger UI
```

## 📊 Configuration Actuelle

### Profils
- **Profile2:** ohada.save@gmail.com (Port 25812) ✅ Actif
- **Profile3:** ohada.save3@gmail.com (Port 25813) ✅ Actif
- **Profile4:** ohada.save12@gmail.com (Port 25814) ❌ Désactivé (timeout)

### Quotas (2 Profils)
- Requêtes/minute: 30-120
- Tokens/jour: 2-4M
- Haute disponibilité: ✅
- Load balancing: Round-robin

## 🚀 Commandes Essentielles

### Démarrer le Serveur
```bash
npm run multi-cli
```

### Tester les Profils
```bash
node scripts/test-all-profiles.js
```

### Tester Profile4
```bash
node scripts/test-profile4.js
```

### Authentifier Profile4
```bash
.\scripts\auth-profile4-save12.ps1
```

## 📚 Scripts Disponibles

Dans le dossier `../scripts/`:
- `auth-profile4-save12.ps1` - Authentification profile4 (ohada.save12@gmail.com)
- `auth-profiles-simple.ps1` - Authentification simplifiée
- `auth-multi-profiles.ps1` - Authentification multiple
- `setup-multi-cli-profiles.ps1` - Configuration profils
- `start-multi-cli-server.js` - Démarrage serveur
- `test-multi-cli.js` - Tests automatisés
- `test-all-profiles.js` - Tests tous profils
- `test-profile4.js` - Test profile4

## 🎯 Pour n8n

### URLs de Base
```
Load Balancer: http://localhost:25815/api/v1/cli/chat
Profile2:      http://localhost:25815/api/v1/cli/profile2/chat
Profile3:      http://localhost:25815/api/v1/cli/profile3/chat
```

### Format de Requête
```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {"role": "user", "content": "Votre message"}
  ]
}
```

### Documentation
- **Guide complet:** [N8N_INTEGRATION_MULTI_CLI.md](N8N_INTEGRATION_MULTI_CLI.md)
- **Quick Start:** [QUICK_START_N8N.md](QUICK_START_N8N.md)

## ⚠️ Notes Importantes

### ✅ Prompts Longs Supportés
Le serveur supporte maintenant les prompts de **n'importe quelle longueur** grâce à l'utilisation de stdin au lieu d'arguments de ligne de commande.

**Avant:** Limite de 8191 caractères (Windows)  
**Maintenant:** ♾️ Illimité

Voir **[CORRECTION_PROMPTS_LONGS.md](CORRECTION_PROMPTS_LONGS.md)** pour les détails.

### Profile4 (ohada.save12@gmail.com)
- **Status:** Authentifié mais timeout
- **Problème:** La commande Gemini CLI tourne indéfiniment (20+ minutes)
- **Solution:** Désactivé dans `.env`
- **Analyse:** [PROFILE4_TIMEOUT_ANALYSE.md](PROFILE4_TIMEOUT_ANALYSE.md)

### Profils Fonctionnels
Les 2 profils actifs (profile2 et profile3) offrent déjà:
- 30-120 requêtes/minute
- 2-4M tokens/jour
- Haute disponibilité avec failover
- Load balancing automatique
- ✅ Support des prompts longs

C'est largement suffisant pour la plupart des cas d'usage.

## 📖 Documentation Racine

Dans le dossier racine du projet:
- **[MULTI_CLI_N8N_URLS.md](../MULTI_CLI_N8N_URLS.md)** - URLs pour n8n
- **[REPONSE_MULTI_CLI_N8N.md](../REPONSE_MULTI_CLI_N8N.md)** - Réponse finale

---

**Serveur:** http://localhost:25815  
**Swagger:** http://localhost:25815/api-docs  
**Commande:** `npm run multi-cli`  
**Profils actifs:** 2/3 (profile2, profile3)  
**Status:** ✅ Opérationnel
