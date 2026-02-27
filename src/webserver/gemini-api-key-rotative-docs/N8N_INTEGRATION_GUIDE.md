# 🚀 Guide d'intégration n8n - Gemini API avec rotation

**Date:** 26 février 2026  
**Version:** 2.0.0  
**Status:** ✅ PRODUCTION READY

---

## 🎯 Vue d'ensemble

Ce guide explique comment intégrer le serveur Gemini API Key avec rotation automatique dans n8n.

**Serveur:** http://localhost:25808  
**Base URL n8n:** `http://127.0.0.1:25808/v1`  
**Clés API:** 27 clés avec rotation automatique  
**Modèles:** 7 modèles Gemini disponibles

---

## 📋 Configuration rapide

### 1. Démarrer le serveur

```bash
node server-simple.js
```

**Vérifier que le serveur fonctionne:**
```bash
curl http://127.0.0.1:25808/health
```

### 2. Configurer n8n

**Dans n8n, créer un nœud "OpenAI Chat Model":**

**Configuration:**
- **Base URL:** `http://127.0.0.1:25808/v1`
- **API Key:** `dummy` (n'importe quelle valeur, non vérifiée)
- **Model:** `gemini-3-flash` (ou un autre modèle)

**Modèles disponibles:**
- `gemini-3-flash` ⭐ (nouveau, rapide, recommandé)
- `gemini-3-pro` ⭐ (nouveau, plus puissant)
- `gemini-2.5-flash`
- `gemini-2.5-pro`
- `gemini-1.5-flash`
- `gemini-1.5-pro`
- `gemini-exp-1206`

### 3. Tester

**Créer un workflow simple:**
1. Ajouter un nœud "Manual Trigger"
2. Ajouter un nœud "OpenAI Chat Model"
3. Configurer avec les paramètres ci-dessus
4. Ajouter un message: "Bonjour, qui es-tu?"
5. Exécuter

**Résultat attendu:**
- Réponse de Gemini
- Logs du serveur montrent quelle clé a été utilisée

---

## 🔧 Endpoints disponibles

### 1. Liste des modèles

**Endpoint:** `GET /v1/models`

**Exemple:**
```bash
curl http://127.0.0.1:25808/v1/models
```

**Réponse:**
```json
{
  "object": "list",
  "data": [
    {
      "id": "gemini-3-flash",
      "object": "model",
      "created": 1740604800,
      "owned_by": "google"
    },
    {
      "id": "gemini-3-pro",
      "object": "model",
      "created": 1740604800,
      "owned_by": "google"
    },
    ...
  ]
}
```

### 2. Chat avec Gemini

**Endpoint:** `POST /v1/chat/completions`

**Exemple:**
```bash
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "messages": [
      {"role": "user", "content": "Bonjour"}
    ],
    "temperature": 0.7,
    "max_tokens": 2048
  }'
```

**Réponse:**
```json
{
  "id": "chatcmpl-1740604800000",
  "object": "chat.completion",
  "created": 1740604800,
  "model": "gemini-3-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Bonjour! Comment puis-je vous aider?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 12,
    "total_tokens": 17
  }
}
```

---

## 🔑 Rotation automatique des clés

### Comment ça marche

**27 clés API configurées:**
- 8 clés Ohada Finance (A-H)
- 8 clés Ohada Save (A-H)
- 11 clés Ohada Save 2 (A-K)

**Rotation:**
- Chaque requête utilise la clé suivante dans la liste
- Rotation circulaire (après la clé 27, retour à la clé 1)
- Logs affichent quelle clé est utilisée

**Capacité:**
- 5 requêtes/minute par clé
- 135 requêtes/minute au total (27 × 5)
- 250k tokens/jour par clé
- 6.75M tokens/jour au total (27 × 250k)

**Exemple de logs:**
```
🔑 Utilisation de la clé: GEMINI_API_KEY_OHADA_FINANCE_A (1 requêtes)
🔑 Utilisation de la clé: GEMINI_API_KEY_OHADA_FINANCE_B (1 requêtes)
🔑 Utilisation de la clé: GEMINI_API_KEY_OHADA_FINANCE_C (1 requêtes)
...
```

---

## 🎨 Exemples de workflows n8n

### Workflow 1: Question simple

**Nœuds:**
1. Manual Trigger
2. OpenAI Chat Model
   - Base URL: `http://127.0.0.1:25808/v1`
   - API Key: `dummy`
   - Model: `gemini-3-flash`
   - Message: "Explique-moi la rotation des clés API"

### Workflow 2: Conversation avec contexte

**Nœuds:**
1. Manual Trigger
2. Set (définir le contexte)
3. OpenAI Chat Model
   - Messages: `{{ $json.messages }}`
4. Code (extraire la réponse)

**Exemple de messages:**
```json
{
  "messages": [
    {"role": "system", "content": "Tu es un assistant technique"},
    {"role": "user", "content": "Qu'est-ce que Gemini?"}
  ]
}
```

### Workflow 3: Comparaison de modèles

**Nœuds:**
1. Manual Trigger
2. Split In Batches (modèles: gemini-3-flash, gemini-3-pro, gemini-2.5-flash)
3. OpenAI Chat Model
   - Model: `{{ $json.model }}`
4. Merge (comparer les réponses)

---

## 🧪 Tests et validation

### Test 1: Vérifier le serveur

```bash
curl http://127.0.0.1:25808/health
```

**Résultat attendu:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-26T...",
  "providers": [
    {
      "name": "gemini_api_key",
      "displayName": "Gemini API Key (Rotative)",
      "enabled": true,
      "type": "api"
    }
  ]
}
```

### Test 2: Lister les modèles

```bash
curl http://127.0.0.1:25808/v1/models
```

**Résultat attendu:**
- 7 modèles retournés
- Format OpenAI compatible

### Test 3: Chat simple

```bash
curl -X POST http://127.0.0.1:25808/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "messages": [{"role": "user", "content": "Test"}]
  }'
```

**Résultat attendu:**
- Réponse de Gemini
- Format OpenAI compatible
- Logs montrent la clé utilisée

### Test 4: Rotation des clés

**Faire 3 requêtes successives et vérifier les logs:**

```bash
for i in {1..3}; do
  curl -X POST http://127.0.0.1:25808/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{"model":"gemini-3-flash","messages":[{"role":"user","content":"Test '$i'"}]}'
  echo ""
done
```

**Résultat attendu:**
- 3 clés différentes utilisées
- Logs montrent la rotation

---

## 🔍 Dépannage

### Problème: n8n ne charge pas les modèles

**Solution:**
1. Vérifier que le serveur est démarré: `curl http://127.0.0.1:25808/health`
2. Vérifier l'URL dans n8n: `http://127.0.0.1:25808/v1` (pas `localhost`)
3. Vérifier que l'API Key est renseignée (n'importe quelle valeur)

### Problème: Erreur "Not Found"

**Cause:** URL incorrecte

**Solution:**
- Utiliser `/v1` comme Base URL (pas `/v1/gemini-api-key`)
- Exemple correct: `http://127.0.0.1:25808/v1`

### Problème: Erreur "ECONNREFUSED"

**Cause:** n8n essaie de se connecter via IPv6

**Solution:**
- Utiliser `127.0.0.1` au lieu de `localhost`
- Si n8n est dans Docker: utiliser `host.docker.internal:25808`

### Problème: Pas de réponse

**Vérifications:**
1. Serveur démarré: `curl http://127.0.0.1:25808/health`
2. Clés API configurées dans `.env`
3. Logs du serveur pour voir les erreurs

---

## 📊 Monitoring

### Logs du serveur

**Le serveur affiche:**
- Quelle clé est utilisée pour chaque requête
- Nombre de requêtes par clé
- Erreurs éventuelles de l'API Gemini

**Exemple:**
```
[2026-02-26T...] POST /v1/chat/completions - Model: gemini-3-flash
🔑 Utilisation de la clé: GEMINI_API_KEY_OHADA_FINANCE_A (1 requêtes)
```

### Vérifier la rotation

**Faire plusieurs requêtes et observer les logs:**
- Les clés doivent changer à chaque requête
- Rotation circulaire (1 → 2 → 3 → ... → 27 → 1)

---

## 🎯 Best practices

### 1. Choix du modèle

**Pour la rapidité:**
- `gemini-3-flash` ⭐ (nouveau, très rapide)
- `gemini-2.5-flash`

**Pour la qualité:**
- `gemini-3-pro` ⭐ (nouveau, plus puissant)
- `gemini-2.5-pro`

**Pour l'expérimentation:**
- `gemini-exp-1206`

### 2. Gestion des limites

**Limites par clé:**
- 5 requêtes/minute
- 250k tokens/jour

**Avec 27 clés:**
- 135 requêtes/minute
- 6.75M tokens/jour

**Recommandation:**
- Surveiller les logs pour détecter les erreurs de limite
- Ajouter plus de clés si nécessaire

### 3. Configuration n8n

**Recommandations:**
- Utiliser `127.0.0.1` au lieu de `localhost`
- Définir un timeout approprié (30-60 secondes)
- Gérer les erreurs avec un nœud "Error Trigger"

---

## 📚 Ressources

**Documentation:**
- [README.md](README.md) - Index principal
- [INDEX.md](INDEX.md) - Navigation complète
- [RAPPORT_FINAL.md](RAPPORT_FINAL.md) - Rapport détaillé

**Fichiers:**
- `server-simple.js` - Serveur principal
- `gemini-api-client.js` - Client API avec rotation
- `.env` - Configuration des 27 clés

**Tests:**
- `test-models-endpoint.js` - Tester `/v1/models`
- `test-chat-endpoint.js` - Tester `/v1/chat/completions`

---

## ✅ Checklist de démarrage

- [ ] Serveur démarré: `node server-simple.js`
- [ ] Health check OK: `curl http://127.0.0.1:25808/health`
- [ ] Modèles listés: `curl http://127.0.0.1:25808/v1/models`
- [ ] n8n configuré avec Base URL: `http://127.0.0.1:25808/v1`
- [ ] API Key définie: `dummy`
- [ ] Modèle choisi: `gemini-3-flash`
- [ ] Workflow testé et fonctionnel
- [ ] Rotation visible dans les logs

---

**Créé le:** 26 février 2026  
**Version:** 2.0.0  
**Auteur:** AionUi Team
