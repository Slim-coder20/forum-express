// Ce fichier va nous permettre de créer des middlewares pour les routes api //
import { AuthenticationError } from "../errors/index.js";
export function requireAuthApi(req, res, next) {
  if (!req.isLoggedIn) {
    console.log("User not logged in");
    throw new AuthenticationError(
      "Vous devez être connecté pour accéder à cette ressource",
      401,
      true
    );
  }
  next();
}
// création d'un middleware pour rendre la page création de discussion uniquement accessible si l'utilisateur est connecté//
export function requireAuthPage(req, res, next) {
  if (!req.isLoggedIn) {
    res.redirect("/connexion");
    return;
  }
  next();
}
