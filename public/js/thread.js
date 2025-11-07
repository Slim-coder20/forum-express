// Gestion de la page de discussion : ce fichier gère l'affichage des posts d'une discussion coté client //
// initialisation de Quill pour l'éditeur de texte //
const addPostQuill = new Quill("#add-post-editor", { theme: "snow" });

// récupération de la configuration injectée côté serveur //
const threadConfigElement = document.getElementById("thread-config");
let threadPageConfig = {};

if (threadConfigElement) {
  try {
    threadPageConfig = JSON.parse(threadConfigElement.textContent);
  } catch (error) {
    console.error("Impossible de parser la configuration du thread", error);
  }
}

const isLogged = Boolean(threadPageConfig.isLogged);
const threadSlug = threadPageConfig.threadSlug;

// recupération du formulaire d'ajout de post //
const addPostForm = document.querySelector(".js-add-post-form");

// récupération du message d'information pour l'affichage des posts //
const infoMessage = document.querySelector(".js-add-post-server-info");

// écouteur d'événement pour le formulaire d'ajout de post //
if (addPostForm) {
  addPostForm.addEventListener("submit", handleCreatePost);
}

// fonction de gestion de l'ajout de post //
async function handleCreatePost(e) {
  e.preventDefault();
  infoMessage.textContent = "";

  // vérification que l'utilisateur est connecté //
  if (!isLogged) {
    infoMessage.textContent = "Vous devez être connecté pour ajouter un post";
    return;
  }
  // vérification que le post contient au moins un caractère //
  if (!addPostQuill.getText().trim()) {
    infoMessage.textContent = "Le post doit contenir au moins un caractère";
    return;
  }

  if (!threadSlug) {
    infoMessage.textContent = "Discussion introuvable.";
    return;
  }
  try {
    const response = await fetch(`/api/threads/${threadSlug}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: addPostQuill.root.innerHTML,
      }),
    });
    // vérification que la requête a réussi // 
    if (!response.ok) throw new Error("Erreur Serveur");
    const data = await response.json();
    // récupération du nombre de pages et de l'id du post // 
    const targetPage = data?.lastPage ?? 1;
    const anchorId = data?.post?._id;
    // récupération du token de rafraîchissement // 
    const refreshToken = Date.now();
    // redirection vers la page de la discussion avec le nombre de pages et l'id du post // 
    window.location.href = `${location.pathname}?page=${targetPage}&refresh=${refreshToken}${anchorId ? `#${anchorId}` : ""}`;
  } catch (error) {
    console.error("Erreur lors de l'ajout du post:", error);
    infoMessage.textContent = "Erreur, rééssayer plus tard.";
  }
