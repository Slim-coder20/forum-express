import express from "express";
import { createThread } from "../../services/thread/actions.js";

// créationn du routeur pour les threads //
const router = express.Router();

// création de toutes les routes pour les threads : create, get, update, delete //

// create  : méthode POST pour créer une discussion //
router.post("/create", async (req, res) => {
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
    return res.status(400).json({ message: "Titre et contenu sont requis" });
  }
  const result = await createThread(title, content);

  return res
    .status(201)
    .json({ message: "Discussion créée avec succès", thread: result.thread });
});

export default router;
