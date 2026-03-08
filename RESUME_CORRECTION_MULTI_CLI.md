# 📝 Résumé - Correction Multi-CLI Prompts Longs

## 🎯 Problème
```json
{ "error": "Your request is invalid or could not be processed by the service" }
```

## 🔍 Cause
Mauvais flag Gemini CLI: `-m` au lieu de `--model`

## ✅ Correction

### Fichier Modifié
`src/webserver/services/MultiGeminiCliService.ts`

### Changement
```typescript
// ❌ AVANT
const command = `gemini -m ${model}`;
const gemini = spawn(command, [], { env, shell: true });

// ✅ APRÈS
const args = ['--model', model];
const gemini = spawn('gemini', args, { env, shell: true });
```

## 🚀 Action

```bash
npm run build          # Rebuild
npm run multi-cli      # Redémarrer
node scripts/test-multi-cli-correction.js  # Tester
```

## 📊 Résultat

- ✅ Prompts courts fonctionnent
- ✅ Prompts longs fonctionnent (stdin)
- ✅ Tous les modèles Gemini disponibles
- ✅ Multi-profils avec load balancing

## 📚 Documentation

- **[ACTION_IMMEDIATE_CORRECTION.md](ACTION_IMMEDIATE_CORRECTION.md)** ⚡ - 3 commandes
- **[INDEX_CORRECTION_MULTI_CLI.md](INDEX_CORRECTION_MULTI_CLI.md)** 📚 - Index complet
- **[REPONSE_FINALE_CORRECTION_MULTI_CLI.md](REPONSE_FINALE_CORRECTION_MULTI_CLI.md)** 📖 - Documentation complète

## 🔌 n8n

**URL**: `http://localhost:25815/api/v1/cli/chat`

**Body**:
```json
{
  "messages": [{"role": "user", "content": "{{ $json.prompt }}"}],
  "model": "gemini-2.5-flash"
}
```

---

**Status**: ✅ Corrigé | **Temps**: 5 min | **Difficulté**: ⭐ Facile
