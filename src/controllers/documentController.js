const {
  getDocument,
  getDocumentsByUser,
} = require('../services/documentService');

const getUserDocsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const docs = await getDocumentsByUser(userId);

    res.json(docs);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

const getADocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const doc = await getDocument(userId);
    res.json(doc);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
};

module.exports = {getUserDocsController, getADocument};
