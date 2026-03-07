# 📚 Documentation Swagger - Multi-CLI Gemini API

## ✅ Documentation Interactive Disponible!

La documentation Swagger UI est maintenant accessible pour tester tous les endpoints de l'API Multi-CLI Gemini.

## 🌐 URL de la Documentation

```
http://localhost:25815/api-docs
```

## 🚀 Accès Rapide

Ouvrez votre navigateur et accédez à:

**http://localhost:25815/api-docs**

## 📋 Fonctionnalités de Swagger UI

### 1. Documentation Interactive

- **Visualisation complète** de tous les endpoints
- **Schémas de données** détaillés
- **Exemples de requêtes** et réponses
- **Codes d'erreur** documentés

### 2. Test en Direct

- **Try it out** - Testez les endpoints directement depuis le navigateur
- **Exécution en temps réel** - Voir les réponses immédiatement
- **Copier les commandes cURL** - Pour utiliser dans votre terminal

### 3. Endpoints Documentés

#### Chat Endpoints

**Load Balancer (Distribution Automatique)**
```
POST /api/v1/cli/chat
```
Distribution automatique entre profile2 et profile3

**Profile 2 (ohada.save@gmail.com)**
```
POST /api/v1/cli/profile2/chat
```
Utilise spécifiquement le compte ohada.save@gmail.com

**Profile 3 (ohada.save3@gmail.com)**
```
POST /api/v1/cli/profile3/chat
```
Utilise spécifiquement le compte ohada.save3@gmail.com

#### Gestion des Profils

**Liste des profils**
```
GET /api/v1/cli/profiles
```

**Détails d'un profil**
```
GET /api/v1/cli/profiles/{profileId}
```

**Statistiques de tous les profils**
```
GET /api/v1/cli/profiles/stats
```

**Activer un profil**
```
POST /api/v1/cli/profiles/{profileId}/enable
```

**Désactiver un profil**
```
POST /api/v1/cli/profiles/{profileId}/disable
```

#### Health Check

**Vérifier l'état du serveur**
```
GET /health
```

## 🧪 Comment Tester avec Swagger UI

### 1. Ouvrir Swagger UI

Accédez à http://localhost:25815/api-docs dans votre navigateur

### 2. Tester un Endpoint

1. Cliquez sur l'endpoint que vous voulez tester (ex: `POST /api/v1/cli/profile2/chat`)
2. Cliquez sur **"Try it out"**
3. Modifiez le corps de la requête si nécessaire:
   ```json
   {
     "model": "gemini-2.5-flash",
     "messages": [
       {
         "role": "user",
         "content": "Bonjour depuis Swagger!"
       }
     ]
   }
   ```
4. Cliquez sur **"Execute"**
5. Voir la réponse en temps réel

### 3. Copier la Commande cURL

Après l'exécution, Swagger UI génère automatiquement la commande cURL que vous pouvez copier et utiliser dans votre terminal.

## 📊 Exemples de Requêtes

### Chat Simple - Profile 2

```json
POST /api/v1/cli/profile2/chat

{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "Quelle est la capitale de la France?"
    }
  ]
}
```

### Conversation - Profile 3

```json
POST /api/v1/cli/profile3/chat

{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "Bonjour"
    },
    {
      "role": "assistant",
      "content": "Bonjour! Comment puis-je vous aider?"
    },
    {
      "role": "user",
      "content": "Explique-moi les promesses en JavaScript"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

### Load Balancer

```json
POST /api/v1/cli/chat

{
  "model": "gemini-2.5-flash",
  "messages": [
    {
      "role": "user",
      "content": "Test du load balancer"
    }
  ]
}
```

## 🔍 Schémas de Données

### ChatRequest

```typescript
{
  model?: string;              // Modèle Gemini (défaut: gemini-2.5-flash)
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;        // 0-2 (défaut: 0.7)
  max_tokens?: number;         // Nombre max de tokens (défaut: 1000)
}
```

### ChatResponse

```typescript
{
  id: string;                  // ID unique de la réponse
  object: 'chat.completion';
  created: number;             // Timestamp
  model: string;               // Modèle utilisé
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: 'stop' | 'length' | 'error';
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

## 🎯 Modèles Disponibles

- `gemini-2.5-flash` (défaut)
- `gemini-2.5-pro`
- `gemini-2.0-flash`
- `gemini-1.5-flash`
- `gemini-1.5-pro`

## 📱 Captures d'Écran

### Interface Swagger UI

L'interface Swagger UI affiche:
- Liste de tous les endpoints organisés par tags
- Documentation détaillée de chaque endpoint
- Schémas de données interactifs
- Bouton "Try it out" pour tester en direct
- Exemples de requêtes et réponses

## 🔗 Liens Utiles

### Documentation
- **Swagger UI**: http://localhost:25815/api-docs
- **Health Check**: http://localhost:25815/health
- **Liste des profils**: http://localhost:25815/api/v1/cli/profiles

### Endpoints de Chat
- **Profile 2**: http://localhost:25815/api/v1/cli/profile2/chat
- **Profile 3**: http://localhost:25815/api/v1/cli/profile3/chat
- **Load Balancer**: http://localhost:25815/api/v1/cli/chat

## 💡 Conseils d'Utilisation

### 1. Tester les Endpoints

Utilisez Swagger UI pour tester rapidement tous les endpoints sans avoir besoin d'écrire du code.

### 2. Générer du Code

Swagger UI peut générer du code client dans plusieurs langages (JavaScript, Python, cURL, etc.)

### 3. Partager la Documentation

Partagez l'URL http://localhost:25815/api-docs avec votre équipe pour qu'ils puissent voir et tester l'API.

### 4. Exporter la Spécification

La spécification OpenAPI 3.0 est disponible et peut être exportée pour générer des clients automatiquement.

## 🚀 Démarrage Rapide

```bash
# 1. Démarrer le serveur
npm run multi-cli

# 2. Ouvrir Swagger UI dans le navigateur
start http://localhost:25815/api-docs

# 3. Tester un endpoint
# Cliquez sur POST /api/v1/cli/profile2/chat
# Cliquez sur "Try it out"
# Cliquez sur "Execute"
```

## 📚 Documentation Complète

Pour plus de détails sur l'utilisation de l'API:
- **[ENDPOINTS_OPENAI_PAR_COMPTE.md](ENDPOINTS_OPENAI_PAR_COMPTE.md)** - Guide complet des endpoints
- **[URLS_FINALES_PAR_COMPTE.md](URLS_FINALES_PAR_COMPTE.md)** - URLs finales
- **[MULTI_CLI_FINAL_SUMMARY.md](MULTI_CLI_FINAL_SUMMARY.md)** - Vue d'ensemble

## ✅ Résumé

- ✅ **Documentation Swagger UI disponible**
- ✅ **URL**: http://localhost:25815/api-docs
- ✅ **Test en direct** de tous les endpoints
- ✅ **Exemples de requêtes** inclus
- ✅ **Compatible OpenAPI 3.0**
- ✅ **Interface interactive** et facile à utiliser

---

**URL de Test**: http://localhost:25815/api-docs  
**Serveur**: http://localhost:25815  
**Status**: ✅ En ligne

