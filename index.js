const express = require('express');
const config = require('./src/config/config');
const authRouter = require('./src/routers/authRouter');
const sequelize = require('./src/models/db');
const uploadRouter = require('./src/routers/uploadRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const documentRouter = require('./src/routers/documentRouter');
const adminRouter = require('./src/routers/adminRouter');
const rateLimiter = require('./src/middlewares/rateLimiter');
const logger = require('./src/middlewares/logger');

const app = express();

// applying middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use(logger);
app.use(rateLimiter);

// cors
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:5175',
  'https://ac4087f1a82c.ngrok-free.app',
  'https://proofmint.up.railway.app',
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

// routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/document', uploadRouter);
app.use('/api/v1/documents', documentRouter);
app.use('/api/v1/admin', adminRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({status: 'OK', message: 'Server is running'});
});

// error middleware
app.use(errorMiddleware);

const port = config.port || process.env.PORT || 8000;
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({alter: process.env.NODE_ENV === 'development'});
    console.log('Database connected successfully');
    console.log(`Server running on port ${port}`);
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
});
