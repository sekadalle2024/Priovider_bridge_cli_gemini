# 📊 Comparaison des Serveurs - AionUi

## 🎯 Vue d'Ensemble

Vous disposez de **3 serveurs** différents avec des endpoints OpenAI compatibles:

| Serveur | Port | Base URL | Commande |
|---------|------|----------|----------|
| **Assistants** | 25810 | `http://127.0.0.1:25810/api/v1` | `npm run assistants` |
| **Multi-CLI** | 25815 | `http://127.0.0.1:25815/api/v1/cli` | `npm run multi-cli` |
| **API Keys** | 25808 | `http://127.0.0.1:25808/api/v1` | `npm start` |

## 📡 Endpoints Chat

### 1. Serveur Assistants (Port 25810)
```
POST http://127.0.0.1:25810/api/v1/assistants/chat
```
**Utilise:** Gemini CLI avec mode "auto" (gemini-2.5-pro ou gemini-3-pro-preview)  
**Avantage:** Assistants personnalisés avec instructions spécifiques  
**Profils:** 1 compte (ohada.finance@gmail.com)

### 2. Serveur Multi-CLI (Port 25815)
```
POST http://127.0.0.1:25815/api/v1/cli/chat
```
**Utilise:** Gemini CLI avec plusieurs comptes Google  
**Avantage:** Load balancing entre 2 comptes, quotas multipliés  
**Profils:** 2 comptes actifs (ohada.save@gmail.com, ohada.save3@gmail.com)

### 3. Serveur API Keys (Port 25808)
```
POST http://127.0.0.1:25808/api/v1/gemini-api-key/chat
```
**Utilise:** API Keys Gemini avec rotation automatique  
**Avantage:** 27 API keys, quotas les plus élevés  
**Profils:** 27 API keys (rotation automatique)

## 🔧 Configuration n8n

### Serveur Assistants
```
URL: http://127.0.0.1:25810/api/v1/assistants/chat
Body: {
  "assistant": "data-analyst",
  "message": "Votre message"
}
```

### Serveur Multi-CLI
```
URL: http://127.0.0.1:25815/api/v1/cli/chat
Body: {
  "model": "gemini-2.5-flash",
  "messages": [{"role": "user", "content": "Votre message"}]
}
```

### Serveur API Keys
```
URL: http://127.0.0.1:25808/api/v1/gemini-api-key/chat
Body: {
  "model": "gemini-2.5-flash",
  "messages": [{"role": "user", "content": "Votre message"}]
}
```

## 📈 Capacités et Quotas

### Serveur Assistants (1 compte CLI)
- **Requêtes/minute:** 15-60
- **Tokens/jour:** 1-2M
- **Modèle:** auto (gemini-2.5-pro ou gemini-3-pro-preview)
- **Spécialité:** Assistants personnalisés

### Serveur Multi-CLI (2 comptes CLI)
- **Requêtes/minute:** 30-120
- **Tokens/jour:** 2-4M
- **Modèles:** gemini-2.5-flash, gemini-2.5-pro, etc.
- **Spécialité:** Load balancing, haute disponibilité

### Serveur API Keys (27 clés)
- **Requêtes/minute:** 135 (5 × 27)
- **Tokens/jour:** 6,75M (250k × 27)
- **Modèles:** Tous les modèles Gemini
- **Spécialité:** Quotas maximaux, rotation automatique

## 🎯 Quel Serveur Utiliser?

### Pour des Assistants Spécialisés
→ **Serveur Assistants** (Port 25810)
- Assistants avec instructions personnalisées
- Mode "auto" pour le meilleur modèle

### Pour du Load Balancing
→ **Serveur Multi-CLI** (Port 25815)
- Distribution automatique entre comptes
- Haute disponibilité avec failover

### Pour des Quotas Maximaux
→ **Serveur API Keys** (Port 25808)
- 27 API keys avec rotation
- Quotas les plus élevés

## 🔍 Endpoints de Gestion

### Serveur Assistants
```
GET http://127.0.0.1:25810/api/v1/assistants
GET http://127.0.0.1:25810/health
GET http://127.0.0.1:25810/api-docs
```

### Serveur Multi-CLI
```
GET http://127.0.0.1:25815/api/v1/cli/profiles
GET http://127.0.0.1:25815/api/v1/cli/profiles/stats
GET http://127.0.0.1:25815/health
GET http://127.0.0.1:25815/api-docs
```

### Serveur API Keys
```
GET http://127.0.0.1:25808/api/v1/providers
GET http://127.0.0.1:25808/health
GET http://127.0.0.1:25808/api-docs
```

## 🚀 Commandes de Démarrage

```bash
# Serveur Assistants
npm run assistants

# Serveur Multi-CLI
npm run multi-cli

# Serveur API Keys
npm start
```

## 📝 Notes Importantes

- **Utilisez `127.0.0.1`** au lieu de `localhost` pour tous les serveurs
- **Ports différents:** 25810 (Assistants), 25815 (Multi-CLI), 25808 (API Keys)
- **Format OpenAI Compatible** pour tous les serveurs
- **Tous les serveurs peuvent tourner simultanément**

## 💡 Recommandation

### Pour n8n
1. **Développement/Test:** Serveur Multi-CLI (Port 25815)
2. **Production:** Serveur API Keys (Port 25808) - Quotas maximaux
3. **Assistants Spécialisés:** Serveur Assistants (Port 25810)

---

**Documentation:**
- Assistants: `assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md`
- Multi-CLI: `gemini_cli_multi_provider/00_LIRE_EN_PREMIER.md`
- API Keys: `src/webserver/gemini-api-key-rotative-docs/README.md`
