// import du model de la discussion //
import Thread from "../../models/Thread.js";

// requete pour récuperer les discussion dans la page d'accueil //
export async function getThreadsForHomePage(currentPage) {
  // calcul du nombre de documents à sauter //
  const threads = await Thread.find().sort({ createdAt: -1 }).limit(10);

  return {threads};
}
