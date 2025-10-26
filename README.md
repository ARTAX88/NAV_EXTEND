# NAV Extend

NAV Extend est une extension Chrome qui facilite la navigation dans les pages riches en contenu.
Elle collecte automatiquement tous les titres (`<h1>` à `<h6>`) de la page active et les affiche dans
une popup ergonomique. En un clic, vous pouvez faire défiler la page vers la section souhaitée et
profiter d'un surlignage temporaire pour vous repérer visuellement.

## Fonctionnalités

- Récupération automatique des titres de la page courante.
- Filtre instantané pour retrouver rapidement un intitulé spécifique.
- Défilement fluide jusqu'à la section sélectionnée avec mise en évidence temporaire.
- Interface compatible avec les thèmes clair et sombre du navigateur.

## Installation pour le développement

1. Ouvrez `chrome://extensions/` dans Google Chrome ou Microsoft Edge.
2. Activez le **Mode développeur** dans le coin supérieur droit.
3. Cliquez sur **Charger l'extension non empaquetée**.
4. Sélectionnez le dossier `NAV_EXTEND` contenant ce projet.
5. L'icône "NAV Extend" apparaît alors dans votre barre d'extensions.

## Utilisation

1. Rendez-vous sur une page web contenant des titres structurés.
2. Cliquez sur l'icône de l'extension pour ouvrir la popup.
3. Utilisez la barre de recherche pour filtrer les titres si nécessaire.
4. Cliquez sur un titre de la liste pour y accéder immédiatement.

## Structure du projet

```
NAV_EXTEND/
├── manifest.json       # Manifest MV3 de l'extension
└── src/
    ├── content.js      # Script injecté pour analyser la page et gérer le défilement
    ├── popup.css       # Styles de la popup
    ├── popup.html      # Structure de la popup
    └── popup.js        # Logique de la popup et communication avec la page
```

Vous pouvez modifier librement ces fichiers pour adapter l'extension à vos besoins spécifiques.
