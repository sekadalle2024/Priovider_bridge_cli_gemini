# 🤖 Gemini CLI — Endpoints OpenAI-Compatible

Ce document décrit les endpoints OpenAI-compatibles pour **Gemini CLI** (authentification OAuth Google, aucune clé API consommée).

---

## 📍 Base URLs

Vous pouvez utiliser l'une de ces base URLs dans n8n, LangChain ou tout autre client OpenAI :

```
http://localhost:25809/cli
```

ou

```
http://localhost:25809/cli/v1
```

---

## 🔗 Endpoints disponibles

### 1. Liste des modèles

**GET** `/cli/models` ou `/cli/v1/models`

Retourne la liste des modèles Gemini disponibles via CLI OAuth.

**Exemple de requête :**
```bash
curl http://localhost:25809/cli/models
```

**Réponse :**
```json
{
  "object": "list",
  "data": [
    {
      "id": "gemini-3-flash",
      "object": "model",
      "created": 1677610602,
      "owned_by": "google",
      "description": "Gemini 3 Flash — Gemini CLI OAuth (no API key consumed)"
    },
    {
      "id": "gemini-2.5-pro",
      "object": "model",
      "created": 1677610602,
      "owned_by": "google",
      "description": "Gemini 2.5 Pro — Gemini CLI OAuth (no API key consumed)"
    }
  ]
}
```

---

### 2. Chat Completions

**POST** `/cli/chat/completions` ou `/cli/v1/chat/completions`

Envoie un message au modèle Gemini via CLI OAuth (format OpenAI).

**Exemple de requête :**
```bash
curl -X POST http://localhost:25809/cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      {"role": "user", "content": "Bonjour, comment vas-tu ?"}
    ]
  }'
```

**Corps de la requête :**
```json
{
  "model": "gemini-2.5-pro",
  "messages": [
    {"role": "user", "content": "Votre message ici"}
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**Paramètres :**
- `model` (string, optionnel) : Modèle Gemini à utiliser. Par défaut : `gemini-2.5-pro`
- `messages` (array, requis) : Tableau de messages au format OpenAI
- `temperature` (number, optionnel) : Accepté pour compatibilité mais ignoré par la CLI
- `max_tokens` (number, optionnel) : Accepté pour compatibilité mais ignoré par la CLI

**Réponse :**
```json
{
  "id": "chatcmpl-cli-1709123456789",
  "object": "chat.completion",
  "created": 1709123456,
  "model": "gemini-2.5-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Bonjour ! Je vais très bien, merci. Comment puis-je vous aider aujourd'hui ?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 0,
    "completion_tokens": 0,
    "total_tokens": 0
  }
}
```

---

## 🔧 Configuration n8n

### Méthode 1 : HTTP Request Node

1. Ajoutez un nœud **HTTP Request**
2. Configurez :
   - **Method** : POST
   - **URL** : `http://localhost:25809/cli/chat/completions`
   - **Authentication** : None
   - **Body** :
     ```json
     {
       "model": "gemini-2.5-pro",
       "messages": [
         {"role": "user", "content": "{{ $json.prompt }}"}
       ]
     }
     ```

### Méthode 2 : OpenAI Node (avec base URL personnalisée)

1. Créez des credentials **OpenAI**
2. Configurez :
   - **API Key** : `dummy` (non utilisé mais requis par n8n)
   - **Base URL** : `http://localhost:25809/cli`
3. Utilisez le nœud **OpenAI Chat Model** avec ces credentials

---

## 🎯 Avantages de Gemini CLI OAuth

✅ **Gratuit** : Utilise votre compte Google OAuth, aucune clé API consommée  
✅ **Quota généreux** : Quota OAuth plus élevé que les clés API gratuites  
✅ **Modèles récents** : Accès aux derniers modèles Gemini (3 Flash, 2.5 Pro, etc.)  
✅ **Compatible OpenAI** : Fonctionne avec n8n, LangChain et tous les clients OpenAI  

---

## ⚠️ Prérequis

Avant d'utiliser ces endpoints, assurez-vous que :

1. **Gemini CLI est installé** :
   ```bash
   npm install -g @google/gemini-cli
   ```

2. **Vous êtes authentifié avec Google OAuth** :
   ```bash
   gemini auth login
   ```

3. **Le serveur Provider Bridge est lancé** :
   ```bash
   cd provider-bridge
   npm run dev
   ```

---

## 📊 Vérification du statut

Pour vérifier que Gemini CLI est correctement configuré :

```bash
curl http://localhost:25809/api/providers/gemini_cli/status
```

**Réponse attendue :**
```json
{
  "available": true,
  "hasOAuth": true,
  "version": "1.x.x",
  "cliPath": "C:\\Users\\...\\npm\\gemini.cmd"
}
```

---

## 🐛 Dépannage

### Erreur : "Gemini CLI not found"
```bash
npm install -g @google/gemini-cli
```

### Erreur : "OAuth credentials not found"
```bash
gemini auth login
```

### Erreur : "Exit code 1"
Vérifiez que vous êtes bien authentifié :
```bash
gemini auth status
```

---

## 📚 Documentation complète

- [README Provider Bridge](./README.md)
- [Documentation Swagger](http://localhost:25809/docs)
- [Gemini CLI Official Docs](https://github.com/google/generative-ai-cli)

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0.0
