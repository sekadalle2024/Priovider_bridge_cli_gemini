# 🎉 Serveur Multi-CLI Gemini - Configuration Finale

## ✅ Status: OPÉRATIONNEL - 2 PROFILS ACTIFS

Le serveur Multi-CLI Gemini est maintenant **pleinement opérationnel** avec 2 comptes Google authentifiés!

## 📊 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│         Serveur Multi-CLI Gemini (Port 25815)               │
│                                                             │
│  Load Balancer (Round-Robin)                                │
│         ↓                    ↓                              │
│    Profile 2            Profile 3                           │
│  ohada.save@           ohada.save3@                         │
│  gmail.com             gmail.com                            │
│  Port 25812            Port 25813                           │
│  ✅ Actif              ✅ Actif                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuration

### Profils Configurés

| # | Profil | Compte | Status | Port |
|---|--------|--------|--------|------|
| 1 | profile1 | ohada.finance@gmail.com | ⏸️ Désactivé | 25811 |
| 2 | profile2 | ohada.save@gmail.com | ✅ Actif | 25812 |
| 3 | profile3 | ohada.save3@gmail.com | ✅ Actif | 25813 |

### Serveur

- **Port**: 25815
- **Profils actifs**: 2
- **Load Balancer**: Round-robin
- **Failover**: Automatique
- **Status**: ✅ En ligne

## 🚀 Démarrage Rapide

### 1. Démarrer le Serveur

```bash
npm run multi-cli
```

### 2. Tester les Endpoints

```bash
# Liste des profils
curl http://localhost:25815/api/v1/cli/profiles

# Chat avec load balancer
curl -X POST http://localhost:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Bonjour!"}]}'

# Chat avec profile2
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

# Chat avec profile3
curl -X POST http://localhost:25815/api/v1/cli/profile3/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi"}]}'

# Statistiques
curl http://localhost:25815/api/v1/cli/profiles/stats
```

## 📡 Endpoints Disponibles

### Load Balancer
```
POST http://localhost:25815/api/v1/cli/chat
```
Distribution automatique entre profile2 et profile3

### Profils Spécifiques
```
POST http://localhost:25815/api/v1/cli/profile2/chat
POST http://localhost:25815/api/v1/cli/profile3/chat
```

### Gestion
```
GET  http://localhost:25815/api/v1/cli/profiles
GET  http://localhost:25815/api/v1/cli/profiles/stats
GET  http://localhost:25815/api/v1/cli/profiles/{profileId}
POST http://localhost:25815/api/v1/cli/profiles/{profileId}/enable
POST http://localhost:25815/api/v1/cli/profiles/{profileId}/disable
GET  http://localhost:25815/health
```

## 📊 Quotas et Performance

### Quotas Multipliés

| Métrique | 1 Profil | 2 Profils | Gain |
|----------|----------|-----------|------|
| Requêtes/minute | 15-60 | 30-120 | **2x** |
| Tokens/jour | 1-2M | 2-4M | **2x** |
| Disponibilité | 1 point | 2 points | **Haute** |

### Load Balancing

Le serveur distribue automatiquement les requêtes en mode round-robin:

```
Requête 1 → Profile 2
Requête 2 → Profile 3
Requête 3 → Profile 2
Requête 4 → Profile 3
...
```

### Failover Automatique

Si un profil échoue, le serveur réessaie automatiquement avec un autre profil:

```
Requête → Profile 2 (erreur) → Profile 3 (succès)
```

## 💻 Exemples d'Utilisation

### JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:25815/api/v1/cli/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemini-2.5-flash',
    messages: [
      { role: 'user', content: 'Explique-moi les promesses en JavaScript' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:25815/api/v1/cli/chat',
    json={
        'model': 'gemini-2.5-flash',
        'messages': [
            {'role': 'user', 'content': 'Bonjour!'}
        ]
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
```

### PowerShell

```powershell
$response = Invoke-RestMethod -Uri http://localhost:25815/api/v1/cli/chat `
  -Method Post `
  -Body (@{
    model = "gemini-2.5-flash"
    messages = @(@{role="user"; content="Bonjour!"})
  } | ConvertTo-Json -Depth 5) `
  -ContentType "application/json"

$response.choices[0].message.content
```

## 🔍 Monitoring

### Voir les Statistiques

```bash
curl http://localhost:25815/api/v1/cli/profiles/stats
```

Réponse:
```json
{
  "success": true,
  "stats": {
    "profile2": {
      "requests": 150,
      "errors": 2,
      "avgResponseTime": 850,
      "lastUsed": "2026-03-07T14:30:00.000Z",
      "isAvailable": true
    },
    "profile3": {
      "requests": 145,
      "errors": 0,
      "avgResponseTime": 920,
      "lastUsed": "2026-03-07T14:29:55.000Z",
      "isAvailable": true
    }
  }
}
```

## 🛠️ Gestion des Profils

### Désactiver un Profil

```bash
curl -X POST http://localhost:25815/api/v1/cli/profiles/profile2/disable
```

### Réactiver un Profil

```bash
curl -X POST http://localhost:25815/api/v1/cli/profiles/profile2/enable
```

## 📝 Configuration .env

```env
# Multi-CLI Configuration
MULTI_CLI_ENABLED=true
MULTI_CLI_PROFILES=profile2,profile3
CLI_LOAD_BALANCER_STRATEGY=round-robin

# Profile 2 - ohada.save@gmail.com
CLI_PROFILE2_HOME=~/.gemini-profile2
CLI_PROFILE2_PORT=25812
CLI_PROFILE2_ACCOUNT=ohada.save@gmail.com
CLI_PROFILE2_ENABLED=true

# Profile 3 - ohada.save3@gmail.com
CLI_PROFILE3_HOME=~/.gemini-profile3
CLI_PROFILE3_PORT=25813
CLI_PROFILE3_ACCOUNT=ohada.save3@gmail.com
CLI_PROFILE3_ENABLED=true

# Port du serveur Multi-CLI
MULTI_CLI_PORT=25815
```

## 🔄 Workflow Complet

1. **Démarrage**: `npm run multi-cli`
2. **Requête entrante**: Client envoie une requête au load balancer
3. **Sélection**: Le serveur sélectionne un profil (round-robin)
4. **Exécution**: Gemini CLI exécute la requête avec le profil sélectionné
5. **Réponse**: Le serveur retourne la réponse au client
6. **Statistiques**: Le serveur met à jour les statistiques du profil

## 🎯 Cas d'Usage

### 1. Application Web

Intégrez le serveur Multi-CLI dans votre application web pour bénéficier de quotas multipliés:

```javascript
// Frontend
async function chat(message) {
  const response = await fetch('http://localhost:25815/api/v1/cli/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }]
    })
  });
  return await response.json();
}
```

### 2. Automation avec n8n

Utilisez le serveur Multi-CLI dans vos workflows n8n:

1. Créer un nœud HTTP Request
2. URL: `http://localhost:25815/api/v1/cli/chat`
3. Méthode: POST
4. Body: Format OpenAI

### 3. Scripts Batch

Exécutez des scripts batch avec des quotas multipliés:

```bash
#!/bin/bash
for i in {1..100}; do
  curl -X POST http://localhost:25815/api/v1/cli/chat \
    -H "Content-Type: application/json" \
    -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Question $i\"}]}"
done
```

## 📚 Documentation Complète

- **[MULTI_CLI_QUICK_START.md](MULTI_CLI_QUICK_START.md)** - Guide de démarrage rapide
- **[MULTI_CLI_ENDPOINTS_GUIDE.md](MULTI_CLI_ENDPOINTS_GUIDE.md)** - Guide complet des endpoints
- **[MULTI_CLI_ACTIVATION_COMPLETE.md](MULTI_CLI_ACTIVATION_COMPLETE.md)** - Configuration complète
- **[AUTH_PROFILE2_SUCCESS.md](AUTH_PROFILE2_SUCCESS.md)** - Authentification profile2
- **[AUTH_PROFILE3_SUCCESS.md](AUTH_PROFILE3_SUCCESS.md)** - Authentification profile3
- **[MULTI_COMPTES_GEMINI_CLI.md](MULTI_COMPTES_GEMINI_CLI.md)** - Comparaison API Keys vs CLI

## 🔧 Dépannage

### Problème: "No available profiles"

**Solution**: Vérifier que les profils sont activés dans `.env`

```bash
MULTI_CLI_PROFILES=profile2,profile3
CLI_PROFILE2_ENABLED=true
CLI_PROFILE3_ENABLED=true
```

### Problème: "Profile not found"

**Solution**: Vérifier l'authentification du profil

```powershell
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile2"
gemini --version
```

### Problème: Serveur ne démarre pas

**Solution**: Vérifier que le port 25815 est disponible

```bash
netstat -ano | findstr :25815
```

## ✅ Checklist de Vérification

- [x] Profile2 authentifié (ohada.save@gmail.com)
- [x] Profile3 authentifié (ohada.save3@gmail.com)
- [x] Configuration `.env` mise à jour
- [x] Serveur Multi-CLI démarré
- [x] Endpoints testés et fonctionnels
- [x] Load balancer opérationnel
- [x] Statistiques disponibles
- [x] Documentation complète

## 🎉 Résumé

Vous disposez maintenant d'un serveur Multi-CLI Gemini pleinement opérationnel avec:

✅ 2 comptes Google authentifiés  
✅ Quotas multipliés par 2  
✅ Load balancing automatique  
✅ Haute disponibilité avec failover  
✅ API REST compatible OpenAI  
✅ Statistiques en temps réel  
✅ Documentation complète  

**Prochaine étape**: Intégrer avec votre application, n8n, ou LangChain!

---

**Date**: 2026-03-07  
**Status**: ✅ OPÉRATIONNEL  
**Profils actifs**: 2 (profile2, profile3)  
**Port**: 25815  
**Quotas**: 2x  
**Disponibilité**: Haute

