// import de la classe BaseError //
import BaseError from "./BaseError.js";

export default class NotFoundError extends BaseError {
  /**
   * Constructeur de la classe NotFoundError
   * @param {string} message - Le message de l'erreur
   * @param {number} status - Le statut HTTP de l'erreur
   * @param {boolean} showToUser - Indique si l'erreur doit être affichée à l'utilisateur
   */
  constructor(message = "Page non trouvée", status = 404, showToUser = true) {
    super(message, status, showToUser);
    
  }
}
