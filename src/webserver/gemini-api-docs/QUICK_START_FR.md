# ⚡ Démarrage Ultra-Rapide - Gemini CLI API

> Votre compte Google (ohada.finance@gmail.com) est déjà configuré ! 🎉

## 🚀 En 3 Commandes

```bash
# 1. Vérifier que tout est OK
npm run diagnose:api

# 2. Démarrer le serveur
npm run webui:remote

# 3. Tester l'API
npm run test:api
```

**C'est tout ! Votre API Gemini est prête. 🎊**

## 📍 Accès

- **Interface Web** : http://localhost:25808
- **API Endpoint** : http://localhost:25808/api/chat
- **Documentation** : http://localhost:25808/api/version

## 🔑 Obtenir votre Token JWT

1. Ouvrir http://localhost:25808
2. Se connecter avec vos credentials
3. F12 → Application → Cookies → Copier le token

## 💡 Premier Test

```bash
# Remplacer YOUR_TOKEN par votre token JWT
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [
      {"role": "user", "content": "Dis bonjour en 5 langues"}
    ]
  }'
```

## 🔗 Utiliser dans n8n

### Configuration HTTP Request

- **URL** : `http://localhost:25808/api/chat`
- **Method** : POST
- **Auth** : Header Auth
  - Name: `Authorization`
  - Value: `Bearer YOUR_TOKEN`
- **Body** :
  ```json
  {
    "messages": [
      {"role": "user", "content": "{{ $json.prompt }}"}
    ]
  }
  ```

## 📚 Documentation Complète

- **Guide Rapide** : [GEMINI_API_QUICKSTART_FR.md](./GEMINI_API_QUICKSTART_FR.md)
- **Guide Complet** : [GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md)
- **Avec votre compte** : [UTILISATION_AVEC_COMPTE_GOOGLE.md](./UTILISATION_AVEC_COMPTE_GOOGLE.md)

## 🌐 Déployer sur Internet

### Netlify (Recommandé)

```bash
# 1. Obtenir une clé API sur https://aistudio.google.com/apikey
# 2. Déployer
netlify deploy --prod
# 3. Configurer GEMINI_API_KEY dans le dashboard
```

### Vercel

```bash
# 1. Obtenir une clé API sur https://aistudio.google.com/apikey
# 2. Déployer
vercel --prod
# 3. Configurer GEMINI_API_KEY dans le dashboard
```

## 🐛 Problème ?

```bash
# Diagnostic complet
npm run diagnose:api

# Voir les logs
npm run webui:remote
```

## 💬 Besoin d'aide ?

- **Documentation** : [README_GEMINI_API_FR.md](./README_GEMINI_API_FR.md)
- **GitHub Issues** : https://github.com/iOfficeAI/AionUi/issues
- **Discord** : https://discord.gg/aionui

---

**Bon développement ! 🚀**
