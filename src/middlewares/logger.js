const morgan = require('morgan'); // getting the morgan from morgan
const logger = morgan('dev'); // request logs in development mode
module.exports = logger;
