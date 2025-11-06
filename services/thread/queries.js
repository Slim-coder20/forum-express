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
  const posts = await Post.find({ thread: threadId })
    .sort({ postNumber: 1 })
    .limit(limit)
    .populate("author", "userName")
    .lean();

  const decoratedPost = posts.map((post) => ({
    ...post,
    isOwner: userId && post.author._id.toString() === userId.toString(), // vérification si l'auteur du post est l'utilisateur connecté //
  }));
  return {
    posts: decoratedPost,
    hasMorePosts: posts.length === limit,
  }; 
}
