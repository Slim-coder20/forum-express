import express from "express";

// créationn du routeur pour les threads //
const router = express.Router();

// création de toutes les routes pour les threads : create, get, update, delete //

// create  : méthode POST pour créer une discussion //
router.post("/create", async (req, res) => {
  console.log("create thread");
});

export default router;
