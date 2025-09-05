const bcrypt = require('bcrypt');
const user = require('../models/user');
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

const passwordChange = async (email, password, newPassword)=> {
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

module.exports = {loginService, signupService, passwordChange};
