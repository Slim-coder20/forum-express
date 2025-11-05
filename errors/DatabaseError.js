import BaseError from "./BaseError.js";

export default class DatabaseError extends BaseError {
  /**
   * Constructeur de la classe DatabaseError
   * @param {string} message - Le message de l'erreur
   * @param {number} status - Le statut HTTP de l'erreur
   * @param {boolean} showToUser - Indique si l'erreur doit être affichée à l'utilisateur
   */
  constructor(
    message = "Erreur de base de données",
    status = 500,
    showToUser = false
  ) {
    super(message, status, showToUser);
  }
}
