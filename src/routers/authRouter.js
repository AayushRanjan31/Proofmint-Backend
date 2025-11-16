const express = require('express');
const {
  signupController,
  loginController,
  logoutController,
  updatePassword,
  forgotPassword,
  verifyOpt,
  changePassword,
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', authMiddleware, logoutController);
router.post('/update/password', authMiddleware, updatePassword);
router.post('/forgot/password', forgotPassword);
router.post('/verify/otp', verifyOpt);
router.post('/change/password', changePassword);
router.post('/signup/otp', sendSignupOtp);
router.post('/signup/otp/verify', verifySignupOtp);
module.exports = router;
