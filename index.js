/**
 * Point d'entrée principal de l'application Express
 * Ce fichier configure et démarre le serveur web
 */

// Import du module Express pour créer le serveur web
import express from "express";
// Import de cookie-parser pour gérer les cookies
import cookieParser from "cookie-parser";
// Import du routeur des pages (routes principales de l'application)
import pagesRouter from "./routes/pages/index.js";
// import du Dotenv
import dotenv from "dotenv";
// import de la fonction de connexion à la base de données MongoDB
import { mongoConnection } from "./utils/db/mongoConnection.js";
// import du routeur des threads //
import threadsRouter from "./routes/api/threads.js";
// import du routeur des Users //
import authRouter from "./routes/api/auth.js";
// import de la classe BaseError //
import { BaseError } from "./errors/index.js";
// import de la fonction de récupération des informations de la session //
import { getSessionInfo } from "./services/auth/queries.js";





// Configuration des variables d'environnement
dotenv.config();
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

// Configuration du middleware pour parser les cookies //
// IMPORTANT: cookie-parser doit être configuré AVANT express.json() //
app.use(cookieParser());

// Middleware utilitaire qui va nous permettre de rajouter des informations de session dans la requete et dans le response // 
app.use(async (req, res, next) => {
  // récupération de l'id de la session dans le cookie // 
   const sessionId = req.cookies.sessionId; 
   // récupération des informations de la session dans la base de données // 
   const sessionInfo = await getSessionInfo(sessionId); 
  
   // req va être accessible dans les routes api // 
   req.isLoggedIn = sessionInfo.isLoggedIn || null;
   req.userId = sessionInfo.userId || null;
   req.userName = sessionInfo.userName || null;

   // Changer les vues des pages qu'on retourne du client en fonction de la session// 
   if(req.isLoggedIn) {
    res.locals.isLoggedIn = true;
    res.locals.userId = req.userId;
    res.locals.userName = req.userName;
   } else {
    res.locals.isLoggedIn = false;
    res.locals.userId = null;
    res.locals.userName = null;
   }
   // on passe à la suite // 
   next();
})

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
app.use("/api/auth", authRouter);

// Configuration d'un middware pour gérer les erreurs //
app.use((err, req, res, next) => {
  console.log(err);

  // Soit on montre les erreurs au client soit montrer une erreur générique //
  if (err instanceof BaseError && err.showToClient) {
    return res.status(err.statusCode).json({
      error: err.message,
      showToUser: err.showToUser,
    });
    // Sinon on montre une erreur générique //
    return res.status(500).json({
      error: "Erreur interne du serveur",
    });
  }
});

// Démarrage du serveur sur le port 3000
// Le serveur écoute les requêtes HTTP entrantes
// Une fois démarré, un message de confirmation est affiché dans la console
app.listen(3000, () => {
  console.log("serveur demarré à sur le port 3000 http://localhost:3000/");
});
