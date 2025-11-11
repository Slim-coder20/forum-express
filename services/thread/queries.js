// import du model de la discussion //
import Thread from "../../models/Thread.js";
// import du model du post //
import Post from "../../models/Post.js";

// requete pour récuperer les discussion dans la page d'accueil //
export async function getThreadsForHomePage(currentPage = 1) {
  // On définit le nombre de documents à récupérer par page //
  const limit = 10;
  const totalThreads = await Thread.countDocuments();
  const totalPages = Math.max(1, Math.ceil(totalThreads / limit));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const skip = (safePage - 1) * limit;

  const threads = await Thread.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "userName");

  const hasPrev = safePage > 1;
  const hasNext = safePage < totalPages;

  return {
    threads,
    totalPages,
    totalThreads,
    hasPrev,
    hasNext,
    currentPage: safePage,
  };
}

// requete pour récuperer les discussion d'un utilisateur //
export async function getThreadsPost(currentPage, threadId, userId) {
  const limit = 10;
  // Om met en place un pagination pour les posts //
  // Cette opération permet de sauter le nombres de posts pour la page courante // (10 posts par page) //
  const skip = (currentPage - 1) * limit;

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

  let pagesToShow = [];

  // 1ere condition nombre inférieur ou égale a 7 on les affiche toutes//
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else if (currentPage <= 6) {
    // 2ème condition totalPages est supérieur à 7 et on se trouve dans les 6 premiers pages //
    for (let i = 1; i <= 7; i++) {
      pagesToShow.push(i);
    }
    pagesToShow.push("...", totalPages);
  } else if (currentPage >= totalPages - 5) {
    // 3 ème condition : totalPage > 7, on se retrouve au 6 dernières pages //
    pagesToShow.push(1, "...");
    for (let i = totalPages - 6; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else {
    // 4ème condtion  : au milieu, entre + 7 depuis le début et -7 depuis la fin on affiche 1 "..." 7 pages ".." totalPages //
    const start = currentPage - 3;
    pagesToShow.push(1, "...");
    for (let i = start; i <= start + 6; i++) {
      pagesToShow.push(i);
    }
    pagesToShow.push("...", totalPages);
  }

  // On retourne les posts décorés et un booléen pour savoir si il y a plus de posts à charger //
  return {
    posts: decoratedPost,
    hasMorePosts: posts.length === limit,
    totalPages,
    pagesToShow,
  };
}
