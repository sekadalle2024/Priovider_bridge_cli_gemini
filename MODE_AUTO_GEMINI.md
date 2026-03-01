# 🎯 Mode "auto" de Gemini CLI

## ✅ Configuration mise à jour

Le serveur des assistants utilise maintenant le mode **"auto"** comme dans l'application Electron desktop.

## 🤖 Qu'est-ce que le mode "auto" ?

Le mode "auto" est un **alias intelligent** de Gemini CLI qui sélectionne automatiquement le meilleur modèle disponible.

### Selon la documentation officielle

```
auto → gemini-2.5-pro ou gemini-3-pro-preview (défaut)
```

Gemini CLI choisit automatiquement:
- **gemini-2.5-pro** actuellement (1er mars 2026)
- **gemini-3-pro-preview** quand il sera disponible

## 🎯 Avantages du mode "auto"

### 1. Sélection intelligente
Gemini CLI choisit le meilleur modèle selon:
- La disponibilité des modèles
- Les capacités requises
- Les performances optimales

### 2. Mise à jour automatique
Quand Gemini 3 sera disponible, le mode "auto" basculera automatiquement vers le nouveau modèle sans modification de configuration.

### 3. Cohérence avec l'app Electron
Le serveur des assistants utilise maintenant la même configuration que votre application desktop.

## 📝 Configuration actuelle

### .env
```env
# Modèle par défaut: auto (comme dans l'app Electron)
GEMINI_DEFAULT_MODEL=auto

# Modèles disponibles (inclut les alias)
GEMINI_AVAILABLE_MODELS=auto,pro,flash,flash-lite,gemini-3-flash,gemini-3-pro,gemini-2.5-flash,gemini-2.5-pro,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro,gemini-exp-1206
```

### Serveur standalone
```javascript
defaultModel = 'auto'  // Utiliser 'auto' comme dans l'app Electron
```

## 🔄 Alias disponibles

Gemini CLI propose plusieurs alias pour simplifier l'utilisation:

| Alias | Modèle actuel | Description |
|-------|---------------|-------------|
| `auto` | gemini-2.5-pro | Sélection automatique du meilleur modèle |
| `pro` | gemini-2.5-pro | Modèle le plus puissant |
| `flash` | gemini-2.5-flash | Rapide et efficace |
| `flash-lite` | gemini-2.5-flash-lite | Version légère |

## 🚀 Utilisation

### Avec le mode auto (défaut)

```bash
# Le serveur utilise automatiquement "auto"
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Avec un alias spécifique

```bash
# Utiliser l'alias "flash" pour plus de rapidité
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "flash",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Avec un modèle spécifique

```bash
# Utiliser un modèle spécifique
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## 🧪 Test du mode auto

### Test en ligne de commande

```bash
# Tester avec Gemini CLI directement
gemini -m auto -p "What model are you?"
```

Gemini CLI répondra en utilisant le modèle sélectionné automatiquement (actuellement gemini-2.5-pro).

### Test avec le serveur

```bash
# Démarrer le serveur
npm run assistants

# Tester le mode auto
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "auto",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## 📊 Comparaison des modes

### Mode "auto" (recommandé)
✅ Sélection automatique du meilleur modèle  
✅ Mise à jour automatique vers Gemini 3  
✅ Cohérent avec l'app Electron  
✅ Pas besoin de modifier la config  

### Mode spécifique (ex: gemini-2.5-flash)
✅ Contrôle précis du modèle utilisé  
✅ Prévisibilité des coûts  
✅ Performances constantes  
❌ Nécessite mise à jour manuelle  

## 🎯 Recommandations

### Pour la production
Utiliser **"auto"** pour bénéficier automatiquement des améliorations de modèles.

### Pour le développement
Utiliser **"flash"** pour des tests rapides et économiques.

### Pour les tâches complexes
Utiliser **"pro"** pour les meilleures performances.

### Pour les tâches simples
Utiliser **"flash-lite"** pour économiser les ressources.

## 🔄 Évolution vers Gemini 3

### Actuellement (1er mars 2026)
```
auto → gemini-2.5-pro
```

### Quand Gemini 3 sera disponible
```
auto → gemini-3-pro-preview
```

Le basculement sera **automatique**, sans modification de configuration nécessaire!

## 📚 Documentation

### Gemini CLI
- **Documentation officielle:** https://geminicli.com/docs
- **Référence des modèles:** https://geminicli.com/docs/models
- **Cheatsheet:** https://geminicli.com/docs/cheatsheet

### Documentation locale
- `INSTALLATION_GEMINI_CLI_COMPLETE.md` - Guide complet
- `NOTE_GEMINI_3_MODELS.md` - Note sur Gemini 3
- `RESUME_INSTALLATION_ASSISTANTS.md` - Résumé de l'installation

## 🎓 Exemples d'utilisation

### Exemple 1: Utiliser le mode auto dans n8n

```json
{
  "url": "http://localhost:25810/api/v1/chat/completions",
  "method": "POST",
  "body": {
    "model": "auto",
    "messages": [
      {"role": "user", "content": "Analyze this data"}
    ]
  }
}
```

### Exemple 2: Comparer les alias

```bash
# Test avec auto
time gemini -m auto -p "Count to 10"

# Test avec flash
time gemini -m flash -p "Count to 10"

# Test avec pro
time gemini -m pro -p "Count to 10"
```

### Exemple 3: Utiliser dans un script

```javascript
const response = await fetch('http://localhost:25810/api/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'auto',  // Laisse Gemini CLI choisir
    messages: [
      { role: 'user', content: 'Hello' }
    ]
  })
});
```

## ✅ Checklist de migration

- [x] Configuration .env mise à jour avec `GEMINI_DEFAULT_MODEL=auto`
- [x] Liste des modèles disponibles inclut les alias (auto, pro, flash, flash-lite)
- [x] Serveur standalone utilise 'auto' par défaut
- [x] Documentation mise à jour
- [x] Cohérence avec l'application Electron desktop

## 🎉 Conclusion

Le serveur des assistants utilise maintenant le mode **"auto"** comme dans votre application Electron desktop. Cela garantit:

- ✅ Cohérence entre desktop et serveur
- ✅ Sélection automatique du meilleur modèle
- ✅ Mise à jour automatique vers Gemini 3
- ✅ Simplicité de configuration

**Le serveur est prêt avec le mode "auto"!**

---

**Date:** 1er mars 2026  
**Configuration:** Mode "auto" activé  
**Modèle actuel:** gemini-2.5-pro (via auto)
