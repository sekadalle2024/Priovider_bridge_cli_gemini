# 🤖 Guide des Modèles Gemini CLI API

Guide pour utiliser différents modèles Gemini avec l'API.

## 📋 Modèles Disponibles

### Gemini 2.5 Pro
- **Nom**: `gemini-2.5-pro`
- **Usage**: Tâches complexes, raisonnement avancé
- **Statut**: ✅ Testé et fonctionnel
- **Recommandé pour**: Analyse approfondie, code complexe, raisonnement multi-étapes

### Gemini 2.5 Flash (Par défaut)
- **Nom**: `gemini-2.5-flash`
- **Usage**: Réponses rapides, usage général
- **Statut**: ⚠️ Peut rencontrer des limites de capacité (429)
- **Recommandé pour**: Requêtes simples, prototypage rapide

### Gemini 1.5 Flash
- **Nom**: `gemini-1.5-flash`
- **Usage**: Version stable et rapide
- **Statut**: ⏳ À tester
- **Recommandé pour**: Production, haute disponibilité

### Gemini 1.5 Pro
- **Nom**: `gemini-1.5-pro`
- **Usage**: Version stable pour tâches complexes
- **Statut**: ⏳ À tester
- **Recommandé pour**: Production, analyses complexes

## 🚀 Utilisation

### Via l'API REST

#### Spécifier le modèle dans la requête

```bash
# Génération avec gemini-2.5-pro
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "prompt": "Explain quantum computing",
    "stream": false
  }'
```

```bash
# Chat avec gemini-1.5-flash
curl -X POST http://localhost:25808/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-1.5-flash",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "stream": false
  }'
```

#### PowerShell

```powershell
# Génération avec modèle personnalisé
$body = @{
    model = "gemini-2.5-pro"
    prompt = "Write a haiku about coding"
    stream = $false
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:25808/api/generate `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing
```

### Via Swagger UI

1. Ouvrir la documentation: `npm run docs:api`
2. Sélectionner l'endpoint `/api/generate` ou `/api/chat`
3. Cliquer sur "Try it out"
4. Modifier le champ `model` avec le modèle souhaité
5. Cliquer sur "Execute"

### Via Variable d'Environnement

Définir le modèle par défaut dans `.env`:

```bash
GEMINI_MODEL=gemini-2.5-pro
```

Puis redémarrer le serveur:

```bash
npm run server:remote
```

## ⚠️ Gestion des Erreurs 429

### Erreur: "No capacity available for model"

Cette erreur indique que le serveur Google n'a pas de capacité disponible pour ce modèle à ce moment.

**Solutions:**

1. **Changer de modèle**
   ```bash
   # Si gemini-2.5-flash échoue, essayer gemini-2.5-pro
   curl -X POST http://localhost:25808/api/generate \
     -H "Content-Type: application/json" \
     -d '{"model":"gemini-2.5-pro","prompt":"Hello"}'
   ```

2. **Attendre et réessayer**
   - Les limites se réinitialisent périodiquement
   - Attendre quelques minutes avant de réessayer

3. **Utiliser un modèle alternatif**
   - `gemini-1.5-flash` - Plus stable
   - `gemini-1.5-pro` - Pour tâches complexes

4. **Vérifier les limites**
   - Free tier: 5-15 requêtes/minute selon le modèle
   - Tier 1: 150-300 requêtes/minute
   - Voir: [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)

## 🔧 Configuration Avancée

### Timeout

Le timeout par défaut est de 300 secondes (5 minutes). Pour le modifier:

```javascript
// Dans dist/gemini-service-standalone.js
const timeout = setTimeout(() => {
  reject(new Error('Timeout after 300s'));
}, 300000); // 300000ms = 5 minutes
```

### Options de Génération

```bash
curl -X POST http://localhost:25808/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-2.5-pro",
    "prompt": "Write a story",
    "stream": false,
    "options": {
      "temperature": 0.8,
      "top_p": 0.9,
      "max_tokens": 2048
    }
  }'
```

## 📊 Comparaison des Modèles

| Modèle | Vitesse | Complexité | Disponibilité | Coût |
|--------|---------|------------|---------------|------|
| gemini-2.5-pro | Moyen | Élevée | Bonne | Moyen |
| gemini-2.5-flash | Rapide | Moyenne | Variable | Faible |
| gemini-1.5-flash | Rapide | Moyenne | Excellente | Faible |
| gemini-1.5-pro | Moyen | Élevée | Excellente | Moyen |

## 💡 Bonnes Pratiques

1. **Utiliser gemini-2.5-pro pour:**
   - Analyse de code complexe
   - Raisonnement multi-étapes
   - Génération de documentation détaillée

2. **Utiliser gemini-2.5-flash pour:**
   - Prototypage rapide
   - Requêtes simples
   - Tests et développement

3. **Utiliser gemini-1.5-flash pour:**
   - Production stable
   - Haute disponibilité requise
   - Coûts optimisés

4. **Stratégie de fallback:**
   ```javascript
   const models = ['gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
   for (const model of models) {
     try {
       const response = await callAPI(model, prompt);
       return response;
     } catch (error) {
       if (error.code === 429) continue;
       throw error;
     }
   }
   ```

## 🔗 Ressources

- [Documentation Gemini API](https://ai.google.dev/gemini-api/docs)
- [Rate Limits Guide](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini CLI Documentation](https://geminicli.com/docs/)
- [API Documentation](http://localhost:25808/docs)

## 📝 Notes

- Le modèle par défaut peut être changé via `GEMINI_MODEL` dans `.env`
- Tous les modèles supportent le streaming
- Les limites de taux varient selon le modèle et le tier
- L'authentification OAuth Google est requise (via Gemini CLI)
