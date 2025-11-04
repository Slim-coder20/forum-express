/**
 * Routeur pour les pages principales de l'application
 * Gère les routes liées à l'affichage des pages (home, etc.)
 */

// Import du module Express pour créer un routeur
import express from "express";
// import de la fonction pour récupérer les discussions pour la page d'accueil //
import { getThreadsForHomePage } from "../../services/thread/queries.js";

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
router.get("/", async (req, res) => {
  // récupération des discussions pour la page d'accueil //
  const { threads } = await getThreadsForHomePage(1);

  res.render("pages/home", { threads });
});

// création de la route pour la page d'ajout de discussion //
router.get("/ajouter-une-discussion", (req, res) => {
  res.render("pages/ajouter-une-discussion");
});

// Export du routeur pour qu'il puisse être utilisé dans index.js
export default router;
