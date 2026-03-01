# 🚀 Démarrage Simple du Serveur des Assistants

## ✅ Prérequis

Vous avez déjà tout installé ! Le projet AionUI est déjà configuré.

## 🎯 Démarrer UNIQUEMENT le Serveur des Assistants

### Option 1 : Commande Simple (Recommandée)

```bash
npm run assistants
```

C'est tout ! Le serveur démarre sur **http://localhost:25810**

### Option 2 : Mode Développement (avec rechargement automatique)

```bash
npm run assistants:dev
```

### Option 3 : Avec TypeScript Direct

```bash
npx ts-node src/webserver/server-assistants.ts
```

## 🔍 Vérifier que ça Fonctionne

Ouvrir dans le navigateur :
```
http://localhost:25810
```

Ou tester avec curl :
```bash
curl http://localhost:25810/health
```

Vous devriez voir :
```json
{
  "status": "ok",
  "geminiCli": "available",
  "assistantsCount": 12
}
```

## 📚 Documentation Swagger

Une fois le serveur démarré, ouvrir :
```
http://localhost:25810/api-docs
```

## ❓ Questions Fréquentes

### Q: Dois-je installer quelque chose ?

**R: NON !** Tout est déjà installé avec le projet AionUI.

Les dépendances sont déjà dans `node_modules/` depuis l'installation initiale du projet.

### Q: Dois-je configurer quelque chose ?

**R: NON !** Le fichier `.env` est déjà configuré avec :
```env
ASSISTANT_PORT=25810
ASSISTANTS_ENABLED=true
ASSISTANTS_AUTO_START=true
```

### Q: Le serveur démarre-t-il avec l'application Electron ?

**R: OUI !** Quand vous faites `npm start`, le serveur des assistants démarre automatiquement.

Mais vous pouvez aussi le démarrer SEUL avec `npm run assistants`.

### Q: Quelle est la différence entre les commandes ?

| Commande | Description | Démarre |
|----------|-------------|---------|
| `npm start` | Démarre l'application Electron complète | Application + Serveur assistants |
| `npm run assistants` | Démarre UNIQUEMENT le serveur des assistants | Serveur assistants seul |
| `npm run assistants:dev` | Mode développement avec rechargement auto | Serveur assistants seul |

### Q: Dois-je avoir Gemini CLI installé ?

**R: OUI, pour utiliser les assistants.**

Si pas encore installé :
```bash
npm install -g @google/generative-ai-cli
```

Puis configurer :
```bash
gemini auth login
```

### Q: Le port 25810 est déjà utilisé, que faire ?

**R:** Changer le port dans `.env` :
```env
ASSISTANT_PORT=25811
```

Puis redémarrer :
```bash
npm run assistants
```

## 🎯 Résumé Ultra-Simple

### Pour démarrer UNIQUEMENT le serveur :

```bash
npm run assistants
```

### Pour vérifier :

```bash
curl http://localhost:25810/health
```

### Pour voir la documentation :

```
http://localhost:25810/api-docs
```

## 🔧 Dépannage

### Erreur : "Cannot find module"

```bash
# Réinstaller les dépendances
npm install
```

### Erreur : "Port already in use"

```bash
# Vérifier quel processus utilise le port
lsof -i :25810

# Ou changer le port
ASSISTANT_PORT=25811 npm run assistants
```

### Erreur : "Gemini CLI not found"

```bash
# Installer Gemini CLI
npm install -g @google/generative-ai-cli

# Configurer
gemini auth login
```

## 📝 Exemple Complet

```bash
# 1. Démarrer le serveur
npm run assistants

# 2. Dans un autre terminal, tester
curl http://localhost:25810/health

# 3. Tester un chat
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}],
    "model": "gemini-3-flash"
  }'

# 4. Ouvrir Swagger dans le navigateur
# http://localhost:25810/api-docs
```

## ✅ Checklist

- [ ] Projet AionUI déjà installé (npm install fait)
- [ ] Gemini CLI installé et configuré
- [ ] Lancer : `npm run assistants`
- [ ] Vérifier : http://localhost:25810/health
- [ ] Explorer : http://localhost:25810/api-docs

---

**C'est tout !** Pas d'installation supplémentaire nécessaire.

**Commande magique** : `npm run assistants`

**URL** : http://localhost:25810

**Swagger** : http://localhost:25810/api-docs
