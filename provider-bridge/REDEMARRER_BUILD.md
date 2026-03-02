# 🔄 Redémarrer le Build Netlify

## ✅ Variables Configurées

Vous avez configuré les variables d'environnement sur Netlify. Maintenant, il faut redémarrer le build pour que les changements prennent effet.

## 🚀 Méthodes pour Redémarrer le Build

### Méthode 1 : Via le Dashboard Netlify (Recommandé)

1. **Allez sur** : https://app.netlify.com/projects/providerbridge/deploys
2. Cliquez sur le dernier déploiement
3. Cliquez sur **Trigger deploy** > **Deploy site**
4. Attendez 2-3 minutes que le build se termine

### Méthode 2 : Via la CLI Netlify

```bash
cd provider-bridge
netlify deploy --prod --build
```

### Méthode 3 : Commit Vide (si Git est configuré)

```bash
cd provider-bridge
git commit --allow-empty -m "Trigger rebuild with new env vars"
git push
```

### Méthode 4 : Via l'API Netlify

```bash
curl -X POST https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID
```

## 🧪 Vérification Après le Build

Une fois le build terminé (2-3 minutes), testez :

### Test 1 : Health Check

```bash
curl https://providerbridge.netlify.app/health
```

**Résultat attendu** :
```json
{
  "status": "ok",
  "service": "provider-bridge",
  "timestamp": "2026-03-02T...",
  "environment": "production"
}
```

### Test 2 : Models (vérifie que les API Keys fonctionnent)

```bash
curl https://providerbridge.netlify.app/v1/models
```

**Résultat attendu** :
```json
{
  "object": "list",
  "data": [
    {
      "id": "gemini-2.5-flash",
      "object": "model",
      "created": 1677610602,
      "owned_by": "google"
    },
    ...
  ]
}
```

### Test 3 : Chat Complet

```bash
# 1. Login
TOKEN=$(curl -s -X POST https://providerbridge.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@provider-bridge.local","password":"admin123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

# 2. Chat
curl -X POST https://providerbridge.netlify.app/v1/chat/completions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }'
```

**Résultat attendu** : Réponse de Gemini avec le contenu du message.

## 📊 Vérifier le Statut du Build

### Via le Dashboard

Allez sur : https://app.netlify.com/projects/providerbridge/deploys

Vous verrez :
- **Building** : Le build est en cours (⏳ 2-3 minutes)
- **Published** : Le build est terminé et déployé ✅
- **Failed** : Le build a échoué ❌ (vérifiez les logs)

### Via la CLI

```bash
netlify status
```

## 🐛 Si le Build Échoue

### 1. Vérifier les Logs

Allez sur : https://app.netlify.com/projects/providerbridge/deploys

Cliquez sur le dernier déploiement et consultez les logs.

### 2. Vérifier les Variables

Allez sur : https://app.netlify.com/projects/providerbridge/settings/env

Vérifiez que toutes les variables sont bien définies :
- `GEMINI_API_KEY_1` à `GEMINI_API_KEY_13`
- `GEMINI_MODEL`
- `JWT_SECRET`
- etc.

### 3. Rebuild Local

```bash
cd provider-bridge
npm run build
```

Si le build local fonctionne, le problème vient de la configuration Netlify.

## 🎯 Prochaines Étapes

1. **Redémarrer le build** (Méthode 1 recommandée)
2. **Attendre 2-3 minutes**
3. **Tester les endpoints**
4. **Intégrer avec n8n**

## 📚 Documentation

- [DEPLOYMENT_SUCCESS.md](../DEPLOYMENT_SUCCESS.md) — Informations de déploiement
- [CONFIGURATION_API_KEYS.md](./CONFIGURATION_API_KEYS.md) — Configuration des API Keys
- [examples/README.md](./examples/README.md) — Exemples de tests

---

**Après le redémarrage du build, Provider Bridge sera pleinement fonctionnel! 🎉**
