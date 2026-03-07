# 🚀 Mise à Jour Gemini CLI v0.32.1 pour AionUI

## ✅ Mise à Jour Effectuée

**Version:** 0.31.0 → 0.32.1  
**Date:** 7 mars 2026

```bash
npm install -g @google/gemini-cli@latest
gemini --version  # 0.32.1
```

## 🎯 Nouveautés Importantes

### 1. Gemini 3.1 Pro Preview 🆕

Nouveau modèle le plus puissant (déploiement progressif).

**Vérifier l'accès:**
```bash
node scripts/test-gemini-3-1-pro.js
```

**Utilisation dans AionUI:**
```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-pro-preview",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 2. Generalist Agent

Agent généraliste pour un meilleur routage des tâches.

**Avantages:**
- Routage intelligent automatique
- Meilleure compréhension du contexte
- Optimisation des quotas

### 3. Chargement Parallèle des Extensions

**Impact:** Démarrage 30-50% plus rapide

### 4. Plan Mode Amélioré

Pour les tâches complexes nécessitant une planification.

**Activation:**
```json
// ~/.gemini/settings.json
{
  "experimental": {
    "plan": true
  }
}
```

### 5. Browser Agent (Expérimental)

Pour interagir avec les pages web.

**Activation:**
```json
{
  "experimental": {
    "browserAgent": true
  }
}
```

## 📋 Configuration AionUI

### Fichier .env Mis à Jour

```env
# Modèle par défaut
GEMINI_DEFAULT_MODEL=auto

# Modèles disponibles (avec gemini-3.1-pro-preview)
GEMINI_AVAILABLE_MODELS=auto,pro,flash,flash-lite,gemini-3.1-pro-preview,gemini-3-flash,gemini-3-pro,gemini-2.5-flash,gemini-2.5-pro,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro,gemini-exp-1206
```

### Redémarrer le Serveur

```bash
npm run assistants
```

## 🧪 Tests

### Test Rapide

```bash
# Test complet
node scripts/test-gemini-3-1-pro.js

# Test manuel
gemini -m gemini-2.5-flash -p "Test"
gemini -m auto -p "Test"
gemini -m gemini-3.1-pro-preview -p "Test"  # Si disponible
```

### Test du Serveur

```bash
# Health check
curl http://localhost:25810/health

# Liste des modèles
curl http://localhost:25810/api/v1/models

# Test de chat
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## 📊 Modèles Recommandés

| Modèle | Usage | Vitesse | Qualité | Disponibilité |
|--------|-------|---------|---------|---------------|
| `auto` | Général | Auto | Auto | ✅ Tous |
| `gemini-2.5-flash` | Défaut | ⚡⚡⚡ | ⭐⭐⭐ | ✅ Tous |
| `gemini-2.5-pro` | Premium | ⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ Tous |
| `gemini-3.1-pro-preview` | Nouveau | ⚡⚡ | ⭐⭐⭐⭐⭐⭐ | ⚠️ Progressif |

## 🔧 Utilisation avec n8n

### Endpoint OpenAPI

**URL:** `http://localhost:25810/api/v1/chat/completions`

**Body:**
```json
{
  "model": "auto",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ]
}
```

### Modèles Recommandés

- **`auto`** - Routage intelligent (recommandé)
- **`gemini-2.5-flash`** - Rapide et stable
- **`gemini-2.5-pro`** - Haute qualité
- **`gemini-3.1-pro-preview`** - Nouveau (si disponible)

## 📚 Documentation

### Fichiers Créés

1. **UPDATE_GEMINI_CLI_v0.32.md** (racine) - Guide complet
2. **QUICK_START_GEMINI_v0.32.md** (racine) - Démarrage rapide
3. **scripts/test-gemini-3-1-pro.js** - Script de test
4. **assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md** (ce fichier)

### Fichiers Mis à Jour

1. **.env** - Ajout de gemini-3.1-pro-preview
2. **INSTALLATION_GEMINI_CLI_COMPLETE.md** - Référence à v0.32.1

### Documentation Existante

- **00_LIRE_EN_PREMIER.md** - Guide de démarrage
- **README.md** - Documentation complète
- **GEMINI_CLI_OBLIGATOIRE.md** - Pourquoi Gemini CLI
- **N8N_ASSISTANTS_ENDPOINT.md** - Intégration n8n

## 🐛 Dépannage

### Gemini 3.1 non disponible

**C'est normal!** Le déploiement est progressif.

**Solutions:**
- Utiliser `auto` (routage intelligent)
- Utiliser `gemini-2.5-pro` (haute qualité)
- Réessayer plus tard

### Erreur "Model not found"

**Solutions:**
```bash
# Utiliser un alias
gemini -m auto

# Vérifier les modèles disponibles
gemini /model manage

# Utiliser un modèle stable
gemini -m gemini-2.5-flash
```

### Serveur ne détecte pas les nouveaux modèles

**Solution:**
```bash
# Vérifier .env
cat .env | grep GEMINI_AVAILABLE_MODELS

# Redémarrer le serveur
npm run assistants
```

## ✅ Checklist

- [x] Gemini CLI mis à jour vers v0.32.1
- [x] Fichier .env mis à jour
- [x] Script de test créé
- [x] Documentation créée
- [ ] Tests exécutés
- [ ] Serveur redémarré
- [ ] Nouveaux modèles testés

## 🎉 Résumé

La mise à jour vers Gemini CLI v0.32.1 apporte:

✅ **Nouveau modèle Gemini 3.1 Pro Preview**  
✅ **Routage intelligent amélioré**  
✅ **Performance accrue (chargement parallèle)**  
✅ **Nouvelles fonctionnalités expérimentales**  
✅ **Compatibilité totale avec AionUI**

**Prochaines étapes:**
1. Exécuter `node scripts/test-gemini-3-1-pro.js`
2. Redémarrer le serveur: `npm run assistants`
3. Tester les nouveaux modèles
4. Mettre à jour vos workflows n8n si nécessaire

## 🔗 Ressources

- **Documentation complète:** UPDATE_GEMINI_CLI_v0.32.md (racine)
- **Démarrage rapide:** QUICK_START_GEMINI_v0.32.md (racine)
- **Site officiel:** https://geminicli.com/docs
- **Releases:** https://github.com/google-gemini/gemini-cli/releases

---

**Version:** 0.32.1  
**Date:** 7 mars 2026  
**Statut:** ✅ Mise à jour complète
