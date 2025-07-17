const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const produits = await Product.find();
    res.status(200).json(produits);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des produits." });
  }
};
