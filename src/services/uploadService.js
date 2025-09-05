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

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
          {folder: 'proofmint', resource_type: resourceType},
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
      );
      stream.end(bufferToUpload);
    });
  } catch {
    throw new Error('Cannot upload the file');
  }
};

const createDocument = async (metaData)=> {
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
      throw new Error('No document found for this userId + certificateId');
    }
    return rows[0];
  } catch {
    throw new Error('Failed to update document');
  }
};

module.exports = {uploadService, createDocument, putStampImage};
