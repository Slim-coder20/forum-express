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
    window.location.href = `${
      location.pathname
    }?page=${targetPage}&refresh=${refreshToken}${
      anchorId ? `#${anchorId}` : ""
    }`;
  } catch (error) {
    console.error("Erreur lors de l'ajout du post:", error);
    infoMessage.textContent = "Erreur, rééssayer plus tard.";
  }
}

// Gestion de la suppression de post coté client //
const deletePostBtns = document.querySelectorAll(".js-delete-btn");

// écouteur d'évenement pour la suppression de post //
deletePostBtns.forEach((btn) =>
  btn.addEventListener("click", handleDeleteBtnClick)
);

// fonction de gestion de la suppression de post //
async function handleDeleteBtnClick(e) {
  e.preventDefault();
  // récupération de l'id du post //
  const postId = e.currentTarget.dataset.id;

  try {
    const response = await fetch(`/api/post/${postId}`, {
      method: "DELETE",
    });
    console.log(response);
    if (response.ok) {
      document.getElementById(postId).remove();
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    infoMessage.textContent = "Erreur, rééssayer plus tard.";
  }
}

// Afficher l'éditeur de modification de post //
// création de la map quillEditors pour stocker les éditeurs Quill //
const quillEditors = new Map();
// récupération des boutons open-edit-btn //

const openEditBoxBtns = document.querySelectorAll(".js-open-edit-btn");
// écouteur d'événement pour le bouton open-edit-btn //
openEditBoxBtns.forEach((btn) => btn.addEventListener("click", openEditBox));

// On créé la fonction openEditBox //
function openEditBox(e) {
  // récupération de l'id du post //
  const postId = e.currentTarget.dataset.id;
  // récupération de l'élément li du post //
  const liPost = document.getElementById(postId);
  // récupération de l'élément edit-post-box du post //
  const editContent = liPost.querySelector(".js-edit-post-box");
  // récupération de l'élément post-content du post //
  const postContent = liPost.querySelector(".js-post-content");
  // ajout de la classe hidden à l'élément post-content //

  postContent.classList.add("hidden");
  // suppression de la classe hidden à l'élément edit-post-box //
  editContent.classList.remove("hidden");

  // On créer l"éditeur Quill //
  // vérification que l'éditeur Quill n'existe pas déjà //
  if (!quillEditors.has(postId)) {
    // vérification que l'élément ql-container n'existe pas déjà //
    if (!editContent.querySelector(".ql-container")) {
      // création de l'élément ql-container //
      // création de l'élément ql-container //
      const editorEl = document.createElement("div");
      // ajout des classes ql-container et !mb-5 à l'élément ql-container //
      editorEl.classList.add("ql-container", "!mb-5");
      // ajout de l'élément ql-container à l'élément edit-post-box //
      editContent.prepend(editorEl);
      // création de l'éditeur Quill //
      const quillEditor = new Quill(editorEl, { theme: "snow" });
      // copie du contenu du post dans l'éditeur Quill //
      quillEditor.clipboard.dangerouslyPasteHTML(postContent.innerHTML);
      // ajout de l'éditeur Quill à la map quillEditors //
      quillEditors.set(postId, quillEditor);
    }
  }
}
// Fermer l'éditeur de post  */
const closeEditBoxBtns = document.querySelectorAll(".js-hide-edit-post-box");
closeEditBoxBtns.forEach((btn) => btn.addEventListener("click", closeEditBox));

/*création de la fonction de fermeture de l'éditeur de post  */
// récupération de l'id du post //
function closeEditBox(e) {
  // récupération de l'élément li du post //
  const liPost = document.getElementById(
    e.currentTarget.getAttribute("data-id")
  );
  // ajout de la classe hidden à l'élément edit-post-box //
  liPost.querySelector(".js-edit-post-box").classList.add("hidden");
  // suppression de la classe hidden à l'élément post-content //
  liPost.querySelector(".js-post-content").classList.remove("hidden");
}

// Gestion de l'envoie de la modification de post //
// récupération des boutons save-edit-btn //
const saveEditBoxBtns = document.querySelectorAll(".js-save-edit-btn");
// écouteur d'événement pour le bouton save-edit-btn //
saveEditBoxBtns.forEach((btn) =>
  btn.addEventListener("click", savePostChanges)
);
// Fonction de gestion de l'envoie de la modification de post //
async function savePostChanges(e) {
  // prévention du comportement par défaut du formulaire //
  e.preventDefault();
  // récupération de l'id du post //
  const postId = e.currentTarget.getAttribute("data-id");
  // récupération de l'élément li du post //
  const liPost = document.getElementById(postId);
  // vérification que l'élément li du post existe //
  if (!liPost) {
    console.error("Post introuvable pour la sauvegarde:", postId);
    return;
  }

  // récupération de l'élément update-server-info du post //
  const updateServerInfo = liPost.querySelector(".js-upadte-server-info");
  // récupération de l'éditeur Quill //
  const editor = quillEditors.get(postId);
// vérification que l'éditeur Quill existe //
  if (!editor) return;

  // récupération du contenu du post //
  const newContent = editor.root.innerHTML;
  // vérification que le contenu du post est valide //
  if (!newContent.trim()) {
    if (updateServerInfo) {
      updateServerInfo.textContent =
        "🔴 Impossible de modifier le post : contenu non valide.";
    }
    return;
  }

  try {
    // envoi de la requête pour la modification du post //
    const response = await fetch(`/api/post/${postId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newContent }),
    });

    // vérification que la requête a réussi //
    if (!response.ok) {
      // récupération du message d'erreur du serveur //
      throw new Error("Erreur serveur");
    }

    const resultData = await response.json();
    console.log(resultData);
    // récupération du contenu du post mis à jour //
    const updatedHtml = resultData?.post?.HTMLPost ?? newContent;

    // mise à jour du contenu du post dans l'élément post-content //
    liPost.querySelector(".js-post-content").innerHTML = updatedHtml;
    // ajout de la classe hidden à l'élément edit-post-box //
    liPost.querySelector(".js-edit-post-box").classList.add("hidden");
    // suppression de la classe hidden à l'élément post-content //
    liPost.querySelector(".js-post-content").classList.remove("hidden");

    // mise à jour du message d'information //
    if (updateServerInfo) {
      updateServerInfo.textContent = "✅ Post modifié avec succès.";
    }
  } catch (error) {
    console.error("Erreur lors de la modification du post:", error);
    // mise à jour du message d'information //
    if (updateServerInfo) {
      updateServerInfo.textContent =
        "🔴 Impossible de modifier le post. Réessayez plus tard.";
    }
  }
}
