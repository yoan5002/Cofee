const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  clientEmail: String,
  produits: [{
    nom: String,
    prix: Number,
    quantite: Number,
    image: String
  }],
  total: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Commande', commandeSchema);
