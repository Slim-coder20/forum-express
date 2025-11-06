// import du model de l'utilisateur //
import User from "../../models/User.js";
// import du slugify pour générer les slugs //
import slugify from "slugify";
// import de bcrypt pour hacher le mot de passe //
import bcrypt from "bcrypt";
// import du model de la session //
import Session from "../../models/Session.js";
// import des erreurs //
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
    throw new AuthenticationError("Pseudo ou Email déjà utilisé", 400, true);
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

// création de la session //
export async function createSession(email, password) {
  // Normaliser l'email en minuscules pour la recherche //
  const lowercaseEmail = email.toLowerCase();
  // On vérifie si un User exist //
  const user = await User.findOne({
    email: lowercaseEmail,
  });
  // si aucun user n'est trouvé on renvoie une erreur //
  if (!user) {
    throw new AuthenticationError("Email ou mot de passe incorrect", 401, true);
  }
  // On vérifie si le mot de passe est correct //
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // Si le mot de passe est incorrect on renvoie une erreur //
  if (!isPasswordValid) {
    throw new AuthenticationError("Email ou mot de passe incorrect", 401, true);
  }

  // On vérfie si une session existe déjà pour cet utilisateur //
  const existingSession = await Session.findOne({
    userId: user._id,
    expiresAt: { $gt: new Date() },
  });
  // Si une session existe déjà on renvoie une erreur //
  let session; // On initialise la session à null //

  if (existingSession) {
    session = existingSession;
  } else {
    // création de la session //
    session = new Session({
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    });
    // enregistrement de la session //
    await session.save();
  }
  // on retourne la session id en string pour la sécurité //
  return { sessionId: session._id.toString() };
}

// création de la fonction pour la deconnexion //
export async function logout(sessionId) {
  // On supprime la session dans le base de données et on supprime le cookie de la session //
  await Session.findByIdAndDelete(sessionId);
  return { success: true };
}
