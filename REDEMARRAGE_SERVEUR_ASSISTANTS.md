# 🔄 Redémarrage du Serveur des Assistants

## ✅ Modifications Appliquées

La solution pour les prompts longs a été appliquée dans :
- ✅ `src/webserver/services/AssistantService.ts` (TypeScript)
- ✅ `scripts/server-assistants-standalone.js` (JavaScript standalone)

## 🚀 Redémarrer le Serveur

### 1. Arrêter le serveur actuel
Appuyez sur `Ctrl+C` dans le terminal où le serveur tourne.

### 2. Redémarrer le serveur
```bash
npm run assistants
```

Le serveur devrait démarrer sur `http://localhost:25810`

## 🧪 Tester la Solution

### Test 1: Vérifier que le serveur fonctionne
```bash
curl http://localhost:25810/health
```

Résultat attendu:
```json
{
  "status": "ok",
  "geminiCli": "available",
  "assistantsCount": 12,
  "port": 25810,
  "timestamp": "2026-03-02T..."
}
```

### Test 2: Tester avec un prompt court
```bash
node scripts/test-long-prompt.js
```

Ce script teste automatiquement:
1. Un prompt court (pour vérifier la compatibilité)
2. Un prompt long (>8000 caractères)

### Test 3: Tester depuis n8n

Dans votre workflow n8n, utilisez:

**URL**: `http://localhost:25810/api/v1/chat/completions`

**Method**: POST

**Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-3-flash",
  "temperature": 0.7
}
```

Vous pouvez maintenant passer votre prompt long complet sans erreur !

## 📊 Avant vs Après

### ❌ Avant (Erreur)
```
Gemini CLI error: La ligne de commande est trop longue.
```

### ✅ Après (Fonctionne)
```json
{
  "id": "chatcmpl-1234567890",
  "object": "chat.completion",
  "model": "gemini-3-flash",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "{ \"Google contenu 1A\": \"...\", ... }"
    }
  }]
}
```

## 🔍 Vérification Rapide

### Le serveur démarre-t-il ?
```bash
npm run assistants
```

Vous devriez voir:
```
🤖 AionUI Assistants Microservices API
📡 Serveur démarré sur http://localhost:25810
📚 Documentation Swagger: http://localhost:25810/api-docs
✅ Gemini CLI: Disponible
📦 12 assistants découverts
```

### Gemini CLI est-il disponible ?
```bash
gemini --version
```

Si erreur, installez:
```bash
npm install -g @google/generative-ai-cli
gemini auth login
```

## 💡 Conseils

### Pour les prompts TRÈS longs (>50000 caractères)
- Augmentez le timeout dans n8n: `"timeout": 120000` (2 minutes)
- Surveillez l'utilisation mémoire
- Considérez diviser en plusieurs requêtes si possible

### Pour déboguer
Regardez les logs du serveur dans le terminal où vous avez lancé `npm run assistants`

### Pour tester manuellement
Utilisez Swagger UI: http://localhost:25810/api-docs

## 📚 Documentation Complète

- **[SOLUTION_PROMPTS_LONGS.md](SOLUTION_PROMPTS_LONGS.md)** - Explication détaillée de la solution
- **[assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md](assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md)** - Documentation principale
- **[N8N_ASSISTANTS_ENDPOINT.md](N8N_ASSISTANTS_ENDPOINT.md)** - Guide d'intégration n8n

## ✅ Checklist

- [ ] Serveur arrêté (Ctrl+C)
- [ ] Serveur redémarré (`npm run assistants`)
- [ ] Health check OK (`curl http://localhost:25810/health`)
- [ ] Test prompt court OK
- [ ] Test prompt long OK
- [ ] Test dans n8n OK

---

**Status**: ✅ PRÊT À TESTER

**Date**: 2026-03-02
