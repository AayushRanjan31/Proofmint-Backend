const {
  loginService,
  signupService,
  passwordUpdate,
  passwordForgot,
  verifyThroughOpt,
  passwordChange,
} = require('../services/authService');
const {
  inValidUser,
  missingCredentials,
  passwordSort,
} = require('../utils/authError');
const token = require('../utils/tokenGenerate');
const {v4: uuid} = require('uuid');

const loginController = async (req, res, next) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) return missingCredentials(res);
    if (password.length < 8) return passwordSort(res);

    const validUser = await loginService(email, password);
    if (!validUser) return inValidUser(res);

    const userToken = await token(validUser.id);

    res.cookie('token', userToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(200).json({
      status: true,
      message: 'Login successfully',
      token: userToken,
      userData: {
        email: validUser.email,
        id: validUser.id,
        role: validUser.role,
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        number: validUser.number,
      },
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const signupController = async (req, res, next) => {
  try {
    const {firstName, email, password, lastName, number} = req.body;

    if (!firstName || !email || !password || !lastName || !number) {
      return missingCredentials(res);
    }
    if (password.length < 8) return passwordSort(res);

    const uniqueId = uuid();
    const userDetails = await signupService(
        uniqueId,
        email,
        password,
        firstName,
        lastName,
        number,
    );

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
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const logoutController = (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.status(200).json({
      status: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const {email, password, newPassword} = req.body;
    if (!newPassword || !email || !password) {
      const error = new Error('Missing required fields');
      error.statusCode = 400;
      throw error;
    }
    if (newPassword.length < 8) return passwordSort(res);

    const updatedPass = await passwordUpdate(email, password, newPassword);
    if (updatedPass) {
      res.status(200).json({
        status: true,
        message: 'Password uploaded successfully',
      });
    } else next();
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const {email} = req.body;
    if (!email) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }
    const sendOtp = await passwordForgot(email);
    if (!sendOtp) return next();
    res.status(200).json({
      status: true,
      message: 'OTP sent to your email',
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const verifyOpt = async (req, res, next) => {
  try {
    const {email, otp} = req.body;
    if (!email || !otp) {
      const error = new Error('Email and OTP are required');
      error.statusCode = 400;
      throw error;
    }
    const verify = await verifyThroughOpt(email, otp);
    if (!verify) return next();
    res.status(200).json({
      status: true,
      message: 'Opt successfully verified',
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const {email, newPassword} = req.body;
    if (!newPassword) {
      const error = new Error('New password is required');
      error.statusCode = 400;
      throw error;
    }
    if (newPassword.length < 8) return passwordSort(res);

    const passChange = await passwordChange(email, newPassword);
    if (!passChange) return next();
    res.status(200).json({
      status: true,
      message: 'Password change successfully',
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = {
  loginController,
  signupController,
  logoutController,
  updatePassword,
  forgotPassword,
  verifyOpt,
  changePassword,
};
