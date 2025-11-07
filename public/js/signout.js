/* 
  Ce fichier gère l'envoie de la requete pour la déconnexion User
*/

// récupération de tous les liens de déconnexion //
const signoutLinks = document.querySelectorAll(".js-signout-link");

// Vérifier que les liens existent avant d'ajouter les event listeners //
if (signoutLinks.length === 0) {
  // Certaines pages ne contiennent pas de lien de déconnexion (par exemple si
  // l'utilisateur n'est pas connecté). Dans ce cas, on ne fait rien pour
  // éviter les faux positifs dans la console.
} else {
  // Ajouter un écouteur d'événement à chaque lien de déconnexion //
  signoutLinks.forEach((link) => {
    link.addEventListener("click", handleSignoutClick);
  });
}

// création de la fonction qui gère le clic sur le lien de déconnexion //
async function handleSignoutClick(e) {
  // prévention du comportement par défaut du lien //
  e.preventDefault();

  try {
    // envoie de la requete pour la déconnexion //
    const response = await fetch("/api/auth/signout", {
      method: "POST",
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
          "Erreur lors de la déconnexion, contactez le site ou rééssayer plus tard."
      );
    }

    // Redirection vers la page d'accueil après déconnexion réussie //
    window.location.href = "/";
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    // En cas d'erreur, on redirige quand même vers la page d'accueil //
    // (la session pourrait déjà être supprimée côté serveur) //
    window.location.href = "/";
  }
}
