import BaseError from "./BaseError.js";

export default class AuthenticationError extends BaseError {
  constructor(
    message = "Erreur d'authentification",
    status = 401,
    showToUser = true
  ) {
    super(message, status, showToUser);
  }
}
