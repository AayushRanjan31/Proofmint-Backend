const bcrypt = require('bcrypt');
const user = require('../models/user');
const sendEmail = require('../utils/sendMail');
const loginService = async (email, password)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) throw new Error('invalid credentials');

    // verifying the password
    const verify = await bcrypt.compare(password, getUser.password);
    if (!verify) throw new Error('invalid credentials');
    return getUser;
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new Error('invalid credentials');
    }
    throw err;
  }
};
const signupService = async (uniqueId, email, password, firstName, lastName, number) =>{
  try {
    // hashing the password for the security
    const hasPassword = await bcrypt.hash(password, 10);
    const newUser = await
    user.create({id: uniqueId, email, password: hasPassword, firstName, lastName, number});
    return newUser;
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Email already exists');
    }
    throw err;
  }
};

const passwordUpdate = async (email, password, newPassword)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) throw new Error('Cannot find user');
    const verify = await bcrypt.compare(password, getUser.password);
    if (!verify) throw new Error('invalid credentials');
    const hasPassword = await bcrypt.hash(newPassword, 10);
    const updateUserPassword = await user.update(
        {password: hasPassword},
        {where: {email: email}},
    );
    return updateUserPassword;
  } catch (err) {
    throw new Error(err.message);
  }
};

const passwordForgot = async (email)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) throw new Error('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await user.update(
        {otp: otp},
        {where: {email}},
    );
    await sendEmail(getUser.email, 'Your OTP for Password Reset', `Your OTP is: ${otp}`);
    setTimeout(async () => {
      await user.update(
          {otp: null},
          {where: {email, otp: otp}},
      );
    }, 10 * 60 * 1000);
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
const verifyThroughOpt = async (email, otp)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) throw new Error('User not found');
    console.log(getUser.otp, otp)
    if (getUser.otp !== otp) throw new Error('Invalid Otp');
    await user.update(
        {otp: null},
        {where: {email}},
    );
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
const passwordChange = async (email, newPassword)=> {
  try {
    const getUser = await user.findOne({where: {email}});
    if (!getUser) throw new Error('User not Found');
    const hasPassword = await bcrypt.hash(newPassword, 10);
    const updatePass = await user.update(
        {password: hasPassword},
        {where: {email}},
    );
    if (!updatePass) throw new Error('cannot change the password, try after some time');
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
module.exports = {loginService, signupService, passwordUpdate,
  passwordForgot, verifyThroughOpt, passwordChange};
