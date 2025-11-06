// Ce fichier va nous permettre de créer des middlewares pour les routes api //

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
