# 🚀 Démarrage Rapide - Gemini CLI v0.32.1

## ⚡ En 3 Minutes

### 1. Vérifier la Mise à Jour

```bash
# Vérifier la version
gemini --version
# Devrait afficher: 0.32.1

# Si ce n'est pas le cas, mettre à jour
npm install -g @google/gemini-cli@latest
```

### 2. Tester les Nouveaux Modèles

```bash
# Test rapide avec le modèle stable
gemini -m gemini-2.5-flash -p "Bonjour, teste la nouvelle version"

# Tester le routage Auto (utilise le meilleur modèle disponible)
gemini -m auto -p "Test du routage intelligent"

# Tester Gemini 3.1 (si disponible)
gemini -m gemini-3.1-pro-preview -p "Test du nouveau modèle"
```

### 3. Démarrer le Serveur AionUI

```bash
# Démarrer le serveur des assistants
npm run assistants

# Vérifier que tout fonctionne
curl http://localhost:25810/health
curl http://localhost:25810/api/v1/models
```

## 🎯 Nouveautés Principales

### Gemini 3.1 Pro Preview 🆕

Le nouveau modèle le plus puissant (déploiement progressif).

```bash
# Vérifier si vous avez accès
node scripts/test-gemini-3-1-pro.js

# Utiliser directement
gemini -m gemini-3.1-pro-preview
```

### Routage Auto Amélioré

Le routage "auto" est maintenant plus intelligent grâce au Generalist Agent.

```bash
# Utiliser le routage auto
gemini -m auto -p "votre prompt"

# Dans AionUI, utiliser "auto" comme modèle
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Plan Mode Amélioré

Pour les tâches complexes nécessitant une planification.

```bash
# Activer dans settings.json
{
  "experimental": {
    "plan": true
  }
}

# Utiliser
gemini
/plan
```

### Browser Agent (Expérimental)

Pour interagir avec les pages web.

```bash
# Activer dans settings.json
{
  "experimental": {
    "browserAgent": true
  }
}

# Utiliser
gemini -p "Scrape le contenu de https://example.com"
```

## 📋 Modèles Disponibles

### Recommandés pour AionUI

| Modèle | Usage | Vitesse | Qualité |
|--------|-------|---------|---------|
| `auto` | Général | Auto | Auto |
| `gemini-2.5-flash` | Défaut | ⚡⚡⚡ | ⭐⭐⭐ |
| `gemini-2.5-pro` | Premium | ⚡⚡ | ⭐⭐⭐⭐⭐ |
| `gemini-3.1-pro-preview` | Nouveau | ⚡⚡ | ⭐⭐⭐⭐⭐⭐ |

### Tous les Modèles

```bash
# Gemini 3.x (nécessite accès)
gemini-3.1-pro-preview  # 🆕 Nouveau
gemini-3-pro
gemini-3-flash

# Gemini 2.5
gemini-2.5-pro          # Haute qualité
gemini-2.5-flash        # Équilibré (défaut)
gemini-2.5-flash-lite   # Léger

# Gemini 2.0 et 1.5
gemini-2.0-flash
gemini-1.5-pro
gemini-1.5-flash

# Expérimental
gemini-exp-1206

# Alias
auto        # Meilleur modèle disponible
pro         # Meilleur modèle Pro
flash       # Meilleur modèle Flash
flash-lite  # Modèle léger
```

## 🧪 Tests Rapides

### Test 1: Version

```bash
gemini --version
# Attendu: 0.32.1
```

### Test 2: Modèle Stable

```bash
gemini -m gemini-2.5-flash -p "Réponds OK"
# Attendu: Réponse avec "OK"
```

### Test 3: Routage Auto

```bash
gemini -m auto -p "Réponds OK"
# Attendu: Réponse avec "OK"
```

### Test 4: Serveur AionUI

```bash
# Démarrer
npm run assistants

# Tester
curl http://localhost:25810/health
# Attendu: {"status":"ok","geminiCli":"available",...}

curl http://localhost:25810/api/v1/models
# Attendu: Liste des modèles incluant gemini-3.1-pro-preview
```

### Test 5: Script Complet

```bash
node scripts/test-gemini-3-1-pro.js
# Exécute tous les tests automatiquement
```

## 🔧 Configuration AionUI

### Fichier .env

```env
# Modèle par défaut (recommandé: auto ou gemini-2.5-flash)
GEMINI_DEFAULT_MODEL=auto

# Modèles disponibles (mis à jour avec v0.32.1)
GEMINI_AVAILABLE_MODELS=auto,pro,flash,flash-lite,gemini-3.1-pro-preview,gemini-3-flash,gemini-3-pro,gemini-2.5-flash,gemini-2.5-pro,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro,gemini-exp-1206

# Chemin vers Gemini CLI
GEMINI_CLI_PATH=gemini
```

### Redémarrer le Serveur

```bash
# Arrêter le serveur actuel (Ctrl+C)

# Redémarrer
npm run assistants
```

## 📊 Utilisation avec n8n

### Configuration du Nœud HTTP Request

**URL:** `http://localhost:25810/api/v1/chat/completions`

**Méthode:** POST

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

### Modèles Recommandés pour n8n

- **`auto`** - Laisse Gemini CLI choisir le meilleur modèle
- **`gemini-2.5-flash`** - Rapide et stable
- **`gemini-2.5-pro`** - Haute qualité
- **`gemini-3.1-pro-preview`** - Nouveau modèle (si disponible)

## 🎓 Commandes Utiles

### Gestion des Modèles

```bash
# Voir les modèles disponibles
gemini /model manage

# Définir un modèle par défaut
gemini /model set gemini-2.5-flash --persist

# Utiliser un modèle spécifique
gemini -m gemini-3.1-pro-preview
```

### Statistiques

```bash
# Statistiques de session
gemini /stats session

# Statistiques du modèle
gemini /stats model

# Statistiques des outils
gemini /stats tools
```

### Aide

```bash
# Aide générale
gemini --help

# Aide sur les commandes
gemini /help

# Documentation
gemini /docs
```

## 🐛 Dépannage Rapide

### Problème: "Model not found"

```bash
# Solution 1: Utiliser un alias
gemini -m auto

# Solution 2: Vérifier les modèles disponibles
gemini /model manage

# Solution 3: Utiliser un modèle stable
gemini -m gemini-2.5-flash
```

### Problème: Gemini 3.1 non disponible

```bash
# C'est normal, le déploiement est progressif
# Utiliser en attendant:
gemini -m gemini-2.5-pro  # Haute qualité
gemini -m auto            # Meilleur disponible
```

### Problème: Serveur ne démarre pas

```bash
# Vérifier que Gemini CLI est installé
gemini --version

# Vérifier le fichier .env
cat .env | grep GEMINI

# Redémarrer
npm run assistants
```

## 📚 Documentation Complète

- **UPDATE_GEMINI_CLI_v0.32.md** - Guide complet de mise à jour
- **INSTALLATION_GEMINI_CLI_COMPLETE.md** - Installation détaillée
- **assistant_serveur_endpoint/00_LIRE_EN_PREMIER.md** - Guide du serveur

## 🔗 Ressources

- **Site officiel:** https://geminicli.com/docs
- **Releases:** https://github.com/google-gemini/gemini-cli/releases
- **FAQ:** https://geminicli.com/docs/faq/

## ✅ Checklist

- [ ] Gemini CLI v0.32.1 installé
- [ ] Tests de base passés
- [ ] Fichier .env mis à jour
- [ ] Serveur AionUI redémarré
- [ ] Nouveaux modèles testés
- [ ] Documentation lue

## 🎉 Prêt à Utiliser!

Vous êtes maintenant prêt à utiliser Gemini CLI v0.32.1 avec AionUI!

**Prochaines étapes:**
1. Tester les nouveaux modèles
2. Explorer les fonctionnalités expérimentales
3. Intégrer avec n8n si nécessaire

---

**Version:** 0.32.1  
**Date:** 7 mars 2026  
**Statut:** ✅ Prêt à l'emploi
