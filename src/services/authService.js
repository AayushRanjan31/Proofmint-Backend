const bcrypt = require('bcrypt');
const user = require('../models/user');
const sendEmail = require('../utils/sendMail');
const signup = require('../models/signupTable');

const loginService = async (email, password)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) {
      const error = new Error('User Does not exist');
      error.statusCode = 401;
      throw error;
    }

    const verify = await bcrypt.compare(password, getUser.password);
    if (!verify) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    return getUser;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

const signupService = async (uniqueId, email, password, firstName, lastName, number) =>{
  try {
    const hasPassword = await bcrypt.hash(password, 10);
    const userCount = await user.count();
    const role = userCount === 0 ? 'admin' : 'user';
    const newUser = await user.create({
      id: uniqueId, email, password: hasPassword, firstName, lastName, number, role});
    await sendEmail(email, 'ProofMint Security', `${firstName}, Your proofmint account is created successfully`);
    return newUser;
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      const error = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

const passwordUpdate = async (email, password, newPassword)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) {
      const error = new Error('Cannot find user');
      error.statusCode = 404;
      throw error;
    }
    const verify = await bcrypt.compare(password, getUser.password);
    if (!verify) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    const hasPassword = await bcrypt.hash(newPassword, 10);
    const updateUserPassword = await user.update({password: hasPassword}, {where: {email}});
    return updateUserPassword;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

const passwordForgot = async (email)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await user.update({otp: otp}, {where: {email}});
    await sendEmail(getUser.email, 'Your OTP for Password Reset', `Your OTP is: ${otp}`);
    setTimeout(async () => {
      await user.update({otp: null}, {where: {email, otp: otp}});
    }, 10 * 60 * 1000);
    return true;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

const verifyThroughOpt = async (email, otp)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    if (getUser.otp !== otp) {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      throw error;
    }
    await user.update({otp: null}, {where: {email}});
    return true;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

const passwordChange = async (email, newPassword)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    const hasPassword = await bcrypt.hash(newPassword, 10);
    const updatePass = await user.update({password: hasPassword}, {where: {email}});
    await sendEmail(getUser.email, 'ProofMint Security', 'Your password has been changed');
    if (!updatePass) {
      const error = new Error('Cannot change the password, try after some time');
      error.statusCode = 500;
      throw error;
    }
    return true;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

const sendSignUpOtp = async (email) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserInSignUp = await signup.findOne({where: {email}});
    const existUser =await user.findOne({where: {email}});
    if (existUser) {
      return false;
    }
    if (existingUserInSignUp) {
      await signup.update({signUpOtp: otp}, {where: {email}});
    } else {
      await signup.create({email, signUpOtp: otp});
    }
    const user1 = await signup.findOne({where: {email}});
    (user1.email, user1.signUpOtp, otp);

    await sendEmail(email, 'Your OTP for Sign up', `Your OTP is: ${otp}`);

    setTimeout(async () => {
      await signup.destroy({where: {email}});
    }, 10 * 60 * 1000);

    return true;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};


const verifySignUpOtp = async (email, otp) => {
  try {
    const user = await signup.findOne({where: {email}});
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (user.signUpOtp !== otp) {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      throw error;
    }

    await signup.update({signUpOtp: null}, {where: {email}});

    return true;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

module.exports = {loginService, signupService, passwordUpdate,
  passwordForgot, verifyThroughOpt, passwordChange, sendSignUpOtp, verifySignUpOtp};
