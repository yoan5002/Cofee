const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/starcoffe')
  .then(() => {
    console.log(' MongoDB connecté dans seedProducts');
    seed();
  })
  .catch(err => console.error(' Connexion échouée :', err));

async function seed() {
  try {
    await Product.deleteMany(); //  Vider les anciens produits

    const produits = [
      { nom: "ICED COFFEE MOCHA", prix: 15.90, image: "uploads/products-coffee-1.png",stock : 20 },
      { nom: "COFFEE WITH CREAM", prix: 11.90, image: "uploads/products-coffee-2.png", stock : 15 },
      { nom: "CAPPUCCINO COFFEE", prix: 19.90, image: "uploads/products-coffee-3.png", stock : 10 },
      { nom: "COFFEE WITH MILK", prix: 9.90, image: "uploads/products-coffee-4.png", stock : 25 },
      { nom: "CLASSIC ICED COFFEE", prix: 5.90, image: "uploads/products-coffee-5.png", stock : 30 },
      { nom: "ICED COFFEE FRAPPE", prix: 16.90, image: "uploads/products-coffee-6.png", stock : 5 },
    ]; console.log(produit._id);

    await Product.insertMany(produits);
    console.log(" Produits insérés avec succès !");
    mongoose.disconnect();
  } catch (err) {
    console.error(" Erreur lors de l’insertion :", err);
    mongoose.disconnect();
  }
}
