# 🔗 Base URLs par Compte Individuel - Multi-CLI Gemini

## 📋 Serveur Multi-CLI - Comptes Individuels

Le serveur Multi-CLI expose des endpoints pour chaque compte Google authentifié, vous permettant de cibler un compte spécifique au lieu d'utiliser le load balancer.

---

## 🎯 Base URLs Disponibles

### 1️⃣ Load Balancer (Recommandé)
```
http://127.0.0.1:25815/api/v1/cli
```
**Compte:** Rotation automatique entre profile2 et profile3  
**Avantage:** Haute disponibilité, failover automatique

---

### 2️⃣ Profile2 - ohada.save@gmail.com
```
http://127.0.0.1:25815/api/v1/cli/profile2
```
**Compte:** ohada.save@gmail.com  
**Status:** ✅ Actif  
**Quotas:** 15-60 req/min, 1-2M tokens/jour

---

### 3️⃣ Profile3 - ohada.save3@gmail.com
```
http://127.0.0.1:25815/api/v1/cli/profile3
```
**Compte:** ohada.save3@gmail.com  
**Status:** ✅ Actif  
**Quotas:** 15-60 req/min, 1-2M tokens/jour

---

### ❌ Profile4 - ohada.save12@gmail.com (Désactivé)
```
http://127.0.0.1:25815/api/v1/cli/profile4
```
**Compte:** ohada.save12@gmail.com  
**Status:** ❌ Désactivé (timeout)  
**Raison:** La commande Gemini CLI tourne indéfiniment (20+ minutes)

---

## 🔧 Configuration n8n par Compte

### Option 1: Load Balancer (Recommandé)
**Base URL:**
```
http://127.0.0.1:25815/api/v1/cli
```
**Credential:** OpenAI account  
**API Key:** `dummy`  
**Model:** `gemini-2.5-flash` ou `auto`

**Avantages:**
- ✅ Haute disponibilité
- ✅ Failover automatique
- ✅ Distribution de charge

---

### Option 2: Profile2 Uniquement
**Base URL:**
```
http://127.0.0.1:25815/api/v1/cli/profile2
```
**Credential:** OpenAI account  
**API Key:** `dummy`  
**Model:** `gemini-2.5-flash` ou `auto`

**Cas d'usage:**
- Workflows dédiés au compte ohada.save@gmail.com
- Tests spécifiques sur un compte
- Séparation des quotas par workflow

---

### Option 3: Profile3 Uniquement
**Base URL:**
```
http://127.0.0.1:25815/api/v1/cli/profile3
```
**Credential:** OpenAI account  
**API Key:** `dummy`  
**Model:** `gemini-2.5-flash` ou `auto`

**Cas d'usage:**
- Workflows dédiés au compte ohada.save3@gmail.com
- Tests spécifiques sur un compte
- Séparation des quotas par workflow

---

## 📊 Endpoints par Compte

### Load Balancer
```
GET  /api/v1/cli/models                    ✅
POST /api/v1/cli/chat                      ✅
POST /api/v1/cli/chat/completions          ✅
```

### Profile2 (ohada.save@gmail.com)
```
POST /api/v1/cli/profile2/models           ✅
POST /api/v1/cli/profile2/chat             ✅
POST /api/v1/cli/profile2/chat/completions ✅
```

### Profile3 (ohada.save3@gmail.com)
```
POST /api/v1/cli/profile3/models           ✅
POST /api/v1/cli/profile3/chat             ✅
POST /api/v1/cli/profile3/chat/completions ✅
```

---

## 🧪 Tester les Comptes Individuels

### Test Profile2
```bash
curl -X POST http://127.0.0.1:25815/api/v1/cli/profile2/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour"}
    ]
  }'
```

### Test Profile3
```bash
curl -X POST http://127.0.0.1:25815/api/v1/cli/profile3/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour"}
    ]
  }'
```

### Test Load Balancer
```bash
curl -X POST http://127.0.0.1:25815/api/v1/cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour"}
    ]
  }'
```

---

## 📊 Comparaison des Options

| Option | Base URL | Compte(s) | Req/min | Tokens/jour | Failover |
|--------|----------|-----------|---------|-------------|----------|
| **Load Balancer** | `/api/v1/cli` | profile2 + profile3 | 30-120 | 2-4M | ✅ Oui |
| **Profile2** | `/api/v1/cli/profile2` | ohada.save@gmail.com | 15-60 | 1-2M | ❌ Non |
| **Profile3** | `/api/v1/cli/profile3` | ohada.save3@gmail.com | 15-60 | 1-2M | ❌ Non |

---

## 💡 Quand Utiliser Chaque Option?

### Load Balancer (Recommandé)
```
Base URL: http://127.0.0.1:25815/api/v1/cli
```
**Utilisez quand:**
- Vous voulez la meilleure disponibilité
- Vous avez besoin de quotas maximaux
- Vous voulez un failover automatique
- Vous ne vous souciez pas du compte utilisé

### Profile2 Spécifique
```
Base URL: http://127.0.0.1:25815/api/v1/cli/profile2
```
**Utilisez quand:**
- Vous voulez tracer les requêtes par compte
- Vous avez des workflows dédiés à ce compte
- Vous voulez séparer les quotas par projet
- Vous testez spécifiquement ce compte

### Profile3 Spécifique
```
Base URL: http://127.0.0.1:25815/api/v1/cli/profile3
```
**Utilisez quand:**
- Vous voulez tracer les requêtes par compte
- Vous avez des workflows dédiés à ce compte
- Vous voulez séparer les quotas par projet
- Vous testez spécifiquement ce compte

---

## 🔍 Vérifier les Statistiques par Compte

### Voir tous les profils
```bash
curl http://127.0.0.1:25815/api/v1/cli/profiles
```

### Voir les statistiques
```bash
curl http://127.0.0.1:25815/api/v1/cli/profiles/stats
```

### Voir un profil spécifique
```bash
curl http://127.0.0.1:25815/api/v1/cli/profiles/profile2
curl http://127.0.0.1:25815/api/v1/cli/profiles/profile3
```

---

## 📚 Documentation Swagger

Tous les endpoints sont documentés dans Swagger:
```
http://127.0.0.1:25815/api-docs
```

Vous y trouverez:
- Tous les endpoints par profil
- Les schémas de requête/réponse
- La possibilité de tester directement

---

## ✅ Résumé des Base URLs

### Pour n8n - 3 Options Disponibles:

1. **Load Balancer (Recommandé):**
   ```
   http://127.0.0.1:25815/api/v1/cli
   ```

2. **Profile2 (ohada.save@gmail.com):**
   ```
   http://127.0.0.1:25815/api/v1/cli/profile2
   ```

3. **Profile3 (ohada.save3@gmail.com):**
   ```
   http://127.0.0.1:25815/api/v1/cli/profile3
   ```

**Tous utilisent le même format:**
- Credential: OpenAI account
- API Key: `dummy`
- Model: `gemini-2.5-flash` ou `auto`

---

## 🎯 Exemple d'Utilisation Multiple

Vous pouvez créer plusieurs credentials n8n:

### Credential 1: "Gemini Load Balancer"
```
Base URL: http://127.0.0.1:25815/api/v1/cli
```
Pour vos workflows de production

### Credential 2: "Gemini Profile2"
```
Base URL: http://127.0.0.1:25815/api/v1/cli/profile2
```
Pour vos workflows de test

### Credential 3: "Gemini Profile3"
```
Base URL: http://127.0.0.1:25815/api/v1/cli/profile3
```
Pour vos workflows de développement

---

**Commande:** `npm run multi-cli`  
**Port:** 25815  
**Profils actifs:** 2 (profile2, profile3)  
**Status:** ✅ Tous les endpoints opérationnels!
