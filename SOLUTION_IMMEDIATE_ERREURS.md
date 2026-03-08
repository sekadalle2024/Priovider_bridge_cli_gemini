# ⚡ Solution Immédiate - Erreurs Multi-CLI

## 🎯 Problèmes Résolus

✅ Erreur OAuth: `Authentication cancelled by user`  
✅ Timeout 30 min sans réponse  
✅ Réponse incorrecte (package.json)  
✅ Arguments manquants

## 🔧 Cause

Le modèle `auto` nécessite OAuth (Google Cloud). Solution: utiliser `gemini-2.5-flash` avec API Key.

## ✅ Corrections Appliquées

### 1. Fichier `.env`
```env
# Avant
GEMINI_DEFAULT_MODEL=auto

# Après
GEMINI_DEFAULT_MODEL=gemini-2.5-flash
```

### 2. Code `MultiGeminiCliService.ts`
- ✅ Ajout de `GEMINI_API_KEY` dans l'environnement
- ✅ Remplacement de `auto` par `gemini-2.5-flash`
- ✅ Méthode `getApiKeyForProfile()` ajoutée

### 3. Code `AssistantService.ts`
- ✅ Ajout de `GEMINI_API_KEY` dans l'environnement
- ✅ Remplacement de `auto` par `gemini-2.5-flash`

## 🚀 Redémarrer les Serveurs

```bash
# Arrêter tous les serveurs (Ctrl+C dans chaque terminal)

# Terminal 1: Serveur Assistants
npm run assistants

# Terminal 2: Serveur Multi-CLI
npm run multi-cli
```

## 🧪 Tester

### Test 1: Serveur Assistants (Port 25810)
```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}],
    "model": "gemini-2.5-flash"
  }'
```

### Test 2: Serveur Multi-CLI (Port 25815)
```bash
curl -X POST http://localhost:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}],
    "model": "gemini-2.5-flash"
  }'
```

### Test 3: Prompt Long
```bash
node scripts/test-multi-cli-correction.js
```

## 📊 Résultat Attendu

```
✅ Réponse en <10 secondes
✅ Pas d'erreur OAuth
✅ Réponse correcte
✅ Prompts longs fonctionnent
```

## 🔌 Configuration n8n

### Serveur Assistants
**URL**: `http://localhost:25810/api/v1/chat/completions`

### Serveur Multi-CLI
**URL**: `http://localhost:25815/api/v1/cli/chat`

### Body (les deux)
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-2.5-flash"
}
```

## 📚 Documentation

- **[DIAGNOSTIC_ERREURS_MULTI_CLI.md](DIAGNOSTIC_ERREURS_MULTI_CLI.md)** - Diagnostic complet
- **[CORRECTION_FINALE_MULTI_CLI_PROMPTS_LONGS.md](CORRECTION_FINALE_MULTI_CLI_PROMPTS_LONGS.md)** - Correction prompts longs

---

**Status**: ✅ CORRECTIONS APPLIQUÉES

**Action**: Redémarrer les serveurs

**Temps**: 2 minutes
