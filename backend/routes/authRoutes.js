const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.get('/users', authController.getAllUsers);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
