const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      throw new Error({status: false, message: 'Unauthorized user'});
    }
    const decoded = await jwt.verify(token, config.jwtKey);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({status: false, message: 'Unauthorized user'});
  }
};

module.exports = authMiddleware;
