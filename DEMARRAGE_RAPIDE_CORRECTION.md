# ⚡ Démarrage Rapide - Correction Prompts Longs

## 🎯 Problème Résolu

Erreur: `"Your request is invalid or could not be processed by the service"`

Cause: Mauvais flag `-m` au lieu de `--model` dans Gemini CLI

## ✅ Solution en 3 Étapes

### 1. Rebuild du Projet
```bash
npm run build
```

### 2. Redémarrer le Serveur
```bash
# Arrêter le serveur actuel (Ctrl+C si déjà lancé)
npm run multi-cli
```

### 3. Tester
```bash
node scripts/test-multi-cli-correction.js
```

## 📊 Résultat Attendu

```
🧪 Tests de Correction - Serveur Multi-CLI
============================================================
🌐 URL: http://localhost:25815
⏱️  Timeout: 120s

📝 Test 1: Prompt court (baseline)
============================================================
✅ SUCCÈS!
⏱️  Temps de réponse: 2.5s
📄 Réponse: Bonjour !...

📝 Test 2: Prompt long (cas d'usage audit)
============================================================
📏 Longueur du prompt: 2156 caractères
✅ SUCCÈS!
⏱️  Temps de réponse: 5.8s
📄 Longueur de la réponse: 1234 caractères

============================================================
📊 RÉSUMÉ DES TESTS
============================================================
Prompt court:  ✅ SUCCÈS
Prompt long:   ✅ SUCCÈS

🎉 TOUS LES TESTS SONT PASSÉS!
✅ La correction fonctionne correctement.
✅ Les prompts longs sont maintenant supportés.
```

## 🔌 Utiliser dans n8n

### URL
```
http://localhost:25815/api/v1/cli/chat
```

### Body
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

## 🆘 Dépannage Rapide

### Erreur: Port déjà utilisé
```bash
netstat -ano | findstr :25815
taskkill /PID <PID> /F
npm run multi-cli
```

### Erreur: Gemini CLI non trouvé
```bash
npm install -g @google/gemini-cli
gemini auth login
```

### Erreur: Aucun profil actif
```bash
.\scripts\auth-profiles-simple.ps1
```

## 📚 Documentation Complète

- **[CORRECTION_FINALE_MULTI_CLI_PROMPTS_LONGS.md](CORRECTION_FINALE_MULTI_CLI_PROMPTS_LONGS.md)** - Documentation complète
- **[gemini_cli_multi_provider/CORRECTION_PROMPTS_LONGS.md](gemini_cli_multi_provider/CORRECTION_PROMPTS_LONGS.md)** - Documentation technique

---

**Status**: ✅ PRÊT À TESTER

**Temps estimé**: 5 minutes

**Commandes**: 3 seulement
