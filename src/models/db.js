const {Sequelize} = require('sequelize');
const config = require('../config/config');

let sequelize;

if (process.env.DATABASE_URL) {
  // For Railway deployment
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Local development
  sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        dialect: config.dialect,
        logging: false,
      },
  );
}

module.exports = sequelize;
