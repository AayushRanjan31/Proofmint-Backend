const {DataTypes} = require('sequelize');
const User = require('./user');
const sequelize = require('./db');
const Document = sequelize.define(
    'Document',
    {
      id: {type: DataTypes.STRING, primaryKey: true},
      title: {type: DataTypes.STRING, allowNull: false},
      issuer: {type: DataTypes.STRING},
      expiry: {type: DataTypes.DATE},
      documentId: {type: DataTypes.STRING, allowNull: false},
      fileUrl: {type: DataTypes.STRING, allowNull: false},
      qrCode: {type: DataTypes.TEXT, defaultValue: null},
      status: {
        type: DataTypes.ENUM('uploaded', 'stamped', 'expired'),
        defaultValue: 'uploaded',
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
    },
    {timestamps: true},
);
User.hasMany(Document, {foreignKey: 'userId'});
Document.belongsTo(User, {foreignKey: 'userId'});

module.exports = Document;
