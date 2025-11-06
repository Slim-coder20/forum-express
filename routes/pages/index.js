/**
 * Routeur pour les pages principales de l'application
 * Gère les routes liées à l'affichage des pages (home, etc.)
 */

// Import du module Express pour créer un routeur
import express from "express";
// import de la fonction pour récupérer les discussions pour la page d'accueil //
import { getThreadsForHomePage } from "../../services/thread/queries.js";
// import de la fonction de déconnexion //
import { logout } from "../../services/auth/actions.js";
// import du middleware pour rendre la page création de discussion uniquement accessible si l'utilisateur est connecté// 
import { requireAuthPage } from "../../middlewares/index.js";

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
router.get("/ajouter-une-discussion", requireAuthPage, (req, res) => {
  res.render("pages/ajouter-une-discussion");
});

// créattion de la route pour la page d'inscription //
router.get("/inscription", (req, res) => {
  res.render("pages/inscription");
});

// création de la route pour la page de connexion //
router.get("/connexion", (req, res) => {
  res.render("pages/connexion");
});

// création de la route pour la déconnexion //
router.get("/deconnexion", async (req, res) => {
  try {
    // Récupération du sessionId depuis les cookies //
    const sessionId = req.cookies.sessionId;

    // Si une session existe, on la supprime //
    if (sessionId) {
      await logout(sessionId);
    }

    // Suppression du cookie côté client //
    res.clearCookie("sessionId", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // Redirection vers la page d'accueil après déconnexion //
    res.redirect("/");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    // En cas d'erreur, on redirige quand même vers la page d'accueil //
    res.redirect("/");
  }
});

// Export du routeur pour qu'il puisse être utilisé dans index.js
export default router;
