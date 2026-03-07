# ⚠️ Profile4 - Vérification du Compte Requise

## 🔍 Situation Actuelle

Le compte **ohada.save6@gmail.com** (Profile4) est authentifié mais Google demande une vérification du compte avant de pouvoir utiliser l'API Gemini.

## ❌ Erreur Rencontrée

```
ValidationRequiredError: Verify your account to continue.
Code: 403
Message: Verify your account to continue.
```

## 🔗 Action Requise

### Étape 1: Vérifier le Compte

Visitez ce lien pour vérifier le compte ohada.save6@gmail.com:

```
https://accounts.google.com/signin/continue?sarp=1&scc=1&continue=https://developers.google.com/gemini-code-assist/auth/auth_success_gemini
```

**Instructions:**
1. Cliquez sur le lien ci-dessus
2. Connectez-vous avec **ohada.save6@gmail.com**
3. Suivez les étapes de vérification Google
4. Attendez la confirmation

### Étape 2: Tester à Nouveau

Après la vérification, testez le profil:

```powershell
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile4"
gemini -m gemini-2.5-flash --prompt "Test profile4"
```

### Étape 3: Redémarrer le Serveur

Une fois le test réussi:

```bash
npm run multi-cli
```

## 📊 État des Profils

| Profile | Compte | Status | Action |
|---------|--------|--------|--------|
| profile2 | ohada.save@gmail.com | ✅ Actif | Aucune |
| profile3 | ohada.save3@gmail.com | ✅ Actif | Aucune |
| profile4 | ohada.save6@gmail.com | ⚠️ Vérification requise | Vérifier le compte |

## 🔧 Solutions Alternatives

### Option 1: Utiliser un Autre Compte

Si vous avez un autre compte Google disponible, vous pouvez:

1. Modifier `.env`:
```env
CLI_PROFILE4_ACCOUNT=autre-compte@gmail.com
```

2. Réauthentifier:
```powershell
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile4"
gemini auth login
```

### Option 2: Continuer avec 2 Profils

Le serveur Multi-CLI fonctionne déjà avec 2 profils actifs:
- profile2: ohada.save@gmail.com
- profile3: ohada.save3@gmail.com

Quotas actuels:
- Requêtes/minute: 30-120
- Tokens/jour: 2-4M

### Option 3: Attendre la Vérification

Certaines vérifications Google peuvent prendre quelques heures. Réessayez plus tard.

## 📝 Pourquoi Cette Vérification?

Google peut demander une vérification pour plusieurs raisons:
- Nouveau compte récemment créé
- Activité inhabituelle détectée
- Mesure de sécurité standard
- Première utilisation de l'API Gemini

## 🚀 Prochaines Étapes

### Si Vous Vérifiez le Compte

1. ✅ Visiter le lien de vérification
2. ✅ Compléter la vérification Google
3. ✅ Tester: `gemini -m gemini-2.5-flash --prompt "Test"`
4. ✅ Redémarrer: `npm run multi-cli`
5. ✅ Vérifier Swagger: http://localhost:25815/api-docs

### Si Vous Utilisez un Autre Compte

1. ✅ Modifier `.env` avec le nouveau compte
2. ✅ Exécuter: `.\scripts\auth-profile4-simple.ps1`
3. ✅ Redémarrer: `npm run multi-cli`

### Si Vous Continuez avec 2 Profils

1. ✅ Désactiver profile4 dans `.env`:
```env
CLI_PROFILE4_ENABLED=false
MULTI_CLI_PROFILES=profile2,profile3
```

2. ✅ Redémarrer: `npm run multi-cli`

## 📚 Documentation

- **Lien de vérification:** Fourni dans l'erreur ci-dessus
- **Support Google:** https://support.google.com/accounts?p=al_alert
- **Documentation Gemini CLI:** https://github.com/google/generative-ai-cli

## 💡 Recommandation

**Option recommandée:** Vérifier le compte ohada.save6@gmail.com

C'est la solution la plus simple et rapide. La vérification Google prend généralement quelques minutes.

---

**Status:** ⚠️ Vérification du compte requise  
**Action:** Visiter le lien de vérification Google  
**Temps estimé:** 5-10 minutes
