# 🚀 Guide d'Intégration Profile4 (ohada.save6@gmail.com)

## ✅ Configuration Effectuée

### 1. Fichier `.env` Mis à Jour

```env
# Liste des profils (séparés par des virgules)
MULTI_CLI_PROFILES=profile2,profile3,profile4

# Profil 4 - ohada.save6@gmail.com (⏳ EN COURS D'AUTHENTIFICATION)
CLI_PROFILE4_HOME=~/.gemini-profile4
CLI_PROFILE4_PORT=25814
CLI_PROFILE4_ACCOUNT=ohada.save6@gmail.com
CLI_PROFILE4_ENABLED=true
```

### 2. Documentation Swagger Mise à Jour

- ✅ Endpoint `/api/v1/cli/profile4/chat` ajouté
- ✅ Profile4 ajouté dans les schémas
- ✅ Exemples de requêtes inclus

### 3. Code Compilé

- ✅ `dist/swagger/multiCliSwagger.js` mis à jour

## 🔧 Étapes pour Finaliser l'Authentification

### Étape 1: Vérifier le Répertoire Profile4

```powershell
# Vérifier que le répertoire existe
Test-Path "$HOME\.gemini-profile4"
```

**Résultat attendu:** `True`

### Étape 2: Compléter l'Authentification

Le processus d'authentification a été lancé mais a timeout. Vous devez le relancer:

```powershell
# Définir le répertoire du profile4
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile4"

# Lancer l'authentification
gemini auth login
```

**Instructions:**
1. Une fenêtre de navigateur va s'ouvrir
2. Connectez-vous avec le compte **ohada.save6@gmail.com**
3. Autorisez l'accès à Gemini CLI
4. Attendez le message de confirmation dans le terminal

**Note:** Si le processus se bloque, appuyez sur `r` pour redémarrer Gemini CLI.

### Étape 3: Vérifier l'Authentification

```powershell
# Vérifier que le fichier de credentials existe
Test-Path "$HOME\.gemini-profile4\.gemini\oauth_creds.json"
```

**Résultat attendu:** `True`

### Étape 4: Tester le Profile4

```powershell
# Tester avec une commande simple
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile4"
gemini -m gemini-2.5-flash --prompt "Test du profile4"
```

**Résultat attendu:** Une réponse de Gemini

## 🚀 Démarrage du Serveur Multi-CLI

Une fois l'authentification complétée:

```bash
# Arrêter le serveur actuel (si en cours)
# Ctrl+C dans le terminal où il tourne

# Redémarrer le serveur
npm run multi-cli
```

**Vous devriez voir:**
```
🚀 Démarrage du serveur Multi-CLI Gemini...

📋 Profils configurés: profile2, profile3, profile4
  ✅ profile2: ohada.save@gmail.com
  ✅ profile3: ohada.save3@gmail.com
  ✅ profile4: ohada.save6@gmail.com

🎉 Serveur Multi-CLI Gemini démarré!

📡 Endpoints disponibles:
  POST http://localhost:25815/api/v1/cli/chat
  POST http://localhost:25815/api/v1/cli/profile2/chat
  POST http://localhost:25815/api/v1/cli/profile3/chat
  POST http://localhost:25815/api/v1/cli/profile4/chat
```

## 🧪 Tests

### Test 1: Vérifier les Profils

```bash
curl http://localhost:25815/api/v1/cli/profiles
```

**Résultat attendu:**
```json
{
  "success": true,
  "count": 3,
  "profiles": [
    {
      "id": "profile2",
      "name": "Gemini CLI profile2",
      "account": "ohada.save@gmail.com",
      "port": 25812,
      "enabled": true
    },
    {
      "id": "profile3",
      "name": "Gemini CLI profile3",
      "account": "ohada.save3@gmail.com",
      "port": 25813,
      "enabled": true
    },
    {
      "id": "profile4",
      "name": "Gemini CLI profile4",
      "account": "ohada.save6@gmail.com",
      "port": 25814,
      "enabled": true
    }
  ]
}
```

### Test 2: Chat avec Profile4

```bash
curl -X POST http://localhost:25815/api/v1/cli/profile4/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {
        "role": "user",
        "content": "Bonjour depuis profile4!"
      }
    ]
  }'
```

**Résultat attendu:** Une réponse de Gemini au format OpenAI

### Test 3: Swagger UI

Ouvrez votre navigateur:
```
http://localhost:25815/api-docs
```

Vous devriez voir l'endpoint **POST /api/v1/cli/profile4/chat** dans la documentation.

## 📊 Statistiques

Après quelques requêtes, vérifiez les stats:

```bash
curl http://localhost:25815/api/v1/cli/profiles/stats
```

**Résultat attendu:**
```json
{
  "success": true,
  "stats": {
    "profile2": {
      "requests": 10,
      "errors": 0,
      "avgResponseTime": 850,
      "lastUsed": "2026-03-07T...",
      "isAvailable": true
    },
    "profile3": {
      "requests": 8,
      "errors": 0,
      "avgResponseTime": 920,
      "lastUsed": "2026-03-07T...",
      "isAvailable": true
    },
    "profile4": {
      "requests": 5,
      "errors": 0,
      "avgResponseTime": 880,
      "lastUsed": "2026-03-07T...",
      "isAvailable": true
    }
  }
}
```

## 🎯 Avantages avec 3 Profils

| Métrique | 2 Profils | 3 Profils | Gain |
|----------|-----------|-----------|------|
| Requêtes/minute | ~30-120 | ~45-180 | +50% |
| Tokens/jour | ~2-4M | ~3-6M | +50% |
| Disponibilité | 2 points | 3 points | Haute |
| Failover | Bon | Excellent | +33% |

## 🔄 Load Balancing

Avec 3 profils, le load balancer distribue les requêtes:

```
Requête 1 → Profile 2 (ohada.save@gmail.com)
Requête 2 → Profile 3 (ohada.save3@gmail.com)
Requête 3 → Profile 4 (ohada.save6@gmail.com)
Requête 4 → Profile 2 (ohada.save@gmail.com)
Requête 5 → Profile 3 (ohada.save3@gmail.com)
...
```

## 🐛 Dépannage

### Problème: "Profile not found"

**Solution:** Vérifier que profile4 est dans `.env`:
```bash
cat .env | grep PROFILE4
```

### Problème: "Gemini CLI failed"

**Solution:** Réauthentifier le profile4:
```powershell
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile4"
gemini auth login
```

### Problème: "No available profiles"

**Solution:** Vérifier que `MULTI_CLI_PROFILES` inclut profile4:
```bash
cat .env | grep MULTI_CLI_PROFILES
```

Devrait afficher:
```
MULTI_CLI_PROFILES=profile2,profile3,profile4
```

## 📚 Documentation

### Endpoints Profile4

**Chat avec Profile4:**
```
POST http://localhost:25815/api/v1/cli/profile4/chat
```

**Détails du Profile4:**
```
GET http://localhost:25815/api/v1/cli/profiles/profile4
```

**Statistiques du Profile4:**
```
GET http://localhost:25815/api/v1/cli/profiles/stats
```

### Swagger UI

Documentation interactive:
```
http://localhost:25815/api-docs
```

Testez directement l'endpoint profile4 depuis l'interface Swagger.

## ✅ Checklist de Vérification

Avant de considérer l'intégration complète:

- [ ] Répertoire `~/.gemini-profile4` créé
- [ ] Authentification complétée (fichier `oauth_creds.json` existe)
- [ ] Test manuel avec `gemini --prompt "Test"` réussi
- [ ] Variable `.env` `MULTI_CLI_PROFILES` inclut profile4
- [ ] Configuration profile4 dans `.env` complète
- [ ] Serveur Multi-CLI redémarré
- [ ] Endpoint `/api/v1/cli/profile4/chat` accessible
- [ ] Test cURL réussi
- [ ] Swagger UI affiche profile4
- [ ] Statistiques profile4 disponibles

## 🎉 Résumé

Une fois l'authentification complétée, vous aurez:

- ✅ **3 profils Gemini CLI actifs**
  - Profile2: ohada.save@gmail.com
  - Profile3: ohada.save3@gmail.com
  - Profile4: ohada.save6@gmail.com

- ✅ **4 endpoints de chat**
  - Load Balancer: `/api/v1/cli/chat`
  - Profile2: `/api/v1/cli/profile2/chat`
  - Profile3: `/api/v1/cli/profile3/chat`
  - Profile4: `/api/v1/cli/profile4/chat`

- ✅ **Quotas multipliés par 3**
  - ~45-180 requêtes/minute
  - ~3-6M tokens/jour

- ✅ **Haute disponibilité**
  - Failover automatique
  - Distribution équitable

- ✅ **Documentation Swagger complète**
  - http://localhost:25815/api-docs

## 🚀 Prochaines Étapes

1. **Compléter l'authentification** du profile4
2. **Redémarrer le serveur** Multi-CLI
3. **Tester les endpoints** profile4
4. **Vérifier Swagger UI**
5. **Intégrer avec vos applications**

---

**Status Actuel:** ⏳ En attente de l'authentification profile4  
**Prochaine Action:** Exécuter `gemini auth login` avec `GEMINI_CLI_HOME=~/.gemini-profile4`
