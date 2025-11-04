/**
 * Point d'entrée principal de l'application Express
 * Ce fichier configure et démarre le serveur web
 */

// Import du module Express pour créer le serveur web
import express from "express";
// Import du routeur des pages (routes principales de l'application)
import pagesRouter from "./routes/pages/index.js";
// import du Dotenv 
import dotenv from "dotenv"
// import de la fonction de connexion à la base de données MongoDB
import { mongoConnection } from "./utils/db/mongoConnection.js";
// import du routeur des threads //
import threadsRouter from "./routes/api/threads.js";

// Configuration des variables d'environnement
dotenv.config()
// Connexion à la base de données MongoDB
await mongoConnection();
// Instanciation de l'application Express
// Cette instance sera utilisée pour configurer les middlewares et les routes
const app = express();

// Configuration du middleware pour servir les fichiers statiques de Quill
// Les fichiers du module Quill (CSS, JS) seront accessibles via l'URL /vendor/quill
// Par exemple : /vendor/quill/quill.core.css ou /vendor/quill/quill.js
// Cela permet d'utiliser les ressources de Quill dans les templates EJS
app.use("/vendor/quill", express.static("node_modules/quill/dist"));

app.use(express.static("public"));

// Configuration du middleware pour parser le corps des requetes JSON // 
app.use(express.json());

// Configuration du moteur de template EJS
// Permet de rendre des vues dynamiques avec la syntaxe EJS
app.set("view engine", "ejs");

// Configuration des routes de l'application
// Le routeur des pages gère toutes les routes principales (racine "/")
app.use("/", pagesRouter);


// Configuration des routes des threads //
app.use("/api/threads", threadsRouter);

// Démarrage du serveur sur le port 3000
// Le serveur écoute les requêtes HTTP entrantes
// Une fois démarré, un message de confirmation est affiché dans la console
app.listen(3000, () => {
  console.log("serveur demarré à sur le port 3000 http://localhost:3000/");
});
