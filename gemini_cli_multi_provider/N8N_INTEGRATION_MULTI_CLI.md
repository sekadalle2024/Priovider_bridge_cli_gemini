# 🔗 Intégration n8n - Multi-CLI Gemini

## 🚀 Démarrage du Serveur

### Commande
```bash
npm run multi-cli
```

Le serveur démarre sur le port **25815**

## 📡 URLs de Base pour n8n

### Serveur Multi-CLI
```
http://127.0.0.1:25815
```
**Note:** Utilisez `127.0.0.1` au lieu de `localhost` si nécessaire

### Endpoints OpenAI Compatibles

#### 1. Load Balancer (Round-Robin automatique) ✅ Recommandé
```
Base URL: http://127.0.0.1:25815/api/v1/cli
Endpoint: POST /chat
URL complète: http://127.0.0.1:25815/api/v1/cli/chat
```
Distribution automatique entre profile2 et profile3

#### 2. Profile2 - ohada.save@gmail.com ✅
```
Base URL: http://127.0.0.1:25815/api/v1/cli/profile2
Endpoint: POST /chat
URL complète: http://127.0.0.1:25815/api/v1/cli/profile2/chat
```

#### 3. Profile3 - ohada.save3@gmail.com ✅
```
Base URL: http://127.0.0.1:25815/api/v1/cli/profile3
Endpoint: POST /chat
URL complète: http://127.0.0.1:25815/api/v1/cli/profile3/chat
```

## 🔧 Configuration n8n

### Option 1: HTTP Request Node (Recommandé)

#### Configuration
- **Method:** POST
- **URL:** `http://127.0.0.1:25815/api/v1/cli/chat` (ou profile2/chat, profile3/chat)
- **Authentication:** None
- **Body Content Type:** JSON

#### Body (JSON)
```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "Votre message ici"
    }
  ]
}
```

#### Exemple avec Expression n8n
```json
{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ]
}
```

### Option 2: OpenAI Node (Expérimental)

#### Configuration
- **Resource:** Chat
- **Operation:** Create
- **Base URL:** `http://127.0.0.1:25815/api/v1/cli`
- **API Key:** `dummy` (non utilisé mais requis par n8n)
- **Model:** `gemini-2.5-flash`

**Note:** Cette option peut ne pas fonctionner car n8n ajoute `/v1/chat/completions` à la base URL

## 📋 Exemples de Requêtes

### cURL - Load Balancer
```bash
curl -X POST http://localhost:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour"}
    ]
  }'
```

### cURL - Profile2 Spécifique
```bash
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {"role": "user", "content": "Bonjour depuis profile2"}
    ]
  }'
```

### JavaScript/Node.js
```javascript
const response = await fetch('http://localhost:25815/api/v1/cli/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemini-2.5-flash',
    messages: [
      { role: 'user', content: 'Bonjour' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

## 🎯 Workflow n8n Recommandé

### Workflow Simple
```
[Webhook/Trigger] 
    ↓
[HTTP Request]
  Method: POST
  URL: http://localhost:25815/api/v1/cli/chat
  Body: {
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "{{ $json.prompt }}"}]
  }
    ↓
[Code/Transform]
  Extraire: data.choices[0].message.content
    ↓
[Output]
```

### Workflow avec Profil Spécifique
```
[Webhook/Trigger] 
    ↓
[HTTP Request - Profile2]
  URL: http://localhost:25815/api/v1/cli/profile2/chat
    ↓
[HTTP Request - Profile3] (Fallback)
  URL: http://localhost:25815/api/v1/cli/profile3/chat
    ↓
[Output]
```

## 📊 Modèles Disponibles

```
gemini-2.5-flash      (Recommandé - Rapide)
gemini-2.5-pro        (Plus puissant)
gemini-2.0-flash      (Ancien)
gemini-1.5-flash      (Ancien)
gemini-1.5-pro        (Ancien)
```

## 🔍 Endpoints de Gestion

### Liste des Profils
```
GET http://localhost:25815/api/v1/cli/profiles
```

### Statistiques
```
GET http://localhost:25815/api/v1/cli/profiles/stats
```

### Health Check
```
GET http://localhost:25815/health
```

### Documentation Swagger
```
GET http://localhost:25815/api-docs
```

## ⚠️ Notes Importantes

### Profile4 (ohada.save12@gmail.com)
- **Status:** Authentifié mais timeout
- **Problème:** La commande Gemini CLI tourne indéfiniment (20+ minutes)
- **Solution:** Utiliser profile2 ou profile3 uniquement
- **Recommandation:** Désactiver profile4 dans `.env`

### Profils Fonctionnels
- ✅ **Profile2** (ohada.save@gmail.com) - Fonctionne parfaitement
- ✅ **Profile3** (ohada.save3@gmail.com) - Fonctionne parfaitement
- ❌ **Profile4** (ohada.save12@gmail.com) - Timeout

### Load Balancer
Le load balancer distribue automatiquement entre les profils disponibles (actuellement profile2 et profile3)

## 🚀 Démarrage Rapide

### 1. Démarrer le Serveur
```bash
npm run multi-cli
```

### 2. Vérifier que le Serveur Tourne
```bash
curl http://localhost:25815/health
```

### 3. Tester un Endpoint
```bash
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Test"}]}'
```

### 4. Configurer n8n
- Créer un nœud HTTP Request
- URL: `http://localhost:25815/api/v1/cli/chat`
- Method: POST
- Body: Format JSON ci-dessus

## 📚 Documentation Complète

- **Swagger UI:** http://localhost:25815/api-docs
- **Guide Multi-CLI:** `gemini_cli_multi_provider/00_LIRE_EN_PREMIER.md`
- **État des Profils:** `gemini_cli_multi_provider/ETAT_FINAL_PROFILES.md`

## 🔧 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier si le port est déjà utilisé
netstat -ano | findstr :25815

# Arrêter le processus si nécessaire
taskkill /PID <PID> /F

# Redémarrer
npm run multi-cli
```

### Profile4 timeout
```bash
# Désactiver profile4 dans .env
CLI_PROFILE4_ENABLED=false
MULTI_CLI_PROFILES=profile2,profile3

# Redémarrer le serveur
npm run multi-cli
```

### Tester les profils
```bash
node scripts/test-all-profiles.js
```

---

**Serveur:** http://localhost:25815  
**Commande:** `npm run multi-cli`  
**Profils actifs:** profile2, profile3  
**Format:** OpenAI Compatible
