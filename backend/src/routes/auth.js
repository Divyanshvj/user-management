const express = require('express');
const router = express.Router(); 
const authCtrl = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

// Routes
router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', authenticateToken, authCtrl.getCurrentUser);
router.get('/verify-email/:token', authCtrl.verifyEmail);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password/:token', authCtrl.resetPassword);


module.exports = router;
