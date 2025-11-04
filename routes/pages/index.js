/**
 * Routeur pour les pages principales de l'application
 * Gère les routes liées à l'affichage des pages (home, etc.)
 */

// Import du module Express pour créer un routeur
import express from "express";

// Instanciation de l'objet Router d'Express
// Permet de définir des routes modulaires qui peuvent être montées dans l'application principale
const router = express.Router();

/**
 * Route GET pour la page d'accueil de l'application
 * Cette route répond aux requêtes GET sur la racine "/"
 *
 * @param {Object} req - Objet de requête Express contenant les informations de la requête HTTP
 * @param {Object} res - Objet de réponse Express pour envoyer la réponse au client
 */
router.get("/", (req, res) => {
  // Ancienne réponse simple (commentée) - remplacée par le rendu de la vue
  //res.send("Bienvenue ")

  // Rendu de la vue EJS "pages/home" avec le titre dynamique
  // Le titre est passé comme variable locale et sera disponible dans le template
  res.render("pages/home");
});

// Export du routeur pour qu'il puisse être utilisé dans index.js
export default router;
