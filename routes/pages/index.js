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
// import du model de la discussion //
import Thread from "../../models/Thread.js";
// import de la fonction pour récupérer les posts d'une discussion //
import { getThreadsPost } from "../../services/thread/queries.js";

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
  const page = parseInt(req.query.page, 10) || 1;

  // récupération des discussions pour la page d'accueil //
  const {
    threads,
    totalPages,
    hasPrev,
    hasNext,
    currentPage: safePage,
  } = await getThreadsForHomePage(page);

  res.render("pages/home", {
    threads,
    totalPages,
    hasPrev,
    hasNext,
    currentPage: safePage,
  });
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

// création de la route pour la page de l'affichage d'une discussion //
router.get("/discussion/:slug", async (req, res) => {
  const { slug } = req.params;

  const thread = await Thread.findOne({ slug });
  if (!thread) {
    return res.status(404).render("pages/not-found");
  }

  const page = parseInt(req.query.page, 10) || 1;
  const { posts, totalPages, pagesToShow } = await getThreadsPost(
    page,
    thread._id,
    req.userId
  );
  res.render("pages/thread", {
    thread,
    posts,
    pagesToShow,
    totalPages,
    page,
  });
});

// création de la route pour la page 404 //
router.get("/404", (req, res) => {
  res.status(404).render("pages/not-found");
});

//
// Export du routeur pour qu'il puisse être utilisé dans index.js
export default router;
