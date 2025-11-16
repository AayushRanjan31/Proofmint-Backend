const {DataTypes} = require('sequelize');
const Document = require('./document');
const sequelize = require('./db');

const Stamp = sequelize.define(
    'Stamp',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      document_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Document,
          key: 'id',
        },
      },
      page_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      x_norm: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      y_norm: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      width_norm: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      height_norm: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      show_qr: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      show_id_text: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      show_verify_url: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      style_json: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {timestamps: true},
);

Document.hasMany(Stamp, {foreignKey: 'document_id'});
Stamp.belongsTo(Document, {foreignKey: 'document_id'});

module.exports = Stamp;
