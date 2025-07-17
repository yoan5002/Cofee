// routes/commandeRoutes.js
const express = require("express");
const router = express.Router();
const Commande = require("../models/Commande");

router.post("/", async (req, res) => {
  try {
    const { clientEmail, produits, total } = req.body;
    const nouvelleCommande = new Commande({
      clientEmail,
      produits,
      total,
      date: new Date()
    });

    await nouvelleCommande.save();
    res.status(201).json({ success: true, commande: nouvelleCommande });
  } catch (err) {
    console.error(" Erreur lors de l'enregistrement :", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

router.get("/", async (req, res) => {
  try {
    const commandes = await Commande.find();
    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({ message: "Erreur chargement commandes" });
  }
});

module.exports = router;
