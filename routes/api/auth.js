import express from "express";
import { createUser } from "../../services/auth/actions.js";
import { ValidationError } from "../../errors/index.js";
import { createSession } from "../../services/auth/actions.js";
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
      throw new ValidationError("Données non conformes.", 400, true);
    }
    // Vérification du Pseudo //
    if (
      !pseudo ||
      typeof pseudo !== "string" ||
      pseudo.length < 3 ||
      pseudo.length > 30
    ) {
      throw new ValidationError("Pseudo non conforme", 400, true);
    }
    // Vérification de l'email //
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      typeof email !== "string" ||
      !emailRegex.test(email) ||
      email.length > 254
    ) {
      throw new ValidationError("Email non conforme", 400, true);
    }
    // Vérification du mot de passe //
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,72}$/;
    if (
      !password ||
      typeof password !== "string" ||
      !passwordRegex.test(password)
    ) {
      throw new ValidationError(
        "Mot de passe non conforme. Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial"
      );
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
      message:
        "Compte créé avec succés, vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    const statusCode = error.statusCode || 500;
    const message = error.showToUser
      ? error.message
      : "Erreur lors de l'inscription";
    return res.status(statusCode).json({ message });
  }
});

// création de la route pour la connexion : méthode Post
router.post("/signin", async (req, res) => {
  try {
    console.log("User connected");
    console.log("Body reçu:", req.body);
    // récupération des données du corps de la requete //
    const signinData = req.body;

    // Vérification des données //
    if (!signinData) {
      throw new ValidationError("Erreur lors de la connexion ", 400);
    }

    // destructring des données //
    const { email, password } = signinData;

    // Vérification de l'email //
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      typeof email !== "string" ||
      !emailRegex.test(email) ||
      email.length > 254
    ) {
      throw new ValidationError("Email non conforme", 400, true);
    }

    // Vérification du mot de passe //
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,72}$/;
    if (
      !password ||
      typeof password !== "string" ||
      !passwordRegex.test(password)
    ) {
      throw new ValidationError("Mot de passe non conforme", 400, true);
    }

    // On crée une session pour l'utilisateur //
    const session = await createSession(email, password);
    // On crée un cookie pour la session qui va nous servir a identifier l'utilisateur et nous permettre de faire des requetes authentifiés//
    res.cookie("sessionId", session.sessionId, {
      // le cookie est httpOnly, c'est a dire qu'il ne peut etre accédé que par le serveur //
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      sameSite: "lax",
    });
    // Désactiver le cache pour éviter les réponses 304 //
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    const statusCode = error.statusCode || 500;
    const message = error.showToUser
      ? error.message
      : "Erreur lors de la connexion";
    return res.status(statusCode).json({ message });
  }
});

export default router;
