# 🔍 Diagnostic des Erreurs Multi-CLI

## 📋 Résumé des Erreurs

### Erreur 1: Authentification OAuth
```
FatalCancellationError: Authentication cancelled by user
```

### Erreur 2: Timeout (30 min)
Prompt tourne indéfiniment sans réponse

### Erreur 3: Réponse Incorrecte
Réponse parle de package.json au lieu du prompt d'audit

### Erreur 4: Arguments Manquants
```
Not enough arguments following: prompt
```

## 🎯 Cause Racine Identifiée

### Problème Principal: Modèle "auto"

Le fichier `.env` configure:
```env
GEMINI_DEFAULT_MODEL=auto
```

Le modèle `auto` dans Gemini CLI nécessite:
1. **Authentification OAuth** (Google Cloud)
2. **Accès à Gemini 3.1 Pro Preview**
3. **Configuration Google Cloud Project**

### Pourquoi ça ne fonctionne pas

1. **Erreur 1 (OAuth)**: Le modèle `auto` essaie de s'authentifier via OAuth mais l'utilisateur annule
2. **Erreur 2 (Timeout)**: Le processus attend indéfiniment une authentification
3. **Erreur 3 (Mauvaise réponse)**: Le contexte de Gemini CLI est pollué par des tentatives précédentes
4. **Erreur 4 (Arguments)**: La commande est mal formée à cause de l'échec d'authentification

## ✅ Solutions

### Solution 1: Utiliser un Modèle Spécifique (RECOMMANDÉ)

Au lieu de `auto`, utilisez un modèle spécifique qui fonctionne avec API Key:

```env
GEMINI_DEFAULT_MODEL=gemini-2.5-flash
```

### Solution 2: Authentifier OAuth pour Tous les Profils

Si vous voulez vraiment utiliser `auto`:

```bash
# Profile 2
$env:GEMINI_CLI_HOME="$env:USERPROFILE\.gemini-profile2"
gemini auth login

# Profile 3
$env:GEMINI_CLI_HOME="$env:USERPROFILE\.gemini-profile3"
gemini auth login
```

### Solution 3: Utiliser API Key au lieu d'OAuth

Configurez les API Keys dans chaque profil:

```bash
# Profile 2
$env:GEMINI_CLI_HOME="$env:USERPROFILE\.gemini-profile2"
$env:GEMINI_API_KEY="AIzaSyBkQT5cPXo3vv0EnI1lQ04gzOX6wwGvmS4"
gemini -m gemini-2.5-flash "Test"

# Profile 3
$env:GEMINI_CLI_HOME="$env:USERPROFILE\.gemini-profile3"
$env:GEMINI_API_KEY="AIzaSyAb3D111bdTz2DKgPyVDOZw0vqyW0s1lOo"
gemini -m gemini-2.5-flash "Test"
```

## 🚀 Action Immédiate (RECOMMANDÉ)

### Étape 1: Modifier .env

Changez le modèle par défaut:

```env
# Avant
GEMINI_DEFAULT_MODEL=auto

# Après
GEMINI_DEFAULT_MODEL=gemini-2.5-flash
```

### Étape 2: Redémarrer les Serveurs

```bash
# Arrêter tous les serveurs (Ctrl+C)

# Redémarrer serveur assistants
npm run assistants

# Redémarrer serveur multi-cli
npm run multi-cli
```

### Étape 3: Tester

```bash
# Test serveur assistants
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}],
    "model": "gemini-2.5-flash"
  }'

# Test serveur multi-cli
curl -X POST http://localhost:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}],
    "model": "gemini-2.5-flash"
  }'
```

## 📊 Comparaison des Modèles

| Modèle | Authentification | Vitesse | Disponibilité | Recommandé |
|--------|------------------|---------|---------------|------------|
| `auto` | OAuth (Google Cloud) | ⚡⚡⚡ | ⚠️ Complexe | ❌ Non |
| `gemini-2.5-flash` | API Key | ⚡⚡⚡ | ✅ Simple | ✅ Oui |
| `gemini-2.5-pro` | API Key | ⚡⚡ | ✅ Simple | ✅ Oui |
| `gemini-3-flash` | OAuth | ⚡⚡⚡ | ⚠️ Complexe | ❌ Non |

## 🔧 Correction du Code

### Fichier: `src/webserver/services/MultiGeminiCliService.ts`

Ajoutez la gestion de l'API Key:

```typescript
private async executeGeminiCli(
  profile: GeminiCliProfile,
  request: ChatRequest
): Promise<ChatResponse> {
  return new Promise((resolve, reject) => {
    const model = request.model || 'gemini-2.5-flash'; // ✅ Modèle par défaut
    const lastMessage = request.messages[request.messages.length - 1];
    const prompt = lastMessage.content;

    // Préparer l'environnement avec API Key
    const env = {
      ...process.env,
      GEMINI_CLI_HOME: profile.home,
      // ✅ Ajouter l'API Key pour éviter OAuth
      GEMINI_API_KEY: this.getApiKeyForProfile(profile.id)
    };

    const args = ['--model', model];
    const gemini = spawn('gemini', args, {
      env,
      shell: true
    });

    // ... reste du code
  });
}

// ✅ Nouvelle méthode pour obtenir l'API Key
private getApiKeyForProfile(profileId: string): string {
  const apiKeys: Record<string, string> = {
    'profile2': process.env.GEMINI_API_KEY_OHADA_SAVE_A || '',
    'profile3': process.env.GEMINI_API_KEY_OHADA_SAVE2_A || ''
  };
  return apiKeys[profileId] || process.env.GEMINI_API_KEY_OHADA_FINANCE_A || '';
}
```

### Fichier: `src/webserver/services/AssistantService.ts`

Même correction:

```typescript
private async runGeminiCli(prompt: string, model: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // ✅ Utiliser un modèle spécifique au lieu de "auto"
    const actualModel = model === 'auto' ? 'gemini-2.5-flash' : model;
    
    const args = ['--model', actualModel];
    
    // ✅ Ajouter l'API Key dans l'environnement
    const env = {
      ...process.env,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY_OHADA_FINANCE_A
    };
    
    const process = spawn(this.geminiCliPath, args, { env });

    // ... reste du code
  });
}
```

## 📝 Fichiers à Modifier

### 1. `.env`
```env
# Changer
GEMINI_DEFAULT_MODEL=auto

# En
GEMINI_DEFAULT_MODEL=gemini-2.5-flash
```

### 2. `src/webserver/services/MultiGeminiCliService.ts`
- Ajouter méthode `getApiKeyForProfile()`
- Ajouter `GEMINI_API_KEY` dans l'environnement

### 3. `src/webserver/services/AssistantService.ts`
- Remplacer `auto` par `gemini-2.5-flash`
- Ajouter `GEMINI_API_KEY` dans l'environnement

## 🧪 Tests Après Correction

### Test 1: Prompt Court
```bash
curl -X POST http://localhost:25815/api/v1/cli/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Dis bonjour"}],
    "model": "gemini-2.5-flash"
  }'
```

### Test 2: Prompt Long
```bash
node scripts/test-multi-cli-correction.js
```

### Test 3: Profil Spécifique
```bash
curl -X POST http://localhost:25815/api/v1/cli/profile2/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}],
    "model": "gemini-2.5-flash"
  }'
```

## 🎯 Résultat Attendu

Après correction:
- ✅ Pas d'erreur OAuth
- ✅ Réponse en <10 secondes
- ✅ Réponse correcte correspondant au prompt
- ✅ Prompts longs fonctionnent

## 💡 Recommandations

### Pour Production

1. **Utiliser API Keys** au lieu d'OAuth
2. **Modèle spécifique** au lieu de `auto`
3. **Timeout raisonnable** (120 secondes max)
4. **Rotation des API Keys** pour éviter les limites

### Pour Développement

1. **Tester avec `gemini-2.5-flash`** (rapide et fiable)
2. **Logs détaillés** pour déboguer
3. **Timeout court** (30 secondes) pour détecter les problèmes rapidement

## 🆘 Dépannage

### Si l'erreur OAuth persiste

```bash
# Nettoyer les credentials OAuth
rm -rf ~/.gemini/oauth_creds.json
rm -rf ~/.gemini-profile2/oauth_creds.json
rm -rf ~/.gemini-profile3/oauth_creds.json

# Redémarrer les serveurs
```

### Si le timeout persiste

```bash
# Vérifier que Gemini CLI fonctionne
$env:GEMINI_API_KEY="AIzaSyBkQT5cPXo3vv0EnI1lQ04gzOX6wwGvmS4"
gemini -m gemini-2.5-flash "Test"
```

### Si la réponse est incorrecte

```bash
# Nettoyer le cache Gemini CLI
rm -rf ~/.gemini/.cache
rm -rf ~/.gemini-profile2/.cache
rm -rf ~/.gemini-profile3/.cache
```

---

**Status**: 🔍 DIAGNOSTIC COMPLET

**Cause**: Modèle `auto` nécessite OAuth

**Solution**: Utiliser `gemini-2.5-flash` avec API Key

**Temps estimé**: 5 minutes

**Prochaine étape**: Modifier `.env` et redémarrer les serveurs
