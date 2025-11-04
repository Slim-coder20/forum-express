/**
 * Fonction de connexion à la base de données MongoDB
 * @returns {Promise<void>} - Retourne la connexion à la base de données MongoDB
 * @throws {Error} - Retourne une erreur si la connexion à la base de données MongoDB échoue
 */
import mongoose from "mongoose";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      "Connecté à la base de données MongoDB",
      mongoose.connection.name
    );
  } catch (error) {
    console.error("Erreur de connexion à la base de données MongoDB", error);
    throw new Error(
      "La connexion à la base de donnée MongoDB a échoué" + error.message
    );
  }
};
