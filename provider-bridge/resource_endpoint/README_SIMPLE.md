# 🌉 Provider Bridge — Guide Simple

Guide ultra-simplifié pour démarrer en 2 minutes.

---

## 🚀 Lancer le Serveur

### Windows
Double-cliquez sur :
```
START.bat
```

### Linux / macOS
```bash
cd provider-bridge
npm run dev
```

✅ Le serveur démarre sur **http://localhost:25809**

---

## 🔗 URLs pour n8n

Copiez-collez une de ces URLs dans n8n :

### Option 1 : Gemini CLI (Gratuit)
```
http://localhost:25809/cli
```

### Option 2 : API Key Rotative (195 req/min)
```
http://localhost:25809
```

---

## ⚙️ Configuration n8n

1. Dans n8n → **Credentials** → **New** → **OpenAI**
2. Remplissez :
   ```
   API Key: dummy
   Base URL: http://localhost:25809/cli
   ```
3. Sauvegardez et utilisez !

---

## ✅ Vérifier que ça marche

Ouvrez dans votre navigateur :
```
http://localhost:25809/health
```

Vous devriez voir :
```json
{"status": "ok"}
```

---

## 🧪 Tester

```bash
# Windows
TEST.bat

# Linux/Mac
node scripts/test-gemini-cli-openai.js
```

---

## 📚 Documentation Complète

- [REPONSE_RAPIDE.md](./REPONSE_RAPIDE.md) — FAQ
- [COMMENT_LANCER.md](./COMMENT_LANCER.md) — Guide de lancement
- [N8N_BASE_URLS.md](./N8N_BASE_URLS.md) — URLs pour n8n
- [INDEX.md](./INDEX.md) — Toute la documentation

---

## 🆘 Problème ?

### Le serveur ne démarre pas
```bash
cd provider-bridge
npm install
npm run dev
```

### Port déjà utilisé
```bash
# Windows
netstat -ano | findstr :25809
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:25809 | xargs kill -9
```

---

**C'est tout !** 🎉

Le serveur est maintenant prêt à être utilisé avec n8n.
