import mongoose from "mongoose";

// création du schema du post // 
const postSchema = new mongoose.Schema ({
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

// création du model du post // 
const Post = mongoose.model("Post", postSchema);

export default Post;
