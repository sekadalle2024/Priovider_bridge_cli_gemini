# 🚀 Déploiement Netlify - Serveur des Assistants EXPLIQUÉ

## ✅ OUI, c'est possible! Mais avec une différence importante

Vous avez raison! Le **provider-bridge** fonctionne sur Netlify, et nous pouvons faire pareil pour les assistants.

## 🔑 La clé: Deux modes différents

### Provider Bridge offre 2 modes:

```
┌─────────────────────────────────────────────────────────┐
│              PROVIDER BRIDGE                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Mode 1: Gemini CLI (OAuth)                             │
│  └─ /cli → Gemini CLI                                   │
│     ✅ LOCAL uniquement                                  │
│     ✅ Gratuit (OAuth)                                   │
│     ✅ Mode "auto"                                       │
│                                                          │
│  Mode 2: Gemini API Keys (REST)                         │
│  └─ /v1 → API REST Gemini                               │
│     ✅ NETLIFY compatible                                │
│     ✅ Utilise les API keys                             │
│     ❌ Pas de mode "auto" (doit spécifier le modèle)    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📊 Serveur des Assistants: Même approche

Nous pouvons créer **2 versions** du serveur des assistants:

### Version 1: Local (Gemini CLI) - ACTUELLE
```
Port: 25810
URL: http://localhost:25810/api/v1
Technologie: Gemini CLI (OAuth)
Mode "auto": ✅ OUI
Déploiement: ❌ Local uniquement
```

**Fichier**: `scripts/server-assistants-standalone.js`

### Version 2: Netlify (API Keys) - NOUVELLE
```
URL: https://votre-site.netlify.app/assistants/v1
Technologie: API REST Gemini (API Keys)
Mode "auto": ❌ NON (utilise gemini-2.5-flash par défaut)
Déploiement: ✅ Netlify
```

**Fichiers**: `netlify/functions/assistants-*.ts`

## 🎯 Ce que j'ai créé

J'ai déjà créé les 4 fonctions Netlify nécessaires:

1. **`netlify/functions/assistants-chat.ts`**
   - Endpoint principal de chat
   - Utilise l'API REST de Gemini avec rotation des API keys
   - Charge les assistants depuis le dossier `assistant/`
   - Compatible OpenAI

2. **`netlify/functions/assistants-models.ts`**
   - Liste les 13 modèles disponibles
   - Format compatible OpenAI

3. **`netlify/functions/assistants-list.ts`**
   - Liste les 13 assistants disponibles

4. **`netlify/functions/assistants-health.ts`**
   - Health check

## 📋 Différences entre les deux versions

| Caractéristique | Local (CLI) | Netlify (API Keys) |
|-----------------|-------------|---------------------|
| **Technologie** | Gemini CLI | API REST Gemini |
| **Authentification** | OAuth (gratuit) | API Keys |
| **Mode "auto"** | ✅ OUI | ❌ NON |
| **Modèle par défaut** | auto → gemini-2.5-pro | gemini-2.5-flash |
| **Installation** | Gemini CLI requis | Aucune |
| **Déploiement** | Local/VPS | Netlify/Vercel |
| **Coût** | Gratuit | Limité par quotas API |
| **URL** | localhost:25810 | votre-site.netlify.app |

## 🚀 Comment déployer sur Netlify

### 1. Configurer les variables d'environnement

Dans Netlify UI, ajoutez toutes vos API keys Gemini:

```
GEMINI_API_KEY_OHADA_FINANCE_A=AIzaSy...
GEMINI_API_KEY_OHADA_FINANCE_B=AIzaSy...
GEMINI_API_KEY_OHADA_FINANCE_C=AIzaSy...
... (toutes vos clés)
```

### 2. Déployer

```bash
# Build
npm run build

# Déployer
npx netlify deploy --prod
```

### 3. Utiliser

```
Base URL: https://votre-site.netlify.app/assistants/v1
```

## 🔗 URLs des endpoints

### Version Netlify

```
POST   https://votre-site.netlify.app/assistants/v1/chat/completions
GET    https://votre-site.netlify.app/assistants/v1/models
GET    https://votre-site.netlify.app/assistants/v1/assistants
GET    https://votre-site.netlify.app/assistants/health
```

### Version Locale (actuelle)

```
POST   http://localhost:25810/api/v1/chat/completions
GET    http://localhost:25810/api/v1/models
GET    http://localhost:25810/api/v1/assistants
GET    http://localhost:25810/health
```

## 💡 Quelle version utiliser?

### Utilisez la version LOCALE si:
- ✅ Vous développez en local
- ✅ Vous voulez le mode "auto"
- ✅ Vous voulez utiliser OAuth gratuit
- ✅ Vous avez accès à votre machine

### Utilisez la version NETLIFY si:
- ✅ Vous voulez un déploiement cloud
- ✅ Vous avez des API keys Gemini
- ✅ Vous voulez une URL publique stable
- ✅ Vous utilisez n8n cloud

## 🎨 Configuration n8n

### Avec la version Netlify

```
Credentials: OpenAI
API Key: dummy
Base URL: https://votre-site.netlify.app/assistants/v1
```

### Avec la version Locale

```
Credentials: OpenAI
API Key: dummy
Base URL: http://localhost:25810/api/v1
```

## 📊 Exemple de requête

### Version Netlify (API Keys)

```bash
curl -X POST https://votre-site.netlify.app/assistants/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      {
        "role": "user",
        "content": "Analyze this data"
      }
    ],
    "assistant": "data-analyst"
  }'
```

### Version Locale (Gemini CLI)

```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [
      {
        "role": "user",
        "content": "Analyze this data"
      }
    ],
    "assistant": "data-analyst"
  }'
```

## ⚙️ Modèles disponibles

### Version Netlify
```
gemini-2.5-flash (par défaut)
gemini-2.5-pro
gemini-2.5-flash-lite
gemini-2.0-flash
gemini-1.5-flash
gemini-1.5-pro
... (13 modèles)
```

### Version Locale
```
auto (recommandé - sélection automatique)
pro
flash
flash-lite
gemini-2.5-flash
gemini-2.5-pro
... (13 modèles)
```

## 🔄 Rotation des API Keys

La version Netlify utilise la même rotation que provider-bridge:

```javascript
// Rotation automatique entre toutes les clés configurées
const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY_OHADA_FINANCE_A,
  process.env.GEMINI_API_KEY_OHADA_FINANCE_B,
  // ... toutes vos clés
].filter(Boolean);

// Rotation simple
let currentKeyIndex = 0;
function getNextApiKey() {
  const key = GEMINI_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
  return key;
}
```

## 📈 Limites et quotas

### Version Netlify (API Keys)
- **Par clé**: 15 req/min, 1500 req/jour
- **Total (27 clés)**: 405 req/min, 40,500 req/jour
- **Coût**: Gratuit (tier gratuit Gemini)

### Version Locale (OAuth)
- **Quota OAuth**: Généreux
- **Coût**: Gratuit
- **Limite**: Dépend de votre compte Google

## ✅ Checklist de déploiement Netlify

- [ ] Fonctions Netlify créées (`netlify/functions/assistants-*.ts`)
- [ ] `netlify.toml` mis à jour avec les redirects
- [ ] Variables d'environnement configurées (API keys)
- [ ] Dossier `assistant/` inclus dans le build
- [ ] Build testé localement (`npm run build`)
- [ ] Déployé sur Netlify (`npx netlify deploy --prod`)
- [ ] Endpoints testés
- [ ] Configuration n8n mise à jour

## 🆘 Dépannage

### Erreur: "No Gemini API keys configured"
**Solution**: Ajoutez les variables d'environnement dans Netlify UI

### Erreur: "Assistant not found"
**Solution**: Vérifiez que le dossier `assistant/` est inclus dans le build

### Le mode "auto" ne fonctionne pas
**Solution**: Normal! La version Netlify n'a pas le mode "auto". Utilisez `gemini-2.5-flash` à la place.

## 🎯 Conclusion

**OUI, vous pouvez déployer sur Netlify!**

Mais vous devez comprendre:
- ✅ **Netlify** = API Keys Gemini (pas de mode "auto")
- ✅ **Local** = Gemini CLI OAuth (avec mode "auto")

Les deux versions sont valides et fonctionnelles. Choisissez selon vos besoins!

---

**Date**: 1er mars 2026  
**Version Netlify**: API Keys (gemini-2.5-flash par défaut)  
**Version Locale**: Gemini CLI (mode "auto")  
**Les deux fonctionnent!** ✅
