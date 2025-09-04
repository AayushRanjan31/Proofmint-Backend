const {loginService, signupService} = require('../services/authService');
const {inValidUser, missingCredentials, passwordSort} = require('../utils/authError');
const token = require('../utils/tokenGenerate');
const {v4: uuid} = require('uuid');
const loginController = async (req, res)=> {
  const {email, password} = req.body;

  // validation
  if (!email || !password) return missingCredentials(res);
  if (password.length < 8) return passwordSort(res);
  // checking the password
  const validUser = await loginService(email, password);
  if (!validUser) return inValidUser(res);

  const userToken = token(validUser.id); // generated the token

  // setting the cookie
  res.cookie('token', userToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 1000,
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

module.exports = {loginController, signupController, logoutController};
