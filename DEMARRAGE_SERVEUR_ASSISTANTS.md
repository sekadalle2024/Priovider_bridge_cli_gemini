# 🚀 Démarrage du Serveur des Assistants - Guide Ultra-Simple

## ✅ Vous avez déjà tout !

Pas besoin d'installer quoi que ce soit de nouveau. Le projet AionUI est déjà configuré.

Toutes les dépendances sont déjà installées dans `node_modules`.

## 🎯 Démarrer le Serveur (SANS l'application Electron)

### Une seule commande :

```bash
npm run assistants
```

**C'est tout !** Le serveur démarre sur http://localhost:25810

## 🔍 Vérifier que ça marche

### Dans le navigateur :
```
http://localhost:25810
```

### Ou avec curl :
```bash
curl http://localhost:25810/health
```

## 📚 Documentation Interactive (Swagger)

```
http://localhost:25810/api-docs
```

## 📖 Explication des Commandes

### `npm run assistants`
- Démarre UNIQUEMENT le serveur des assistants
- N'ouvre PAS l'application Electron
- Parfait pour utiliser avec n8n ou en API

### `npm start`
- Démarre l'application Electron COMPLÈTE
- Le serveur des assistants démarre automatiquement aussi
- Ouvre l'interface graphique

### `npm run assistants:dev`
- Mode développement
- Rechargement automatique quand vous modifiez le code
- Pour les développeurs

## ❓ Questions Fréquentes

### Dois-je installer quelque chose ?

**NON !** Tout est déjà installé quand vous avez fait `npm install` pour AionUI.

### Dois-je configurer quelque chose ?

**NON !** Le fichier `.env` est déjà configuré.

### Dois-je avoir Gemini CLI ?

**OUI, C'EST OBLIGATOIRE !** Gemini CLI est utilisé par les assistants pour générer les réponses IA.

Sans Gemini CLI, le serveur démarre mais les assistants ne fonctionneront pas.

Installation :
```bash
npm install -g @google/generative-ai-cli
gemini auth login
```

Vérification :
```bash
gemini --version
```

Note : Le serveur affichera "Gemini CLI: Non disponible" si Gemini CLI n'est pas installé.

## 🎯 Résumé

| Commande | Résultat |
|----------|----------|
| `npm run assistants` | Serveur seul (port 25810) |
| `npm start` | Application + Serveur |

## 🔗 URLs Importantes

- **Serveur** : http://localhost:25810
- **Swagger** : http://localhost:25810/api-docs
- **Health** : http://localhost:25810/health

## 📝 Exemple Complet

```bash
# 1. Démarrer
npm run assistants

# 2. Tester (dans un autre terminal)
curl http://localhost:25810/health

# 3. Ouvrir Swagger
# http://localhost:25810/api-docs
```

## 📚 Documentation Complète

Voir le dossier : `assistant_serveur_endpoint/`

Fichier principal : `assistant_serveur_endpoint/DEMARRAGE_SIMPLE.md`

---

**Commande** : `npm run assistants`

**URL** : http://localhost:25810

**Swagger** : http://localhost:25810/api-docs

**Pas d'installation nécessaire !** ✅
