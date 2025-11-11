// Ce fichier continet les requetes pour les informations des utilisateurs  depuis la page profile //

// import des models //
import User from "../../models/User.js";
// import du model du post //
import Post from "../../models/Post.js";
// import du model de la discussion //
import Thread from "../../models/Thread.js";

// Requete pour récupérer les utilisateurs //
export async function getUserProfileInfo(normalizedUserName) {
  // On récupère les informations de l'utilisateur //
  const user = await User.findOne({ normalizedUserName })
    .select("userName normalizedUserName createdAt")
    .lean();

  if (!user) {
    return null;
  }

  const [threadsFromUser, totalPosts, lastActivity] = await Promise.all([
    Thread.find({ author: user._id })
      .sort({ updatedAt: -1 })
      .select("title slug postCount updatedAt createdAt")
      .lean(),
    Post.countDocuments({ author: user._id }),
    Post.findOne({ author: user._id })
      .sort({ createdAt: -1 })
      .select("createdAt")
      .lean(),
  ]);

  const totalThreads = threadsFromUser.length;

  return {
    user,
    stats: {
      totalThreads,
      totalPosts,
      lastActivityAt: lastActivity?.createdAt ?? user.createdAt,
    },
    threads: threadsFromUser,
  };
}
