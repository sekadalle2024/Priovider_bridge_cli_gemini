# ⚡ LangChain avec Gemini - Démarrage Ultra-Rapide

## 🎯 Réponses Directes

### ❓ Dois-je utiliser un nœud Ollama?

**NON!** Utilisez **"OpenAI Chat Model"**

### ❓ Quelle URL?

```
http://127.0.0.1:25808/v1
```

### ❓ Ai-je besoin d'une clé API?

**OUI, mais n'importe laquelle:**
```
dummy-key
```

## 🚀 Configuration en 3 étapes

### Étape 1: Créer les Credentials (2 min)

**Dans n8n:**
1. Settings → Credentials → Add Credential
2. Rechercher "OpenAI" → Sélectionner "OpenAI API"
3. Remplir:

```
Credential Name: Gemini Local API
API Key: dummy-key
Base URL: http://127.0.0.1:25808/v1
```

4. Cliquer "Save"

### Étape 2: Importer le Workflow (1 min)

**Fichier:** `n8n-workflow-langchain-simple-ready.json`

**Dans n8n:**
1. Workflows → Import from File
2. Sélectionner le fichier
3. Importer

### Étape 3: Configurer le nœud (1 min)

**Dans le nœud "Gemini Chat Model":**
1. Credentials: Sélectionner "Gemini Local API"
2. Model: `gemini-2.5-flash`
3. Temperature: 0.7
4. Max Tokens: 1000

## ✅ Test

**Cliquer sur "Execute Workflow"**

**Résultat attendu:**
```json
{
  "response": {
    "text": "La capitale du Sénégal est Dakar."
  }
}
```

## 📋 Configuration Complète

### Nœud "OpenAI Chat Model"

```
Type: @n8n/n8n-nodes-langchain.lmChatOpenAi
Credentials: Gemini Local API
Model: gemini-2.5-flash
Temperature: 0.7
Max Tokens: 1000
```

### Credentials "Gemini Local API"

```
Type: OpenAI API
API Key: dummy-key
Base URL: http://127.0.0.1:25808/v1
```

## 🎨 Structure du Workflow

```
[Manual Trigger]
    ↓
[Set Question] → question = "Quelle est la capitale du Sénégal?"
    ↓
[Basic LLM Chain] ← [Gemini Chat Model]
    ↓
[Output]
```

## 🔧 Si ça ne marche pas

### Vérifier le serveur

```bash
curl http://127.0.0.1:25808/health
```

**Résultat attendu:** Status OK, 27 clés chargées

### Vérifier les modèles

```bash
curl http://127.0.0.1:25808/v1/models
```

**Résultat attendu:** Liste de 3 modèles

### Vérifier les credentials

Dans n8n:
1. Settings → Credentials
2. Trouver "Gemini Local API"
3. Cliquer "Test Connection"
4. Résultat: ✅ Connection successful

## 🎯 Résumé

| Question | Réponse |
|----------|---------|
| Nœud à utiliser? | **OpenAI Chat Model** (PAS Ollama) |
| URL? | `http://127.0.0.1:25808/v1` |
| API Key? | `dummy-key` (n'importe quoi) |
| Model? | `gemini-2.5-flash` |

## 🎉 Prêt!

Votre workflow LangChain fonctionne avec les 27 clés API Gemini!

**Capacité:** 135 requêtes/minute

---

**Documentation complète:** [N8N_LANGCHAIN_GUIDE_COMPLET.md](N8N_LANGCHAIN_GUIDE_COMPLET.md)
