export default class BaseError extends Error {
  /**
   * Constructeur de la classe BaseError
   * @param {string} message - Le message de l'erreur
   * @param {number} status - Le statut HTTP de l'erreur
   * @param {boolean} showToUser - Indique si l'erreur doit être affichée à l'utilisateur
   */
  constructor(
    message = "Une erreur est survenue",
    status = 500,
    showToUser = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = status;
    this.showToUser = showToUser;
    Error.captureStackTrace(this, this.constructor);
  }
}
