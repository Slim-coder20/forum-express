import express from "express";
import { createUser } from "../../services/auth/actions.js";

// Création du routeur pour le User //
const router = express.Router();

// création de toutes les routes pour le User : inscription , connexion , deconnexion //
// création newUser : méthode Post
router.post("/signup", async (req, res) => {
  try {
    console.log("User created");
    // récupération des données du corps de la requete //
    const signupData = req.body;
    console.log("received", signupData);

    // destructiring de la data reçu //
    const { pseudo, email, password, repeatedPassword } = signupData;

    // Validation des données //
    if (!signupData) {
      return res.status(400).json({ message: "Données non conformes." });
    }
    // Vérification du Pseudo //
    if (
      !pseudo ||
      typeof pseudo !== "string" ||
      pseudo.length < 3 ||
      pseudo.length > 30
    ) {
      return res.status(400).json({ message: "Pseudo non conforme" });
    }
    // Vérification de l'email //
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      typeof email !== "string" ||
      !emailRegex.test(email) ||
      email.length > 254
    ) {
      return res.status(400).json({ message: "Email non conforme" });
    }
    // Vérification du mot de passe //
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,72}$/;
    if (
      !password ||
      typeof password !== "string" ||
      !passwordRegex.test(password)
    ) {
      return res.status(400).json({ message: "Mot de passe non conforme. Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial" });
    }
    // Vérification de la confirmation du mot de passe //
    if (
      !repeatedPassword ||
      typeof repeatedPassword !== "string" ||
      password !== repeatedPassword
    ) {
      return res.status(400).json({ message: "Mot de passe répété non conforme" });
    }

    // On créer un nouveau utilisateur //
    await createUser(signupData);
    return res.status(201).json({
      success: true,
      message: "Compte créé avec succés, vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(400).json({ message: error.message || "Erreur lors de l'inscription" });
  }
});

export default router;
