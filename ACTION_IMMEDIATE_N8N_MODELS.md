# ⚡ ACTION IMMÉDIATE - Configuration n8n avec Modèles

## ✅ Problème Résolu

L'endpoint `/models` a été ajouté. n8n peut maintenant détecter les modèles!

## 🔧 Configuration n8n

### Base URL (IMPORTANT!)
```
http://127.0.0.1:25815/api/v1/cli
```

**⚠️ N'ajoutez PAS `/profile3/chat` ou `/chat` à la fin!**

### Credential
- Type: OpenAI account
- API Key: `dummy` (requis mais non utilisé)

### Model
Sélectionnez dans la liste déroulante:
- **auto** (Recommandé pour qualité)
- **gemini-2.5-flash** (Recommandé pour rapidité)
- gemini-2.5-pro
- gemini-2.0-flash
- gemini-1.5-flash
- gemini-1.5-pro

## 🧪 Test Rapide

```bash
# Vérifier les modèles
curl http://127.0.0.1:25815/api/v1/cli/models

# Tester le chat
curl -X POST http://127.0.0.1:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-2.5-flash","messages":[{"role":"user","content":"Bonjour"}]}'
```

## ✅ Résultat

n8n affichera maintenant les 6 modèles Gemini dans le dropdown!

**Modèles:**
1. auto (Meilleure qualité)
2. gemini-2.5-flash (Plus rapide)
3. gemini-2.5-pro
4. gemini-2.0-flash
5. gemini-1.5-flash
6. gemini-1.5-pro

---

**Base URL:** `http://127.0.0.1:25815/api/v1/cli`  
**Modèles:** 6 disponibles  
**Status:** ✅ Fonctionnel
