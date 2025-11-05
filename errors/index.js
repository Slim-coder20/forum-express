// Export de toutes les classes d'erreurs pour faciliter les imports
// Utilisation : import { BaseError, ValidationError, NotFoundError } from './errors/index.js'

export { default as BaseError } from "./BaseError.js";
export { default as AuthenticationError } from "./AuthenticationError.js";
export { default as ValidationError } from "./ValidationError.js";
export { default as DatabaseError } from "./DatabaseError.js";
export { default as NotFoundError } from "./NotFoundError.js";
