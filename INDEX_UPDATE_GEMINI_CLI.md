# 📚 Index - Mise à Jour Gemini CLI v0.32.1

## 🎯 Navigation Rapide

### 🚀 Démarrage Rapide

**Je veux démarrer en 3 minutes:**
→ **[QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)**

**Je veux comprendre les changements:**
→ **[UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md)**

**Je veux tester les nouveaux modèles:**
→ Exécuter `node scripts/test-gemini-3-1-pro.js`

**Je veux configurer AionUI:**
→ **[assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md](./assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md)**

## 📋 Fichiers Créés

### Documentation Principale

1. **[UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md)** ⭐⭐⭐
   - Guide complet de mise à jour
   - Toutes les nouveautés détaillées
   - Configuration avancée
   - Dépannage complet

2. **[QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)** ⭐⭐
   - Démarrage en 3 minutes
   - Tests rapides
   - Configuration essentielle
   - Commandes utiles

3. **[INDEX_UPDATE_GEMINI_CLI.md](./INDEX_UPDATE_GEMINI_CLI.md)** (ce fichier)
   - Navigation dans la documentation
   - Liens vers toutes les ressources

### Documentation Spécifique AionUI

4. **[assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md](./assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md)** ⭐
   - Configuration pour le serveur des assistants
   - Intégration avec n8n
   - Tests spécifiques

### Scripts de Test

5. **[scripts/test-gemini-3-1-pro.js](./scripts/test-gemini-3-1-pro.js)**
   - Test automatique de la mise à jour
   - Vérification des nouveaux modèles
   - Validation complète

### Fichiers Mis à Jour

6. **[.env](./.env)**
   - Ajout de `gemini-3.1-pro-preview`
   - Configuration des modèles disponibles

7. **[assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md](./assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md)**
   - Mise à jour de la liste des modèles
   - Référence à la nouvelle version

## 🎯 Par Cas d'Usage

### Je veux mettre à jour Gemini CLI

```bash
# 1. Mettre à jour
npm install -g @google/gemini-cli@latest

# 2. Vérifier
gemini --version  # Devrait afficher 0.32.1

# 3. Tester
node scripts/test-gemini-3-1-pro.js
```

**Documentation:** [UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md)

### Je veux utiliser les nouveaux modèles

**Modèles disponibles:**
- `gemini-3.1-pro-preview` 🆕 (déploiement progressif)
- `auto` (routage intelligent)
- `gemini-2.5-flash` (défaut stable)
- `gemini-2.5-pro` (haute qualité)

**Test:**
```bash
# Test avec le nouveau modèle
gemini -m gemini-3.1-pro-preview -p "Test"

# Test avec routage auto
gemini -m auto -p "Test"
```

**Documentation:** [QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)

### Je veux configurer AionUI

**Étapes:**
1. Mettre à jour `.env`
2. Redémarrer le serveur: `npm run assistants`
3. Tester: `curl http://localhost:25810/api/v1/models`

**Documentation:** [assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md](./assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md)

### Je veux intégrer avec n8n

**Endpoint:** `http://localhost:25810/api/v1/chat/completions`

**Modèle recommandé:** `auto` (routage intelligent)

**Body:**
```json
{
  "model": "auto",
  "messages": [
    {"role": "user", "content": "{{ $json.prompt }}"}
  ]
}
```

**Documentation:** [assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md](./assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md)

### Je veux explorer les nouvelles fonctionnalités

**Nouveautés v0.32.1:**

1. **Gemini 3.1 Pro Preview** 🆕
   - Nouveau modèle le plus puissant
   - Déploiement progressif
   - Test: `gemini -m gemini-3.1-pro-preview`

2. **Generalist Agent**
   - Routage intelligent automatique
   - Meilleure compréhension du contexte
   - Activé par défaut

3. **Plan Mode Amélioré**
   - Pour tâches complexes
   - Activation: `experimental.plan: true`
   - Commande: `/plan`

4. **Browser Agent** (Expérimental)
   - Interaction avec pages web
   - Activation: `experimental.browserAgent: true`
   - Usage: Web scraping, tests automatisés

5. **Chargement Parallèle**
   - Extensions chargées en parallèle
   - Démarrage 30-50% plus rapide
   - Automatique

**Documentation:** [UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md)

### J'ai un problème

**Problèmes courants:**

1. **Gemini 3.1 non disponible**
   - C'est normal (déploiement progressif)
   - Utiliser `auto` ou `gemini-2.5-pro`
   - Réessayer plus tard

2. **"Model not found"**
   - Utiliser un alias: `auto`, `pro`, `flash`
   - Vérifier: `gemini /model manage`
   - Utiliser un modèle stable: `gemini-2.5-flash`

3. **Serveur ne démarre pas**
   - Vérifier Gemini CLI: `gemini --version`
   - Vérifier `.env`: `cat .env | grep GEMINI`
   - Redémarrer: `npm run assistants`

**Documentation:** [UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md) (section Dépannage)

## 📊 Comparaison des Versions

| Fonctionnalité | v0.31.0 | v0.32.1 |
|----------------|---------|---------|
| Gemini 3.1 Pro Preview | ❌ | ✅ |
| Generalist Agent | ❌ | ✅ |
| Model Steering | ❌ | ✅ |
| Plan Mode Amélioré | Basique | ✅ Avancé |
| Shell Autocomplétion | ❌ | ✅ |
| Extensions Parallèles | ❌ | ✅ |
| Browser Agent | ❌ | ✅ Expérimental |
| Policy Engine Avancé | Basique | ✅ Avancé |

## 🧪 Tests Disponibles

### Test Automatique Complet

```bash
node scripts/test-gemini-3-1-pro.js
```

**Ce qui est testé:**
- ✅ Version de Gemini CLI
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

# Test 4: Gemini 3.1 (si disponible)
gemini -m gemini-3.1-pro-preview -p "Test"

# Test 5: Serveur AionUI
npm run assistants
curl http://localhost:25810/health
curl http://localhost:25810/api/v1/models
```

## 📚 Documentation Complète

### Guides Principaux

1. **[UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md)** - Guide complet (15 min)
2. **[QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)** - Démarrage rapide (3 min)
3. **[assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md](./assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md)** - Configuration AionUI (5 min)

### Documentation Existante

4. **[INSTALLATION_GEMINI_CLI_COMPLETE.md](./INSTALLATION_GEMINI_CLI_COMPLETE.md)** - Installation détaillée
5. **[assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md](./assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md)** - Guide du serveur
6. **[assistant_serveur_endpoint/README.md](./assistant_serveur_endpoint/README.md)** - Documentation complète

### Ressources Officielles

- **Site officiel:** https://geminicli.com/docs
- **Changelog:** https://github.com/google-gemini/gemini-cli/releases
- **Annonces v0.32.0:** https://geminicli.com/docs/releases/#announcements-v0320---2026-03-03
- **FAQ:** https://geminicli.com/docs/faq/

## ✅ Checklist de Mise à Jour

### Étape 1: Installation

- [ ] Exécuter `npm install -g @google/gemini-cli@latest`
- [ ] Vérifier la version: `gemini --version` (devrait afficher 0.32.1)
- [ ] Tester l'authentification: `gemini /stats model`

### Étape 2: Configuration

- [ ] Mettre à jour `.env` avec `gemini-3.1-pro-preview`
- [ ] Vérifier `GEMINI_DEFAULT_MODEL=auto`
- [ ] Vérifier `GEMINI_CLI_PATH=gemini`

### Étape 3: Tests

- [ ] Exécuter `node scripts/test-gemini-3-1-pro.js`
- [ ] Tester manuellement: `gemini -m auto -p "Test"`
- [ ] Vérifier l'accès à Gemini 3.1 (optionnel)

### Étape 4: Serveur AionUI

- [ ] Redémarrer le serveur: `npm run assistants`
- [ ] Tester health check: `curl http://localhost:25810/health`
- [ ] Tester liste des modèles: `curl http://localhost:25810/api/v1/models`
- [ ] Tester un chat: voir [QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)

### Étape 5: Documentation

- [ ] Lire [QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)
- [ ] Parcourir [UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md)
- [ ] Explorer les nouvelles fonctionnalités (optionnel)

## 🎉 Résumé

**Ce qui a été fait:**
- ✅ Gemini CLI mis à jour vers v0.32.1
- ✅ Documentation complète créée
- ✅ Scripts de test créés
- ✅ Configuration AionUI mise à jour
- ✅ Guide d'intégration n8n mis à jour

**Nouveautés principales:**
- 🆕 Gemini 3.1 Pro Preview
- 🤖 Generalist Agent
- ⚡ Performance améliorée
- 📋 Plan Mode avancé
- 🌐 Browser Agent expérimental

**Prochaines étapes:**
1. Exécuter les tests
2. Redémarrer le serveur
3. Tester les nouveaux modèles
4. Explorer les nouvelles fonctionnalités

## 🔗 Liens Rapides

- **Démarrage rapide:** [QUICK_START_GEMINI_v0.32.md](./QUICK_START_GEMINI_v0.32.md)
- **Guide complet:** [UPDATE_GEMINI_CLI_v0.32.md](./UPDATE_GEMINI_CLI_v0.32.md)
- **Configuration AionUI:** [assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md](./assistant_serveur_endpoint/UPDATE_GEMINI_CLI_v0.32.md)
- **Script de test:** `node scripts/test-gemini-3-1-pro.js`
- **Documentation officielle:** https://geminicli.com/docs

---

**Version:** 0.32.1  
**Date:** 7 mars 2026  
**Statut:** ✅ Documentation complète
