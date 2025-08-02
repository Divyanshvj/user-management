const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');
const multer = require('multer');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get('/', authenticateToken, authorizeRoles('admin'), userCtrl.getUsers);
router.get('/profile', authenticateToken, userCtrl.getProfile);
router.put('/profile', authenticateToken, upload.single('profileImage'), userCtrl.updateProfile);

module.exports = router;
