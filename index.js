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
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(rateLimiter);

// cors
app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:5175',
    'https://ac4087f1a82c.ngrok-free.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/document', uploadRouter);
app.use('/api/v1/documents', documentRouter);
app.use('/api/v1/admin', adminRouter);

// error middleware
app.use(errorMiddleware);

const port = config.port;
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('database is connected successfully');
    console.log(`server is up and running on ${port}`);
  } catch (err) {
    console.log(err);
  }
});
