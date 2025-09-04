const Document = require('../models/document');

const getDocumentsByUser = async (userId) => {
  return await Document.findAll({
    where: {userId},
    order: [['createdAt', 'DESC']],
  });
};

const getDocument = async (userId) => {
  return await Document.findOne({
    where: {userId},
  });
};

module.exports = {getDocumentsByUser, getDocument};
