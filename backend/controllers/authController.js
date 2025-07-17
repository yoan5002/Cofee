const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

// Transporteur d'email Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

//  Inscription
exports.register = async (req, res) => {
    const { email, password } = req.body;

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expire en 10 min

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        //  Définir le rôle : un seul admin par email connu
        let role = "client";
        if (email === "admin@starcoffe.com") {
            role = "admin";
        }

        const user = new User({
            email,
            password: hashedPassword,
            otp,
            otpExpires,
            role
        });

        await user.save();

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Votre code OTP",
            text: `Votre code OTP est : ${otp}`,
        });

        console.log("OTP généré (register) :", otp);
        res.status(200).json({ message: "OTP envoyé par email" });

    } catch (err) {
        console.error("Erreur register:", err);
        res.status(500).json({ error: err.message });
    }
};

//  Connexion (login)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Utilisateur introuvable" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Code OTP de connexion",
            text: `Voici votre code OTP : ${otp}`,
        });

        console.log("OTP généré (login) :", otp);
        res.status(200).json({ success: true, message: "OTP envoyé à votre email" });

    } catch (err) {
        console.error("Erreur login:", err);
        res.status(500).json({ error: err.message });
    }
};

//  Vérification OTP
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(401).json({ success: false, message: "OTP invalide ou expiré" });
        }

        return res.status(200).json({
            success: true,
            message: "OTP vérifié avec succès",
            user: {
                email: user.email,
                role: user.role // 👍 on récupère depuis MongoDB
            }
        });

    } catch (err) {
        console.error("Erreur verifyOtp:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};




// GET tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('email createdAt role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs.' });
  }
};

// DELETE un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  //  Vérifier si l'ID est un ObjectId valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID utilisateur invalide.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Impossible de supprimer un admin.' });
    }

    await User.deleteOne({ _id: id });
    res.json({ message: 'Utilisateur supprimé avec succès.' });

  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
  }
};


