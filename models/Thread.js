import mongoose from "mongoose";

// création du schéma de la discussion  //
const threadSchema = new mongoose.Schema(
  {
    // Ajout de l'auteur de la discussion //
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // titre de la discussion //
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Le titre doit contenir au moins 3 caractères"],
      maxlength: [100, "Le titre doit contenir au plus 100 caractères"],
    },
    // slug est un champ calculé automatiquementil sert a générer une url unique pour la discussion//
    slug: {
      type: String,
      unique: true,
    },
    // compteur de post //
    postCount: {
      type: Number,
      default: 1,
    },
    // date de la dernière publication //
    lastPostAt: {
      type: Date,
      default: Date.now,
    },
  },
  // timestamps: true pour ajouter automatiquement les champs createdAt et updatedAt //
  { timestamps: true }
);

/* Indexation des champs pour optimiser les requetes */
threadSchema.index({ author: 1 });
// Note: slug a déjà un index unique défini via unique: true dans le schéma

// création du modèle de la discussion //
const Thread = mongoose.model("Thread", threadSchema);

export default Thread;
