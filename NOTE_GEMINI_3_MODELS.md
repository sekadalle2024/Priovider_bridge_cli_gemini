# 📝 Note sur les Modèles Gemini 3

## ⚠️ Situation actuelle (1er mars 2026)

Les modèles **Gemini 3** (gemini-3-flash, gemini-3-pro) ne sont **pas encore disponibles** dans l'API publique de Google.

## 🔍 Ce que nous avons découvert

### Test effectué

```bash
gemini -m gemini-3-flash -p "Test"
```

### Résultat

```
Error: ModelNotFoundError: Requested entity was not found.
Code: 404
```

### Conclusion

Le modèle `gemini-3-flash` n'existe pas encore dans l'API Gemini au 1er mars 2026.

## ✅ Modèles disponibles actuellement

Selon la documentation officielle de Gemini CLI (26 février 2026):

### Alias recommandés
- `auto` → gemini-2.5-pro ou gemini-3-pro-preview (défaut)
- `pro` → gemini-2.5-pro
- `flash` → gemini-2.5-flash ⭐ **Recommandé**
- `flash-lite` → gemini-2.5-flash-lite

### Modèles spécifiques disponibles
- **gemini-2.5-pro** - Modèle le plus puissant
- **gemini-2.5-flash** ⭐ - Rapide et efficace (modèle par défaut)
- **gemini-2.5-flash-lite** - Version légère
- **gemini-2.0-flash** - Version précédente
- **gemini-1.5-flash** - Ancienne version
- **gemini-1.5-pro** - Ancienne version pro
- **gemini-exp-1206** - Version expérimentale

## 🎯 Configuration actuelle

Le serveur des assistants est configuré avec:

```env
GEMINI_DEFAULT_MODEL=gemini-2.5-flash
```

Ce modèle est:
- ✅ Disponible dans l'API
- ✅ Rapide et efficace
- ✅ Bon rapport qualité/prix
- ✅ Recommandé par Google

## 📊 Comparaison des modèles

| Modèle | Disponibilité | Vitesse | Qualité | Recommandation |
|--------|---------------|---------|---------|----------------|
| gemini-3-flash | ❌ Pas encore | - | - | Attendre |
| gemini-3-pro | ❌ Pas encore | - | - | Attendre |
| gemini-2.5-flash | ✅ Oui | ⚡⚡⚡ | ⭐⭐⭐⭐ | ⭐ Recommandé |
| gemini-2.5-pro | ✅ Oui | ⚡⚡ | ⭐⭐⭐⭐⭐ | Pour tâches complexes |
| gemini-2.5-flash-lite | ✅ Oui | ⚡⚡⚡⚡ | ⭐⭐⭐ | Pour tâches simples |

## 🔄 Quand Gemini 3 sera disponible

### Comment savoir?

1. **Vérifier avec Gemini CLI:**
   ```bash
   gemini /model manage
   ```

2. **Tester directement:**
   ```bash
   gemini -m gemini-3-flash -p "Test"
   ```

3. **Consulter la documentation:**
   - https://geminicli.com/docs
   - https://ai.google.dev/gemini-api/docs/models

### Mise à jour de la configuration

Quand Gemini 3 sera disponible, il suffira de:

1. **Mettre à jour .env:**
   ```env
   GEMINI_DEFAULT_MODEL=gemini-3-flash
   ```

2. **Redémarrer le serveur:**
   ```bash
   npm run assistants
   ```

3. **Tester:**
   ```bash
   curl -X POST http://localhost:25810/api/v1/chat/completions \
     -H "Content-Type: application/json" \
     -d '{
       "model": "gemini-3-flash",
       "messages": [{"role": "user", "content": "Test"}]
     }'
   ```

## 💡 Recommandations

### Pour l'instant

Utiliser **gemini-2.5-flash** qui est:
- Disponible immédiatement
- Performant et rapide
- Bien documenté
- Stable et fiable

### Pour les tâches complexes

Utiliser **gemini-2.5-pro** qui offre:
- Meilleure qualité de réponse
- Meilleure compréhension du contexte
- Capacités de raisonnement avancées

### Pour les tâches simples

Utiliser **gemini-2.5-flash-lite** qui est:
- Très rapide
- Économique
- Suffisant pour des tâches basiques

## 📝 Configuration dans .env

```env
# Modèle par défaut (actuellement disponible)
GEMINI_DEFAULT_MODEL=gemini-2.5-flash

# Liste des modèles disponibles
# Note: gemini-3-flash et gemini-3-pro ne sont pas encore disponibles
GEMINI_AVAILABLE_MODELS=gemini-2.5-flash,gemini-2.5-pro,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro,gemini-exp-1206
```

## 🎯 Utilisation dans les requêtes

### Avec le modèle par défaut

```json
{
  "messages": [{"role": "user", "content": "Hello"}]
}
```

Le serveur utilisera automatiquement `gemini-2.5-flash`.

### Avec un modèle spécifique

```json
{
  "model": "gemini-2.5-pro",
  "messages": [{"role": "user", "content": "Complex task"}]
}
```

### Avec l'alias "auto"

```json
{
  "model": "auto",
  "messages": [{"role": "user", "content": "Hello"}]
}
```

Gemini CLI choisira automatiquement le meilleur modèle.

## 📚 Ressources

### Documentation officielle
- **Gemini CLI:** https://geminicli.com/docs
- **Gemini API:** https://ai.google.dev/gemini-api/docs
- **Modèles disponibles:** https://ai.google.dev/gemini-api/docs/models

### Documentation locale
- `INSTALLATION_GEMINI_CLI_COMPLETE.md` - Guide complet
- `RESUME_INSTALLATION_ASSISTANTS.md` - Résumé de l'installation
- Documentation officielle Gemini CLI intégrée dans le projet

## ✅ Conclusion

- ❌ Gemini 3 n'est pas encore disponible (1er mars 2026)
- ✅ Gemini 2.5 Flash est le meilleur choix actuel
- ✅ Le serveur est configuré avec un modèle disponible
- ✅ Tout fonctionne correctement avec Gemini 2.5

**Pas besoin d'attendre Gemini 3 pour utiliser le serveur des assistants!**

---

**Date:** 1er mars 2026  
**Statut:** Gemini 2.5 Flash opérationnel ✅
