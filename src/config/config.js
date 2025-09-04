require('dotenv').config();
module.exports = {
  port: process.env.PORT || 8000,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || 'postgres',
  secretKey: process.env.DB_SECRET_KEY,
  jwtKey: process.env.JWT_SECRET_KEY,
};
