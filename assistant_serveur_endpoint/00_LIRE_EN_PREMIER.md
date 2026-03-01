# 📚 Documentation Serveur des Assistants - LIRE EN PREMIER

## 🎯 Informations Essentielles

### ⚠️ PRÉREQUIS OBLIGATOIRE : Gemini CLI

**Gemini CLI DOIT être installé** pour que les assistants fonctionnent.

```bash
npm install -g @google/generative-ai-cli
gemini auth login
```

Voir : **[GEMINI_CLI_OBLIGATOIRE.md](../GEMINI_CLI_OBLIGATOIRE.md)** pour plus de détails.

### 🌐 URLs du Serveur

**URL du serveur** : `http://localhost:25810`

**Documentation Swagger** : `http://localhost:25810/api-docs`

**Health Check** : `http://localhost:25810/health`

### 🚀 Démarrage Rapide

```bash
# Démarrer l'application (le serveur démarre automatiquement)
npm start

# Ou démarrer le serveur standalone
npm run assistants
```

### 📡 Endpoints Principaux

#### Format OpenAPI (Recommandé pour n8n)

```
POST   http://localhost:25810/api/v1/chat/completions
GET    http://localhost:25810/api/v1/models
GET    http://localhost:25810/api/v1/assistants
POST   http://localhost:25810/api/v1/assistants/{id}/chat
```

#### Format Classique

```
POST   http://localhost:25810/api/gemini/chat
POST   http://localhost:25810/api/assistant/{name}
GET    http://localhost:25810/api/assistants
```

### 🎨 9 Modèles Gemini Disponibles

1. `gemini-3-flash` - Ultra-rapide
2. `gemini-3-pro` - Haute qualité
3. `gemini-2.5-flash` - Équilibré
4. `gemini-2.5-pro` - Premium
5. `gemini-2.5-flash-lite` - Léger
6. `gemini-2.0-flash` - Standard
7. `gemini-1.5-flash` - Stable
8. `gemini-1.5-pro` - Très haute qualité
9. `gemini-exp-1206` - Expérimental

### 🎯 12 Assistants Disponibles

1. **cowork** - Automatisation de tâches
2. **pptx-generator** - Présentations PowerPoint
3. **beautiful-mermaid** - Diagrammes
4. **pdf-to-ppt** - Conversion PDF
5. **game-3d** - Jeux 3D
6. **ui-ux-pro-max** - Design UI/UX
7. **planning-with-files** - Planification
8. **human-3-coach** - Coaching
9. **social-job-publisher** - Offres d'emploi
10. **moltbook** - Réseau social IA
11. **openclaw-setup** - Configuration
12. **story-roleplay** - Jeu de rôle

## 📚 Documentation Disponible

### Démarrage Rapide

1. **[README_FINAL_ASSISTANTS.md](./README_FINAL_ASSISTANTS.md)** ⭐
   - Démarrage ultra-rapide
   - Exemples essentiels
   - Configuration de base

2. **[GUIDE_DEMARRAGE_RAPIDE_ASSISTANTS.md](./GUIDE_DEMARRAGE_RAPIDE_ASSISTANTS.md)**
   - Guide détaillé en 30 secondes
   - Tous les exemples
   - Cas d'usage

### Intégration n8n

3. **[N8N_ASSISTANTS_OPENAPI_GUIDE.md](./N8N_ASSISTANTS_OPENAPI_GUIDE.md)** ⭐⭐⭐
   - Guide complet d'intégration n8n
   - Configuration des nœuds
   - Workflows exemples
   - Tous les cas d'usage

4. **[n8n-workflow-assistants-openapi.json](./n8n-workflow-assistants-openapi.json)**
   - Workflow n8n prêt à l'emploi
   - À importer directement dans n8n

### Documentation Technique

5. **[MISE_A_JOUR_ASSISTANTS_OPENAPI.md](./MISE_A_JOUR_ASSISTANTS_OPENAPI.md)**
   - Détails techniques
   - Changements effectués
   - Migration

6. **[CHANGEMENTS_FINAUX_ASSISTANTS.md](./CHANGEMENTS_FINAUX_ASSISTANTS.md)**
   - Résumé des modifications
   - Comparaison avant/après

7. **[INTEGRATION_ASSISTANTS_COMPLETE.md](./INTEGRATION_ASSISTANTS_COMPLETE.md)**
   - Documentation complète
   - Architecture détaillée
   - Dépannage

### Guides Complets

8. **[README_ASSISTANTS_COMPLET.md](./README_ASSISTANTS_COMPLET.md)**
   - Documentation exhaustive
   - Tous les détails

9. **[GUIDE_ASSISTANTS_MICROSERVICES.md](./GUIDE_ASSISTANTS_MICROSERVICES.md)**
   - Architecture microservices
   - Concepts avancés

### Index et Navigation

10. **[INDEX_DOCUMENTATION_ASSISTANTS.md](./INDEX_DOCUMENTATION_ASSISTANTS.md)**
    - Navigation complète
    - Recherche par mot-clé

11. **[INDEX_ASSISTANTS_DOCUMENTATION.md](./INDEX_ASSISTANTS_DOCUMENTATION.md)**
    - Index alternatif

### Autres Documents

- **COMMANDES_ASSISTANTS.md** - Toutes les commandes
- **DEMARRAGE_ASSISTANTS.md** - Guide de démarrage
- **PLAN_INTEGRATION_ASSISTANTS.md** - Plan technique
- **RESUME_IMPLEMENTATION_ASSISTANTS.md** - Résumé implémentation
- **MISSION_ACCOMPLIE.md** - Récapitulatif final
- **PROJET_ASSISTANTS_MICROSERVICES_COMPLET.md** - Projet complet
- **INTEGRATION_ELECTRON_ASSISTANTS.md** - Intégration Electron
- **README_ASSISTANTS_API.md** - Documentation API

## 🎯 Par Où Commencer ?

### Je veux démarrer rapidement
→ **[README_FINAL_ASSISTANTS.md](./README_FINAL_ASSISTANTS.md)**

### Je veux intégrer avec n8n
→ **[N8N_ASSISTANTS_OPENAPI_GUIDE.md](./N8N_ASSISTANTS_OPENAPI_GUIDE.md)**

### Je veux comprendre l'architecture
→ **[INTEGRATION_ASSISTANTS_COMPLETE.md](./INTEGRATION_ASSISTANTS_COMPLETE.md)**

### Je veux voir les changements
→ **[CHANGEMENTS_FINAUX_ASSISTANTS.md](./CHANGEMENTS_FINAUX_ASSISTANTS.md)**

### J'ai un problème
→ **[INTEGRATION_ASSISTANTS_COMPLETE.md](./INTEGRATION_ASSISTANTS_COMPLETE.md)** (section Dépannage)

## 🧪 Test Rapide

```bash
# 1. Vérifier que le serveur fonctionne
curl http://localhost:25810/health

# 2. Lister les modèles
curl http://localhost:25810/api/v1/models

# 3. Tester un chat (NÉCESSITE GEMINI CLI)
curl -X POST http://localhost:25810/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Bonjour"}],
    "model": "gemini-3-flash"
  }'
```

## ⚠️ Prérequis OBLIGATOIRE : Gemini CLI

Les assistants utilisent Gemini CLI pour générer les réponses IA.

**Installation** :
```bash
npm install -g @google/generative-ai-cli
gemini auth login
```

**Vérification** :
```bash
gemini --version
```

Sans Gemini CLI, le serveur démarre mais retournera une erreur 503 lors des requêtes.

## 📝 Exemple n8n Rapide

**URL** : `http://localhost:25810/api/v1/chat/completions`

**Body** :
```json
{
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ],
  "model": "gemini-3-flash"
}
```

## 🆘 Support

- **Swagger** : http://localhost:25810/api-docs
- **GitHub** : https://github.com/iOfficeAI/AionUi
- **Discord** : https://discord.gg/2QAwJn7Egx

## ✅ Checklist

- [ ] Gemini CLI installé : `npm install -g @google/generative-ai-cli`
- [ ] Gemini CLI authentifié : `gemini auth login`
- [ ] Serveur démarré : `npm start`
- [ ] Health check OK : `curl http://localhost:25810/health`
- [ ] Gemini CLI disponible : vérifier dans le health check
- [ ] Swagger accessible : http://localhost:25810/api-docs
- [ ] Tests passent : `npm run test:assistants:integration`
- [ ] n8n configuré (si nécessaire)

---

**Port** : 25810

**Swagger** : http://localhost:25810/api-docs

**Status** : ✅ PRODUCTION READY

**Version** : 1.1.0
