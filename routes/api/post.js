import express from "express";
import Post from "../../models/Post.js";
import { requireAuthApi } from "../../middlewares/index.js";
import {
  deletePostInThread,
  updatePostInThread,
} from "../../services/post/actions.js";
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


// update : méthode PATCH pour mettre à jour un post //
router.patch("/:id/", requireAuthApi, async (req, res) => {
  try {
    // On récupère le contenu du post //
    const { content } = req.body;

    // Si le contenu est vide ou non valide //
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw new ValidationError("Contenu du post non valide", 400, true);
    }

    // On récupère le post depuis son Id //
    const post = await Post.findById(req.params.id);

    // Si on trouve pas de post //
    if (!post) throw new ValidationError("Post introuvable", 404, true);

    // Vérification si l'utilisateur est connecté //
    if (!req.userId) throw new ValidationError("Action interdite", 403, true);

    // Vérification si l'utilisateur connecté est celui qui a créé le post //
    if (post.author.toString() !== req.userId.toString()) {
      throw new ValidationError("Action interdite", 403, true);
    }

    // On met à jour le post avec le contenu //
    const updatedPost = await updatePostInThread(post, content);

    // On renvoie la réponse avec le message de succès //
    return res.json({
      success: true,
      message: "Post mis à jour avec succès",
      post: updatedPost,
    });
  } catch (error) {
    // On affiche l'erreur dans la console //
    console.error("Erreur lors de la mise à jour du post:", error);

    const statusCode = error.statusCode || 500;
    const message = error.showToUser
      ? error.message
      : "Erreur interne du serveur";
    return res.status(statusCode).json({ message });
  }
});
export default router;
