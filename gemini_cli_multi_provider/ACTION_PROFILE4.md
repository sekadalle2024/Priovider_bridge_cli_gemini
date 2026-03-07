# ⚡ Action Immédiate - Profile4

## 🎯 Objectif

Activer le compte **ohada.save6@gmail.com** comme Profile4 dans le système Multi-CLI Gemini.

## ✅ Configuration Actuelle

- ✅ Fichier `.env` mis à jour
- ✅ Documentation Swagger mise à jour
- ✅ Code compilé
- ✅ Scripts d'authentification créés

## 🚀 Action Requise (5 minutes)

### 1. Authentifier Profile4

```powershell
.\scripts\auth-profile4.ps1
```

Le script va:
- Vérifier/créer le répertoire `~/.gemini-profile4`
- Lancer l'authentification Google
- Tester le profil
- Afficher les prochaines étapes

### 2. Redémarrer le Serveur

```bash
npm run multi-cli
```

### 3. Tester

```bash
# Vérifier les profils
curl http://localhost:25815/api/v1/cli/profiles

# Tester profile4
curl -X POST http://localhost:25815/api/v1/cli/profile4/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Test"}]}'
```

## 📊 Résultat Attendu

### Avant (2 profils)
- profile2: ohada.save@gmail.com ✅
- profile3: ohada.save3@gmail.com ✅

### Après (3 profils)
- profile2: ohada.save@gmail.com ✅
- profile3: ohada.save3@gmail.com ✅
- profile4: ohada.save6@gmail.com ✅

### Quotas Multipliés
- Requêtes/minute: 30-120 → 45-180 (+50%)
- Tokens/jour: 2-4M → 3-6M (+50%)

## 🔗 Endpoints Disponibles

```
POST http://localhost:25815/api/v1/cli/profile2/chat  # ohada.save@gmail.com
POST http://localhost:25815/api/v1/cli/profile3/chat  # ohada.save3@gmail.com
POST http://localhost:25815/api/v1/cli/profile4/chat  # ohada.save6@gmail.com
POST http://localhost:25815/api/v1/cli/chat           # Load balancer (round-robin)
```

## 📚 Documentation

- **PROFILE4_INTEGRATION_GUIDE.md** - Guide complet
- **PROFILE4_READY.md** - Synthèse rapide
- **INTEGRATION_PROFILE4_COMPLETE.md** - Vue d'ensemble
- **http://localhost:25815/api-docs** - Swagger UI

## 🐛 Dépannage Rapide

### Problème: Authentification timeout

```powershell
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile4"
gemini auth login
# Appuyer sur 'r' si bloqué
```

### Problème: Profile4 non trouvé

```bash
# Vérifier .env
cat .env | grep PROFILE4

# Redémarrer
npm run multi-cli
```

---

**Commande:** `.\scripts\auth-profile4.ps1`  
**Temps:** 5 minutes  
**Status:** ⏳ En attente
