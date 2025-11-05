// import de la classe BaseError //
import BaseError from "./BaseError.js";

export default class ValidationError extends BaseError {
  /**
   * Constructeur de la classe ValidationError
   * @param {string} message - Le message de l'erreur
   * @param {number} status - Le statut HTTP de l'erreur
   * @param {boolean} showToUser - Indique si l'erreur doit être affichée à l'utilisateur
   * @param {object} errors - Les erreurs de validation
   */
  constructor(
    message = "Données invalidées",
    status = 400,
    showToUser = true,
    errors = null
  ) {
    super(message, status, showToUser);
    this.errors = errors;
  }
}
