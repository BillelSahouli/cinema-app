# 🎬 Cinema App

Application de films réalisée dans le cadre d'un test technique pour HelloCSE.

Interface de consultation de films utilisant l'API TMDB, développée avec Nuxt 4, Vue 3 et TypeScript.

---

## Stack technique

- **Nuxt 4** — Framework Vue.js avec routing automatique et SSR
- **Vue 3** — Composition API et TypeScript
- **Tailwind CSS + SCSS** — Styling utilitaire et animations
- **Pinia** — Gestion d'état global
- **VueUse** — Composables utilitaires (infinite scroll, debounce)
- **Vuelidate** — Validation de formulaires
- **@nuxtjs/i18n** — Internationalisation (FR / EN)
- **@nuxt/icon + Heroicons** — Icônes
- **Vitest** — Tests unitaires

---

## Fonctionnalités

### Page liste des films
- Affichage des films populaires depuis l'API TMDB
- Défilement infini (infinite scroll)
- Barre de recherche avec debounce (400ms)
- Header fixe avec barre de recherche accessible au scroll
- Restauration de la position de scroll au retour
- Skeletons pendant le chargement

### Page détail d'un film
- Affiche, titre, tagline, synopsis
- Note TMDB et nombre de votes
- Durée, réalisateur, genres
- Casting (10 premières têtes d'affiche)
- Image de fond avec dégradé

### Commentaires
- Formulaire avec validation Vuelidate :
  - Nom d'utilisateur (lettres uniquement, 3-50 caractères)
  - Message (3-500 caractères)
  - Note de 1 à 10
- Stockage en localStorage
- Affichage du plus récent au plus ancien

---

## Architecture
```
app/
├── components/
│   ├── AppHeader.vue          # Header fixe avec recherche
│   ├── CommentForm.vue        # Formulaire de commentaire
│   ├── CommentList.vue        # Liste des commentaires
│   ├── MovieCard.vue          # Carte film
│   └── MovieCardSkeleton.vue  # Skeleton de chargement
├── pages/
│   ├── index.vue              # Liste des films
│   └── movies/[id].vue        # Détail d'un film
services/
├── tmdb.ts                    # Appels API TMDB
stores/
├── commentStore.ts            # État des commentaires
└── movieStore.ts              # État des films
types/
├── comment.ts                 # Types TypeScript
└── movie.ts                   # Types TypeScript
tests/
├── commentStore.test.ts       # Tests unitaires
└── movieStore.test.ts         # Tests unitaires
i18n/
├── locales/fr.json            # Traductions françaises
└── locales/en.json            # Traductions anglaises
```

---

## Installation
```bash
# Cloner le projet
git clone https://github.com/TON_USERNAME/cinema-app.git
cd cinema-app

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Ajouter votre clé API TMDB dans .env

# Lancer en développement
npm run dev
```

---

## Variables d'environnement

Créez un fichier `.env` à la racine :
```
NUXT_PUBLIC_TMDB_API_KEY=votre_bearer_token_tmdb
```

Le Bearer Token est disponible sur [themoviedb.org](https://www.themoviedb.org) dans `Settings → API`.

---

## Scripts
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run lint         # Vérification ESLint
npm run lint:fix     # Correction automatique ESLint
npm run format       # Formatage Prettier
npm run test         # Tests unitaires
npm run test:watch   # Tests en mode watch
```

---

## Tests
```bash
npm run test
```

11 tests unitaires couvrant :
- `commentStore` — ajout, suppression, filtrage, tri, persistance localStorage
- `movieStore` — chargement, recherche, pagination, état de loading
```

Crée aussi un fichier `.env.example` à la racine :
```
NUXT_PUBLIC_TMDB_API_KEY=your_tmdb_bearer_token_here