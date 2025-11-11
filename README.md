# Forum Express

Application web de forum développée avec **Express.js**, **Node.js** et **Tailwind CSS**. Cette plateforme permet aux utilisateurs de créer des discussions, d'interagir et de partager leurs idées.

## 🌐 Démo en ligne

- URL : https://forum-express.onrender.com/
- Statut : déployé sur Render (Web Service)

## 📆 Avancement du projet

- ✅ Initialisation de l'application Express avec rendu côté serveur via EJS et Tailwind pour le style.
- ✅ Mise en place de l'authentification (inscription, connexion, déconnexion) avec sessions persistées en base.
- ✅ Gestion des discussions : création sécurisée, génération de slugs uniques et affichage des listes sur la page d'accueil.
- ✅ Gestion des posts dans une discussion : création, édition et suppression côté API avec sanitation du HTML.
- ✅ Intégration front (Quill, fetch API) pour créer/modifier/supprimer des posts avec retours utilisateur en temps réel.
- 🔄 Étape en cours : pagination des posts (limite de 10, navigation via `?page=` et redirection automatique vers la dernière page après ajout).

## 🚀 Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **EJS** - Moteur de template pour les vues
- **Tailwind CSS** - Framework CSS utilitaire
- **MongoDB** / **Mongoose** - Base de données NoSQL et ODM
- **bcrypt** - Hachage des mots de passe
- **cookie-parser** - Gestion des cookies de session
- **marked** - Parser Markdown pour le contenu
- **DOMPurify** - Sanitization HTML pour la sécurité
- **Quill** - Éditeur de texte riche (WYSIWYG)
- **slugify** - Génération d'URLs propres (slugs)

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- npm (gestionnaire de paquets Node.js)
- MongoDB (base de données)

## 🛠️ Installation

1. **Cloner le dépôt** (ou télécharger le projet)

   ```bash
   git clone <url-du-depot>
   cd forum-express
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créer un fichier `.env` à la racine du projet avec les variables nécessaires :

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/forum-express
   SESSION_SECRET=votre-secret-de-session
   ```

4. **Démarrer MongoDB**
   Assurez-vous que MongoDB est en cours d'exécution sur votre machine.

## ▶️ Démarrage

### Mode développement

Pour démarrer le serveur en mode développement avec rechargement automatique :

```bash
npm run dev
```

### Compilation Tailwind CSS

Pour compiler et surveiller les fichiers Tailwind CSS :

```bash
npm run buildTailwind
```

Le serveur sera accessible à l'adresse : `http://localhost:3000`

## 🚀 Déploiement (Render)

1. **Préparer le dépôt**

   - S'assurer que `index.js` lit le port via `process.env.PORT` (Render fournit la valeur en production).
   - Vérifier que la commande `npm start` lance bien l'application.
   - Commiter et pousser vos modifications sur la branche cible (`main` par exemple).

2. **Créer le service sur Render**

   - Se connecter sur https://dashboard.render.com/ et cliquer sur **New +** > **Web Service**.
   - Connecter le dépôt GitHub ou GitLab contenant ce projet.
   - Choisir la branche à déployer et donner un nom au service (ex. `forum-express`).

3. **Configurer les paramètres**

   - **Environment** : `Node`.
   - **Build Command** : `npm install` (Render l’exécute par défaut, laisser vide si souhaité).
   - **Start Command** : `npm start`.
   - Ajouter les variables d’environnement dans l’onglet **Environment** :
     - `MONGODB_URI`
     - `SESSION_SECRET`
     - (Optionnel) `PORT` si vous souhaitez forcer une valeur spécifique.

4. **Lancer le déploiement**

   - Cliquer sur **Create Web Service**.
   - Render installe les dépendances, exécute la commande de démarrage et fournit un domaine public (ex. `https://forum-express.onrender.com/`).

5. **Mettre à jour en continu**
   - Chaque push sur la branche suivie déclenche automatiquement un nouveau déploiement.
   - Surveiller les logs Render pour diagnostiquer d’éventuelles erreurs de build ou de runtime.

## 📁 Structure du projet

```
forum-express/
├── index.js                 # Point d'entrée principal de l'application
├── package.json             # Dépendances et scripts npm
├── nodemon.json             # Configuration Nodemon
├── routes/                  # Routes de l'application
│   ├── pages/               # Routes des pages (home, auth, thread)
│   │   └── index.js
│   └── api/                 # API REST (auth, threads, post)
│       ├── auth.js
│       ├── post.js
│       └── threads.js
├── views/                   # Templates EJS
│   └── pages/              # Vues des pages
│       ├── home.ejs
│       ├── thread.ejs
│       ├── inscription.ejs
│       └── connexion.ejs
├── public/                  # Fichiers statiques
│   ├── styles/             # Fichiers CSS compilés
│   │   └── main.css        # CSS principal (Tailwind compilé)
│   ├── js/                 # Scripts front (Quill, fetch API)
│   │   ├── create-thread.js
│   │   └── thread.js
│   └── icons/              # Icônes SVG
├── styles/                  # Fichiers sources CSS
│   └── input/              # Fichiers d'entrée Tailwind
│       └── tailwindInput.css
├── services/                # Couche métier (auth, thread, post)
├── models/                  # Schémas Mongoose
├── middlewares/             # Middlewares personnalisés (sessions, guards)
├── errors/                  # Classes d'erreurs custom
└── utils/db                 # Connexion MongoDB
└── .gitignore              # Fichiers ignorés par Git
```

## 🎯 Fonctionnalités

- ✅ Page d'accueil listant les discussions les plus récentes.
- ✅ Formulaires d'inscription/connexion avec validation côté serveur et gestion de session.
- ✅ Création de discussions (titre + premier post) protégée par authentification.
- ✅ Page de discussion avec affichage des posts, éditeur riche et contrôles conditionnels selon l'auteur.
- ✅ API REST pour créer/mettre à jour/supprimer un post avec sanitation DOMPurify.
- 🔄 Pagination des posts (10 par page) en cours d'implémentation côté client.

## 🔄 Pagination des posts (travail en cours)

- `services/thread/queries.js#getThreadsPost` renvoie les posts par lot de 10, ainsi que le flag `hasMorePosts` pour préparer le chargement incrémental.
- La vue `views/pages/thread.ejs` consomme le paramètre `?page=` et délègue à `public/js/thread.js` la gestion des interactions (ajout, édition, suppression).
- Après la création d'un post, la redirection renvoie automatiquement vers la dernière page (`lastPage`) avec ancrage sur le nouveau post.
- Prochaines étapes : exposer le `totalPages` côté rendu, ajouter la navigation (précédent/suivant) et mettre en place un rafraîchissement partiel sans rechargement complet.

## 📝 Scripts disponibles

- `npm run dev` - Démarre le serveur en mode développement avec Nodemon
- `npm run buildTailwind` - Compile les fichiers Tailwind CSS en mode watch
- `npm test` - Lance les tests (à configurer)

## 🔧 Configuration

### Port du serveur

Par défaut, le serveur écoute sur le port **3000**. Vous pouvez modifier cette valeur dans le fichier `index.js` ou via une variable d'environnement.

### Base de données

Le projet utilise MongoDB avec Mongoose. Assurez-vous que votre URI de connexion MongoDB est correctement configurée dans le fichier `.env`.

## 🎨 Personnalisation

### Tailwind CSS

Les fichiers Tailwind sont dans `styles/input/tailwindInput.css`. Après modification, exécutez `npm run buildTailwind` pour compiler les styles.

### Vues EJS

Les templates sont dans le dossier `views/pages/`. Vous pouvez modifier les fichiers `.ejs` pour personnaliser l'interface.

## 📦 Dépendances principales

### Production

- `express` - Framework web
- `ejs` - Moteur de template
- `mongoose` - ODM pour MongoDB
- `bcrypt` - Hachage des mots de passe
- `cookie-parser` - Gestion des cookies
- `dotenv` - Variables d'environnement
- `marked` - Parser Markdown
- `dompurify` - Sanitization HTML
- `quill` - Éditeur de texte riche
- `slugify` - Génération de slugs
- `tailwindcss` - Framework CSS

### Développement

- `nodemon` - Rechargement automatique du serveur

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 👤 Auteur

Projet développé dans le cadre d'une formation React/Express.

---

**Note** : Ce projet est en cours de développement. Certaines fonctionnalités peuvent être incomplètes ou en cours d'implémentation.
