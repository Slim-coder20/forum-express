// import du model de la discussion //
import Thread from "../../models/Thread.js";
// import du model du post //
import Post from "../../models/Post.js";
// requete pour récuperer les discussion dans la page d'accueil //
export async function getThreadsForHomePage(currentPage) {
  // calcul du nombre de documents à sauter //
  const threads = await Thread.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("author", "userName");
  return { threads };
}

// requete pour récuperer les discussion d'un utilisateur //
export async function getThreadsPost(currentPage, threadId, userId) {

  
  const limit = 10;
  // Om met en place un pagination pour les posts //
  // Cette opération permet de sauter le nombres de posts pour la page courante // (10 posts par page) //
  const skip = (currentPage -1 ) * limit 
  
  const posts = await Post.find({ thread: threadId })
    .sort({ postNumber: 1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "userName")
    .lean();

  // On récupère le nombre total de posts pour la discussion //
  const totalPosts = await Post.countDocuments({ thread: threadId });
  
  // On calcule le nombre de pages total //
  const totalPages = Math.ceil(totalPosts / limit);
  
  // On map les posts pour ajouter des informations supplémentaires //
  const decoratedPost = posts.map((post) => ({
    ...post,
    isOwner: userId && post.author._id.toString() === userId.toString(), // vérification si l'auteur du post est l'utilisateur connecté //
  }));

// Algo pagination pour savoir si il y a plus de dix posts à charger //
  

  // On retourne les posts décorés et un booléen pour savoir si il y a plus de posts à charger //
  return {
    posts: decoratedPost,
    hasMorePosts: posts.length === limit,
  };
}
