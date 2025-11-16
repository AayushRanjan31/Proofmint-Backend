const {DataTypes} = require('sequelize');
const Document = require('./document');
const sequelize = require('./db');

const DocumentFile = sequelize.define(
    'DocumentFile',
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
      kind: {
        type: DataTypes.ENUM('source', 'stamped', 'preview'),
        allowNull: false,
      },
      storage_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size_bytes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      page_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {timestamps: true},
);

Document.hasMany(DocumentFile, {foreignKey: 'document_id'});
DocumentFile.belongsTo(Document, {foreignKey: 'document_id'});

module.exports = DocumentFile;
