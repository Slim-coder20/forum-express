/**
 * Fonction de connexion à la base de données MongoDB
 * @returns {Promise<void>} - Retourne la connexion à la base de données MongoDB
 * @throws {DatabaseError} - Retourne une erreur si la connexion à la base de données MongoDB échoue
 */
import mongoose from "mongoose";
import { DatabaseError } from "../../errors/index.js";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      "Connecté à la base de données MongoDB",
      mongoose.connection.name
    );
  } catch (error) {
    console.error("Erreur de connexion à la base de données MongoDB", error);
    throw new DatabaseError(
      "La connexion à la base de donnée MongoDB a échoué: " + error.message
    );
  }
};
