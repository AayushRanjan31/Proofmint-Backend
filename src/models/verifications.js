const {DataTypes} = require('sequelize');
const Document = require('./document');
const sequelize = require('./db');

const Verification = sequelize.define(
    'Verification',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      document_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: Document,
          key: 'id',
        },
      },
      query_value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      result: {
        type: DataTypes.ENUM('valid', 'invalid', 'expired', 'revoked'),
        allowNull: false,
      },
      client_ip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {timestamps: true},
);

Document.hasMany(Verification, {foreignKey: 'document_id'});
Verification.belongsTo(Document, {foreignKey: 'document_id'});

module.exports = Verification;
