import mongoose from "mongoose"; 

//création du schema du User // 
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true, 
    unique: true,
    minlength: [3, "Le pseudo doit contenir au moins trois caractères"], 
    maxlength: [30, "Le pseudo doit contenir au plus de trente caractères"]
    trim: true,

  },
  // normalizedUserName est un champ calculé automatiquement il sert a générer une url unique pour le user //
  normalizedUserName: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Le pseudo doit contenir au moins trois caractères"], 
    maxlength: [30, "Le pseudo doit contenir au plus de trente caractères"]
  },
  eamil: {
    type: String,
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "L'email doit être une adresse email valide"],
    maxlength: [254, "L'email doit contenir au plus de deux cent cinquante-quatre caractères"]
  }, 
  password: {
    type: String,
    required: true,
    minlength: [6, "Le mot de passe doit contenir au moins huit caractères"],
    maxlength: [72, "Le mot de passe doit contenir au plus de soixante-douze caractères"]
    pattern: /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,72}$/,
  },
  
},{ timestamps: true });

// création du model du user //
const User = mongoose.model("User", userSchema);

export default User;