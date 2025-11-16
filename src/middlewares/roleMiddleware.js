const {getAUser} = require('../services/adminService');

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        const error = new Error('Unauthorized user');
        error.statusCode = 401;
        throw error;
      }
      const {id} = req.user;
      const user = await getAUser(id);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      if (allowedRoles.includes(user.role)) {
        next();
      } else {
        const error = new Error('Invalid Role');
        error.statusCode = 403;
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
};

module.exports = roleMiddleware;
