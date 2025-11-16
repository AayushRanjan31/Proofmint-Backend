require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
let dbConfig = {};

if (databaseUrl) {
  // Parse DATABASE_URL for Railway
  const url = new URL(databaseUrl);
  dbConfig = {
    username: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    host: url.hostname,
    port: url.port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
} else {
  // Fallback to individual env vars
  dbConfig = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
  };
}

module.exports = {
  port: process.env.PORT || 8000,
  ...dbConfig,
  secretKey: process.env.DB_SECRET_KEY,
  jwtKey:
        process.env.JWT_SECRET_KEY ||
        'fallback-secret-key-change-in-production',
  cookies: process.env.NODE_ENV,
  userEmail: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  qrBase: process.env.QR_BASE_URL || 'https://proofmint.up.railway.app',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};
