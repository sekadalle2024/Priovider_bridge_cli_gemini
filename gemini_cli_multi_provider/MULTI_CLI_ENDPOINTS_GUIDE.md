# 🚀 Multi-Endpoints Gemini CLI - Guide Complet

## 🎯 Objectif

Créer des endpoints séparés pour chaque compte Google avec Gemini CLI, permettant de multiplier les quotas disponibles.

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Load Balancer / Router                     │
│              Port: 25810                                │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
        ▼            ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ CLI Account1 │ │ CLI Account2 │ │ CLI Account3 │ │ CLI Account4 │
│ Port: 25811  │ │ Port: 25812  │ │ Port: 25813  │ │ Port: 25814  │
│ Profile 1    │ │ Profile 2    │ │ Profile 3    │ │ Profile 4    │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## 🔧 Étape 1: Configuration des Profils Gemini CLI

### 1.1 Créer les Profils

```bash
# Profil 1 - ohada.finance@gmail.com
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile1"
gemini auth login
# Se connecter avec ohada.finance@gmail.com

# Profil 2 - ohada.save@gmail.com
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile2"
gemini auth login
# Se connecter avec ohada.save@gmail.com

# Profil 3 - ohada.save2@gmail.com
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile3"
gemini auth login
# Se connecter avec ohada.save2@gmail.com

# Profil 4 - autre compte (si disponible)
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile4"
gemini auth login
# Se connecter avec un autre compte
```

### 1.2 Vérifier les Profils

```bash
# Vérifier profil 1
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile1"
gemini --version

# Vérifier profil 2
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile2"
gemini --version

# etc.
```

## 📝 Étape 2: Créer les Services Multi-CLI

### 2.1 Service de Gestion des Profils

Créer `src/webserver/services/MultiGeminiCliService.ts`

### 2.2 Routes pour Chaque Profil

Créer `src/webserver/routes/multiGeminiCliRoutes.ts`

### 2.3 Load Balancer

Créer `src/webserver/services/GeminiCliLoadBalancer.ts`

## 🌐 Endpoints Disponibles

### Endpoint Principal (Load Balancer)

```
POST http://localhost:25810/api/v1/chat/completions
```

**Rotation automatique entre tous les profils**

### Endpoints par Profil

```
POST http://localhost:25810/api/v1/cli/profile1/chat
POST http://localhost:25810/api/v1/cli/profile2/chat
POST http://localhost:25810/api/v1/cli/profile3/chat
POST http://localhost:25810/api/v1/cli/profile4/chat
```

**Utilisation d'un profil spécifique**

### Endpoint de Statut

```
GET http://localhost:25810/api/v1/cli/profiles
GET http://localhost:25810/api/v1/cli/profiles/profile1/status
```

## 📊 Quotas Totaux

Avec 4 comptes Gemini CLI:

| Métrique | 1 Compte | 4 Comptes |
|----------|----------|-----------|
| Requêtes/minute | ~15-60 | ~60-240 |
| Tokens/jour | ~1-2M | ~4-8M |
| Multiplier | 1x | 4x |

## 🚀 Démarrage

### Commande Simple

```bash
npm run multi-cli
```

### Commande Détaillée

```bash
node scripts/start-multi-cli-server.js
```

## 📋 Configuration .env

```env
# Multi-CLI Configuration
MULTI_CLI_ENABLED=true
MULTI_CLI_PROFILES=profile1,profile2,profile3,profile4

# Profil 1
CLI_PROFILE1_HOME=~/.gemini-profile1
CLI_PROFILE1_PORT=25811
CLI_PROFILE1_ACCOUNT=ohada.finance@gmail.com

# Profil 2
CLI_PROFILE2_HOME=~/.gemini-profile2
CLI_PROFILE2_PORT=25812
CLI_PROFILE2_ACCOUNT=ohada.save@gmail.com

# Profil 3
CLI_PROFILE3_HOME=~/.gemini-profile3
CLI_PROFILE3_PORT=25813
CLI_PROFILE3_ACCOUNT=ohada.save2@gmail.com

# Profil 4
CLI_PROFILE4_HOME=~/.gemini-profile4
CLI_PROFILE4_PORT=25814
CLI_PROFILE4_ACCOUNT=autre-compte@gmail.com

# Load Balancer
CLI_LOAD_BALANCER_STRATEGY=round-robin
# Options: round-robin, least-loaded, random, weighted
```

## 🧪 Tests

### Test du Load Balancer

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Test d'un Profil Spécifique

```bash
curl -X POST http://localhost:25810/api/v1/cli/profile1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Hello from profile 1"}]
  }'
```

### Test du Statut

```bash
curl http://localhost:25810/api/v1/cli/profiles
```

## 📚 Documentation Swagger

Accéder à: `http://localhost:25810/api-docs`

Nouvelles sections:
- `/api/v1/cli/profiles` - Liste des profils
- `/api/v1/cli/{profile}/chat` - Chat par profil
- `/api/v1/cli/{profile}/status` - Statut d'un profil

## 🔄 Stratégies de Load Balancing

### 1. Round Robin (Par Défaut)

Rotation séquentielle entre les profils.

```
Requête 1 → Profile 1
Requête 2 → Profile 2
Requête 3 → Profile 3
Requête 4 → Profile 4
Requête 5 → Profile 1
...
```

### 2. Least Loaded

Utilise le profil le moins chargé.

```
Profile 1: 5 requêtes en cours
Profile 2: 2 requêtes en cours ← Sélectionné
Profile 3: 8 requêtes en cours
Profile 4: 3 requêtes en cours
```

### 3. Weighted

Poids différents selon les comptes.

```
Profile 1: 40% (compte premium)
Profile 2: 30%
Profile 3: 20%
Profile 4: 10%
```

### 4. Random

Sélection aléatoire.

## 🎯 Cas d'Usage

### Cas 1: Volume Élevé

```javascript
// Utiliser le load balancer pour distribuer la charge
for (let i = 0; i < 1000; i++) {
  await fetch('http://localhost:25810/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: `Request ${i}` }]
    })
  });
}
```

### Cas 2: Profil Spécifique

```javascript
// Utiliser un compte spécifique pour une tâche
await fetch('http://localhost:25810/api/v1/cli/profile1/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemini-2.5-pro',
    messages: [{ role: 'user', content: 'Important task' }]
  })
});
```

### Cas 3: Failover

```javascript
// Si un profil échoue, essayer le suivant
const profiles = ['profile1', 'profile2', 'profile3', 'profile4'];

for (const profile of profiles) {
  try {
    const response = await fetch(
      `http://localhost:25810/api/v1/cli/${profile}/chat`,
      { /* ... */ }
    );
    if (response.ok) break;
  } catch (error) {
    console.log(`Profile ${profile} failed, trying next...`);
  }
}
```

## 🔧 Maintenance

### Ajouter un Nouveau Profil

1. Créer le profil:
```bash
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile5"
gemini auth login
```

2. Ajouter dans `.env`:
```env
CLI_PROFILE5_HOME=~/.gemini-profile5
CLI_PROFILE5_PORT=25815
CLI_PROFILE5_ACCOUNT=nouveau-compte@gmail.com
```

3. Redémarrer le serveur:
```bash
npm run multi-cli
```

### Désactiver un Profil

Dans `.env`:
```env
CLI_PROFILE2_ENABLED=false
```

### Monitorer les Profils

```bash
# Voir les statistiques
curl http://localhost:25810/api/v1/cli/profiles/stats

# Voir un profil spécifique
curl http://localhost:25810/api/v1/cli/profiles/profile1/stats
```

## 📊 Monitoring et Logs

### Logs par Profil

```
logs/
  ├── cli-profile1.log
  ├── cli-profile2.log
  ├── cli-profile3.log
  └── cli-profile4.log
```

### Métriques

```javascript
{
  "profile1": {
    "requests": 1250,
    "errors": 5,
    "avgResponseTime": 850,
    "quotaUsed": "45%"
  },
  "profile2": {
    "requests": 980,
    "errors": 2,
    "avgResponseTime": 920,
    "quotaUsed": "38%"
  }
}
```

## 🚨 Gestion des Erreurs

### Quota Dépassé

```javascript
{
  "error": "quota_exceeded",
  "profile": "profile1",
  "message": "Quota exceeded for profile1",
  "fallback": "profile2",
  "retryAfter": 3600
}
```

### Profil Indisponible

```javascript
{
  "error": "profile_unavailable",
  "profile": "profile3",
  "message": "Profile3 is currently unavailable",
  "availableProfiles": ["profile1", "profile2", "profile4"]
}
```

## 🎯 Avantages

✅ **Quotas Multipliés** - 4x plus de requêtes et tokens  
✅ **Haute Disponibilité** - Failover automatique  
✅ **Load Balancing** - Distribution intelligente  
✅ **Isolation** - Chaque compte est indépendant  
✅ **Flexibilité** - Choisir le profil selon le besoin  
✅ **Monitoring** - Statistiques par profil  

## ⚠️ Limitations

⚠️ **Complexité** - Plus de comptes = plus de maintenance  
⚠️ **Coût** - Nécessite plusieurs comptes Google  
⚠️ **Synchronisation** - Pas de partage d'état entre profils  

## 🔐 Sécurité

### Isolation des Credentials

Chaque profil a ses propres credentials dans:
```
~/.gemini-profile1/oauth_creds.json
~/.gemini-profile2/oauth_creds.json
~/.gemini-profile3/oauth_creds.json
~/.gemini-profile4/oauth_creds.json
```

### Permissions

Chaque compte peut avoir des permissions différentes.

## 📞 Support

### Problème: Profil ne répond pas

```bash
# Vérifier le profil
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile1"
gemini --version

# Réauthentifier si nécessaire
gemini auth login
```

### Problème: Load balancer ne distribue pas

```bash
# Vérifier les profils actifs
curl http://localhost:25810/api/v1/cli/profiles

# Redémarrer le serveur
npm run multi-cli
```

## 🎉 Résumé

Avec cette configuration, vous aurez:

- ✅ 4 endpoints Gemini CLI indépendants
- ✅ Load balancer automatique
- ✅ Quotas multipliés par 4
- ✅ Failover automatique
- ✅ Monitoring complet
- ✅ API REST compatible OpenAI

**Prochaine étape:** Implémenter les fichiers de code!
