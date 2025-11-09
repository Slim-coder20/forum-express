// Ce fichier contient les actions liées aux poste c'est a dire la création d'un post,
// la modification d'un post, la suppression d'un post
// et la récupération des posts d'une discussion.
import Thread from "../../models/Thread.js";
import Post from "../../models/Post.js";
import { ValidationError } from "../../errors/index.js";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export async function addNewPostInThread(slug, postContent, userId) {
  // On récupère le thread et on incrémente le nombre de posts et le nombre de post suivant //
  const thread = await Thread.findOneAndUpdate(
    { slug },
    {
      $inc: { postCount: 1, nextPostNumber: 1 },
      $set: { lastPostAt: new Date() },
    },
    { new: true }
  );
  // On vérifie si y'a pas de thread //
  if (!thread) throw new ValidationError("Thread introuvable", 404);

  // Une méthode pour se sécurisé contre les attaques XSS //
  const HTMLPost = DOMPurify.sanitize(postContent);
  const assignedPostNumber = thread.nextPostNumber;
  // On crée le nouveau post //
  const newPost = await Post.create({
    author: userId,
    thread: thread._id,
    HTMLPost,
    postNumber: assignedPostNumber,
  });

  // On calcule le nombre de pages //
  const lastPage = Math.ceil(thread.postCount / 10);
  // On retourne le nouveau post et le nombre de pages //
  return { newPost, lastPage };
}

// fonction pour supprimer un post //
export async function deletePostInThread(post) {
  // On supprime le post //
  await Post.findByIdAndDelete(post._id);
  // On décrémente le nombre de posts dans le thread //
  await Thread.findByIdAndUpdate(post.thread, {
    $inc: { postCount: -1 },
  });
  // On récupère le thread //
  return { message: "Post supprimé avec succès" };
}
