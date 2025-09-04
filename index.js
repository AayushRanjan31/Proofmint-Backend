const express = require('express');
const config = require('./src/config/config');
const authRouter = require('./src/routers/authRouter');
const sequelize = require('./src/models/db');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const app = express();
app.use(express.json());

// routers
app.use('/api/v1/auth', authRouter);

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
