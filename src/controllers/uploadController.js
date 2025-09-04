const stampDocument = require('../services/qrService');
const {uploadService, createDocument, putStampImage} = require('../services/uploadService');
const uploadError = require('../utils/uploadError');
const {v4: uuid} = require('uuid');
const uploadFile = async (req, res, next) => {
  try {
    const {title, expiry, username} = req.body;
    if (!title || !expiry || !username) return uploadError(res);
    const {id} = req.user;
    if (!req.file) return next();

    // Upload buffer to Cloudinary
    const result = await uploadService(req);
    if (!result) return next();

    const documentId = uuid();
    const generateQrCode = await stampDocument(documentId);
    const uniqueId = uuid();
    const metaData =
    {uniqueId: uniqueId, userId: id, title, expiry, fileUrl: result.url,
      documentId: documentId, issuer: username, qrCode: generateQrCode};
    await createDocument(metaData);

    res.status(200).json({
      status: true,
      message: 'file uploaded successfully',
      imageData: {
        url: result.url,
        id: result.public_id,
        documentId: documentId,
        qrCode: generateQrCode,
      },
    });
  } catch (err) {
    next(err);
  }
};
const uploadStamp = async (req, res, next)=> {
  try {
    const {id} = req.user;
    const {documentId} = req.body;
    if (!req.file || !documentId) return next();

    // Upload buffer to Cloudinary
    const result = await uploadService(req);
    if (!result) return next();

    const modifyDocument = await putStampImage(id, documentId, result.url);

    if (!modifyDocument) return next();
    res.status(200).json({
      status: true,
      message: 'Stamps uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {uploadFile, uploadStamp};
