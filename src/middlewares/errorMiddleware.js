const errorMiddleware = (err, req, res, next)=> {
  res.status(500).json({
    status: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorMiddleware;
