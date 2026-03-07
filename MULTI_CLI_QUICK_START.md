# 🚀 Démarrage Rapide - Multi-CLI Gemini

Guide rapide pour configurer et utiliser plusieurs comptes Google avec Gemini CLI.

## 📋 Prérequis

- ✅ Node.js v22+ installé
- ✅ Gemini CLI v0.32.1 installé (`npm install -g @google/generative-ai-cli`)
- ✅ Plusieurs comptes Google disponibles
- ✅ Projet compilé (`npm run build`)

## 🔧 Étape 1: Configuration des Profils (5 min)

### Option A: Configuration Automatique (Recommandé)

```powershell
npm run setup:multi-cli
```

Le script vous guidera pour:
1. Choisir le nombre de comptes (1-10)
2. Entrer l'email de chaque compte
3. Authentifier chaque compte via le navigateur
4. Générer automatiquement la configuration `.env`

### Option B: Configuration Manuelle

1. **Créer les profils manuellement:**

```powershell
# Profil 1
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile1"
gemini auth login
# → Se connecter avec ohada.finance@gmail.com

# Profil 2
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile2"
gemini auth login
# → Se connecter avec ohada.save@gmail.com

# Profil 3
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile3"
gemini auth login
# → Se connecter avec ohada.save2@gmail.com
```

2. **Ajouter dans `.env`:**

```env
# Multi-CLI Configuration
MULTI_CLI_ENABLED=true
MULTI_CLI_PROFILES=profile1,profile2,profile3

# Profil 1
CLI_PROFILE1_HOME=~/.gemini-profile1
CLI_PROFILE1_PORT=25811
CLI_PROFILE1_ACCOUNT=ohada.finance@gmail.com
CLI_PROFILE1_ENABLED=true

# Profil 2
CLI_PROFILE2_HOME=~/.gemini-profile2
CLI_PROFILE2_PORT=25812
CLI_PROFILE2_ACCOUNT=ohada.save@gmail.com
CLI_PROFILE2_ENABLED=true

# Profil 3
CLI_PROFILE3_HOME=~/.gemini-profile3
CLI_PROFILE3_PORT=25813
CLI_PROFILE3_ACCOUNT=ohada.save2@gmail.com
CLI_PROFILE3_ENABLED=true

# Load Balancer
CLI_LOAD_BALANCER_STRATEGY=round-robin
```

## 🚀 Étape 2: Démarrer le Serveur (1 min)

```bash
npm run multi-cli
```

Vous verrez:
```
🚀 Démarrage du serveur Multi-CLI Gemini...

📋 Profils configurés: profile1, profile2, profile3
  ✅ profile1: ohada.finance@gmail.com
  ✅ profile2: ohada.save@gmail.com
  ✅ profile3: ohada.save2@gmail.com

🎉 Serveur Multi-CLI Gemini démarré!

📡 Endpoints disponibles:
  POST http://localhost:25810/api/v1/cli/chat
  POST http://localhost:25810/api/v1/cli/profile1/chat
  POST http://localhost:25810/api/v1/cli/profile2/chat
  POST http://localhost:25810/api/v1/cli/profile3/chat
```

## 🧪 Étape 3: Tester (2 min)

### Test Automatique

```bash
npm run test:multi-cli
```

### Test Manuel

**1. Vérifier les profils:**
```bash
curl http://localhost:25810/api/v1/cli/profiles
```

**2. Chat avec load balancer:**
```bash
curl -X POST http://localhost:25810/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

**3. Chat avec un profil spécifique:**
```bash
curl -X POST http://localhost:25810/api/v1/cli/profile1/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Hello from profile 1"}]
  }'
```

## 📊 Utilisation

### Load Balancing Automatique

Le serveur distribue automatiquement les requêtes entre tous les profils disponibles:

```javascript
// Requête 1 → Profile 1
// Requête 2 → Profile 2
// Requête 3 → Profile 3
// Requête 4 → Profile 1
// ...
```

**Endpoint:** `POST /api/v1/cli/chat`

### Profil Spécifique

Pour utiliser un compte particulier:

**Endpoint:** `POST /api/v1/cli/{profileId}/chat`

Exemples:
- `/api/v1/cli/profile1/chat` → ohada.finance@gmail.com
- `/api/v1/cli/profile2/chat` → ohada.save@gmail.com
- `/api/v1/cli/profile3/chat` → ohada.save2@gmail.com

### Statistiques

Voir l'utilisation de chaque profil:

```bash
curl http://localhost:25810/api/v1/cli/profiles/stats
```

Réponse:
```json
{
  "success": true,
  "stats": {
    "profile1": {
      "requests": 150,
      "errors": 2,
      "avgResponseTime": 850,
      "lastUsed": "2026-03-07T10:30:00.000Z",
      "isAvailable": true
    },
    "profile2": {
      "requests": 145,
      "errors": 0,
      "avgResponseTime": 920,
      "lastUsed": "2026-03-07T10:29:55.000Z",
      "isAvailable": true
    }
  }
}
```

## 🎯 Avantages

Avec 3 profils configurés:

| Métrique | 1 Compte | 3 Comptes | Gain |
|----------|----------|-----------|------|
| Requêtes/minute | ~15-60 | ~45-180 | 3x |
| Tokens/jour | ~1-2M | ~3-6M | 3x |
| Disponibilité | 1 point | 3 points | Haute |

## 🔄 Stratégies de Load Balancing

Configurer dans `.env`:

```env
CLI_LOAD_BALANCER_STRATEGY=round-robin
```

Options disponibles:
- `round-robin` (défaut) - Rotation séquentielle
- `least-loaded` - Profil le moins chargé
- `random` - Sélection aléatoire

## 🛠️ Gestion des Profils

### Désactiver un profil temporairement

```bash
curl -X POST http://localhost:25810/api/v1/cli/profiles/profile2/disable
```

### Réactiver un profil

```bash
curl -X POST http://localhost:25810/api/v1/cli/profiles/profile2/enable
```

### Ajouter un nouveau profil

1. Créer le profil:
```powershell
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile4"
gemini auth login
```

2. Ajouter dans `.env`:
```env
MULTI_CLI_PROFILES=profile1,profile2,profile3,profile4

CLI_PROFILE4_HOME=~/.gemini-profile4
CLI_PROFILE4_PORT=25814
CLI_PROFILE4_ACCOUNT=nouveau-compte@gmail.com
CLI_PROFILE4_ENABLED=true
```

3. Redémarrer:
```bash
npm run multi-cli
```

## 🐛 Dépannage

### Problème: "No available profiles"

**Solution:** Vérifier que les profils sont configurés dans `.env`

```bash
# Vérifier les variables d'environnement
echo $env:MULTI_CLI_PROFILES
```

### Problème: "Profile not found"

**Solution:** Vérifier l'authentification du profil

```powershell
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile1"
gemini --version
```

Si erreur, réauthentifier:
```powershell
gemini auth login
```

### Problème: "Gemini CLI failed"

**Solution:** Tester le profil manuellement

```powershell
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile1"
gemini -m gemini-2.5-flash --prompt "Test"
```

### Problème: Routes non chargées

**Solution:** Compiler le projet

```bash
npm run build
```

## 📚 Documentation Complète

Pour plus de détails, voir:
- `MULTI_CLI_ENDPOINTS_GUIDE.md` - Guide complet
- `MULTI_COMPTES_GEMINI_CLI.md` - Comparaison API Keys vs CLI

## 💡 Exemples d'Utilisation

### JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:25810/api/v1/cli/chat', {
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
    'http://localhost:25810/api/v1/cli/chat',
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

### cURL

```bash
curl -X POST http://localhost:25810/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Quelle est la capitale de la France?"}
    ]
  }'
```

## 🎉 Résumé

Vous avez maintenant:
- ✅ Plusieurs profils Gemini CLI configurés
- ✅ Load balancer automatique fonctionnel
- ✅ Quotas multipliés (3x, 4x, etc.)
- ✅ Haute disponibilité avec failover
- ✅ API REST compatible OpenAI

**Temps total de configuration:** ~10 minutes

**Prochaine étape:** Intégrer avec n8n, LangChain, ou votre application!
