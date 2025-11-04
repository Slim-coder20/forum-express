// import du model de la discussion //
import Thread from "../../models/Thread.js";
// import du model Post //
import Post from "../../models/Post.js";
// import du slugify pour générer les slugs //
import slugify from "slugify";
// import JSDOM pour parser le contenu HTML //
import { JSDOM } from "jsdom";
// import de dompurify pour sanitiser le contenu HTML //
import createDOMPurify from "dompurify";

// création de la fenêtre de l'objet JSDOM //
const window = new JSDOM("").window;
// création de l'objet DOMPurify avec la fenêtre JSDOM //
const DOMPurify = createDOMPurify(window);

// création de la discussion //
export async function createThread(threadTitle, firstPostContent) {
  // générer le slug //
  const baseSlug = slugify(threadTitle, { lower: true, strict: true });
  // générer le slug unique //
  let slug = baseSlug;
  // initialisation du compteur //
  let counter = 1;
  // boucle pour générer le slug unique //
  while (await Thread.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const newThread = new Thread({
    title: threadTitle,
    slug,
  });

  await newThread.save();

  const HTMLPost = DOMPurify.sanitize(firstPostContent);

  // création du premier post //
  const newPost = new Post({
    thread: newThread._id,
    HTMLPost,
    postNumber: 1,
  });

  await newPost.save();
  return { thread: newThread, post: newPost };
}
