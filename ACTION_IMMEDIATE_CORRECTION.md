# ⚡ ACTION IMMÉDIATE - Correction Multi-CLI

## 🎯 Problème
```json
{ "error": "Your request is invalid or could not be processed by the service" }
```

## ✅ Solution
Mauvais flag: `-m` → Correct: `--model`

## 🚀 3 Commandes

```bash
# 1. Rebuild
npm run build

# 2. Redémarrer
npm run multi-cli

# 3. Tester
node scripts/test-multi-cli-correction.js
```

## 📊 Résultat Attendu
```
🎉 TOUS LES TESTS SONT PASSÉS!
✅ La correction fonctionne correctement.
✅ Les prompts longs sont maintenant supportés.
```

## 🔌 n8n
**URL**: `http://localhost:25815/api/v1/cli/chat`

**Body**:
```json
{
  "messages": [{"role": "user", "content": "{{ $json.prompt }}"}],
  "model": "gemini-2.5-flash"
}
```

## 📚 Documentation
**[INDEX_CORRECTION_MULTI_CLI.md](INDEX_CORRECTION_MULTI_CLI.md)** - Index complet

---

**Temps**: 5 minutes | **Difficulté**: ⭐ Facile | **Status**: ✅ Prêt
