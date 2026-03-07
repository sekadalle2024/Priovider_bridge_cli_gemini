# 🚀 Mise à Jour Gemini CLI v0.32.1 - README

## ⚡ Démarrage Ultra-Rapide (30 secondes)

```bash
# 1. Vérifier la version actuelle
gemini --version  # Devrait afficher 0.32.1

# 2. Si ce n'est pas le cas, mettre à jour
npm install -g @google/gemini-cli@latest

# 3. Tester
node scripts/test-gemini-3-1-pro.js

# 4. Redémarrer le serveur AionUI
npm run assistants
```

## 🎯 Qu'est-ce qui a changé?

### Gemini 3.1 Pro Preview 🆕

Le nouveau modèle le plus puissant de Google (déploiement progressif).

```bash
# Tester si vous avez accès
gemini -m gemini-3.1-pro-preview -p "Hello"
```

### Routage Auto Amélioré

Le modèle "auto" est maintenant plus intelligent.

```bash
# Utiliser le routage auto (recommandé)
gemini -m auto -p "votre prompt"
```

### Performance +50%

Démarrage 30-50% plus rapide grâce au chargement parallèle des extensions.

## 📚 Documentation

### Je veux...

**...démarrer en 3 minutes**  
→ [QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)

**...comprendre tous les changements**  
→ [UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md)

**...configurer AionUI**  
→ [assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md](./assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md)

**...naviguer dans la documentation**  
→ [INDEX_UPDATE_GEMINI_CLI.md](./INDEX_UPDATE_GEMINI_CLI.md)

**...voir le récapitulatif complet**  
→ [TACHE_4_UPDATE_GEMINI_CLI_COMPLETE.md](./TACHE_4_UPDATE_GEMINI_CLI_COMPLETE.md)

## 🧪 Tests

### Test Automatique

```bash
node scripts/test-gemini-3-1-pro.js
```

**Ce qui est testé:**
- ✅ Version de Gemini CLI (0.32.1)
- ✅ Modèle stable (gemini-2.5-flash)
- ✅ Accès à Gemini 3.1 Pro Preview
- ✅ Routage Auto

### Tests Manuels

```bash
# Test 1: Version
gemini --version

# Test 2: Modèle stable
gemini -m gemini-2.5-flash -p "Test"

# Test 3: Routage auto
gemini -m auto -p "Test"

# Test 4: Serveur AionUI
npm run assistants
curl http://localhost:25810/health
curl http://localhost:25810/api/v1/models
```

## 📋 Modèles Disponibles

### Recommandés

| Modèle | Usage | Vitesse | Qualité | Disponibilité |
|--------|-------|---------|---------|---------------|
| `auto` | Général | Auto | Auto | ✅ Tous |
| `gemini-2.5-flash` | Défaut | ⚡⚡⚡ | ⭐⭐⭐ | ✅ Tous |
| `gemini-2.5-pro` | Premium | ⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ Tous |
| `gemini-3.1-pro-preview` | Nouveau | ⚡⚡ | ⭐⭐⭐⭐⭐⭐ | ⚠️ Progressif |

### Tous les Modèles

```
Gemini 3.x (nécessite accès):
- gemini-3.1-pro-preview  🆕 Nouveau
- gemini-3-pro
- gemini-3-flash

Gemini 2.5:
- gemini-2.5-pro
- gemini-2.5-flash (défaut)
- gemini-2.5-flash-lite

Gemini 2.0 et 1.5:
- gemini-2.0-flash
- gemini-1.5-pro
- gemini-1.5-flash

Expérimental:
- gemini-exp-1206

Alias:
- auto (recommandé)
- pro
- flash
- flash-lite
```

## 🔧 Configuration AionUI

### Fichier .env

```env
# Modèle par défaut
GEMINI_DEFAULT_MODEL=auto

# Modèles disponibles
GEMINI_AVAILABLE_MODELS=auto,pro,flash,flash-lite,gemini-3.1-pro-preview,gemini-3-flash,gemini-3-pro,gemini-2.5-flash,gemini-2.5-pro,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro,gemini-exp-1206
```

### Redémarrer le Serveur

```bash
npm run assistants
```

## 🌐 Intégration n8n

### Configuration

**URL:** `http://localhost:25810/api/v1/chat/completions`

**Méthode:** POST

**Body:**
```json
{
  "model": "auto",
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ]
}
```

## 🎯 Nouveautés v0.32.1

### 1. Gemini 3.1 Pro Preview 🆕
Nouveau modèle le plus puissant (déploiement progressif)

### 2. Generalist Agent 🤖
Routage intelligent automatique

### 3. Performance ⚡
Démarrage 30-50% plus rapide

### 4. Plan Mode 📋
Amélioré pour tâches complexes

### 5. Browser Agent 🌐
Expérimental pour web scraping

### 6. Model Steering 🔧
Configuration avancée

### 7. Policy Engine 🛡️
Sécurité renforcée

### 8. Shell Autocomplétion ⌨️
Navigation améliorée

### 9. Web Fetch Amélioré 🌍
Rate limiting et sécurité

## 🐛 Dépannage Rapide

### Gemini 3.1 non disponible

**C'est normal!** Le déploiement est progressif.

**Solutions:**
```bash
# Utiliser le routage auto
gemini -m auto

# Utiliser gemini-2.5-pro
gemini -m gemini-2.5-pro
```

### "Model not found"

**Solutions:**
```bash
# Utiliser un alias
gemini -m auto

# Vérifier les modèles disponibles
gemini /model manage
```

### Serveur ne démarre pas

**Solutions:**
```bash
# Vérifier Gemini CLI
gemini --version

# Vérifier .env
cat .env | grep GEMINI

# Redémarrer
npm run assistants
```

## ✅ Checklist

- [ ] Gemini CLI v0.32.1 installé
- [ ] Tests exécutés
- [ ] Fichier .env mis à jour
- [ ] Serveur redémarré
- [ ] Nouveaux modèles testés
- [ ] Documentation lue

## 📞 Support

**Documentation:**
- [QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md) - Démarrage rapide
- [UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md) - Guide complet
- [INDEX_UPDATE_GEMINI_CLI.md](./INDEX_UPDATE_GEMINI_CLI.md) - Navigation

**Ressources officielles:**
- Site: https://geminicli.com/docs
- GitHub: https://github.com/google-gemini/gemini-cli
- FAQ: https://geminicli.com/docs/faq/

**Tests:**
```bash
node scripts/test-gemini-3-1-pro.js
```

## 🎉 Résumé

**Version:** 0.31.0 → 0.32.1  
**Date:** 7 mars 2026  
**Statut:** ✅ Mise à jour complète

**Nouveautés:**
- 🆕 Gemini 3.1 Pro Preview
- 🤖 Generalist Agent
- ⚡ Performance +50%
- 📋 Plan Mode amélioré
- 🌐 Browser Agent expérimental

**Impact:**
- ✅ Compatibilité totale avec AionUI
- ✅ Nouveaux modèles disponibles
- ✅ Performance améliorée
- ✅ Documentation complète

---

**Prêt à utiliser!** 🚀

Pour démarrer: [QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)
