const {getAUser} = require('../services/adminService');

const roleMiddleware = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({message: 'Unauthorized user'});
    }
    const {id} = req.user;
    const user = await getAUser(id);
    if (allowedRoles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({message: 'Invalid Role'});
    }
  };
};
module.exports = roleMiddleware;

