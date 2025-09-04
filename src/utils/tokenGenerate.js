const jwt = require('jsonwebtoken');
const config = require('../config/config');
const token = (id)=> {
  const generateToken = jwt.sign(
      {id},
      config.jwtKey,
      {expiresIn: '7d'},
  );
  return generateToken;
};
module.exports = token;
