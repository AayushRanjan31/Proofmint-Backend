const {DataTypes} = require('sequelize');
const sequelize = require('./db');

const user = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          len: [10, 10],
          isNumeric: true,
        },
      },
      otp: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
    },
    {
      timestamps: true, // disables Sequelize auto timestamps (createdAt/updatedAt)
    },
);


user.hasMany(user, {foreignKey: 'id'});


user.belongsTo(user, {foreignKey: 'id'});

module.exports = user;
