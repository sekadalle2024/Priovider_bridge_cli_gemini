# 🎯 LIRE EN PREMIER - Kiro CLI avec Claude Sonnet 4.5

## 👋 Bienvenue !

Vous avez maintenant accès à **Kiro CLI avec Claude Sonnet 4.5** via un endpoint OpenAI-compatible !

## ⚡ Démarrage ultra-rapide (5 minutes)

### Windows

```batch
REM Double-cliquez sur ce fichier
START-KIRO-CLAUDE.bat
```

### PowerShell

```powershell
.\START-KIRO-CLAUDE.ps1
```

### Ligne de commande

```bash
# 1. Installer Kiro CLI
npm install -g @kirodotdev/cli

# 2. S'authentifier
kiro auth login

# 3. Démarrer
npm run start:assistants

# 4. Tester
node scripts/test-kiro-claude.js
```

## 📚 Documentation

### 🚀 Pour démarrer

| Document | Description | Temps |
|----------|-------------|-------|
| [KIRO_CLAUDE_QUICK_START.md](./KIRO_CLAUDE_QUICK_START.md) | Guide de démarrage rapide | 5 min |
| [README_KIRO_CLAUDE_ENDPOINT.md](./README_KIRO_CLAUDE_ENDPOINT.md) | Vue d'ensemble complète | 10 min |

### 📖 Pour approfondir

| Document | Description | Temps |
|----------|-------------|-------|
| [KIRO_CLAUDE_INTEGRATION.md](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md) | Documentation technique | 30 min |
| [TACHE_3_KIRO_CLAUDE_COMPLETE.md](./TACHE_3_KIRO_CLAUDE_COMPLETE.md) | Rapport technique | 20 min |

### 🔍 Pour naviguer

| Document | Description |
|----------|-------------|
| [INDEX_KIRO_CLAUDE_DOCUMENTATION.md](./INDEX_KIRO_CLAUDE_DOCUMENTATION.md) | Index de toute la documentation |
| [COMMANDES_KIRO_CLAUDE.md](./COMMANDES_KIRO_CLAUDE.md) | Toutes les commandes |
| [FICHIERS_CREES_KIRO_CLAUDE.md](./FICHIERS_CREES_KIRO_CLAUDE.md) | Liste des fichiers créés |

### 📝 Résumé final

| Document | Description |
|----------|-------------|
| [REPONSE_FINALE_KIRO_CLAUDE.md](./REPONSE_FINALE_KIRO_CLAUDE.md) | Résumé complet de l'intégration |

## 🎯 Que voulez-vous faire ?

### Je veux démarrer rapidement
👉 Exécutez `START-KIRO-CLAUDE.bat` (Windows)  
👉 Ou lisez [KIRO_CLAUDE_QUICK_START.md](./KIRO_CLAUDE_QUICK_START.md)

### Je veux comprendre le projet
👉 Lisez [README_KIRO_CLAUDE_ENDPOINT.md](./README_KIRO_CLAUDE_ENDPOINT.md)

### Je veux intégrer dans n8n
👉 Importez `n8n-workflow-kiro-claude.json`  
👉 Base URL: `http://localhost:25810/v1/kiro-cli`

### Je veux développer
👉 Lisez [TACHE_3_KIRO_CLAUDE_COMPLETE.md](./TACHE_3_KIRO_CLAUDE_COMPLETE.md)  
👉 Étudiez le code dans `src/webserver/`

### Je veux tester
👉 Exécutez `TEST-KIRO-CLAUDE.bat` (Windows)  
👉 Ou `node scripts/test-kiro-claude.js`

### J'ai un problème
👉 Consultez la section "Dépannage" dans [KIRO_CLAUDE_QUICK_START.md](./KIRO_CLAUDE_QUICK_START.md)  
👉 Ou [COMMANDES_KIRO_CLAUDE.md](./COMMANDES_KIRO_CLAUDE.md)

## 🔗 URLs importantes

| Service | URL |
|---------|-----|
| **Base URL** | `http://localhost:25810/v1/kiro-cli` |
| **Chat** | `http://localhost:25810/v1/kiro-cli/chat/completions` |
| **Models** | `http://localhost:25810/v1/kiro-cli/models` |
| **Status** | `http://localhost:25810/api/kiro-cli/status` |

## 🎨 Modèles disponibles

| Modèle | Description |
|--------|-------------|
| `claude-sonnet-4-5` | ⭐ Par défaut, équilibré |
| `claude-opus-4-5` | 🚀 Le plus puissant |
| `claude-sonnet-3-5` | 📦 Version précédente |
| `claude-haiku-3-5` | ⚡ Rapide et léger |

## 💻 Premier test

```bash
curl -X POST http://localhost:25810/v1/kiro-cli/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [
      {"role": "user", "content": "Bonjour!"}
    ]
  }'
```

## 📊 Parcours recommandé

### Niveau 1 : Débutant (30 min)
1. ✅ Lire ce document
2. ✅ Exécuter `START-KIRO-CLAUDE.bat`
3. ✅ Tester avec `TEST-KIRO-CLAUDE.bat`
4. ✅ Lire [KIRO_CLAUDE_QUICK_START.md](./KIRO_CLAUDE_QUICK_START.md)

### Niveau 2 : Intermédiaire (1h)
1. ✅ Lire [README_KIRO_CLAUDE_ENDPOINT.md](./README_KIRO_CLAUDE_ENDPOINT.md)
2. ✅ Importer le workflow n8n
3. ✅ Créer votre premier workflow
4. ✅ Explorer [COMMANDES_KIRO_CLAUDE.md](./COMMANDES_KIRO_CLAUDE.md)

### Niveau 3 : Avancé (2h)
1. ✅ Lire [KIRO_CLAUDE_INTEGRATION.md](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)
2. ✅ Étudier le code source
3. ✅ Personnaliser la configuration
4. ✅ Créer des intégrations personnalisées

## 🆘 Aide rapide

### Problèmes courants

| Problème | Solution |
|----------|----------|
| Kiro CLI non trouvé | `npm install -g @kirodotdev/cli` |
| Erreur d'authentification | `kiro auth logout && kiro auth login` |
| Service non disponible | Vérifier que le serveur est démarré |
| Port déjà utilisé | Modifier `ASSISTANT_PORT` dans `.env` |

### Commandes essentielles

```bash
# Installer Kiro CLI
npm install -g @kirodotdev/cli

# S'authentifier
kiro auth login

# Démarrer le serveur
npm run start:assistants

# Tester
node scripts/test-kiro-claude.js

# Vérifier le statut
curl http://localhost:25810/api/kiro-cli/status
```

## 📦 Fichiers importants

### Scripts de démarrage
- `START-KIRO-CLAUDE.bat` - Démarrage Windows (batch)
- `START-KIRO-CLAUDE.ps1` - Démarrage Windows (PowerShell)
- `TEST-KIRO-CLAUDE.bat` - Test rapide Windows

### Documentation
- `README_KIRO_CLAUDE_ENDPOINT.md` - Vue d'ensemble
- `KIRO_CLAUDE_QUICK_START.md` - Démarrage rapide
- `INDEX_KIRO_CLAUDE_DOCUMENTATION.md` - Index complet

### Tests et workflows
- `scripts/test-kiro-claude.js` - Tests automatisés
- `n8n-workflow-kiro-claude.json` - Workflow n8n

### Configuration
- `.env` - Variables d'environnement
- `src/webserver/services/KiroCliService.ts` - Service
- `src/webserver/routes/kiroCliRoutes.ts` - Routes

## ✅ Checklist de démarrage

- [ ] Kiro CLI installé (`kiro --version`)
- [ ] Authentifié (`kiro auth status`)
- [ ] Serveur démarré (`npm run start:assistants`)
- [ ] Test réussi (`node scripts/test-kiro-claude.js`)
- [ ] Premier appel API fonctionnel
- [ ] Documentation lue

## 🎉 Prochaines étapes

Une fois que tout fonctionne :

1. **Importer** le workflow n8n : `n8n-workflow-kiro-claude.json`
2. **Explorer** les différents modèles Claude
3. **Créer** vos propres workflows
4. **Intégrer** dans vos projets

## 📞 Besoin d'aide ?

1. **Documentation** : Consultez [INDEX_KIRO_CLAUDE_DOCUMENTATION.md](./INDEX_KIRO_CLAUDE_DOCUMENTATION.md)
2. **Commandes** : Voir [COMMANDES_KIRO_CLAUDE.md](./COMMANDES_KIRO_CLAUDE.md)
3. **Diagnostic** : Exécutez `node scripts/test-kiro-claude.js`
4. **Dépannage** : Section "Dépannage" dans [KIRO_CLAUDE_QUICK_START.md](./KIRO_CLAUDE_QUICK_START.md)

## 🌟 Points clés

✅ **Gratuit** : Accès gratuit à Claude Sonnet 4.5  
✅ **Compatible** : API OpenAI standard  
✅ **Puissant** : Un des meilleurs modèles pour le code  
✅ **Documenté** : Documentation complète  
✅ **Testé** : Tests automatisés  
✅ **Prêt** : Workflow n8n inclus

## 🚀 Commencez maintenant !

### Option 1 : Démarrage automatique (recommandé)
```batch
START-KIRO-CLAUDE.bat
```

### Option 2 : Démarrage manuel
```bash
npm install -g @kirodotdev/cli
kiro auth login
npm run start:assistants
```

### Option 3 : Lire d'abord
Consultez [KIRO_CLAUDE_QUICK_START.md](./KIRO_CLAUDE_QUICK_START.md)

---

**Bon développement avec Claude Sonnet 4.5 ! 🎉**

Pour toute question, consultez l'[INDEX_KIRO_CLAUDE_DOCUMENTATION.md](./INDEX_KIRO_CLAUDE_DOCUMENTATION.md)
