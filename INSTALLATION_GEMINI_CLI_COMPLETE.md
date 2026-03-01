# ✅ Installation Complète de Gemini CLI

## 📋 Résumé

Gemini CLI a été installé et configuré avec succès pour le serveur des assistants AionUI.

## 🎯 Ce qui a été fait

### 1. Installation de Gemini CLI
```bash
npm install -g @google/gemini-cli
```

**Version installée:** 0.31.0  
**Emplacement:** `C:\Users\LEADER\AppData\Roaming\npm\node_modules\@google\gemini-cli`

### 2. Authentification
Gemini CLI est authentifié avec le compte Google: `ohada.finance@gmail.com`

**Plan:** Gemini Code Assist for individuals

### 3. Configuration du serveur

Le fichier `.env` a été configuré:

```env
# Chemin vers Gemini CLI
GEMINI_CLI_PATH=gemini

# Modèle par défaut
GEMINI_DEFAULT_MODEL=gemini-2.5-flash

# Modèles disponibles
GEMINI_AVAILABLE_MODELS=gemini-3-flash,gemini-3-pro,gemini-2.5-flash,gemini-2.5-pro,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro,gemini-exp-1206
```

### 4. Scripts de test créés

- `scripts/test-gemini-cli-installation.js` - Teste l'installation de Gemini CLI
- `scripts/test-assistant-complete.js` - Test complet du serveur des assistants

## 🚀 Utilisation

### Démarrer le serveur des assistants

```bash
npm run assistants
```

Le serveur démarre sur le port **25810** avec:
- 13 assistants disponibles
- Gemini CLI intégré
- Support de 9 modèles Gemini

### URLs importantes

- **Serveur:** http://localhost:25810
- **Swagger:** http://localhost:25810/api-docs
- **Health Check:** http://localhost:25810/health

### Endpoint OpenAPI pour n8n

```
URL: http://localhost:25810/api/v1/chat/completions
Modèle par défaut: gemini-2.5-flash
Format: Compatible OpenAI
```

## 📝 Modèles Gemini disponibles

Selon la documentation officielle de Gemini CLI:

### Alias de modèles
- `auto` → gemini-2.5-pro ou gemini-3-pro-preview (défaut)
- `pro` → gemini-2.5-pro ou gemini-3-pro-preview
- `flash` → gemini-2.5-flash
- `flash-lite` → gemini-2.5-flash-lite

### Modèles spécifiques
- gemini-2.5-pro
- gemini-2.5-flash
- gemini-2.5-flash-lite
- gemini-2.0-flash
- gemini-1.5-flash
- gemini-1.5-pro
- gemini-exp-1206

**Note:** Les modèles Gemini 3 (gemini-3-flash, gemini-3-pro) ne sont pas encore disponibles dans l'API publique au 1er mars 2026.

## 🧪 Tests

### Test 1: Vérifier l'installation de Gemini CLI

```bash
node scripts/test-gemini-cli-installation.js
```

Ce test vérifie:
- ✅ Version de Gemini CLI
- ✅ Authentification
- ✅ Requête simple avec le modèle par défaut

### Test 2: Test complet du serveur

```bash
node scripts/test-assistant-complete.js
```

Ce test vérifie:
- ✅ Gemini CLI installé
- ✅ Modèle par défaut fonctionne
- ✅ Serveur démarre correctement
- ✅ Health check retourne "geminiCli": "available"

### Test 3: Test manuel avec curl

```bash
# Health check
curl http://localhost:25810/health

# Liste des modèles
curl http://localhost:25810/api/v1/models

# Test de chat
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## 🔧 Commandes Gemini CLI utiles

### Commandes de base

```bash
# Démarrer en mode interactif
gemini

# Requête non-interactive
gemini -p "votre prompt ici"

# Spécifier un modèle
gemini -m gemini-2.5-flash -p "votre prompt"

# Vérifier la version
gemini --version

# Aide
gemini --help
```

### Gestion de l'authentification

```bash
# Se connecter
gemini auth login

# Vérifier le statut
gemini /stats model
```

### Gestion des sessions

```bash
# Lister les sessions
gemini --list-sessions

# Reprendre une session
gemini -r latest

# Reprendre avec un nouveau prompt
gemini -r latest "nouveau prompt"
```

## 📚 Documentation

### Documentation officielle
- Site: https://geminicli.com/docs
- GitHub: https://github.com/google-gemini/gemini-cli
- Quota et tarification: https://geminicli.com/docs/faq/

### Documentation locale
- `assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md` - Guide de démarrage
- `assistant_serveur_endpoint/README.md` - Documentation complète
- `GEMINI_CLI_OBLIGATOIRE.md` - Pourquoi Gemini CLI est obligatoire
- `N8N_ASSISTANTS_ENDPOINT.md` - Intégration avec n8n

## ⚙️ Configuration avancée

### Fichiers de configuration

Gemini CLI utilise plusieurs niveaux de configuration:

1. **Système par défaut:** `/etc/gemini-cli/system-defaults.json` (Linux)
2. **Utilisateur:** `~/.gemini/settings.json`
3. **Projet:** `.gemini/settings.json`
4. **Variables d'environnement**
5. **Arguments en ligne de commande**

### Variables d'environnement importantes

```env
GEMINI_API_KEY=votre_clé_api
GEMINI_MODEL=gemini-2.5-flash
GEMINI_CLI_HOME=~/.gemini
NO_COLOR=1  # Désactive les couleurs
DEBUG=1     # Active les logs de debug
```

### Sandboxing

Pour exécuter Gemini CLI dans un environnement sécurisé:

```bash
# Avec Docker
gemini --sandbox -y -p "votre prompt"

# Avec un Dockerfile personnalisé
# Créer .gemini/sandbox.Dockerfile
BUILD_SANDBOX=1 gemini -s
```

## 🐛 Dépannage

### Problème: "Gemini CLI not found"

**Solution:** Vérifier que npm global bin est dans le PATH:

```bash
npm root -g
# Ajouter C:\Users\LEADER\AppData\Roaming\npm au PATH si nécessaire
```

### Problème: "ModelNotFoundError"

**Solution:** Le modèle demandé n'existe pas. Utiliser un modèle disponible:

```bash
# Lister les modèles disponibles
gemini /model manage

# Utiliser un alias
gemini -m auto -p "test"
gemini -m flash -p "test"
```

### Problème: "Rate limit exceeded"

**Solution:** Vous avez dépassé votre quota. Vérifier dans Google AI Studio:

```bash
# Voir les statistiques d'usage
gemini /stats model
```

### Problème: Le serveur ne détecte pas Gemini CLI

**Solution:** Vérifier la configuration dans `.env`:

```env
GEMINI_CLI_PATH=gemini
```

Sur Windows, le serveur utilise automatiquement `cmd.exe /c gemini` pour exécuter les commandes.

## 📊 Statistiques et monitoring

### Voir les statistiques de session

```bash
gemini /stats session
```

### Voir les statistiques du modèle

```bash
gemini /stats model
```

### Voir les statistiques des outils

```bash
gemini /stats tools
```

## 🔐 Sécurité et confidentialité

### Télémétrie

Gemini CLI collecte des statistiques d'usage anonymisées. Pour désactiver:

```json
// ~/.gemini/settings.json
{
  "privacy": {
    "usageStatisticsEnabled": false
  }
}
```

### Ce qui est collecté
- Appels d'outils (noms, succès/échec, durée)
- Requêtes API (modèle, durée, succès)
- Informations de session (config, outils activés)

### Ce qui N'est PAS collecté
- Informations personnellement identifiables (PII)
- Contenu des prompts et réponses
- Contenu des fichiers

## 🎓 Prochaines étapes

1. **Tester les assistants** - Essayer les 13 assistants disponibles
2. **Intégrer avec n8n** - Utiliser l'endpoint OpenAPI dans vos workflows
3. **Créer des assistants personnalisés** - Ajouter vos propres assistants dans `assistant/`
4. **Explorer les Agent Skills** - Étendre les capacités avec des compétences spécialisées

## ✅ Checklist finale

- [x] Gemini CLI installé (v0.31.0)
- [x] Authentification configurée (ohada.finance@gmail.com)
- [x] Serveur des assistants configuré
- [x] Tests de validation créés
- [x] Documentation complète
- [x] Modèle par défaut: gemini-2.5-flash
- [x] 13 assistants découverts
- [x] Endpoint OpenAPI compatible n8n

## 📞 Support

Pour toute question ou problème:

1. Consulter la documentation officielle: https://geminicli.com/docs
2. Vérifier les issues GitHub: https://github.com/google-gemini/gemini-cli/issues
3. Consulter la FAQ: https://geminicli.com/docs/faq/

---

**Date de création:** 1er mars 2026  
**Version Gemini CLI:** 0.31.0  
**Statut:** ✅ Installation complète et fonctionnelle
