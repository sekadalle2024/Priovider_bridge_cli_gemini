# 🎯 Utiliser les modèles Gemini 3 dans n8n

## Problème

Les nouveaux modèles Gemini 3 (gemini-3-flash, gemini-3-pro) ne sont pas encore disponibles dans la liste déroulante du nœud Google Gemini natif de n8n.

## ✅ Solution : HTTP Request Node

Utilisez le nœud **HTTP Request** pour accéder à tous les modèles via notre serveur API.

## 📋 Configuration étape par étape

### Étape 1 : Ajouter un nœud HTTP Request
6. **gemini-1.5-pro**
7. **gemini-exp-1206**

## 🔧 Méthode 1 : HTTP Request Node (Recommandé)

Cette méthode vous donne accès à TOUS les modèles.

### Étape 1 : Ajouter un nœud HTTP Request

1. Dans votre workflow n8n, ajoutez un nœud **HTTP Request**
2. Configurez-le comme suit :

### Étape 2 : Configuration du nœud

```
Method: POST
URL: http://localhost:25808/v1/gemini-api-key/chat/completions
Authentication: None
Body Content Type: JSON
```

### Étape 3 : Body JSON

```json
{
  "model": "gemini-3-flash",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

### Étape 4 : Extraire la réponse

Ajoutez un nœud **Code** après le HTTP Request :

```javascript
// Extraire la réponse du modèle
const response = $input.item.json;
const answer = response.choices[0].message.content;

return {
  json: {
    answer: answer,
    model: response.model,
    usage: response.usage
  }
};
```

## 🔧 Méthode 2 : LangChain Chat Model avec OpenAI

Vous pouvez aussi utiliser le nœud LangChain en configurant un endpoint OpenAI personnalisé.

### Étape 1 : Ajouter un nœud "OpenAI Chat Model"

1. Dans votre workflow, ajoutez un nœud **OpenAI Chat Model**
2. Créez de nouvelles credentials OpenAI

### Étape 2 : Configuration des credentials

```
API Key: dummy-key-not-used
Base URL: http://localhost:25808/v1/gemini-api-key
```

### Étape 3 : Configuration du modèle

Dans le nœud