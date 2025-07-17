const Commande = require('../models/Commande');

exports.enregistrerCommande = async (req, res) => {
  try {
    const { clientEmail, produits, total } = req.body;
    const commande = new Commande({ clientEmail, produits, total });
    await commande.save();
    res.status(201).json({ message: 'Commande enregistrée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la sauvegarde de la commande' });
  }
};

exports.listerCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find()
  .populate('produits.produitId') // ⬅️ ça va charger les infos produits
  .sort({ date: -1 });

    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
  }
};
