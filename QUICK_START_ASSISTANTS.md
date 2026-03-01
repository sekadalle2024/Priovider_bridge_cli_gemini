# 🚀 Quick Start - Serveur des Assistants

## ✅ Installation terminée!

Gemini CLI v0.31.0 est installé et configuré avec succès.

## 🎯 Démarrage en 3 étapes

### 1. Démarrer le serveur

```bash
npm run assistants
```

### 2. Vérifier que ça fonctionne

```bash
curl http://localhost:25810/health
```

### 3. Tester un assistant

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

**Note:** Le mode "auto" est utilisé par défaut (comme dans l'app Electron).

## 📍 URLs importantes

- **Serveur:** http://localhost:25810
- **Swagger:** http://localhost:25810/api-docs
- **Health:** http://localhost:25810/health

## 🔧 Configuration n8n

**Endpoint:** `http://localhost:25810/api/v1/chat/completions`  
**Modèle:** `auto` (sélection automatique, comme dans Electron)  
**Format:** Compatible OpenAI

## 📚 Documentation complète

- `RESUME_INSTALLATION_ASSISTANTS.md` - Résumé complet
- `INSTALLATION_GEMINI_CLI_COMPLETE.md` - Guide détaillé
- `assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md` - Guide de démarrage

## 🎯 13 assistants disponibles

beautiful-mermaid, cowork, data-analyst, game-3d, human-3-coach, moltbook, openclaw-setup, pdf-to-ppt, planning-with-files, pptx-generator, social-job-publisher, story-roleplay, ui-ux-pro-max

---

**Tout est prêt! Lancez `npm run assistants` pour commencer.**
