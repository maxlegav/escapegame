# Escape Game - Next.js

Un escape game interactif construit avec Next.js, TypeScript et Tailwind CSS.

## Description

Cette application présente une série de défis à résoudre. Les utilisateurs doivent répondre correctement aux questions pour progresser d'un niveau à l'autre.

### Parcours du jeu

1. **Page d'accueil** (`/`) - Message d'erreur 404 avec un indice
2. **Défi 1** (`/hec23fr`) - Exercices GMAT
3. **Défi 2** (`/youtube-challenge`) - Épreuve YouTube
4. **Victoire** (`/victory`) - Page de félicitations

## Installation locale

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Déploiement sur Vercel

### Méthode 1: Via le dashboard Vercel (Recommandée)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre repository GitHub/GitLab/Bitbucket
3. Vercel détectera automatiquement qu'il s'agit d'un projet Next.js
4. Cliquez sur "Deploy"
5. Votre application sera déployée en quelques secondes

### Méthode 2: Via la CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel
```

### Méthode 3: Déploiement direct depuis ce dossier

```bash
# Si vous n'avez pas de repository git
vercel --prod
```

## Ajouter de nouveaux défis

Pour ajouter de nouveaux défis, éditez le fichier `data/challenges.ts`:

```typescript
export const challenges: Record<string, Challenge> = {
  'nouveau-defi': {
    id: 'nouveau-defi',
    question: 'Votre question ici ?',
    answer: 'la-reponse',
    hint: 'Un indice optionnel',
    nextPath: 'defi-suivant',
    caseSensitive: false,
  },
  // ...
};
```

Puis créez la page correspondante dans `app/nouveau-defi/page.tsx`.

## Structure du projet

```
escapegame/
├── app/                    # Pages Next.js (App Router)
│   ├── hec23fr/           # Exercices GMAT
│   ├── youtube-challenge/ # Épreuve YouTube
│   ├── victory/           # Page de victoire
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil (404)
├── components/            # Composants React
│   ├── ChallengeForm.tsx  # Formulaire de défi
│   ├── GMATChallengeForm.tsx  # Formulaire GMAT
│   └── YouTubeChallenge.tsx   # Challenge YouTube
├── data/                  # Données
│   ├── challenges.ts      # Configuration des défis
│   └── gmat-challenge.ts  # Configuration GMAT
├── types/                 # Types TypeScript
│   └── challenge.ts       # Interfaces
└── package.json
```

## Technologies utilisées

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Vercel (pour le déploiement)

## Personnalisation

### Modifier le style

Le style principal se trouve dans `app/globals.css`. Le thème utilise:
- Fond noir avec texte vert (style terminal/Matrix)
- Police monospace (Courier New)
- Bordures et effets de couleur verte

### Modifier les questions

Toutes les questions et réponses sont centralisées dans `data/challenges.ts` et `data/gmat-challenge.ts` pour faciliter la modification.
