const express = require('express');
const {signupController, loginController, logoutController, changePassword} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', authMiddleware, logoutController);
router.post('/change/password', authMiddleware, changePassword);
module.exports = router;
