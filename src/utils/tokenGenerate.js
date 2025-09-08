const jwt = require('jsonwebtoken');
const config = require('../config/config');
const token = async (id)=> {
  const generateToken = await jwt.sign(
      {id},
      config.jwtKey,
      {expiresIn: '7d'},
  );
  return generateToken;
};
module.exports = token;
