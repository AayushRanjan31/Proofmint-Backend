const {DataTypes} = require('sequelize');
const sequelize = require('./db');

const signUpTable = sequelize.define('OtpVerification', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  signUpOtp: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
});

module.exports=signUpTable;
