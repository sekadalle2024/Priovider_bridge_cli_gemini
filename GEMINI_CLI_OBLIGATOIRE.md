# ⚠️ GEMINI CLI EST OBLIGATOIRE

## 🚨 Important

**Gemini CLI est OBLIGATOIRE** pour que le serveur des assistants fonctionne correctement.

Sans Gemini CLI, le serveur démarre mais **toutes les requêtes aux assistants échoueront** avec une erreur 503.

## 📦 Installation

### 1. Installer Gemini CLI

```bash
npm install -g @google/generative-ai-cli
```

### 2. Authentification

```bash
gemini auth login
```

Cela ouvrira votre navigateur pour vous connecter avec votre compte Google.

### 3. Vérification

```bash
gemini --version
```

Vous devriez voir la version de Gemini CLI.

## 🧪 Test

```bash
# Test simple
gemini --model gemini-3-flash --prompt "Dis bonjour"
```

Si cela fonctionne, Gemini CLI est correctement installé.

## 🔍 Pourquoi Gemini CLI ?

Les assistants utilisent Gemini CLI pour :
1. Lire les instructions de l'assistant (fichiers `.md`)
2. Construire le prompt complet avec le contexte
3. Appeler l'API Gemini via CLI
4. Retourner la réponse générée

**Sans Gemini CLI, aucune génération IA n'est possible.**

## 📊 Vérification du Statut

### Via Health Check

```bash
curl http://localhost:25810/health
```

Réponse :
```json
{
  "status": "ok",
  "geminiCli": "available",  // ← Doit être "available"
  "assistantsCount": 13,
  "port": "25810",
  "timestamp": "2026-03-01T22:00:00.000Z"
}
```

### Via la Page d'Accueil

Ouvrez http://localhost:25810 dans votre navigateur.

Vous verrez :
- ✅ Gemini CLI disponible (si installé)
- ❌ Gemini CLI non disponible (si pas installé)

## 🚫 Erreurs Sans Gemini CLI

### Erreur 503

```json
{
  "error": {
    "message": "Gemini CLI is not available",
    "type": "service_unavailable",
    "code": "gemini_cli_unavailable"
  }
}
```

**Solution** : Installer Gemini CLI (voir ci-dessus)

### Erreur lors du Test

```bash
npm run test:gemini-3-flash
```

Résultat :
```
3️⃣  Test Chat avec Gemini 3 Flash...
   Status: 503
   ❌ Erreur: Gemini CLI is not available
```

**Solution** : Installer Gemini CLI

## 📝 Configuration

### Variables d'Environnement

Dans `.env` :

```env
# Chemin vers Gemini CLI (défaut: gemini)
GEMINI_CLI_PATH=gemini

# Modèle Gemini par défaut
GEMINI_DEFAULT_MODEL=gemini-3-flash
```

Si Gemini CLI est installé dans un chemin personnalisé, modifiez `GEMINI_CLI_PATH`.

## 🔗 Liens Utiles

- **Documentation Gemini CLI** : https://ai.google.dev/gemini-api/docs/cli
- **Installation** : https://www.npmjs.com/package/@google/generative-ai-cli
- **GitHub** : https://github.com/google/generative-ai-cli

## ✅ Checklist

- [ ] Gemini CLI installé : `npm install -g @google/generative-ai-cli`
- [ ] Authentifié : `gemini auth login`
- [ ] Test réussi : `gemini --version`
- [ ] Test avec prompt : `gemini --model gemini-3-flash --prompt "Test"`
- [ ] Serveur démarré : `npm run assistants`
- [ ] Health check OK : `curl http://localhost:25810/health`
- [ ] Status "available" dans le health check

## 🎯 Résumé

| Élément | Status | Action |
|---------|--------|--------|
| Gemini CLI | ⚠️ OBLIGATOIRE | `npm install -g @google/generative-ai-cli` |
| Authentification | ⚠️ OBLIGATOIRE | `gemini auth login` |
| Serveur | ✅ Démarre sans CLI | Mais ne fonctionne pas |
| Assistants | ❌ Ne fonctionnent pas sans CLI | Erreur 503 |

---

**IMPORTANT** : Ne démarrez pas le serveur sans avoir installé Gemini CLI. Toutes les requêtes échoueront.

**Commande complète** :

```bash
# 1. Installer Gemini CLI
npm install -g @google/generative-ai-cli

# 2. S'authentifier
gemini auth login

# 3. Vérifier
gemini --version

# 4. Démarrer le serveur
npm run assistants
```

**Status** : ⚠️ PRÉREQUIS OBLIGATOIRE
