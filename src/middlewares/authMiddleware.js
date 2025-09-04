const jwt=require('jsonwebtoken');
const config = require('../config/config');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error({status: false, message: 'Unauthorized user'});
    const decoded = await jwt.verify(token, config.jwtKey);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({status: false, message: 'Unauthorized user'});
  }
};

module.exports=authMiddleware;
