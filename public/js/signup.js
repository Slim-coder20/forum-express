/* 
  Ce fichier gère l'envoie de la requete pour l'inscription User
*/

// récupération des éléments du DOM //
const signupForm = document.querySelector(".js-signup-form");
const serverInfo = document.querySelector(".js-server-info");

// écouteur d'événement pour le formulaire d'inscription //
signupForm.addEventListener("submit", handleSignupSubmit);

// création de la fonction qui gère la soumission du formulaire d'inscription //
async function handleSignupSubmit(e) {
  // prévention du comportement par défaut du formulaire //
  e.preventDefault();
  // récupération des données du formulaire //
  const formData = new FormData(e.currentTarget);
  serverInfo.textContent = "";

  // Vérification de la correspondance des mots de passe //
  if (formData.get("password") !== formData.get("repeatedPassword")) {
    serverInfo.textContent =
      "Le mot de passe et la confirmation du mot de passe ne sont pas identiques";
    return;
  }

  try {
    // Envoie de la requete pour créer l'utilisateur //
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pseudo: formData.get("pseudo"),
        email: formData.get("email"),
        password: formData.get("password"),
        repeatedPassword: formData.get("repeatedPassword"),
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
    serverInfo.textContent = data.message;
    // remise à zéro des champs du formulaire //
    signupForm.reset();
  } catch (error) {
    serverInfo.textContent = `Erreur : ${error.message}`;
  }
}
