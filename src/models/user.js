const {DataTypes} = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'issuer', 'public'),
        defaultValue: 'issuer',
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    },
    {
      timestamps: true,
    },
);

module.exports = User;
