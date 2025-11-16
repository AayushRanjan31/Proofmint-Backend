const {DataTypes} = require('sequelize');
const User = require('./user');
const Document = require('./document');
const sequelize = require('./db');

const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      actor_user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: User,
          key: 'id',
        },
      },
      document_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: Document,
          key: 'id',
        },
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      meta_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {timestamps: true},
);

User.hasMany(AuditLog, {foreignKey: 'actor_user_id'});
AuditLog.belongsTo(User, {foreignKey: 'actor_user_id'});

Document.hasMany(AuditLog, {foreignKey: 'document_id'});
AuditLog.belongsTo(Document, {foreignKey: 'document_id'});

module.exports = AuditLog;
