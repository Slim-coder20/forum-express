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

// création du model Session //
const Session = mongoose.model("Session", sessionSchema);

export default Session;
