const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

//  Route pour passer une commande
router.post("/", orderController.placeOrder);

//  Route pour récupérer toutes les commandes
router.get("/", orderController.getAllOrders);



module.exports = router;
