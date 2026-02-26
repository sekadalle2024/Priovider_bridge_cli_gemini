# 🎨 Guide Visuel: Configuration LangChain dans n8n

## 📋 Vue d'ensemble

Votre workflow utilise le bon nœud (**OpenAI Chat Model**), il suffit de configurer les credentials!

## 🔑 Étape 1: Créer les Credentials

### 1.1 Ouvrir le menu Credentials

```
┌─────────────────────────────────────────┐
│ n8n                                     │
├─────────────────────────────────────────┤
│ Workflows                               │
│ Executions                              │
│ ► Settings                              │
│   ├─ Users                              │
│   ├─ API                                │
│   └─► Credentials  ← CLIQUER ICI       │
└─────────────────────────────────────────┘
```

### 1.2 Ajouter un nouveau Credential

```
┌─────────────────────────────────────────┐
│ Credentials                             │
├─────────────────────────────────────────┤
│ [+ Add Credential]  ← CLIQUER ICI       │
│                                         │
│ Existing Credentials:                   │
│ (vide pour l'instant)                   │
└─────────────────────────────────────────┘
```

### 1.3 Rechercher "OpenAI"

```
┌─────────────────────────────────────────┐
│ Select Credential Type                  │
├─────────────────────────────────────────┤
│ Search: [OpenAI____________]            │
│                                         │
│ Results:                                │
│ ► OpenAI API  ← CLIQUER ICI             │
│   OpenRouter API                        │
│   Anthropic API                         │
└─────────────────────────────────────────┘
```

### 1.4 Remplir les informations

```
┌─────────────────────────────────────────┐
│ OpenAI API Credentials                  │
├─────────────────────────────────────────┤
│ Credential Name:                        │
│ [Gemini Local API___________________]   │
│                                         │
│ API Key: *                              │
│ [dummy-key__________________________]   │
│                                         │
│ Base URL: (optional)                    │
│ [http://127.0.0.1:25808/v1__________]   │
│                                         │
│ Organization ID: (optional)             │
│ [___________________________________]   │
│                                         │
│ [Test Connection] [Save]                │
└─────────────────────────────────────────┘
```

**Important:**
- ✅ Credential Name: `Gemini Local API`
- ✅ API Key: `dummy-key` (ou n'importe quoi)
- ✅ Base URL: `http://127.0.0.1:25808/v1`

### 1.5 Sauvegarder

```
┌─────────────────────────────────────────┐
│ ✅ Credential saved successfully!       │
│                                         │
│ Gemini Local API                        │
│ Type: OpenAI API                        │
│ Created: Just now                       │
└─────────────────────────────────────────┘
```

## 🎨 Étape 2: Configurer le Workflow

### 2.1 Structure du Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [When clicking 'Execute Workflow']                         │
│                    ↓                                        │
│              [Set Question]                                 │
│                    ↓                                        │
│            [Basic LLM Chain] ← [Gemini Chat Model]         │
│                    ↓                                        │
│                 [Output]                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Configurer "Set Question"

```
┌─────────────────────────────────────────┐
│ Set Question                            │
├─────────────────────────────────────────┤
│ Values to Set:                          │
│                                         │
│ Name: question                          │
│ Value: Quelle est la capitale du        │
│        Sénégal?                         │
│                                         │
│ [+ Add Value]                           │
└─────────────────────────────────────────┘
```

### 2.3 Configurer "Gemini Chat Model"

```
┌─────────────────────────────────────────┐
│ Gemini Chat Model                       │
├─────────────────────────────────────────┤
│ Credentials:                            │
│ [Gemini Local API ▼]  ← SÉLECTIONNER   │
│                                         │
│ Model:                                  │
│ [gemini-2.5-flash___________________]   │
│                                         │
│ Options:                                │
│   Temperature: [0.7_________________]   │
│   Max Tokens:  [1000________________]   │
│                                         │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

**Configuration:**
- ✅ Credentials: `Gemini Local API`
- ✅ Model: `gemini-2.5-flash`
- ✅ Temperature: `0.7`
- ✅ Max Tokens: `1000`

### 2.4 Configurer "Basic LLM Chain"

```
┌─────────────────────────────────────────┐
│ Basic LLM Chain                         │
├─────────────────────────────────────────┤
│ Prompt Type:                            │
│ ● Define below                          │
│ ○ Take from previous node               │
│                                         │
│ Text:                                   │
│ [={{ $json.question }}______________]   │
│                                         │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

**Configuration:**
- ✅ Prompt Type: `Define below`
- ✅ Text: `={{ $json.question }}`

### 2.5 Connexions

```
┌─────────────────────────────────────────┐
│ Connexions à vérifier:                  │
├─────────────────────────────────────────┤
│                                         │
│ 1. Manual Trigger → Set Question        │
│    Type: main                           │
│                                         │
│ 2. Set Question → Basic LLM Chain       │
│    Type: main                           │
│                                         │
│ 3. Gemini Chat Model → Basic LLM Chain  │
│    Type: ai_languageModel               │
│                                         │
└─────────────────────────────────────────┘
```

## ▶️ Étape 3: Exécuter le Workflow

### 3.1 Cliquer sur "Execute Workflow"

```
┌─────────────────────────────────────────┐
│ Workflow: Gemini LangChain              │
├─────────────────────────────────────────┤
│ [▶ Execute Workflow]  ← CLIQUER ICI     │
│                                         │
│ Status: Ready                           │
└─────────────────────────────────────────┘
```

### 3.2 Voir l'exécution

```
┌─────────────────────────────────────────┐
│ Execution in progress...                │
├─────────────────────────────────────────┤
│                                         │
│ ✅ When clicking 'Execute Workflow'     │
│ ✅ Set Question                         │
│ ⏳ Gemini Chat Model                    │
│ ⏳ Basic LLM Chain                      │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 Résultat

```
┌─────────────────────────────────────────┐
│ ✅ Execution completed successfully!    │
├─────────────────────────────────────────┤
│                                         │
│ Basic LLM Chain:                        │
│ {                                       │
│   "response": {                         │
│     "text": "La capitale du Sénégal     │
│              est Dakar."                │
│   }                                     │
│ }                                       │
│                                         │
└─────────────────────────────────────────┘
```

## 🔍 Étape 4: Vérifications

### 4.1 Vérifier les logs du serveur

```
┌─────────────────────────────────────────┐
│ Terminal: node server-api-key.js        │
├─────────────────────────────────────────┤
│                                         │
│ [Rotation] Using key 1/27 (1/5 req/min) │
│ [OpenAI API] Request received           │
│ [OpenAI API] Model: gemini-2.5-flash    │
│ [OpenAI API] Response sent              │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 Vérifier les credentials

```
┌─────────────────────────────────────────┐
│ Settings → Credentials                  │
├─────────────────────────────────────────┤
│                                         │
│ Gemini Local API                        │
│ Type: OpenAI API                        │
│ Status: ✅ Connected                    │
│                                         │
│ [Test Connection] [Edit] [Delete]       │
│                                         │
└─────────────────────────────────────────┘
```

## 🎯 Résumé Visuel

### Configuration Complète

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  CREDENTIALS                                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Name: Gemini Local API                              │   │
│  │ Type: OpenAI API                                    │   │
│  │ API Key: dummy-key                                  │   │
│  │ Base URL: http://127.0.0.1:25808/v1                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  WORKFLOW                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  [Manual Trigger]                                   │   │
│  │         ↓                                           │   │
│  │  [Set Question]                                     │   │
│  │    question = "Quelle est la capitale du Sénégal?" │   │
│  │         ↓                                           │   │
│  │  [Basic LLM Chain] ← [Gemini Chat Model]           │   │
│  │    text = $json.question                            │   │
│  │                      model = gemini-2.5-flash       │   │
│  │                      credentials = Gemini Local API │   │
│  │         ↓                                           │   │
│  │  [Output]                                           │   │
│  │    "La capitale du Sénégal est Dakar."              │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Checklist Visuelle

```
Configuration:
  ✅ Credentials créés
  ✅ API Key: dummy-key
  ✅ Base URL: http://127.0.0.1:25808/v1
  ✅ Credentials sélectionnés dans le nœud
  ✅ Model: gemini-2.5-flash

Workflow:
  ✅ Manual Trigger connecté à Set Question
  ✅ Set Question connecté à Basic LLM Chain
  ✅ Gemini Chat Model connecté à Basic LLM Chain (ai_languageModel)
  ✅ Prompt configuré: ={{ $json.question }}

Test:
  ✅ Serveur démarré
  ✅ Workflow exécuté
  ✅ Résultat obtenu
  ✅ Logs du serveur montrent la rotation
```

## 🎉 Prêt!

Votre workflow LangChain est configuré et fonctionne!

---

**Documentation:** [N8N_LANGCHAIN_GUIDE_COMPLET.md](N8N_LANGCHAIN_GUIDE_COMPLET.md)  
**Démarrage rapide:** [N8N_LANGCHAIN_QUICK_START.md](N8N_LANGCHAIN_QUICK_START.md)
