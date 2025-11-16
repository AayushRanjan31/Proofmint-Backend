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
      const error = new Error('Unauthorized user');
      error.statusCode = 401;
      throw error;
    }
    const decoded = await jwt.verify(token, config.jwtKey);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
