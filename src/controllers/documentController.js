const {
  getDocument,
  getDocumentsByUser,
  verifyDocuments,
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

const verifyDocument = async (req, res, next)=> {
  try {
    const {documentId} = req.body;
    if (!documentId) next();
    const getDocument = await verifyDocuments(documentId);
    if (!getDocument) {
      return res.status(404).json({
        status: false,
        message: 'There is not document related to this documentId',
      });
    }
    res.status(200).json({
      status: true,
      previewUrl: getDocument.preview,
      verify: getDocument.status,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {getUserDocsController, getADocument, verifyDocument};
