// Ce fichier contient les requêtes pour la gestion de la session //
// import du model de l'utilisateur //
import User from "../../models/User.js";
// import du model de la session //
import Session from "../../models/Session.js";

// récupération des informations de la session dans la base de données //
export async function getSessionInfo(sessionId) {
  const session = await Session.findById(sessionId);
  // si la session n'existe pas ou est expirée on renvoie false et null //
  if (!session || session.expiresAt < new Date()) {
    return { isLoggedIn: false };
  }
  // récupération de l'utilisateur associé à la session //
  const user = await User.findById(session.userId);
  // si l'utilisateur n'existe pas on renvoie false et null //
  if (!user) {
    return { isLoggedIn: false };
  }
  // si l'utilisateur existe on renvoie true et les informations de l'utilisateur //
  return { isLoggedIn: true, userId: user._id, userName: user.userName };
}
