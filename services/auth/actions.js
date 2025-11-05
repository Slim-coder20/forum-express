// import du model de l'utilisateur //
import User from "../../models/User.js";
// import du slugify pour générer les slugs //
import slugify from "slugify";
// import de bcrypt pour hacher le mot de passe //
import bcrypt from "bcrypt";
import { AuthenticationError } from "../../errors/index.js";

// création de l'utilisateur //
export async function createUser(signUpData) {
  const { pseudo, email, password } = signUpData;

  const lowercaseEmail = email.toLowerCase();

  // Vérifier si le User exsite déjà dans la base de donnée /
  const existingUser = await User.findOne({
    $or: [{ userName: pseudo }, { email: lowercaseEmail }],
  });
  // Si existing User est true //
  if (existingUser) {
    throw new AuthenticationError("Pseudo ou Email déjà utilisé");
  }
  // création du slug pour le User//
  const normalizedUserName = slugify(pseudo, { lower: true, strict: true });

  // hashaage du mot de passe //
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // création du nouvel utilisateur //
  const newUser = new User({
    userName: pseudo,
    normalizedUserName,
    email: lowercaseEmail,
    password: hashedPassword,
  });
  // enregistrer le document //
  await newUser.save();
}
