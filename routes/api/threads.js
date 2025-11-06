import express from "express";
import { createThread } from "../../services/thread/actions.js";
import { ValidationError } from "../../errors/index.js";
import { requireAuthApi } from "../../middlewares/index.js";

// créationn du routeur pour les threads //
const router = express.Router();

// création de toutes les routes pour les threads : create, get, update, delete //

// create  : méthode POST pour créer une discussion //
router.post("/create", requireAuthApi, async (req, res) => {
  try {
    console.log("create thread");
    // récupération des données du corps de la requete //
    const { title, content } = req.body;
    // vérification que le titre et le contenu sont présents et non vides //
    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      title.trim() === "" ||
      title.length < 3 ||
      title.length > 100 ||
      content.trim() === "" ||
      content.length < 1
    ) {
      throw new ValidationError("Titre et contenu sont requis", 400, true);
    }
    const result = await createThread(title, content, req.userId);

    return res
      .status(201)
      .json({ message: "Discussion créée avec succès", thread: result.thread });
  } catch (error) {
    console.error("Erreur lors de la création de la discussion:", error);
    const statusCode = error.statusCode || 500;
    const message = error.showToUser
      ? error.message
      : "Erreur lors de la création de la discussion";
    return res.status(statusCode).json({ message });
  }
});

export default router;
