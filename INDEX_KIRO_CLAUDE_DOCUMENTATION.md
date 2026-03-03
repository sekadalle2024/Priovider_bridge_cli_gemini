# 📚 Index de la Documentation - Kiro CLI avec Claude Sonnet 4.5

## 🎯 Navigation rapide

| Document | Description | Niveau |
|----------|-------------|--------|
| [README Principal](#readme-principal) | Vue d'ensemble et démarrage | ⭐ Débutant |
| [Guide de démarrage rapide](#guide-de-démarrage-rapide) | Installation en 3 étapes | ⭐ Débutant |
| [Documentation complète](#documentation-complète) | Guide détaillé | ⭐⭐ Intermédiaire |
| [Rapport de tâche](#rapport-de-tâche) | Résumé technique | ⭐⭐⭐ Avancé |
| [API Reference](#api-reference) | Référence des endpoints | ⭐⭐ Intermédiaire |
| [Intégration n8n](#intégration-n8n) | Guide n8n | ⭐⭐ Intermédiaire |

## 📖 Documents disponibles

### README Principal
**Fichier** : `README_KIRO_CLAUDE_ENDPOINT.md`

Vue d'ensemble complète du projet avec :
- Introduction et objectifs
- Installation rapide
- Exemples d'utilisation
- Configuration
- Dépannage
- Comparaison avec d'autres providers

**👉 Commencez ici si vous découvrez le projet**

---

### Guide de démarrage rapide
**Fichier** : `KIRO_CLAUDE_QUICK_START.md`

Guide pratique pour démarrer en 3 minutes :
- ✅ Installation de Kiro CLI
- ✅ Authentification
- ✅ Premier test
- ✅ Configuration n8n
- ✅ Exemples de code
- ✅ Dépannage rapide

**👉 Parfait pour une mise en route rapide**

---

### Documentation complète
**Fichier** : `src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md`

Documentation technique détaillée :
- Architecture d'intégration
- Installation et configuration
- Tous les endpoints disponibles
- Fonctionnalités avancées
- Streaming et contexte
- Limites et considérations
- Exemples complets

**👉 Pour comprendre en profondeur le système**

---

### Rapport de tâche
**Fichier** : `TACHE_3_KIRO_CLAUDE_COMPLETE.md`

Rapport technique de l'implémentation :
- Objectifs atteints
- Fichiers créés/modifiés
- Architecture technique
- Tests et validation
- Checklist de complétion

**👉 Pour les développeurs et mainteneurs**

---

### API Reference
**Fichier** : `src/webserver/kiro-cli-docs/API_REFERENCE.md`

Référence complète des API :
- Endpoints OpenAI-compatible
- Endpoints natifs Kiro
- Paramètres et réponses
- Codes d'erreur
- Exemples de requêtes

**👉 Pour l'intégration technique**

---

### Intégration n8n
**Fichier** : `src/webserver/kiro-cli-docs/INTEGRATION_N8N.md`

Guide spécifique pour n8n :
- Configuration des nœuds
- Workflows exemples
- LangChain integration
- Bonnes pratiques
- Troubleshooting

**👉 Pour les utilisateurs de n8n**

---

## 🛠️ Ressources techniques

### Scripts

| Script | Description | Commande |
|--------|-------------|----------|
| **Test complet** | Teste tous les endpoints | `node scripts/test-kiro-claude.js` |
| **Démarrage serveur** | Lance le serveur | `npm run start:assistants` |
| **Mode développement** | Serveur avec hot-reload | `npm run dev:assistants` |

### Workflows

| Fichier | Description |
|---------|-------------|
| `n8n-workflow-kiro-claude.json` | Workflow n8n complet avec 6 tests |

### Configuration

| Fichier | Description |
|---------|-------------|
| `.env` | Variables d'environnement |
| `src/webserver/services/KiroCliService.ts` | Service principal |
| `src/webserver/routes/kiroCliRoutes.ts` | Routes API |

---

## 🎓 Parcours d'apprentissage

### Niveau 1 : Débutant (30 minutes)

1. Lire le [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md)
2. Suivre le [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md)
3. Exécuter le premier test : `node scripts/test-kiro-claude.js`
4. Tester un appel API simple avec cURL

**Objectif** : Avoir un endpoint fonctionnel

---

### Niveau 2 : Intermédiaire (1 heure)

1. Lire la [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)
2. Explorer l'[API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
3. Importer le workflow n8n
4. Créer votre premier workflow personnalisé
5. Tester le streaming

**Objectif** : Maîtriser les fonctionnalités principales

---

### Niveau 3 : Avancé (2 heures)

1. Lire le [Rapport de tâche](./TACHE_3_KIRO_CLAUDE_COMPLETE.md)
2. Étudier le code source :
   - `src/webserver/services/KiroCliService.ts`
   - `src/webserver/routes/kiroCliRoutes.ts`
3. Personnaliser la configuration
4. Créer des intégrations personnalisées
5. Optimiser les performances

**Objectif** : Personnaliser et étendre le système

---

## 🔍 Recherche par sujet

### Installation et configuration

- [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md) - Section "Installation"
- [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md) - Section "Installation et Configuration"

### Utilisation de base

- [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md) - Section "Exemples d'utilisation"
- [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md) - Section "Exemples d'utilisation"

### API et endpoints

- [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md) - Section "Endpoints disponibles"

### Intégration n8n

- [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)
- [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md) - Section "Configuration n8n"
- Workflow : `n8n-workflow-kiro-claude.json`

### Streaming

- [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md) - Section "Streaming"
- [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md) - Section "Fonctionnalités avancées"

### Dépannage

- [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md) - Section "Dépannage"
- [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md) - Section "Dépannage"
- [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md) - Section "Dépannage"

### Configuration avancée

- [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md) - Section "Fonctionnalités avancées"
- [Rapport de tâche](./TACHE_3_KIRO_CLAUDE_COMPLETE.md) - Section "Configuration avancée"

### Architecture technique

- [Rapport de tâche](./TACHE_3_KIRO_CLAUDE_COMPLETE.md)
- Code source : `src/webserver/services/KiroCliService.ts`

---

## 📊 Matrice de documentation

| Besoin | Document recommandé | Temps de lecture |
|--------|---------------------|------------------|
| Démarrage rapide | [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md) | 5 min |
| Vue d'ensemble | [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md) | 10 min |
| Intégration n8n | [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md) | 15 min |
| Référence API | [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md) | 20 min |
| Compréhension complète | [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md) | 30 min |
| Détails techniques | [Rapport de tâche](./TACHE_3_KIRO_CLAUDE_COMPLETE.md) | 20 min |

---

## 🎯 Cas d'usage et documentation associée

### Je veux...

#### ...démarrer rapidement
👉 [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md)

#### ...comprendre le projet
👉 [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md)

#### ...intégrer dans n8n
👉 [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)  
👉 Workflow : `n8n-workflow-kiro-claude.json`

#### ...développer une intégration
👉 [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)  
👉 [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)

#### ...résoudre un problème
👉 [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md) - Section "Dépannage"  
👉 [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md) - Section "Dépannage"

#### ...comprendre l'architecture
👉 [Rapport de tâche](./TACHE_3_KIRO_CLAUDE_COMPLETE.md)  
👉 Code source dans `src/webserver/`

#### ...tester le système
👉 Script : `node scripts/test-kiro-claude.js`  
👉 [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md) - Section "Test rapide"

---

## 📝 Checklist de lecture

### Pour démarrer (obligatoire)
- [ ] [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md)
- [ ] [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md)
- [ ] Exécuter `node scripts/test-kiro-claude.js`

### Pour utiliser (recommandé)
- [ ] [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)
- [ ] [API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- [ ] [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md) (si utilisation de n8n)

### Pour développer (optionnel)
- [ ] [Rapport de tâche](./TACHE_3_KIRO_CLAUDE_COMPLETE.md)
- [ ] Code source : `src/webserver/services/KiroCliService.ts`
- [ ] Code source : `src/webserver/routes/kiroCliRoutes.ts`

---

## 🔗 Liens externes

### Documentation officielle
- [Kiro CLI Documentation](https://kiro.dev/docs/cli/)
- [Kiro GitHub](https://github.com/kirodotdev/Kiro)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Claude Documentation](https://docs.anthropic.com/)

### Outils d'intégration
- [n8n Documentation](https://docs.n8n.io/)
- [LangChain Documentation](https://python.langchain.com/)
- [Flowise Documentation](https://docs.flowiseai.com/)

---

## 📞 Support et aide

### Problèmes techniques
1. Consulter la section "Dépannage" dans :
   - [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md)
   - [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md)
   - [Documentation complète](./src/webserver/kiro-cli-docs/KIRO_CLAUDE_INTEGRATION.md)

2. Exécuter le diagnostic :
   ```bash
   node scripts/test-kiro-claude.js
   ```

3. Vérifier les logs :
   ```bash
   npm run logs:assistants
   ```

### Questions sur l'utilisation
- Consulter l'[API Reference](./src/webserver/kiro-cli-docs/API_REFERENCE.md)
- Voir les exemples dans le [README Principal](./README_KIRO_CLAUDE_ENDPOINT.md)

### Intégration n8n
- Lire le guide [Intégration n8n](./src/webserver/kiro-cli-docs/INTEGRATION_N8N.md)
- Importer le workflow : `n8n-workflow-kiro-claude.json`

---

## 🎉 Prochaines étapes

Après avoir lu la documentation :

1. **Installer** : Suivre le [Guide de démarrage rapide](./KIRO_CLAUDE_QUICK_START.md)
2. **Tester** : Exécuter `node scripts/test-kiro-claude.js`
3. **Intégrer** : Importer le workflow n8n
4. **Créer** : Développer vos propres intégrations

---

## 📅 Historique

| Date | Version | Changements |
|------|---------|-------------|
| 2026-03-02 | 1.0.0 | Version initiale complète |

---

**Dernière mise à jour** : 2 mars 2026  
**Version** : 1.0.0  
**Statut** : ✅ Complet

Pour toute question, consultez d'abord la documentation appropriée selon votre besoin, puis exécutez les scripts de diagnostic si nécessaire.
