# 🚀 AionUi Multi-Provider API - README

Serveur API unifié exposant plusieurs providers d'IA (Gemini CLI, Gemini API Key avec rotation, Kiro CLI) via des endpoints compatibles Ollama.

## ✨ Nouveautés

### 🎯 Multi-Provider Architecture

- **3 providers** disponibles avec endpoints dédiés
- **Rotation automatique** des clés API Gemini (27 clés configurées)
- **Compatible Ollama** pour intégration facile avec n8n, LangChain, etc.
- **Déploiement flexible**: Local, Netlify, Vercel, VPS, Docker

### 🔑 Providers disponibles

1. **Gemini CLI** (`/api/gemini_cli/*`)
   - Authentification: Google OAuth
   - Avantages: Accès complet aux fonctionnalités Gemini CLI
   - Idéal pour: Développement local

2. **Gemini API Key Rotative** (`/api/gemini_api_key_rotative/*`)
   - Authentification: Clés API avec rotation automatique
   - Limites: 5 req/min, 250k tokens/jour par clé
   - 27 clés configurées = capacité élevée
   - Idéal pour: Production, n8n, déploiement serverless

3. **Kiro CLI** (`/api/kiro_cli/*`)
   - Status: À venir
   - Intégration prévue

## 📦 Installation rapide

```bash
# 1. Cloner le projet
git clone https://github.com/iOfficeAI/AionUi.git
cd AionUi

# 2. Installer les dépendances
npm install

# 3. Configurer les clés API
cp .env.example .env
nano .env  # Ajouter vos clés API

# 4. Builder les services
npm run build:multi-provider

# 5. Démarrer le serveur
npm run server
```

**Vérification**:
```bash
curl http://localhost:25808/health
curl http://localhost:25808/api/providers
```

## 🎯 Utilisation

### Exemple 1: Chat simple

```bash
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Bonjour!"}
    ],
    "stream": false
  }'
```

### Exemple 2: Génération de texte

```bash
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Écris un haiku sur le code",
    "stream": false
  }'
```

### Exemple 3: Statistiques des clés

```bash
curl http://localhost:25808/api/gemini_api_key_rotative/stats
```

**Réponse**:
```json
{
  "totalKeys": 27,
  "availableKeys": 25,
  "usage": [...]
}
```

## 🔗 Endpoints API

### Gemini API Key Rotative (recommandé)

- `POST /api/gemini_api_key_rotative/chat` - Chat avec rotation des clés
- `POST /api/gemini_api_key_rotative/generate` - Génération de texte
- `GET /api/gemini_api_key_rotative/stats` - Statistiques d'utilisation

### Gemini CLI

- `POST /api/gemini_cli/chat` - Chat via Gemini CLI (OAuth)
- `POST /api/gemini_cli/generate` - Génération via Gemini CLI

### Endpoints communs

- `GET /api/providers` - Liste des providers disponibles
- `GET /api/version` - Version de l'API
- `GET /health` - Health check

## 🌐 Intégration n8n

### Configuration rapide

1. Créer un nœud "HTTP Request"
2. Configurer:
   - Method: POST
   - URL: `http://localhost:25808/api/gemini_api_key_rotative/chat`
   - Body:
   ```json
   {
     "messages": [
       {"role": "user", "content": "{{ $json.prompt }}"}
     ],
     "stream": false
   }
   ```

**Workflow complet**: Voir `examples/n8n-workflow-example.json`

## 📊 Architecture

```
AionUi Multi-Provider API
│
├── Gemini CLI Provider
│   ├── Google OAuth Authentication
│   └── Full Gemini CLI features
│
├── Gemini API Key Provider
│   ├── 27 API Keys (3 comptes × 8-11 clés)
│   ├── Rotation automatique
│   ├── Rate limiting: 5 req/min par clé
│   └── Quota: 250k tokens/jour par clé
│
└── Kiro CLI Provider (à venir)
    └── TBD
```

## 🔑 Configuration des clés API

### Structure des clés

Le fichier `.env` contient 27 clés API réparties sur 3 comptes:

```env
# Ohada Finance (8 clés)
GEMINI_API_KEY_OHADA_FINANCE_A=AIzaSy...
GEMINI_API_KEY_OHADA_FINANCE_B=AIzaSy...
# ... F, G, H

# Ohada Save (8 clés)
GEMINI_API_KEY_OHADA_SAVE_A=AIzaSy...
# ... B-H

# Ohada Save 2 (11 clés)
GEMINI_API_KEY_OHADA_SAVE2_A=AIzaSy...
# ... B-K
```

### Capacité totale

- **27 clés** × 5 req/min = **135 requêtes/minute**
- **27 clés** × 250k tokens/jour = **6.75M tokens/jour**

## 🚀 Déploiement

### Local

```bash
npm run server          # Mode local (127.0.0.1)
npm run server:remote   # Mode remote (0.0.0.0)
```

### Netlify

```bash
netlify deploy --prod
```

Configuration automatique via `netlify.toml`.

### Vercel

```bash
vercel --prod
```

### VPS avec PM2

```bash
pm2 start server.js --name aionui-api -- --remote
pm2 save
```

### Docker

```bash
docker-compose up -d
```

**Guide complet**: Voir [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📚 Documentation

- **[QUICK_START_MULTI_PROVIDER.md](QUICK_START_MULTI_PROVIDER.md)** - Guide de démarrage rapide
- **[MULTI_PROVIDER_API.md](MULTI_PROVIDER_API.md)** - Documentation complète de l'API
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Guide de déploiement
- **[examples/n8n-workflow-example.json](examples/n8n-workflow-example.json)** - Exemple de workflow n8n

## 🧪 Tests

### Test rapide

```bash
npm run test:multi-provider
```

### Test manuel

```bash
# Health check
curl http://localhost:25808/health

# Providers
curl http://localhost:25808/api/providers

# Chat
curl -X POST http://localhost:25808/api/gemini_api_key_rotative/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Test"}],"stream":false}'
```

## 🔧 Scripts disponibles

```bash
npm run server                    # Démarrer le serveur (local)
npm run server:remote             # Démarrer le serveur (remote)
npm run build:multi-provider      # Builder les services
npm run test:multi-provider       # Tester l'API
```

## 📊 Monitoring

### Logs

Le serveur affiche automatiquement:
- Sélection des clés API
- Utilisation des quotas
- Erreurs et warnings

### Statistiques en temps réel

```bash
curl http://localhost:25808/api/gemini_api_key_rotative/stats | jq
```

## 🐛 Dépannage

### Problème: "Aucune clé API trouvée"

```bash
# Vérifier les clés dans .env
grep GEMINI_API_KEY .env
```

### Problème: "Toutes les clés ont atteint leurs limites"

- Attendre 1 minute (limite: 5 req/min)
- Ou ajouter plus de clés dans `.env`

### Problème: Port déjà utilisé

```bash
# Changer le port
echo "PORT=25809" >> .env

# Ou tuer le processus
lsof -ti:25808 | xargs kill -9
```

## 🎯 Cas d'usage

### 1. Intégration n8n

Utiliser l'API comme provider Ollama dans n8n pour:
- Automatisation de workflows
- Traitement de données
- Génération de contenu

### 2. Application web

Intégrer l'API dans votre application:
- Chat bot
- Assistant virtuel
- Génération de contenu

### 3. Scripts automatisés

Utiliser l'API dans vos scripts:
- Traitement batch
- Analyse de données
- Génération de rapports

## 🔒 Sécurité

- **Rate limiting**: 100 req/min par IP (configurable)
- **CORS**: Configuré pour localhost et IPs locales
- **Clés API**: Rotation automatique pour respecter les limites
- **HTTPS**: Recommandé en production

## 🌟 Avantages

### vs Claude Cowork

| Feature | Claude Cowork | AionUi Multi-Provider |
|---------|---------------|----------------------|
| OS | macOS only | macOS, Windows, Linux |
| Models | Claude only | Gemini, Claude, OpenAI, Ollama |
| Cost | $100/mois | Gratuit & Open Source |
| Remote Access | ❌ | ✅ |
| API Endpoints | ❌ | ✅ |
| Key Rotation | ❌ | ✅ |

### vs Gemini CLI seul

- ✅ **Rotation automatique** des clés API
- ✅ **Endpoints REST** compatibles Ollama
- ✅ **Déploiement serverless** (Netlify, Vercel)
- ✅ **Intégration n8n** facile
- ✅ **Monitoring** et statistiques

## 🤝 Contribution

Les contributions sont les bienvenues!

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Apache-2.0 - Voir [LICENSE](LICENSE)

## 💬 Support

- **GitHub Issues**: https://github.com/iOfficeAI/AionUi/issues
- **Discord**: [Lien Discord]
- **Documentation**: https://aionui.com

## 🎉 Prochaines étapes

1. ✅ Gemini CLI provider
2. ✅ Gemini API Key provider avec rotation
3. ✅ Déploiement Netlify/Vercel
4. ✅ Intégration n8n
5. 🔄 Kiro CLI provider (en cours)
6. 🔄 Support streaming pour Netlify/Vercel
7. 🔄 Dashboard de monitoring

## 📈 Statistiques

- **27 clés API** configurées
- **135 req/min** de capacité
- **6.75M tokens/jour** de quota
- **3 providers** (2 actifs, 1 à venir)
- **100% Open Source**

---

**Fait avec ❤️ par l'équipe AionUi**

[⭐ Star sur GitHub](https://github.com/iOfficeAI/AionUi) | [📖 Documentation](MULTI_PROVIDER_API.md) | [🚀 Quick Start](QUICK_START_MULTI_PROVIDER.md)
