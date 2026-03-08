# 🚀 Démarrage Rapide - Prompts Longs Multi-CLI

## ⚡ En 3 Étapes

### 1. Redémarrer le Serveur
```bash
# Arrêter le serveur actuel (Ctrl+C dans le terminal)
# Puis redémarrer
npm run multi-cli
```

### 2. Tester
```bash
node scripts/test-multi-cli-long-prompt.js
```

### 3. Utiliser dans n8n
```
URL: http://localhost:25815/api/v1/cli/chat
Method: POST
Body: {
  "messages": [{"role": "user", "content": "{{ $json.prompt }}"}],
  "model": "gemini-2.5-flash"
}
```

## ✅ C'est Tout !

Vos prompts longs fonctionnent maintenant, quelle que soit leur longueur.

## 🧪 Résultat Attendu du Test

```
✅ SUCCÈS!
⏱️  Temps de réponse: X.XXs
📄 Réponse reçue

🎉 TOUS LES TESTS SONT PASSÉS!
✅ La correction stdin fonctionne correctement.
✅ Les prompts longs sont maintenant supportés.
```

## 📚 Documentation Complète

Voir **[CORRECTION_PROMPTS_LONGS.md](CORRECTION_PROMPTS_LONGS.md)** pour tous les détails.

## 🆘 Problème ?

### Le serveur ne démarre pas
```bash
# Vérifier le port
netstat -ano | findstr :25815

# Tuer le processus si nécessaire
taskkill /PID <PID> /F
```

### Gemini CLI non trouvé
```bash
npm install -g @google/gemini-cli
gemini auth login
```

### Aucun profil actif
```bash
.\scripts\auth-profiles-simple.ps1
```

---

**Serveur**: http://localhost:25815  
**Swagger**: http://localhost:25815/api-docs  
**Status**: ✅ Prêt pour prompts longs
