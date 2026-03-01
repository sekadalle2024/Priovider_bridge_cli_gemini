# Template Assistant

Ceci est un template pour créer votre propre assistant personnalisé.

---

## Description

Décrivez ici ce que fait votre assistant. Cette description apparaîtra dans la liste des assistants disponibles via l'API.

Exemple : "Assistant spécialisé dans l'analyse de données et la génération de rapports automatiques."

---

## Capacités

### Capacité 1: Nom de la capacité

Décrivez la première capacité de votre assistant.

**Exemple d'utilisation :**
```
Analyser les données de ventes du dernier trimestre
```

### Capacité 2: Autre capacité

Décrivez une autre capacité.

**Exemple d'utilisation :**
```
Générer un rapport PDF avec graphiques
```

### Capacité 3: Encore une capacité

Et ainsi de suite...

---

## Instructions spécifiques

Ajoutez ici des instructions spécifiques pour guider le comportement de l'assistant.

### Règles importantes

1. **Règle 1** : Description de la règle
2. **Règle 2** : Description de la règle
3. **Règle 3** : Description de la règle

### Format de sortie

Spécifiez le format de sortie attendu :

- JSON
- Markdown
- Fichiers spécifiques
- etc.

### Contexte requis

Listez les informations de contexte nécessaires :

- `workspace` : Chemin vers le dossier de travail
- `files` : Liste des fichiers à traiter
- `options` : Options spécifiques
- etc.

---

## Exemples d'utilisation

### Exemple 1: Cas d'usage simple

**Prompt :**
```
Votre exemple de prompt ici
```

**Contexte :**
```json
{
  "workspace": "/path/to/workspace",
  "option1": "value1"
}
```

**Résultat attendu :**
```
Description du résultat attendu
```

### Exemple 2: Cas d'usage avancé

**Prompt :**
```
Exemple plus complexe
```

**Contexte :**
```json
{
  "workspace": "/path/to/workspace",
  "files": ["file1.txt", "file2.txt"],
  "options": {
    "format": "pdf",
    "style": "modern"
  }
}
```

**Résultat attendu :**
```
Description du résultat attendu
```

---

## Limitations

Listez les limitations connues de votre assistant :

- Limitation 1
- Limitation 2
- Limitation 3

---

## Dépendances

Si votre assistant nécessite des outils ou bibliothèques spécifiques :

- Outil 1 : Description
- Outil 2 : Description
- Bibliothèque 1 : Description

---

## Notes de développement

Ajoutez ici des notes pour les développeurs qui voudront modifier ou étendre cet assistant.

### Structure des fichiers

```
assistant/
  mon-assistant/
    mon-assistant.md          # Ce fichier
    mon-assistant.zh-CN.md    # Version chinoise (optionnel)
    skills/                   # Compétences spécifiques (optionnel)
      skill1.py
      skill2.js
    templates/                # Templates (optionnel)
      template1.md
```

### Intégration avec l'API

Une fois ce fichier créé dans `assistant/mon-assistant/mon-assistant.md`, l'assistant sera automatiquement découvert et disponible via :

```
POST /api/assistant/mon-assistant
```

---

## Auteur

- Nom : Votre nom
- Email : votre@email.com
- GitHub : @votre-username

---

## Licence

Spécifiez la licence de votre assistant (généralement la même que le projet principal : Apache 2.0)

---

## Changelog

### Version 1.0.0 (2024-03-01)
- Création initiale de l'assistant
- Ajout de la capacité 1
- Ajout de la capacité 2

### Version 1.1.0 (2024-03-15)
- Amélioration de la capacité 1
- Ajout de la capacité 3
- Correction de bugs
