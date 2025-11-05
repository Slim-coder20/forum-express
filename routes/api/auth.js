import express from "express";
import { createUser } from "../../services/auth/actions.js";
import { ValidationError } from "../../errors/index.js";

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
      throw new ValidationError("Données non conformes.");
    }
    // Vérification du Pseudo //
    if (
      !pseudo ||
      typeof pseudo !== "string" ||
      pseudo.length < 3 ||
      pseudo.length > 30
    ) {
      throw new ValidationError("Pseudo non conforme");
    }
    // Vérification de l'email //
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      typeof email !== "string" ||
      !emailRegex.test(email) ||
      email.length > 254
    ) {
      throw new ValidationError("Email non conforme");
    }
    // Vérification du mot de passe //
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,72}$/;
    if (
      !password ||
      typeof password !== "string" ||
      !passwordRegex.test(password)
    ) {
      throw new ValidationError("Mot de passe non conforme. Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial");
    }
    // Vérification de la confirmation du mot de passe //
    if (
      !repeatedPassword ||
      typeof repeatedPassword !== "string" ||
      password !== repeatedPassword
    ) {
      throw new ValidationError("Mot de passe répété non conforme");
    }

    // On créer un nouveau utilisateur //
    await createUser(signupData);
    return res.status(201).json({
      success: true,
      message: "Compte créé avec succés, vous pouvez maintenant vous connecter.",
      
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    const statusCode = error.statusCode || 500;
    const message = error.showToUser ? error.message : "Erreur lors de l'inscription";
    return res.status(statusCode).json({ message });
  }
});

export default router;
