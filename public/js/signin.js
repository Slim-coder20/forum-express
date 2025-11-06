/* 
  Ce fichier gère l'envoie de la requete pour la connexion User
*/

// récuprération des éléments du formulaires de connexion //
const signinForm = document.querySelector(".js-signin-form");
const serverInfo = document.querySelector(".js-server-info");

// Vérifier que le formulaire existe avant d'ajouter l'event listener //
if (signinForm) {
  // écouter l'évenement de soumission du formulaire de connexion //
  signinForm.addEventListener("submit", handleSigninSubmit);
} else {
  console.error("Formulaire de connexion non trouvé (.js-signin-form)");
}

// création de la fonction qui gère la sousmission du formulaire de connexion //
async function handleSigninSubmit(e) {
  // prévention du comportement par défaut du formulaire //
  e.preventDefault();
  // récupération des données du formulaire //
  serverInfo.textContent = "";
  const formData = new FormData(e.currentTarget);

  // envoie de la requete pour la connexion //

  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      // conversion des données du formulaire en JSON //
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: {
        "Content-Type": "application/json",
      },
      // Désactiver le cache pour éviter les réponses 304 //
      cache: "no-store",
    });
    console.log("Response", response);
    console.log("Status", response.status);

    // Vérifier si la réponse a un corps avant d'essayer de parser JSON //
    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      // Si ce n'est pas du JSON, lire comme texte pour le debug //
      const text = await response.text();
      console.error("Réponse non-JSON reçue:", text);
      throw new Error("Réponse invalide du serveur");
    }

    console.log("ResponseData", responseData);
    // vérification que la requete a été effectuée avec succès //
    if (!response.ok) {
      // Récupération du message d'erreur du serveur //
      throw new Error(
        responseData.message ||
          "Erreur, contactez le site ou rééssayer plus tard."
      );
    }
    redirectAfterSignin();
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    serverInfo.textContent = `Erreur : ${error.message}`;
  }
}
// création d'une fonction pour redireger vers la page d'acceuil //
function redirectAfterSignin() {
  let timer = 3;
  serverInfo.textContent = `Connexion réussie ! Redirection vers l'accueil dans ${timer}s`;
  // On met un setInterval //
  const intervalId = setInterval(() => {
    if (timer === 1) {
      clearInterval(intervalId);
      window.location.href = "/";
    } else {
      timer--;
      serverInfo.textContent = `Connexion réussie ! Redirection vers l'accueil dans ${timer}s.`;
    }
  }, 1000);
}
