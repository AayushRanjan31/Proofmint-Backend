const cloudinary = require('../config/cloudinary');
const Document = require('../models/document');
const sharp = require('sharp');

const uploadService = async (buffer, mimeType) => {
  try {
    let bufferToUpload = buffer;
    let resourceType = 'auto';

    if (mimeType.startsWith('image/')) {
      bufferToUpload = await sharp(buffer)
          .jpeg({quality: 70})
          .toBuffer();
      resourceType = 'image';
    }
    if (mimeType === 'application/pdf') {
      resourceType = 'raw';
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
          {folder: 'proofmint', resource_type: resourceType},
          (error, result) => {
            if (error) {
              const err = new Error('Cannot upload the file');
              err.statusCode = 500;
              return reject(err);
            }
            resolve(result);
          },
      );
      stream.end(bufferToUpload);
    });
  } catch {
    const error = new Error('Cannot upload the file');
    error.statusCode = 500;
    throw error;
  }
};

const createDocument = async (metaData)=> {
  try {
    const createNewDocument = await Document.create({
      id: metaData.uniqueId,
      title: metaData.title,
      issuer: metaData.issuer,
      expiry: metaData.expiry,
      fileUrl: metaData.fileUrl,
      documentId: metaData.documentId,
      userId: metaData.userId,
      qrCode: metaData.qrCode,
    });
    return createNewDocument;
  } catch {
    const error = new Error('Failed to create document');
    error.statusCode = 500;
    throw error;
  }
};

const putStampImage = async (userId, certificateId, newUrl, previewUrl) => {
  try {
    const [count, rows] = await Document.update(
        {
          fileUrl: newUrl,
          preview: previewUrl,
          status: 'stamped',
        },
        {
          where: {userId, id: certificateId},
          returning: true,
        },
    );
    if (count === 0) {
      const error = new Error('No document found for this userId + certificateId');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  } catch {
    const error = new Error('Failed to update document');
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {uploadService, createDocument, putStampImage};
