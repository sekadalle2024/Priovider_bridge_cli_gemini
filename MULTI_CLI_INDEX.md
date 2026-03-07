# 📚 Index - Documentation Multi-CLI Gemini

Documentation complète pour l'utilisation de plusieurs comptes Google avec Gemini CLI.

## 🚀 Démarrage Rapide

**Temps estimé:** 10 minutes

1. **[MULTI_CLI_QUICK_START.md](MULTI_CLI_QUICK_START.md)** ⭐
   - Guide de démarrage rapide (recommandé pour commencer)
   - Configuration en 3 étapes
   - Tests et exemples d'utilisation

## 📖 Documentation Détaillée

2. **[MULTI_CLI_ENDPOINTS_GUIDE.md](MULTI_CLI_ENDPOINTS_GUIDE.md)**
   - Architecture complète du système
   - Tous les endpoints disponibles
   - Stratégies de load balancing
   - Cas d'usage avancés
   - Monitoring et maintenance

3. **[MULTI_COMPTES_GEMINI_CLI.md](MULTI_COMPTES_GEMINI_CLI.md)**
   - Comparaison API Keys vs CLI
   - Avantages et limitations
   - Quand utiliser quelle solution

## 🔧 Fichiers de Configuration

4. **[.env.multi-cli.example](.env.multi-cli.example)**
   - Exemple de configuration
   - Variables d'environnement nécessaires
   - Notes et instructions

## 📜 Scripts

5. **Configuration:**
   - `scripts/setup-multi-cli-profiles.ps1` - Configuration automatique des profils
   - Commande: `npm run setup:multi-cli`

6. **Démarrage:**
   - `scripts/start-multi-cli-server.js` - Serveur Multi-CLI
   - Commande: `npm run multi-cli`

7. **Tests:**
   - `scripts/test-multi-cli.js` - Tests automatisés
   - Commande: `npm run test:multi-cli`

## 💻 Code Source

8. **Service Principal:**
   - `src/webserver/services/MultiGeminiCliService.ts`
   - Gestion des profils, load balancing, statistiques

9. **Routes API:**
   - `src/webserver/routes/multiGeminiCliRoutes.ts`
   - Endpoints REST pour chaque profil

## 🎯 Parcours Recommandé

### Pour Débutants

1. Lire [MULTI_CLI_QUICK_START.md](MULTI_CLI_QUICK_START.md)
2. Exécuter `npm run setup:multi-cli`
3. Démarrer avec `npm run multi-cli`
4. Tester avec `npm run test:multi-cli`

### Pour Utilisateurs Avancés

1. Lire [MULTI_CLI_ENDPOINTS_GUIDE.md](MULTI_CLI_ENDPOINTS_GUIDE.md)
2. Consulter [MULTI_COMPTES_GEMINI_CLI.md](MULTI_COMPTES_GEMINI_CLI.md)
3. Personnaliser la configuration dans `.env`
4. Implémenter des stratégies de load balancing personnalisées

## 📊 Résumé des Fonctionnalités

### ✅ Fonctionnalités Implémentées

- [x] Configuration automatique des profils
- [x] Load balancing (round-robin, least-loaded, random)
- [x] Endpoints par profil
- [x] Statistiques en temps réel
- [x] Failover automatique
- [x] API REST compatible OpenAI
- [x] Tests automatisés
- [x] Documentation complète

### 🎯 Avantages

- **Quotas Multipliés:** 3x-4x plus de requêtes et tokens
- **Haute Disponibilité:** Failover automatique entre profils
- **Flexibilité:** Choisir le profil selon le besoin
- **Monitoring:** Statistiques détaillées par profil
- **Simplicité:** API compatible OpenAI

### ⚙️ Configuration Requise

- Node.js v22+
- Gemini CLI v0.32.1+
- Plusieurs comptes Google
- Windows avec PowerShell (pour le script de configuration)

## 🔗 Liens Utiles

### Documentation Externe

- [Gemini CLI Documentation](https://github.com/google/generative-ai-cli)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)

### Documentation Interne

- [UPDATE_GEMINI_CLI_v0.32.md](UPDATE_GEMINI_CLI_v0.32.md) - Mise à jour Gemini CLI
- [AI-JE_GEMINI_3_1.md](AI-JE_GEMINI_3_1.md) - Gemini 3.1 Pro Preview

## 🆘 Support

### Problèmes Courants

Consultez la section "Dépannage" dans:
- [MULTI_CLI_QUICK_START.md](MULTI_CLI_QUICK_START.md#-dépannage)
- [MULTI_CLI_ENDPOINTS_GUIDE.md](MULTI_CLI_ENDPOINTS_GUIDE.md#-support)

### Commandes Utiles

```bash
# Configuration
npm run setup:multi-cli

# Démarrage
npm run multi-cli

# Tests
npm run test:multi-cli

# Compilation
npm run build

# Vérifier un profil
$env:GEMINI_CLI_HOME="$HOME\.gemini-profile1"
gemini --version
```

## 📝 Notes Importantes

1. **Authentification:** Chaque profil nécessite une authentification OAuth séparée
2. **Quotas:** Les quotas sont par compte Google, pas par profil CLI
3. **Isolation:** Les profils sont complètement isolés les uns des autres
4. **Performance:** Le load balancing ajoute ~10-20ms de latence
5. **Maintenance:** Vérifier régulièrement l'état des profils

## 🎉 Prochaines Étapes

Après avoir configuré Multi-CLI:

1. **Intégration n8n:** Utiliser les endpoints dans vos workflows
2. **Monitoring:** Mettre en place un dashboard de statistiques
3. **Optimisation:** Ajuster la stratégie de load balancing
4. **Scaling:** Ajouter plus de profils selon les besoins

---

**Dernière mise à jour:** 2026-03-07  
**Version:** 1.0.0  
**Auteur:** AionUi Team
