# 🎯 Guide : Utiliser les modèles Gemini dans n8n

## Problème
Les modèles Gemini (gemini-3-flash, gemini-3-pro, etc.) n'apparaissent pas dans la liste déroulante des modèles OpenAI dans n8n.

## Solution
n8n permet d'utiliser des modèles personnalisés en tapant directement leur nom dans le champ "Model".

## 📋 Configuration étape par étape

### Méthode 1 : OpenAI Chat Model (Recommandé)

1. **Ajouter un nœud "OpenAI Chat Model"**

2. **Configurer les credentials** :
   - Cliquer sur "Create New Credential"
   - **API Key** : `dummy` (n'importe quelle valeur)
   - **Base URL** : `http://localhost:25808/v1/gemini-api-key`
   - Sauvegarder

3. **Configurer le modèle** :
   - Dans le champ **"Model"**, NE PAS sélectionner dans la liste
   - **Cliquer sur l'icône d'expression** (fx) ou taper directement
   - Entrer le nom du modèle : `gemini-3-flash`

4. **Configurer le prompt** :
   - **Messages** : Add Message
   - **Role** : User
   - **Content** : `{{ $json.prompt }}`

### Méthode 2 : HTTP Request (Alternative)

Si la méthode 1 ne fonctionne pas, utilisez un nœud HTTP Request :

1. **Ajouter un nœud "HTTP Request"**

2. **Configurer** :
   - **Method** : POST
   - **URL** : `http://localhost:25808/v1/gemini-api-key/chat/completions`
   - **Authentication** : None
   - **Body Content Type** : JSON

3. **Body** :
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

4. **Extraire la réponse** :
   - Ajouter un nœud "Code"
   - Code :
```javascript
return {
  json: {
    response: $input.item.json.choices[0].message.content
  }
};
```

## 🎨 Modèles disponibles

### Nouveaux modèles Gemini 3 (Recommandés) :
- `gemini-3-flash` - Rapide et efficace
- `gemini-3-pro` - Plus puissant, meilleure qualité

### Modèles Gemini 2.5 :
- `gemini-2.5-flash` - Défaut, bon équilibre
- `gemini-2.5-pro` - Haute qualité

### Modèles Gemini 1.5 :
- `gemini-1.5-flash` - Stable
- `gemini-1.5-pro` - Puissant

### Modèle expérimental :
- `gemini-exp-1206` - Fonctionnalités expérimentales

## 📝 Exemples de workflows

### Exemple 1 : Chat simple avec gemini-3-flash

```json
{
  "nodes": [
    {
      "parameters": {
        "model": "gemini-3-flash",
        "messages": {
          "values": [
            {
              "role": "user",
              "content": "={{ $json.question }}"
            }
          ]
        }
      },
      "name": "Gemini 3 Flash",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "Gemini API"
        }
      }
    }
  ]
}
```

### Exemple 2 : Comparaison de modèles

Créez plusieurs nœuds OpenAI Chat Model avec différents modèles :

1. **Nœud 1** : `gemini-3-flash` (rapide)
2. **Nœud 2** : `gemini-3-pro` (qualité)
3. **Nœud 3** : `gemini-2.5-flash` (défaut)

Comparez les réponses !

### Exemple 3 : Workflow avec HTTP Request

```json
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "http://localhost:25808/v1/gemini-api-key/chat/completions",
        "options": {},
        "bodyParametersJson": "={\n  \"model\": \"gemini-3-pro\",\n  \"messages\": [\n    {\n      \"role\": \"user\",\n      \"content\": \"{{ $json.prompt }}\"\n    }\n  ],\n  \"temperature\": 0.7\n}"
      },
      "name": "Gemini 3 Pro",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}
```

## 🔧 Dépannage

### Problème 1 : "Model not found"
**Solution** : Vérifiez que vous avez bien tapé le nom du modèle exactement comme indiqué (sensible à la casse).

### Problème 2 : Le modèle n'apparaît pas dans la liste
**Solution** : C'est normal ! Tapez directement le nom du modèle au lieu de le sélectionner.

### Problème 3 : Erreur de connexion
**Solution** : Vérifiez que le serveur est démarré sur le port 25808 :
```bash
curl http://localhost:25808/health
```

### Problème 4 : "Invalid API Key"
**Solution** : Dans les credentials OpenAI, mettez n'importe quelle valeur comme `dummy`. L'authentification n'est pas requise pour le serveur local.

## 💡 Astuces

### Astuce 1 : Utiliser des expressions
Dans n8n, vous pouvez utiliser des expressions pour choisir dynamiquement le modèle :

```javascript
={{ $json.useProModel ? "gemini-3-pro" : "gemini-3-flash" }}
```

### Astuce 2 : Paramètres optimaux par modèle

**gemini-3-flash** :
- Temperature : 0.7
- Max Tokens : 2000
- Bon pour : Réponses rapides, chat

**gemini-3-pro** :
- Temperature : 0.5
- Max Tokens : 4000
- Bon pour : Analyse approfondie, code complexe

**gemini-2.5-flash** :
- Temperature : 0.7
- Max Tokens : 2000
- Bon pour : Usage général

### Astuce 3 : Tester rapidement
Créez un workflow simple pour tester tous les modèles :

1. Nœud "Manual Trigger"
2. Nœud "Set" avec `{ "prompt": "Dis bonjour" }`
3. Plusieurs nœuds "OpenAI Chat Model" avec différents modèles
4. Comparez les résultats !

## 📊 Comparaison des modèles

| Modèle | Vitesse | Qualité | Coût | Usage recommandé |
|--------|---------|---------|------|------------------|
| gemini-3-flash | ⚡⚡⚡ | ⭐⭐⭐ | 💰 | Chat, réponses rapides |
| gemini-3-pro | ⚡⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 | Analyse, code complexe |
| gemini-2.5-flash | ⚡⚡⚡ | ⭐⭐⭐ | 💰 | Usage général |
| gemini-2.5-pro | ⚡⚡ | ⭐⭐⭐⭐ | 💰💰 | Qualité élevée |
| gemini-1.5-flash | ⚡⚡ | ⭐⭐ | 💰 | Stable, testé |
| gemini-1.5-pro | ⚡ | ⭐⭐⭐⭐ | 💰💰 | Puissant |

## 🎯 Workflow complet exemple

Voici un workflow n8n complet qui utilise gemini-3-flash :

```json
{
  "name": "Gemini 3 Flash Chat",
  "nodes": [
    {
      "parameters": {},
      "name": "When clicking 'Test workflow'",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "prompt",
              "value": "Explique-moi les closures en JavaScript"
            }
          ]
        }
      },
      "name": "Set Prompt",
      "type": "n8n-nodes-base.set",
      "position": [460, 300]
    },
    {
      "parameters": {
        "model": "gemini-3-flash",
        "messages": {
          "values": [
            {
              "role": "user",
              "content": "={{ $json.prompt }}"
            }
          ]
        },
        "options": {
          "temperature": 0.7,
          "maxTokens": 2000
        }
      },
      "name": "Gemini 3 Flash",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "credentials": {
        "openAiApi": {
          "id": "1",
          "name": "Gemini Local API"
        }
      },
      "position": [680, 300]
    }
  ],
  "connections": {
    "When clicking 'Test workflow'": {
      "main": [[{ "node": "Set Prompt", "type": "main", "index": 0 }]]
    },
    "Set Prompt": {
      "main": [[{ "node": "Gemini 3 Flash", "type": "main", "index": 0 }]]
    }
  }
}
```

## 📚 Ressources

- [Documentation serveur](./README_MULTI_PROVIDER_KIRO.md)
- [Guide n8n complet](./N8N_LANGCHAIN_GUIDE_COMPLET.md)
- [Test des endpoints](./TEST_ENDPOINTS.md)

## ✅ Checklist de configuration

- [ ] Serveur démarré sur port 25808
- [ ] Credentials OpenAI créées dans n8n avec Base URL personnalisée
- [ ] Nom du modèle tapé manuellement (pas sélectionné)
- [ ] Test avec un prompt simple
- [ ] Vérification de la réponse

---

**Astuce finale** : Si vous ne voyez toujours pas les modèles, utilisez la méthode HTTP Request qui fonctionne à 100% ! 🚀
