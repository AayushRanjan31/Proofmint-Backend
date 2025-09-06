const {loginService, signupService, passwordUpdate, passwordForgot, verifyThroughOpt, passwordChange} = require('../services/authService');
const {inValidUser, missingCredentials, passwordSort} = require('../utils/authError');
const token = require('../utils/tokenGenerate');
const {v4: uuid} = require('uuid');
const config = require('../config/config');
const loginController = async (req, res)=> {
  const {email, password} = req.body;

  // validation
  if (!email || !password) return missingCredentials(res);
  if (password.length < 8) return passwordSort(res);
  // checking the password
  const validUser = await loginService(email, password);
  if (!validUser) return inValidUser(res);

  const userToken =await token(validUser.id); // generated the token

  // setting the cookie
  res.cookie('token', userToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: config.cookies == 'development',
    sameSite: 'none',
    secure: true,
  });

  res.status(200).json({
    status: true,
    message: 'Login successfully',
    userData: {
      email: validUser.email,
      id: validUser.id,
      role: validUser.role,
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      number: validUser.number,
    },
  });
};
const signupController = async (req, res)=> {
  const {firstName, email, password, lastName, number} = req.body;

  if (!firstName || !email || !password || !lastName || !number) return missingCredentials(res);
  if (password.length < 8) return passwordSort(res);

  const uniqueId = uuid();
  const userDetails = await signupService(uniqueId, email, password, firstName, lastName, number);

  res.status(201).json({
    status: true,
    message: 'created new user',
    userData: {
      email: userDetails.email,
      id: userDetails.id,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      number: userDetails.number,
    },
  });
};
const logoutController = (req, res)=> {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  return res.status(200).json({
    status: true,
    message: 'Logged out successfully',
  });
};

const updatePassword = async (req, res, next) => {
  try {
    const {email, password, newPassword} = req.body;
    if (!newPassword || !email || !password) return next();
    if (newPassword.length < 8) return passwordSort(res);
    const updatedPass = await passwordUpdate(email, password, newPassword);
    if (updatedPass) {
      res.status(200).json({
        status: true,
        message: 'Password uploaded successfully',
      });
    } else next();
  } catch (err) {
    next(err);
  }
};
const forgotPassword = async (req, res, next)=> {
  try {
    const {email} = req.body;
    const sendOtp = await passwordForgot(email);
    if (!sendOtp) return next();
    res.status(200).json({
      status: true,
      message: 'OTP sent to your email',
    });
  } catch (err) {
    next(err);
  }
};
const verifyOpt = async (req, res, next) => {
  try {
    const {email, otp} = req.body;
    const verify = await verifyThroughOpt(email, otp);
    if (!verify) return next();
    res.status(200).json({
      status: true,
      message: 'Opt successfully verified',
    });
  } catch (err) {
    next(err);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const {email, newPassword} = req.body;
    if (newPassword.length < 8) return passwordSort(res);
    const passChange = await passwordChange(email, newPassword);
    if (!passChange) return next();
    res.status(200).json({
      status: true,
      message: 'Password change successfully',
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {loginController, signupController,
  logoutController, updatePassword, forgotPassword, verifyOpt, changePassword};
