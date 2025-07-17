const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  clientEmail: {
    type: String,
    required: true,
  },
  produits: [
    {
      produitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantite: {
        type: Number,
        required: true,
      },
    }
  ],
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Order", orderSchema);
