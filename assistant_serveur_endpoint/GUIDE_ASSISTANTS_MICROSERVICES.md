# Guide des Assistants comme Microservices

## 🎯 Vue d'ensemble

Ce guide explique comment utiliser les assistants AionUI comme des microservices via une API REST avec documentation Swagger.

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application AionUI                        │
│                    (Electron Desktop)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Démarre automatiquement
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Serveur Express (Port 25810)                    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Routes API (/api/assistant/*)              │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          AssistantService                            │  │
│  │  • Découverte automatique des assistants             │  │
│  │  • Parsing des fichiers .md                          │  │
│  │  • Exécution via Gemini CLI                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Gemini CLI                              │  │
│  │  • Modèle par défaut: gemini-2.0-flash-exp          │  │
│  │  • Exécution des prompts avec contexte               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Dossier assistant/                          │
│                                                              │
│  • cowork/                  • pptx-generator/               │
│  • beautiful-mermaid/       • pdf-to-ppt/                   │
│  • game-3d/                 • ui-ux-pro-max/                │
│  • planning-with-files/     • human-3-coach/                │
│  • social-job-publisher/    • moltbook/                     │
│  • openclaw-setup/          • story-roleplay/               │
│                                                              │
│  Chaque assistant = 1 endpoint API                          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
# Installer swagger-ui-express si pas déjà installé
npm install swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

### 2. Configuration

Créer ou modifier le fichier `.env` :

```env
# Port du serveur des assistants
ASSISTANT_PORT=25810

# Chemin vers Gemini CLI (optionnel, par défaut: 'gemini')
GEMINI_CLI_PATH=gemini

# Modèle Gemini par défaut
GEMINI_DEFAULT_MODEL=gemini-2.0-flash-exp

# Chemin vers le dossier des assistants (optionnel)
ASSISTANTS_PATH=./assistant
```

### 3. Démarrer le serveur

#### Option A: Avec le script de démarrage

```bash
# Démarrage simple
node scripts/start-assistants-server.js

# Avec TypeScript (si ts-node installé)
node scripts/start-assistants-server.js --ts
```

#### Option B: Directement

```bash
# Avec Node.js
node src/webserver/server-assistants.js

# Avec TypeScript
ts-node src/webserver/server-assistants.ts
```

#### Option C: Avec npm script

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "assistants": "node scripts/start-assistants-server.js",
    "assistants:dev": "nodemon --watch src/webserver src/webserver/server-assistants.ts",
    "test:assistants": "node scripts/test-assistants-api.js"
  }
}
```

Puis :

```bash
npm run assistants
```

### 4. Vérifier que ça fonctionne

```bash
# Health check
curl http://localhost:25810/health

# Liste des assistants
curl http://localhost:25810/api/assistants

# Documentation Swagger
# Ouvrir dans le navigateur: http://localhost:25810/api-docs
```

## 📚 Utilisation de l'API

### Endpoints disponibles

#### 1. Liste des assistants

```bash
GET /api/assistants
```

Réponse :

```json
{
  "success": true,
  "count": 12,
  "assistants": [
    {
      "name": "cowork",
      "displayName": "Cowork Assistant",
      "description": "Assistant autonome pour l'exécution de tâches",
      "endpoint": "/api/assistant/cowork",
      "capabilities": [
        "File Path Rules",
        "Document Processing",
        "Large File Handling"
      ]
    }
  ]
}
```

#### 2. Exécuter un assistant

```bash
POST /api/assistant/{name}
Content-Type: application/json

{
  "prompt": "Votre requête ici",
  "context": {
    "workspace": "/path/to/workspace",
    "files": ["file1.pdf", "file2.docx"]
  },
  "model": "gemini-2.0-flash-exp",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

Réponse :

```json
{
  "success": true,
  "result": "Résultat de l'exécution...",
  "metadata": {
    "assistant": "cowork",
    "model": "gemini-2.0-flash-exp",
    "timestamp": "2024-03-01T10:30:00.000Z"
  }
}
```

#### 3. Info d'un assistant

```bash
GET /api/assistant/{name}/info
```

#### 4. Health check

```bash
GET /api/assistant/health
```

### Exemples d'utilisation

#### Exemple 1: Générer une présentation

```bash
curl -X POST http://localhost:25810/api/assistant/pptx-generator \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée une présentation de 5 slides sur l'\''intelligence artificielle",
    "model": "gemini-2.0-flash-exp"
  }'
```

#### Exemple 2: Créer un diagramme

```bash
curl -X POST http://localhost:25810/api/assistant/beautiful-mermaid \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un diagramme de flux pour un processus de connexion",
    "context": {
      "theme": "dark",
      "format": "svg"
    }
  }'
```

#### Exemple 3: Organiser des fichiers

```bash
curl -X POST http://localhost:25810/api/assistant/cowork \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Organise les fichiers de mon dossier Downloads par type",
    "context": {
      "workspace": "/Users/me/Downloads"
    }
  }'
```

#### Exemple 4: Design UI/UX

```bash
curl -X POST http://localhost:25810/api/assistant/ui-ux-pro-max \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crée un design de page de connexion moderne",
    "context": {
      "style": "Modern Gradient",
      "colors": ["#667eea", "#764ba2"]
    }
  }'
```

## 🔧 Intégration avec l'application Electron

### Option 1: Démarrage automatique

Modifier `src/main/index.ts` pour démarrer le serveur automatiquement :

```typescript
import { startServer as startAssistantsServer } from '../webserver/server-assistants';

app.whenReady().then(async () => {
  // Démarrer le serveur des assistants
  try {
    await startAssistantsServer();
    console.log('✅ Serveur des assistants démarré');
  } catch (error) {
    console.error('❌ Erreur serveur assistants:', error);
  }

  // Créer la fenêtre principale
  createWindow();
});
```

### Option 2: Processus séparé

```typescript
import { spawn } from 'child_process';
import path from 'path';

let assistantsServer: ChildProcess | null = null;

app.whenReady().then(() => {
  // Démarrer le serveur dans un processus séparé
  const serverScript = path.join(__dirname, '../webserver/server-assistants.js');
  assistantsServer = spawn('node', [serverScript], {
    stdio: 'inherit'
  });

  createWindow();
});

app.on('before-quit', () => {
  if (assistantsServer) {
    assistantsServer.kill();
  }
});
```

## 🌐 Déploiement

### Déploiement sur Vercel

Créer `api/assistants.ts` :

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAssistantService } from '../src/webserver/services/AssistantService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const service = getAssistantService();
  
  if (req.method === 'GET') {
    const assistants = await service.discoverAssistants();
    return res.json({ assistants });
  }
  
  if (req.method === 'POST') {
    const { assistant, prompt, context } = req.body;
    const result = await service.executeAssistant(assistant, { prompt, context });
    return res.json(result);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
```

### Déploiement sur Netlify

Créer `netlify/functions/assistants.ts` :

```typescript
import { Handler } from '@netlify/functions';
import { getAssistantService } from '../../src/webserver/services/AssistantService';

export const handler: Handler = async (event, context) => {
  const service = getAssistantService();
  
  if (event.httpMethod === 'GET') {
    const assistants = await service.discoverAssistants();
    return {
      statusCode: 200,
      body: JSON.stringify({ assistants })
    };
  }
  
  if (event.httpMethod === 'POST') {
    const { assistant, prompt, context: ctx } = JSON.parse(event.body || '{}');
    const result = await service.executeAssistant(assistant, { prompt, context: ctx });
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  }
  
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
```

## 🧪 Tests

### Exécuter les tests

```bash
# Démarrer le serveur dans un terminal
npm run assistants

# Dans un autre terminal, exécuter les tests
npm run test:assistants
```

### Tests manuels avec curl

```bash
# Test 1: Health check
curl http://localhost:25810/health

# Test 2: Liste des assistants
curl http://localhost:25810/api/assistants

# Test 3: Info d'un assistant
curl http://localhost:25810/api/assistant/cowork/info

# Test 4: Exécution
curl -X POST http://localhost:25810/api/assistant/beautiful-mermaid \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Crée un diagramme simple"}'
```

## 📖 Documentation Swagger

La documentation Swagger est disponible à l'adresse :

```
http://localhost:25810/api-docs
```

Elle inclut :

- Liste complète des endpoints
- Schémas de requêtes et réponses
- Exemples d'utilisation
- Possibilité de tester directement depuis l'interface

## 🔐 Sécurité (TODO)

Pour un usage en production, il est recommandé d'ajouter :

1. **Authentification par API Key**

```typescript
// Middleware d'authentification
app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

2. **Rate Limiting**

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite par IP
});

app.use('/api', limiter);
```

3. **CORS configuré**

```typescript
app.use(cors({
  origin: ['https://votre-domaine.com'],
  credentials: true
}));
```

## 🎯 Prochaines étapes

1. ✅ Service de découverte des assistants
2. ✅ Routes API avec Express
3. ✅ Documentation Swagger
4. ✅ Scripts de démarrage et test
5. ⏳ Intégration avec Electron
6. ⏳ Déploiement Vercel/Netlify
7. ⏳ Authentification et sécurité
8. ⏳ Monitoring et logs
9. ⏳ Cache des résultats
10. ⏳ WebSocket pour streaming

## 📝 Notes

- Chaque assistant du dossier `assistant/` devient automatiquement un endpoint
- Le service parse les fichiers `.md` pour extraire les métadonnées
- Gemini CLI doit être installé et accessible dans le PATH
- Le modèle par défaut est `gemini-2.0-flash-exp`
- Les assistants peuvent avoir leur propre contexte et configuration

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
# Changer le port dans .env
ASSISTANT_PORT=25810
```

### Assistants non découverts

```bash
# Vérifier le chemin
ls -la assistant/

# Vérifier les fichiers .md
ls -la assistant/*/
```

## 📞 Support

Pour toute question ou problème :

- GitHub Issues: https://github.com/iOfficeAI/AionUi/issues
- Discord: https://discord.gg/2QAwJn7Egx
- Documentation: http://localhost:25810/api-docs
