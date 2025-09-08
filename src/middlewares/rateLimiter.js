const limiterStore = {}; // Storing request time

const rateLimiter = (req, res, next)=> {
  const totalHr = 60 * 60 * 1000;
  const maxReq = 100; // allowing 100 request
  const ipAddr = req.ip;
  const currTime = Date.now();
  // putting a empty array
  if (!limiterStore[ipAddr]) limiterStore[ipAddr] = [];

  // filtering the array
  limiterStore[ipAddr] = limiterStore[ipAddr].filter((preTime)=> currTime - preTime < totalHr );

  // checking the condition
  if (limiterStore[ipAddr].length >= maxReq) {
    return res.status(429).json({
      status: false,
      message: 'Too many requests. Please try again later.',
    });
  } else {
    limiterStore[ipAddr].push(currTime); // pushing the  date
    next();
  }
};
module.exports = rateLimiter;
