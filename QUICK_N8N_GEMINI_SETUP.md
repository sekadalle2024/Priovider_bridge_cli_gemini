# ⚡ Configuration Rapide : Gemini 3 dans n8n

## 🎯 Objectif
Utiliser les nouveaux modèles Gemini 3 Flash et Gemini 3 Pro dans n8n.

## ⚠️ Important
Les modèles Gemini ne sont PAS dans la liste déroulante de n8n. Vous devez les taper manuellement !

## 🚀 Configuration en 3 étapes

### Étape 1 : Créer les Credentials OpenAI

1. Dans n8n, aller dans **Credentials** → **New**
2. Chercher **OpenAI**
3. Configurer :
   ```
   API Key: dummy
   Base URL: http://localhost:25808/v1/gemini-api-key
   ```
4. **Sauvegarder** avec le nom "Gemini Local"

### Étape 2 : Ajouter un nœud OpenAI Chat Model

1. Ajouter le nœud **OpenAI Chat Model**
2. Sélectionner les credentials "Gemini Local"
3. Dans le champ **Model** :
   - ❌ NE PAS sélectionner dans la liste
   - ✅ TAPER directement : `gemini-3-flash`

### Étape 3 : Configurer le message

1. **Messages** → Add Message
2. **Role** : User
3. **Content** : Votre prompt ou `{{ $json.prompt }}`

## 📝 Modèles à taper (copier-coller)

```
gemini-3-flash
gemini-3-pro
gemini-2.5-flash
gemini-2.5-pro
gemini-1.5-flash
gemini-1.5-pro
```

## 🎨 Méthode Alternative : HTTP Request

Si la méthode ci-dessus ne fonctionne pas :

### Configuration HTTP Request

1. **Method** : POST
2. **URL** : `http://localhost:25808/v1/gemini-api-key/chat/completions`
3. **Body** (JSON) :

```json
{
  "model": "gemini-3-flash",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ]
}
```

### Extraire la réponse (nœud Code)

```javascript
return {
  json: {
    response: $input.item.json.choices[0].message.content
  }
};
```

## 🧪 Test Rapide

### Workflow minimal :

1. **Manual Trigger**
2. **Set** : `{ "prompt": "Dis bonjour" }`
3. **HTTP Request** (configuration ci-dessus)
4. **Code** (extraction ci-dessus)

### Résultat attendu :
```json
{
  "response": "Bonjour ! Comment puis-je vous aider aujourd'hui ?"
}
```

## 📊 Comparaison des modèles

| Modèle | Quand l'utiliser |
|--------|------------------|
| **gemini-3-flash** | Réponses rapides, chat, usage général |
| **gemini-3-pro** | Analyse approfondie, code complexe, qualité max |
| **gemini-2.5-flash** | Défaut, bon équilibre |
| **gemini-2.5-pro** | Qualité élevée, tâches complexes |

## 🔧 Dépannage Express

### ❌ "Model not found"
→ Vérifiez l'orthographe exacte : `gemini-3-flash` (avec tirets)

### ❌ "Connection refused"
→ Vérifiez que le serveur est démarré :
```bash
curl http://localhost:25808/health
```

### ❌ Le modèle n'apparaît pas dans la liste
→ C'est NORMAL ! Tapez-le directement au lieu de sélectionner

### ❌ "Invalid API Key"
→ Dans Base URL, ajoutez `/v1/gemini-api-key` à la fin

## 💡 Astuce Pro

Pour changer de modèle dynamiquement :

```javascript
// Dans le champ Model, utiliser une expression
={{ $json.useProModel ? "gemini-3-pro" : "gemini-3-flash" }}
```

## 📦 Workflow Prêt à l'Emploi

Importez ce fichier dans n8n :
- `n8n-workflow-gemini-3-models.json`

Ce workflow teste automatiquement gemini-3-flash ET gemini-3-pro !

## ✅ Checklist

- [ ] Serveur démarré (port 25808)
- [ ] Credentials créées avec Base URL correcte
- [ ] Modèle tapé manuellement (pas sélectionné)
- [ ] Test effectué avec succès

## 🎯 Exemple Complet

### Configuration OpenAI Chat Model :

```
Credentials: Gemini Local
  ├─ API Key: dummy
  └─ Base URL: http://localhost:25808/v1/gemini-api-key

Model: gemini-3-flash (tapé manuellement)

Messages:
  └─ User: {{ $json.prompt }}

Options:
  ├─ Temperature: 0.7
  └─ Max Tokens: 2000
```

## 🚀 Prêt !

Vous pouvez maintenant utiliser tous les modèles Gemini dans n8n !

---

**Besoin d'aide ?** Consultez [N8N_GEMINI_MODELS_GUIDE.md](./N8N_GEMINI_MODELS_GUIDE.md) pour plus de détails.
