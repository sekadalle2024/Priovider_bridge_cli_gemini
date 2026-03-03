# 🔄 Installation Alternative - Kiro CLI

## ⚠️ Important

Kiro CLI n'est **pas disponible via npm**. C'est une application desktop qui doit être téléchargée depuis [kiro.dev](https://kiro.dev).

## 📥 Installation de Kiro CLI (Méthode officielle)

### Windows

1. Visitez [https://kiro.dev/downloads](https://kiro.dev/downloads)
2. Téléchargez l'installateur Windows
3. Exécutez l'installateur
4. Suivez les instructions à l'écran

### Vérification

```bash
# Après installation, vérifier
kiro --version
kiro auth login
```

## 🔄 Solution Alternative : API Claude directe

Si vous ne pouvez pas installer Kiro CLI, vous pouvez utiliser directement l'API Claude d'Anthropic.

### Prérequis

1. Compte Anthropic : [https://console.anthropic.com](https://console.anthropic.com)
2. Clé API Claude

### Configuration

Ajoutez dans `.env` :

```env
# API Claude directe (alternative à Kiro CLI)
CLAUDE_API_KEY=sk-ant-xxxxx
CLAUDE_API_BASE_URL=https://api.anthropic.com
CLAUDE_MODEL=claude-sonnet-4-5
CLAUDE_ENABLED=true
```

### Avantages de l'API directe

✅ Pas besoin d'installer Kiro CLI
✅ Accès direct à Claude Sonnet 4.5
✅ Même interface OpenAI-compatible
✅ Plus stable et fiable
✅ Meilleure performance

### Inconvénients

❌ Nécessite une clé API payante
❌ Pas de contexte de projet automatique
❌ Pas d'intégration MCP

## 🎯 Recommandation

### Option 1 : Kiro CLI (Gratuit mais nécessite installation desktop)

**Avantages** :
- Gratuit
- Contexte de projet
- Intégration MCP

**Installation** :
1. Télécharger depuis [kiro.dev](https://kiro.dev)
2. Installer l'application
3. S'authentifier

### Option 2 : API Claude directe (Payant mais plus simple)

**Avantages** :
- Pas d'installation
- Plus stable
- Meilleure performance

**Configuration** :
1. Créer un compte sur [console.anthropic.com](https://console.anthropic.com)
2. Obtenir une clé API
3. Configurer dans `.env`

## 🚀 Prochaines étapes

### Si vous choisissez Kiro CLI

1. Télécharger depuis [kiro.dev](https://kiro.dev)
2. Installer l'application
3. Exécuter `kiro auth login`
4. Démarrer le serveur : `npm run start:assistants`

### Si vous choisissez l'API Claude directe

1. Je vais créer un service alternatif qui utilise l'API Claude
2. Vous obtenez une clé API sur [console.anthropic.com](https://console.anthropic.com)
3. Vous configurez la clé dans `.env`
4. Le serveur fonctionnera de la même manière

## 💡 Quelle option préférez-vous ?

**Option 1** : Installer Kiro CLI (gratuit, nécessite téléchargement)
**Option 2** : Utiliser l'API Claude directe (payant, plus simple)

Dites-moi quelle option vous préférez et je vous guiderai !

## 📞 Liens utiles

- [Kiro Downloads](https://kiro.dev/downloads)
- [Anthropic Console](https://console.anthropic.com)
- [Documentation Claude API](https://docs.anthropic.com)
