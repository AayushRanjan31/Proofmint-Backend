const {
  getDocument,
  getDocumentsByUser,
  verifyDocuments,
  documentRevoke,
} = require('../services/documentService');

const getUserDocsController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const docs = await getDocumentsByUser(userId);
    res.json(docs);
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

// not using this controller
const getADocument = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const doc = await getDocument(userId);
    if (!doc) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(doc);
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const verifyDocument = async (req, res, next)=> {
  try {
    const {documentId} = req.body;
    if (!documentId) {
      const error = new Error('documentId is required');
      error.statusCode = 400;
      throw error;
    }
    const getDocument = await verifyDocuments(documentId);
    if (!getDocument) {
      const error = new Error('There is no document related to this documentId');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: true,
      previewUrl: getDocument.preview,
      verify: getDocument.status,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const revokeDocument = async (req, res, next)=> {
  try {
    const {certificateId} = req.body;
    if (!certificateId) {
      const error = new Error('certificateId is required');
      error.statusCode = 400;
      throw error;
    }
    const updateDocument = await documentRevoke(certificateId);
    if (!updateDocument) {
      const error = new Error('Cannot revoke document');
      error.statusCode = 500;
      throw error;
    }
    res.status(200).json({
      status: true,
      message: 'Successfully revoke the document',
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = {getUserDocsController, getADocument, verifyDocument, revokeDocument};
