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

module.exports = {loginService, signupService};
