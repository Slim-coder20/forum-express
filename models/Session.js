import mongoose from "mongoose";

// Création du schema de la session //
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

/* Indexation des champs pour optimiser les requetes */
sessionSchema.index({userId:1})
// indexation pour la date d'expiration de la session //
sessionSchema.index({expiresAt:1},{expireAfterSeconds:0})

// création du model Session //
const Session = mongoose.model("Session", sessionSchema);


export default Session;
