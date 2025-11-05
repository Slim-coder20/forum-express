/**
 * Gestion du formulaire de création de discussion
 * Ce fichier gère l'envoi du formulaire de création de discussion via une requête AJAX
 */

// initialisation de Quill pour l'éditeur de texte //
const quill = new Quill("#editor", { theme: "snow" });
// récupération du formulaire de création de discussion //
const threadForm = document.querySelector(".js-thread-form");
// récupération du champ de titre //
const titleInput = document.querySelector(".js-title-input");
const createThreadInfo = document.querySelector(".js-create-thread-info");
// écouteur d'événement pour le formulaire de création de discussion //
threadForm.addEventListener("submit", handlerCreateThread);

// fonction de gestion de la création de discussion //
async function handlerCreateThread(e) {
  e.preventDefault();
  createThreadInfo.textContent = "";
  // vérification que le post contient au moins un caractère //
  if (!quill.getText().trim()) {
    createThreadInfo.textContent =
      "Le post doit contenir au mooins un caractère.";
    return;
  }

  try {
    // Envoie de la requete pour créer la discussion //
    const response = await fetch("/api/threads/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleInput.value,
        content: quill.root.innerHTML,
      }),
    });

    if (!response.ok) {
      // Récupération du message d'erreur du serveur //
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur serveur" }));
      throw new Error(errorData.message || "Erreur serveur");
    }

    const data = await response.json();
    console.log(data);
    // affichage du message de succès //
    createThreadInfo.textContent = `${data.message} : ${data.thread.title}`;
    // repise a zero les champs du formulaire //
    titleInput.value = "";
    // remise a zero de l'éditeur de texte //
    quill.root.innerHTML = "";
  } catch (error) {
    createThreadInfo.textContent = `Erreur : ${error.message}`;
  }
}
