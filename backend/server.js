const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();


const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const commandeRoutes = require("./routes/commandeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ strict: false }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/commandes", commandeRoutes);


// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log(" MongoDB connecté");

    // Création de l'admin par défaut
    const User = require("./models/User");
    const bcrypt = require("bcrypt");

    const adminEmail = "yoanlable@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        otp: null,
        otpExpires: null,
      });
      await admin.save();
      console.log(" Admin par défaut créé !");
    } else {
      console.log("ℹ Admin déjà existant.");
    }
  })
  .catch(err => console.error(" Erreur MongoDB :", err));

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Serveur démarré sur le port ${PORT}`));
