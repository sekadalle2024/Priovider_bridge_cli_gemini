# 📁 Organisation de la Documentation - Gemini CLI API

## 🎯 Structure Actuelle

Toute la documentation de l'API Gemini CLI est maintenant organisée dans le dossier `src/webserver/gemini-api-docs/`.

### 📂 Arborescence

```
AionUi/
├── src/
│   └── webserver/
│       ├── gemini-api-docs/                    # 📚 Documentation complète
│       │   ├── README.md                        # Index principal de la documentation
│       │   ├── QUICK_START_FR.md                # Démarrage ultra-rapide (3 commandes)
│       │   ├── GEMINI_API_QUICKSTART_FR.md      # Guide de démarrage détaillé
│       │   ├── README_GEMINI_API_FR.md          # README principal avec vue d'ensemble
│       │   ├── GEMINI_API_ENDPOINT.md           # Documentation technique complète
│       │   ├── UTILISATION_AVEC_COMPTE_GOOGLE.md # Guide pour votre compte Google
│       │   ├── NPM_COMMANDS.md                  # Liste des commandes npm
│       │   ├── GEMINI_API_IMPLEMENTATION.md     # Détails d'implémentation
│       │   ├── GEMINI_API_CHANGELOG.md          # Historique des changements
│       │   ├── NAVIGATION_RAPIDE.md             # Navigation rapide
│       │   └── ORGANISATION_DOCUMENTATION.md    # Ce fichier
│       │
│       ├── services/
│       │   └── GeminiApiService.ts          # Service API
│       └── routes/
│           └── geminiApiRoutes.ts           # Routes API
│
├── netlify/
│   └── functions/
│       ├── gemini-chat.ts                   # Fonction Netlify chat
│       └── gemini-generate.ts               # Fonction Netlify generate
│
├── api/
│   ├── chat.ts                              # Fonction Vercel chat
│   └── generate.ts                          # Fonction Vercel generate
│
├── scripts/
│   ├── test-gemini-api.js                   # Script de test
│   └── diagnose-gemini-api.js               # Script de diagnostic
│
├── netlify.toml                             # Configuration Netlify
├── vercel.json                              # Configuration Vercel
└── .env.example                             # Exemple de configuration
```

## 🗂️ Organisation par Type

### 📖 Documentation Utilisateur

**Localisation** : `src/webserver/gemini-api-docs/`

| Fichier | Description | Public Cible |
|---------|-------------|--------------|
| `README.md` | Index de toute la documentation | Tous |
| `QUICK_START_FR.md` | Démarrage en 3 commandes | Débutants |
| `GEMINI_API_QUICKSTART_FR.md` | Guide de démarrage détaillé | Utilisateurs |
| `README_GEMINI_API_FR.md` | Vue d'ensemble complète | Tous |
| `GEMINI_API_ENDPOINT.md` | Documentation technique | Développeurs |
| `UTILISATION_AVEC_COMPTE_GOOGLE.md` | Guide personnalisé | Utilisateurs avec OAuth |
| `NPM_COMMANDS.md` | Référence des commandes | Développeurs |

### 🛠️ Documentation Technique

**Localisation** : `src/webserver/gemini-api-docs/`

| Fichier | Description | Public Cible |
|---------|-------------|--------------|
| `GEMINI_API_IMPLEMENTATION.md` | Détails d'implémentation | Développeurs |
| `GEMINI_API_CHANGELOG.md` | Historique des changements | Tous |
| `ORGANISATION_DOCUMENTATION.md` | Organisation (ce fichier) | Contributeurs |

### 🔗 Fichiers de Référence

**Localisation** : Racine du projet

| Fichier | Description | Public Cible |
|---------|-------------|--------------|
| `GEMINI_API_INDEX.md` | Index principal avec liens | Tous |
| `README_API_SECTION.md` | Section pour le README | Mainteneurs |

## 📚 Guides par Cas d'Usage

### 🚀 Je veux démarrer rapidement

1. **[QUICK_START_FR.md](./QUICK_START_FR.md)** - 3 commandes
2. **[GEMINI_API_QUICKSTART_FR.md](./GEMINI_API_QUICKSTART_FR.md)** - Guide détaillé

### 📖 Je veux tout comprendre

1. **[README_GEMINI_API_FR.md](./README_GEMINI_API_FR.md)** - Vue d'ensemble
2. **[GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md)** - Documentation complète

### 🔐 J'utilise mon compte Google

1. **[UTILISATION_AVEC_COMPTE_GOOGLE.md](./UTILISATION_AVEC_COMPTE_GOOGLE.md)** - Guide personnalisé

### 💻 Je développe

1. **[GEMINI_API_IMPLEMENTATION.md](./GEMINI_API_IMPLEMENTATION.md)** - Détails techniques
2. **[NPM_COMMANDS.md](./NPM_COMMANDS.md)** - Commandes disponibles

### 🔗 J'intègre dans n8n

1. **[GEMINI_API_ENDPOINT.md](./GEMINI_API_ENDPOINT.md#utilisation-avec-n8n)** - Section n8n

### 🌐 Je déploie sur Internet

1. **[GEMINI_API_QUICKSTART_FR.md](./GEMINI_API_QUICKSTART_FR.md#déploiement-netlify)** - Netlify
2. **[GEMINI_API_QUICKSTART_FR.md](./GEMINI_API_QUICKSTART_FR.md#déploiement-vercel)** - Vercel

## 🔍 Comment Trouver une Information

### Par Mot-Clé

| Mot-Clé | Fichier(s) Recommandé(s) |
|---------|--------------------------|
| Installation | QUICK_START_FR.md, GEMINI_API_QUICKSTART_FR.md |
| Configuration | GEMINI_API_ENDPOINT.md, UTILISATION_AVEC_COMPTE_GOOGLE.md |
| Authentification | UTILISATION_AVEC_COMPTE_GOOGLE.md, GEMINI_API_ENDPOINT.md |
| n8n | GEMINI_API_ENDPOINT.md |
| Netlify | GEMINI_API_QUICKSTART_FR.md, GEMINI_API_ENDPOINT.md |
| Vercel | GEMINI_API_QUICKSTART_FR.md, GEMINI_API_ENDPOINT.md |
| Endpoints | GEMINI_API_ENDPOINT.md, README_GEMINI_API_FR.md |
| Exemples | README_GEMINI_API_FR.md, GEMINI_API_ENDPOINT.md |
| Dépannage | GEMINI_API_ENDPOINT.md |
| Commandes | NPM_COMMANDS.md |
| Architecture | GEMINI_API_IMPLEMENTATION.md |

### Par Niveau d'Expertise

#### Débutant
1. QUICK_START_FR.md
2. GEMINI_API_QUICKSTART_FR.md
3. UTILISATION_AVEC_COMPTE_GOOGLE.md

#### Intermédiaire
1. README_GEMINI_API_FR.md
2. GEMINI_API_ENDPOINT.md
3. NPM_COMMANDS.md

#### Avancé
1. GEMINI_API_IMPLEMENTATION.md
2. GEMINI_API_ENDPOINT.md (sections avancées)
3. Code source dans `src/webserver/`

## 🔄 Flux de Lecture Recommandé

### Pour un Nouvel Utilisateur

```
1. QUICK_START_FR.md
   ↓
2. UTILISATION_AVEC_COMPTE_GOOGLE.md
   ↓
3. README_GEMINI_API_FR.md
   ↓
4. GEMINI_API_ENDPOINT.md (au besoin)
```

### Pour un Développeur

```
1. README_GEMINI_API_FR.md
   ↓
2. GEMINI_API_IMPLEMENTATION.md
   ↓
3. NPM_COMMANDS.md
   ↓
4. Code source
```

### Pour une Intégration n8n

```
1. QUICK_START_FR.md
   ↓
2. GEMINI_API_ENDPOINT.md (section n8n)
   ↓
3. UTILISATION_AVEC_COMPTE_GOOGLE.md (authentification)
```

## 📝 Conventions de Nommage

### Fichiers de Documentation

- **Préfixe `GEMINI_API_`** : Documentation spécifique à l'API
- **Suffixe `_FR`** : Documentation en français
- **UPPERCASE** : Fichiers de documentation importants
- **README.md** : Index ou vue d'ensemble

### Sections dans les Fichiers

- **Emojis** : Utilisés pour la navigation visuelle
- **Titres H2 (##)** : Sections principales
- **Titres H3 (###)** : Sous-sections
- **Blocs de code** : Exemples pratiques

## 🔗 Liens Internes

Tous les liens internes utilisent des chemins relatifs :

```markdown
# Depuis src/webserver/gemini-api-docs/
[Autre doc](./AUTRE_FICHIER.md)

# Depuis la racine
[Doc API](./src/webserver/gemini-api-docs/FICHIER.md)
```

## 🎯 Points d'Entrée

### Pour les Utilisateurs

**Point d'entrée principal** : `GEMINI_API_INDEX.md` (racine du projet)

### Pour les Développeurs

**Point d'entrée principal** : `src/webserver/gemini-api-docs/README.md`

### Pour le README Principal

**Section à ajouter** : `README_API_SECTION.md`

## 📊 Statistiques

- **Nombre total de fichiers** : 10 fichiers de documentation
- **Langues** : Français (principal), Anglais (sections techniques)
- **Taille totale** : ~50 KB de documentation
- **Lignes de code** : ~2000 lignes de documentation

## 🔄 Maintenance

### Mise à Jour de la Documentation

1. **Modifier le fichier approprié** dans `src/webserver/gemini-api-docs/`
2. **Vérifier les liens** internes
3. **Mettre à jour** `GEMINI_API_CHANGELOG.md`
4. **Tester** les exemples de code

### Ajout d'un Nouveau Guide

1. **Créer le fichier** dans `src/webserver/gemini-api-docs/`
2. **Ajouter une entrée** dans `README.md`
3. **Mettre à jour** `GEMINI_API_INDEX.md`
4. **Ajouter dans** `ORGANISATION_DOCUMENTATION.md`

## 💡 Conseils

### Pour les Lecteurs

- Commencez par `README.md` pour avoir une vue d'ensemble
- Utilisez `QUICK_START_FR.md` pour démarrer rapidement
- Consultez `GEMINI_API_ENDPOINT.md` pour les détails techniques

### Pour les Contributeurs

- Respectez la structure existante
- Utilisez des emojis pour la navigation
- Ajoutez des exemples pratiques
- Mettez à jour le changelog

## 📚 Ressources Externes

- **Gemini CLI** : https://geminicli.com/docs
- **n8n** : https://docs.n8n.io/
- **Ollama API** : https://github.com/ollama/ollama/blob/main/docs/api.md
- **AionUI** : https://github.com/iOfficeAI/AionUi

---

**Dernière mise à jour** : 26 février 2026  
**Version** : 1.9.0  
**Mainteneur** : Équipe AionUI

