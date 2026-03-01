# 📝 MEMO - Mode "auto" de Gemini CLI

## 🎯 Résumé en 30 secondes

Le mode **"auto"** est un alias intelligent de Gemini CLI qui sélectionne automatiquement le meilleur modèle Gemini disponible. Actuellement, il utilise **gemini-2.5-pro** et basculera automatiquement vers **gemini-3-pro-preview** quand il sera disponible.

## ✅ Configuration actuelle

```env
GEMINI_DEFAULT_MODEL=auto
```

Le serveur des assistants utilise maintenant le mode "auto" par défaut, comme dans l'application Electron desktop.

## 🤖 Qu'est-ce que "auto" ?

```
auto → gemini-2.5-pro (actuellement)
auto → gemini-3-pro-preview (futur)
```

C'est un **alias intelligent** qui:
- ✅ Choisit le meilleur modèle disponible
- ✅ Se met à jour automatiquement
- ✅ Optimise les performances
- ✅ Simplifie la configuration

## 🔄 Autres alias disponibles

| Alias | Modèle actuel | Usage |
|-------|---------------|-------|
| `auto` | gemini-2.5-pro | Production (recommandé) |
| `pro` | gemini-2.5-pro | Tâches complexes |
| `flash` | gemini-2.5-flash | Développement/tests |
| `flash-lite` | gemini-2.5-flash-lite | Tâches simples |

## 🚀 Utilisation dans n8n

### URL de base
```
http://localhost:25810/api/v1/chat/completions
```

### Body JSON (mode auto)
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Votre message"
    }
  ],
  "model": "auto"
}
```

### Body JSON complet
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Votre message"
    }
  ],
  "model": "auto",
  "temperature": 0.7,
  "max_tokens": 2048
}
```

## 💡 Pourquoi utiliser "auto" ?

### ✅ Avantages
1. **Sélection intelligente** - Gemini CLI choisit le meilleur modèle
2. **Mise à jour automatique** - Bascule vers Gemini 3 sans intervention
3. **Cohérence** - Même comportement que l'app Electron
4. **Simplicité** - Pas besoin de choisir le modèle

### ❌ Quand ne pas utiliser "auto"
- Besoin de contrôle précis du modèle
- Budget strict (coûts variables)
- Tests nécessitant un modèle spécifique

## 🎯 Cas d'usage recommandés

### Production → "auto"
```json
{
  "model": "auto",
  "temperature": 0.7,
  "max_tokens": 2048
}
```

### Développement → "flash"
```json
{
  "model": "flash",
  "temperature": 0.5,
  "max_tokens": 1024
}
```

### Tâches complexes → "pro"
```json
{
  "model": "pro",
  "temperature": 0.8,
  "max_tokens": 4096
}
```

### Tâches simples → "flash-lite"
```json
{
  "model": "flash-lite",
  "temperature": 0.5,
  "max_tokens": 512
}
```

## 🧪 Test rapide

### En ligne de commande
```bash
gemini -m auto -p "What model are you?"
```

### Avec le serveur
```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "auto"
  }'
```

### Avec un script
```bash
node scripts/test-mode-auto.js
```

## 📊 Comparaison des modes

| Critère | auto | flash | pro | flash-lite |
|---------|------|-------|-----|------------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Vitesse | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Coût | Variable | Moyen | Élevé | Faible |
| Mise à jour | Auto | Manuel | Manuel | Manuel |
| Recommandé | Production | Dev/Test | Complexe | Simple |

## 🔍 Vérification

### Vérifier la configuration
```bash
# Vérifier .env
grep GEMINI_DEFAULT_MODEL .env

# Devrait afficher:
# GEMINI_DEFAULT_MODEL=auto
```

### Vérifier le serveur
```bash
# Health check
curl http://localhost:25810/health

# Devrait retourner:
# {"status":"ok","geminiCli":true,"assistants":13}
```

### Vérifier Gemini CLI
```bash
# Version
gemini --version

# Authentification
gemini auth status

# Test du mode auto
gemini -m auto -p "test"
```

## 🆘 Dépannage rapide

### Le mode "auto" ne fonctionne pas

1. **Vérifier Gemini CLI**
```bash
gemini --version  # Doit être >= 0.31.0
gemini auth status  # Doit être authentifié
```

2. **Vérifier la configuration**
```bash
grep GEMINI_DEFAULT_MODEL .env  # Doit être "auto"
```

3. **Redémarrer le serveur**
```bash
node scripts/server-assistants-standalone.js
```

4. **Tester**
```bash
node scripts/test-mode-auto.js
```

## 📚 Documentation complète

- **Mode auto détaillé**: `MODE_AUTO_GEMINI.md`
- **Installation Gemini CLI**: `INSTALLATION_GEMINI_CLI_COMPLETE.md`
- **Intégration n8n**: `N8N_INTEGRATION_URL.md`
- **Index documentation**: `INDEX_DOCUMENTATION.md`

## 🎓 Exemples pratiques

### Exemple 1: Chat simple
```json
{
  "messages": [
    {"role": "user", "content": "Bonjour"}
  ],
  "model": "auto"
}
```

### Exemple 2: Avec contexte système
```json
{
  "messages": [
    {"role": "system", "content": "Tu es un expert en analyse"},
    {"role": "user", "content": "Analyse ces données"}
  ],
  "model": "auto"
}
```

### Exemple 3: Avec assistant spécifique
```json
{
  "messages": [
    {"role": "user", "content": "Analyse ces données"}
  ],
  "model": "auto",
  "assistant": "data-analyst"
}
```

### Exemple 4: Conversation multi-tours
```json
{
  "messages": [
    {"role": "user", "content": "Bonjour"},
    {"role": "assistant", "content": "Bonjour! Comment puis-je vous aider?"},
    {"role": "user", "content": "Parle-moi de l'IA"}
  ],
  "model": "auto"
}
```

## 🔐 Sécurité

- ✅ Le serveur écoute sur `localhost` uniquement
- ✅ Pas d'authentification requise en local
- ✅ Gemini CLI utilise OAuth2 sécurisé
- ⚠️ Pour un accès distant, ajouter une authentification

## 📈 Performance

### Modèle actuel (auto → gemini-2.5-pro)
- **Vitesse**: ~2-3 secondes par réponse
- **Qualité**: Excellente
- **Contexte**: Jusqu'à 1M tokens
- **Multimodal**: Texte, images, audio, vidéo

### Évolution vers Gemini 3
Quand Gemini 3 sera disponible:
- **Basculement**: Automatique
- **Performance**: Améliorée
- **Capacités**: Étendues
- **Configuration**: Aucune modification nécessaire

## ✅ Checklist rapide

- [ ] Gemini CLI installé et authentifié
- [ ] `.env` configuré avec `GEMINI_DEFAULT_MODEL=auto`
- [ ] Serveur démarré sur le port 25810
- [ ] Health check OK
- [ ] Test mode auto réussi
- [ ] Swagger accessible
- [ ] Prêt pour n8n

## 🎯 Points clés à retenir

1. **"auto" = intelligent** - Gemini CLI choisit le meilleur modèle
2. **Mise à jour automatique** - Bascule vers Gemini 3 sans intervention
3. **Recommandé pour la production** - Performances optimales
4. **Cohérent avec Electron** - Même comportement partout
5. **Simple à utiliser** - Pas besoin de choisir le modèle

## 🚀 Commandes essentielles

```bash
# Démarrer le serveur
node scripts/server-assistants-standalone.js

# Tester le mode auto
node scripts/test-mode-auto.js

# Health check
curl http://localhost:25810/health

# Ouvrir Swagger
start http://localhost:25810/api-docs

# Test Gemini CLI
gemini -m auto -p "test"
```

## 📞 Besoin d'aide ?

1. Consulter `MODE_AUTO_GEMINI.md` pour plus de détails
2. Consulter `INDEX_DOCUMENTATION.md` pour la doc complète
3. Vérifier les logs du serveur
4. Tester avec `scripts/test-mode-auto.js`

---

**Date**: 1er mars 2026  
**Modèle actuel**: gemini-2.5-pro (via auto)  
**Port**: 25810  
**Status**: ✅ Opérationnel  
**Gemini CLI**: v0.31.0

**🎉 Le mode "auto" est configuré et prêt à l'emploi!**
