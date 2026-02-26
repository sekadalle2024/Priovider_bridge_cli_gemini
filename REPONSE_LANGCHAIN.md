# 🎯 Réponse: Workflow LangChain avec Gemini

## ✅ Réponses à vos questions

### 1. Dois-je utiliser un nœud Ollama?

**NON!** 

Utilisez le nœud **"OpenAI Chat Model"** (`@n8n/n8n-nodes-langchain.lmChatOpenAi`)

Votre workflow actuel est correct avec ce nœud.

### 2. Quelle URL intégrer?

**Base URL:** `http://127.0.0.1:25808/v1`

**Important:**
- ✅ Utilisez `127.0.0.1` (pas `localhost`)
- ✅ Terminez par `/v1`
- ✅ Si n8n dans Docker: `http://host.docker.internal:25808/v1`

### 3. Ai-je besoin d'une clé API?

**OUI, mais n'importe laquelle!**

Le serveur ne vérifie pas la clé. Vous pouvez utiliser:
- `dummy-key`
- `test`
- `abc123`
- N'importe quel texte

## 🔧 Configuration dans n8n

### Étape 1: Créer les Credentials

**Dans n8n:**
1. **Settings → Credentials → Add Credential**
2. **Rechercher "OpenAI"**
3. **Sélectionner "OpenAI API"**

**Remplir:**
```
Credential Name: Gemini Local API
API Key: dummy-key
Base URL: http://127.0.0.1:25808/v1
```

**Cliquer "Save"**

### Étape 2: Configurer votre nœud "Gemini Chat Model"

**Dans votre workflow:**

1. **Cliquer sur le nœud "Gemini Chat Model"**

2. **Configuration:**
   - **Credentials:** Sélectionner "Gemini Local API"
   - **Model:** `gemini-2.5-flash`
   - **Temperature:** 0.7
   - **Max Tokens:** 1000

3. **Sauvegarder**

## 🎨 Votre Workflow (Corrigé)

```
[Manual Trigger]
    ↓
[Set Question]
    ↓
[Basic LLM Chain] ← [Gemini Chat Model]
                     (Credentials: Gemini Local API)
                     (Model: gemini-2.5-flash)
```

**Connexions:**
- Manual Trigger → Set Question (main)
- Set Question → Basic LLM Chain (main)
- Gemini Chat Model → Basic LLM Chain (ai_languageModel)

## 📊 Configuration Détaillée

### Nœud "Set Question"

```json
{
  "values": {
    "string": [
      {
        "name": "question",
        "value": "Quelle est la capitale du Sénégal?"
      }
    ]
  }
}
```

### Nœud "Gemini Chat Model"

```
Type: @n8n/n8n-nodes-langchain.lmChatOpenAi
Credentials: Gemini Local API
Model: gemini-2.5-flash
Options:
  Temperature: 0.7
  Max Tokens: 1000
```

### Nœud "Basic LLM Chain"

```
Prompt Type: Define below
Text: ={{ $json.question }}
```

## 🧪 Test

### 1. Vérifier le serveur

```bash
curl http://127.0.0.1:25808/v1/models
```

**Résultat attendu:**
```json
{
  "object": "list",
  "data": [
    {"id": "gemini-2.5-flash", "object": "model"},
    {"id": "gemini-1.5-flash", "object": "model"},
    {"id": "gemini-1.5-pro", "object": "model"}
  ]
}
```

### 2. Exécuter le workflow

**Cliquer sur "Execute Workflow"**

**Résultat attendu dans "Basic LLM Chain":**
```json
{
  "response": {
    "text": "La capitale du Sénégal est Dakar."
  }
}
```

### 3. Vérifier les logs du serveur

Dans le terminal où tourne `node server-api-key.js`:

```
[Rotation] Using key 1/27 (1/5 req/min)
[OpenAI API] Request received
```

## 📁 Fichiers créés pour vous

### Workflows prêts à importer

1. **`n8n-workflow-langchain-simple-ready.json`** - Workflow simple (recommandé)
2. **`n8n-workflow-langchain.json`** - Workflow basique
3. **`n8n-workflow-langchain-advanced.json`** - Exemples multiples
4. **`n8n-workflow-langchain-conversation.json`** - Avec mémoire

### Documentation

1. **`N8N_LANGCHAIN_QUICK_START.md`** - Démarrage ultra-rapide (5 min)
2. **`N8N_LANGCHAIN_GUIDE_COMPLET.md`** - Guide complet détaillé
3. **`REPONSE_LANGCHAIN.md`** - Ce fichier

## ✅ Checklist

- [ ] Serveur démarré: `node server-api-key.js`
- [ ] Endpoint `/v1/models` fonctionne
- [ ] Credentials "Gemini Local API" créés
- [ ] Base URL: `http://127.0.0.1:25808/v1`
- [ ] API Key: `dummy-key`
- [ ] Nœud "Gemini Chat Model" configuré
- [ ] Credentials sélectionnés dans le nœud
- [ ] Model: `gemini-2.5-flash`
- [ ] Workflow exécuté avec succès

## 🎯 Résumé Configuration

| Paramètre | Valeur |
|-----------|--------|
| **Nœud** | OpenAI Chat Model (PAS Ollama) |
| **Credentials Type** | OpenAI API |
| **Credential Name** | Gemini Local API |
| **API Key** | dummy-key |
| **Base URL** | http://127.0.0.1:25808/v1 |
| **Model** | gemini-2.5-flash |
| **Temperature** | 0.7 |
| **Max Tokens** | 1000 |

## 🚀 Prochaines étapes

1. **Créer les credentials** (voir Étape 1)
2. **Configurer le nœud** (voir Étape 2)
3. **Exécuter le workflow**
4. **Vérifier le résultat**

## 🎉 Résultat

Votre workflow LangChain utilisera:
- ✅ Les 27 clés API Gemini avec rotation automatique
- ✅ Le modèle `gemini-2.5-flash`
- ✅ 135 requêtes/minute de capacité
- ✅ Pas de coût API externe

---

**Serveur:** http://127.0.0.1:25808  
**Endpoint OpenAI:** http://127.0.0.1:25808/v1/chat/completions  
**Status:** ✅ OPERATIONAL
