import mongoose from "mongoose";

// création du schema du post // 
const postSchema = new mongoose.Schema ({
  // Ajout de l'auteur du post //
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thread: {
    // reference au thread //
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  HTMLPost: {
    type: String,
    minlength: 1

  },
  postNumber: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

/* Indexation des champs pour optimiser les requetes */ 
postSchema.index({ thread: 1, postNumber: 1},{ unique: true });

// création du model du post // 
const Post = mongoose.model("Post", postSchema);

export default Post;
