const limiterStore = {};

const WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000;
const MAX_REQUESTS = process.env.RATE_LIMIT_MAX || 200;

const rateLimiter = (req, res, next) => {
  const ipAddr = req.ip;
  const currTime = Date.now();

  if (!limiterStore[ipAddr]) limiterStore[ipAddr] = [];

  limiterStore[ipAddr] = limiterStore[ipAddr].filter(
      (preTime) => currTime - preTime < WINDOW_MS,
  );

  if (limiterStore[ipAddr].length >= MAX_REQUESTS) {
    return res.status(429).json({
      status: false,
      message: 'Too many requests. Please try again later.',
    });
  }

  limiterStore[ipAddr].push(currTime);
  next();
};

module.exports = rateLimiter;
