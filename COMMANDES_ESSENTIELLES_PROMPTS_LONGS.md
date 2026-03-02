# ⚡ Commandes Essentielles - Prompts Longs

## 🚀 Redémarrer le Serveur

```bash
# Arrêter le serveur actuel
Ctrl+C

# Redémarrer
npm run assistants
```

## 🧪 Tester la Solution

### Test Automatique Complet
```bash
node scripts/test-long-prompt.js
```

### Test Health Check
```bash
curl http://localhost:25810/health
```

### Test Prompt Court
```bash
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Bonjour\"}],\"model\":\"gemini-3-flash\"}"
```

## 🔍 Vérifications

### Vérifier Gemini CLI
```bash
gemini --version
```

### Vérifier le Port
```bash
netstat -ano | findstr :25810
```

### Vérifier les Assistants
```bash
curl http://localhost:25810/api/v1/assistants
```

### Vérifier les Modèles
```bash
curl http://localhost:25810/api/v1/models
```

## 🌐 URLs Importantes

```
Serveur:        http://localhost:25810
Swagger:        http://localhost:25810/api-docs
Health:         http://localhost:25810/health
Assistants:     http://localhost:25810/api/v1/assistants
Modèles:        http://localhost:25810/api/v1/models
```

## 📝 Exemple n8n

### Configuration HTTP Request Node

**URL**:
```
http://localhost:25810/api/v1/chat/completions
```

**Method**: POST

**Body** (JSON):
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-3-flash",
  "temperature": 0.7,
  "max_tokens": 4096
}
```

**Options**:
```json
{
  "timeout": 120000
}
```

## 🔧 Installation Gemini CLI

### Si Gemini CLI n'est pas installé
```bash
npm install -g @google/generative-ai-cli
```

### Authentification
```bash
gemini auth login
```

### Vérification
```bash
gemini --version
```

## 🐛 Dépannage Rapide

### Port déjà utilisé
```bash
# Changer le port
set ASSISTANT_PORT=25811
npm run assistants
```

### Gemini CLI non trouvé
```bash
# Réinstaller
npm install -g @google/generative-ai-cli
gemini auth login
```

### Timeout dans n8n
Augmenter le timeout à 120000 (2 minutes) dans les options du nœud HTTP Request

### Erreur de mémoire
```bash
set NODE_OPTIONS=--max-old-space-size=4096
npm run assistants
```

## 📊 Logs et Monitoring

### Voir les logs du serveur
Les logs s'affichent dans le terminal où vous avez lancé `npm run assistants`

### Tester un endpoint spécifique
```bash
# Test avec curl
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d @test-prompt.json
```

### Créer un fichier de test
```json
// test-prompt.json
{
  "messages": [
    {
      "role": "user",
      "content": "Votre prompt très long ici..."
    }
  ],
  "model": "gemini-3-flash"
}
```

## 🎯 Workflow Typique

1. **Démarrer le serveur**
   ```bash
   npm run assistants
   ```

2. **Vérifier le health**
   ```bash
   curl http://localhost:25810/health
   ```

3. **Tester avec un prompt**
   ```bash
   node scripts/test-long-prompt.js
   ```

4. **Utiliser dans n8n**
   - Configurer le nœud HTTP Request
   - Tester avec votre workflow

5. **Monitorer les logs**
   - Regarder le terminal du serveur

## 📚 Documentation

```bash
# Ouvrir la documentation Swagger dans le navigateur
start http://localhost:25810/api-docs

# Ou sur macOS
open http://localhost:25810/api-docs

# Ou sur Linux
xdg-open http://localhost:25810/api-docs
```

## ✅ Checklist Rapide

```bash
# 1. Serveur démarré ?
npm run assistants

# 2. Health OK ?
curl http://localhost:25810/health

# 3. Gemini CLI OK ?
gemini --version

# 4. Test prompt long OK ?
node scripts/test-long-prompt.js

# 5. n8n configuré ?
# Voir la section "Exemple n8n" ci-dessus
```

## 🎉 Tout Fonctionne !

Si toutes les commandes ci-dessus fonctionnent, vous êtes prêt à utiliser des prompts de n'importe quelle longueur !

---

**Aide**: Consultez **[CORRECTION_PROMPTS_LONGS_COMPLETE.md](CORRECTION_PROMPTS_LONGS_COMPLETE.md)** pour plus de détails
