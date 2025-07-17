const nodemailer = require('nodemailer');
const Order = require("../models/Order"); 



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.placeOrder = async (req, res) => {
  const { cart, email } = req.body;

  if (!cart || !email) {
    return res.status(400).json({ error: "Données manquantes." });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemsText = cart
    .map(item => `- ${item.name} x${item.qty} = $${(item.price * item.qty).toFixed(2)}`)
    .join('\n');

  const message = `
Merci pour votre commande chez StarCoffe !

Détails :
${itemsText}

Total : $${total.toFixed(2)}

À bientôt !
`;

  try {
    //  1. Envoi du mail
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Reçu de votre commande StarCoffe",
      text: message
    });
    console.log("🛒 Cart reçu pour commande :", JSON.stringify(cart, null, 2));


    //  2. Sauvegarde de la commande
    const nouvelleCommande = new Order({
  clientEmail: email, // ← ici, le champ doit s’appeler exactement "clientEmail"
  produits: cart.map(item => ({
    produitId: item._id,
    quantite: item.qty
  })),
  total,
  date: new Date()
});


    await nouvelleCommande.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





exports.getAllOrders = async (req, res) => {
  try {
    const commandes = await Order.find().populate("produits.produitId");
    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({ error: "Erreur chargement commandes" });
  }
};


