/**
 * Point d'entrée principal de l'application Express
 * Ce fichier configure et démarre le serveur web
 */

// Import du module Express pour créer le serveur web
import express from "express";
// Import du routeur des pages (routes principales de l'application)
import pagesRouter from "./routes/pages/index.js";

// Instanciation de l'application Express
// Cette instance sera utilisée pour configurer les middlewares et les routes
const app = express();

app.use(express.static("public"))

// Configuration du moteur de template EJS
// Permet de rendre des vues dynamiques avec la syntaxe EJS
app.set("view engine", "ejs");

// Configuration des routes de l'application
// Le routeur des pages gère toutes les routes principales (racine "/")
app.use("/", pagesRouter);

// Démarrage du serveur sur le port 3000
// Le serveur écoute les requêtes HTTP entrantes
// Une fois démarré, un message de confirmation est affiché dans la console
app.listen(3000, () => {
  console.log("serveur demarré à sur le port 3000 http://localhost:3000/");
});
