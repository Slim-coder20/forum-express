import express from "express";
import Post from "../../models/Post.js";
import { requireAuthApi } from "../../middlewares/index.js";
import { deletePostInThread } from "../../services/post/actions.js";
import { ValidationError } from "../../errors/index.js";

// création du routeur pour les posts //
const router = express.Router();

// création de toutes les routes pour les posts : create, get, update, delete //
// delete : méthode POST pour supprimer un post //
router.delete("/:id/", requireAuthApi, async (req, res) => {
  try {
    // On récupère le post depuis son Id //
    const post = await Post.findById(req.params.id);
    // Si on trouve pas de post //
    if (!post) throw new ValidationError("Post introuvable", 404);

    // Vérification si l'utilisateur est connecté //
    if(!req.userId) throw new ValidationError("Action interdite ", 403);

    // Vérification si l'utilisateur connecté est celui qui a créer le post //
    if (post.author.toString() !== req.userId.toString()) {
      throw new ValidationError("Action interdite ", 403);
    }
    // Suppression du post après vérification //
    await deletePostInThread(post);
    return res.json({ message: "Post supprimé " });
  } catch (error) {
    // On affiche l'erreur dans la console //
    console.error("Erreur lors de la suppression du post:", error);
    // On récupère le statut de l'erreur et le message //
    const statusCode = error.statusCode || 500;
    const message = error.showToUser
      ? error.message
      : "Erreur interne du serveur";
    // On renvoie la réponse avec le statut et le message //
    return res.status(statusCode).json({ message });
  }
});

export default router;
