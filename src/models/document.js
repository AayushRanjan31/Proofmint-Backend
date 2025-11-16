const {DataTypes} = require('sequelize');
const User = require('./user');
const sequelize = require('./db');

const Document = sequelize.define(
    'Document',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recipient_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recipient_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      recipient_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      issuer_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('draft', 'issued', 'revoked'),
        defaultValue: 'draft',
      },
      issue_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      revoke_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      documentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {timestamps: true},
);

User.hasMany(Document, {foreignKey: 'issuer_user_id'});
Document.belongsTo(User, {foreignKey: 'issuer_user_id'});

module.exports = Document;
