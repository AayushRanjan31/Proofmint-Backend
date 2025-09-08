const {previewDocument} = require('../services/documentService');
const stampDocument = require('../services/qrService');
const {uploadService, createDocument, putStampImage} = require('../services/uploadService');
const {v4: uuid} = require('uuid');

const uploadFile = async (req, res, next) => {
  try {
    const {title, expiry, username} = req.body;
    if (!title || !expiry || !username) {
      const error = new Error('title, expiry and username are required');
      error.statusCode = 400;
      throw error;
    }
    const {id} = req.user;
    if (!req.file) {
      const error = new Error('File is required');
      error.statusCode = 400;
      throw error;
    }

    const result = await uploadService(req.file.buffer, req.file.mimetype);
    if (!result) {
      const error = new Error('Failed to upload file');
      error.statusCode = 500;
      throw error;
    }

    const documentId = uuid();
    const generateQrCode = await stampDocument(documentId);
    const uniqueId = uuid();
    const metaData = {
      uniqueId: uniqueId,
      userId: id,
      title,
      expiry,
      fileUrl: result.url,
      documentId: documentId,
      issuer: username,
      qrCode: generateQrCode,
    };
    const document = await createDocument(metaData);

    res.status(200).json({
      status: true,
      message: 'file uploaded successfully',
      imageData: {
        url: result.url,
        id: result.public_id,
        documentId: documentId,
        qrCode: generateQrCode,
        certificateId: document.id,
      },
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

const uploadStamp = async (req, res, next)=> {
  try {
    const {id} = req.user;
    const {certificateId} = req.body;
    if (!req.file || !certificateId) {
      const error = new Error('File and certificateId are required');
      error.statusCode = 400;
      throw error;
    }

    const result = await uploadService(req.file.buffer, req.file.mimetype);
    const {buffer, mimetype} = await previewDocument(req.file.buffer, req.file.mimetype);
    const uploadPreview = await uploadService(buffer, mimetype);
    if (!result || !uploadPreview) {
      const error = new Error('Failed to upload stamp or preview');
      error.statusCode = 500;
      throw error;
    }

    const modifyDocument = await putStampImage(id, certificateId, result.url, uploadPreview.url);
    if (!modifyDocument) {
      const error = new Error('Failed to update document with stamp');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({
      status: true,
      message: 'Stamps uploaded successfully',
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = {uploadFile, uploadStamp};
