# 🤖 AionUI Assistants API

> Transformez tous vos assistants AionUI en microservices avec API REST et documentation Swagger

## 🎯 Qu'est-ce que c'est ?

Un serveur Express qui expose automatiquement tous les assistants du dossier `assistant/` comme des endpoints API REST, avec :

- ✅ **Découverte automatique** - Scan et parsing des fichiers .md
- ✅ **API REST complète** - Endpoints pour chaque assistant
- ✅ **Documentation Swagger** - Interface interactive de test
- ✅ **Gemini CLI intégré** - Exécution via Gemini par défaut
- ✅ **Démarrage automatique** - Avec l'application Electron
- ✅ **Tests automatiques** - Suite de tests complète

## 🚀 Démarrage en 30 secondes

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur
npm run assistants

# 3. Ouvrir le navigateur
open http://localhost:25810
```

C'est tout ! Vous avez maintenant 12+ assistants disponibles via API.

## 📋 Assistants disponibles

| Assistant | Endpoint | Description |
|-----------|----------|-------------|
| Cowork | `/api/assistant/cowork` | Exécution autonome de tâches |
| PPTX Generator | `/api/assistant/pptx-generator` | Génération de présentations |
| Beautiful Mermaid | `/api/assistant/beautiful-mermaid` | Création de diagrammes |
| PDF to PPT | `/api/assistant/pdf-to-ppt` | Conversion PDF → PowerPoint |
| Game 3D | `/api/assistant/game-3d` | Génération de jeux 3D |
| UI/UX Pro Max | `/api/assistant/ui-ux-pro-max` | Design UI/UX professionnel |
| ... | ... | ... |

## 💡 Exemple d'utilisation

```bash
curl -X POST http://localhost:25810/api/assistant/beautiful-mermaid \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un diagramme de flux pour un processus de connexion"
  }'
```

Réponse :

```json
{
  "success": true,
  "result": "```mermaid\ngraph TD\n  A[Utilisateur] --> B[Page de connexion]\n  ...",
  "metadata": {
    "assistant": "beautiful-mermaid",
    "model": "gemini-2.0-flash-exp",
    "timestamp": "2024-03-01T10:30:00.000Z"
  }
}
```

## 📚 Documentation

### Guides complets

- [📖 Guide complet des microservices](./GUIDE_ASSISTANTS_MICROSERVICES.md)
- [🚀 Démarrage rapide](./DEMARRAGE_ASSISTANTS.md)
- [🔌 Intégration Electron](./INTEGRATION_ELECTRON_ASSISTANTS.md)
- [📊 Récapitulatif complet](./PROJET_ASSISTANTS_MICROSERVICES_COMPLET.md)

### Documentation interactive

```
http://localhost:25810/api-docs
```

## 🔧 Configuration

Créer un fichier `.env` :

```env
# Activer le serveur
ASSISTANTS_ENABLED=true

# Port (défaut: 25810)
ASSISTANT_PORT=25810

# Démarrage automatique avec Electron
ASSISTANTS_AUTO_START=true

# Chemin vers Gemini CLI
GEMINI_CLI_PATH=gemini

# Modèle par défaut
GEMINI_DEFAULT_MODEL=gemini-2.0-flash-exp
```

## 🎨 Créer un nouvel assistant

### 1. Créer le dossier et le fichier

```bash
mkdir -p assistant/mon-assistant
cp assistant/TEMPLATE_ASSISTANT.md assistant/mon-assistant/mon-assistant.md
```

### 2. Éditer le fichier

```markdown
# Mon Assistant

Description de mon assistant.

## Capacités

### Capacité 1
Description...
```

### 3. Redémarrer

```bash
npm run assistants
```

Votre assistant est maintenant disponible à :
```
POST /api/assistant/mon-assistant
```

## 🧪 Tests

```bash
# Démarrer le serveur
npm run assistants

# Dans un autre terminal
npm run test:assistants
```

Tests inclus :
- ✅ Health check
- ✅ Liste des assistants
- ✅ Info d'un assistant
- ✅ Exécution
- ✅ Gestion des erreurs

## 🔌 Intégrations

### Avec n8n

1. Créer un nœud HTTP Request
2. URL: `http://localhost:25810/api/assistant/{name}`
3. Méthode: POST
4. Body: `{"prompt": "Votre requête"}`

### Avec Electron

```typescript
import { startServer } from '../webserver/server-assistants';

app.whenReady().then(async () => {
  await startServer();
  createWindow();
});
```

### Avec Vercel/Netlify

Voir le guide complet pour les détails de déploiement.

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│     Application AionUI (Electron)       │
└────────────────┬────────────────────────┘
                 │
                 │ Démarre automatiquement
                 ▼
┌─────────────────────────────────────────┐
│    Serveur Express (Port 25810)         │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Routes API (/api/assistant/*)     │ │
│  └────────────────────────────────────┘ │
│                 │                        │
│                 ▼                        │
│  ┌────────────────────────────────────┐ │
│  │     AssistantService               │ │
│  │  • Découverte automatique          │ │
│  │  • Parsing des .md                 │ │
│  │  • Exécution via Gemini CLI        │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│         Dossier assistant/              │
│                                          │
│  • cowork/                              │
│  • pptx-generator/                      │
│  • beautiful-mermaid/                   │
│  • ... (12+ assistants)                 │
│                                          │
│  Chaque assistant = 1 endpoint API      │
└─────────────────────────────────────────┘
```

## 🎯 Cas d'usage

### 1. Automatisation avec n8n

Créer des workflows qui utilisent les assistants :
- Génération automatique de rapports
- Création de présentations à partir de données
- Analyse de fichiers uploadés
- Génération de diagrammes pour documentation

### 2. Intégration dans des applications

Utiliser les assistants depuis n'importe quelle application :
- Applications web (React, Vue, Angular)
- Applications mobiles
- Scripts Python/Node.js
- Services backend

### 3. API publique

Exposer les assistants comme service :
- Déployer sur Vercel/Netlify
- Ajouter authentification
- Monétiser l'accès

## 🔐 Sécurité

Pour la production, ajouter :

### Authentification

```typescript
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api', limiter);
```

## 📦 Scripts npm

```bash
# Démarrer le serveur
npm run assistants

# Mode développement (rechargement auto)
npm run assistants:dev

# Tests
npm run test:assistants
```

## 🆘 Dépannage

### Gemini CLI non trouvé

```bash
# Vérifier l'installation
which gemini

# Installer si nécessaire
npm install -g @google/generative-ai-cli
```

### Port déjà utilisé

```bash
# Changer le port
ASSISTANT_PORT=25810 npm run assistants
```

### Assistants non découverts

```bash
# Vérifier le dossier
ls -la assistant/

# Vérifier les fichiers .md
ls -la assistant/*/
```

## 📈 Statistiques

- **12+ assistants** disponibles immédiatement
- **4 endpoints** principaux
- **Documentation Swagger** complète
- **6 tests** automatiques
- **~3000 lignes** de code
- **4 guides** de documentation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📞 Support

- GitHub Issues : https://github.com/iOfficeAI/AionUi/issues
- Discord : https://discord.gg/2QAwJn7Egx
- Documentation : http://localhost:25810/api-docs

## 📄 Licence

Apache 2.0 - Voir [LICENSE](LICENSE)

## 🎉 Remerciements

Merci à tous les contributeurs du projet AionUI !

---

**Fait avec ❤️ par l'équipe AionUI**

[⭐ Star sur GitHub](https://github.com/iOfficeAI/AionUi) | [📚 Documentation](http://localhost:25810/api-docs) | [💬 Discord](https://discord.gg/2QAwJn7Egx)
