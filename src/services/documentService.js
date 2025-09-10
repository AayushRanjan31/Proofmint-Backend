const Document = require('../models/document');
const sharp = require('sharp');
const {PDFDocument, rgb, StandardFonts} = require('pdf-lib');

const getDocumentsByUser = async (userId) => {
  try {
    return await Document.findAll({
      where: {userId},
      order: [['createdAt', 'DESC']],
    });
  } catch {
    const error = new Error('Failed to fetch user documents');
    error.statusCode = 500;
    throw error;
  }
};

// not using this services
const getDocument = async (userId) => {
  try {
    const doc = await Document.findOne({
      where: {userId},
    });
    if (!doc) return null;
    return doc;
  } catch {
    const error = new Error('Cannot fetch document');
    error.statusCode = 500;
    throw error;
  }
};

const verifyDocuments = async (documentId) => {
  try {
    const document = await Document.findOne({
      where: {documentId},
    });
    return document;
  } catch {
    const error = new Error('Cannot get the document');
    error.statusCode = 500;
    throw error;
  }
};

const previewDocument = async (fileBuffer, mimetype) => {
  try {
    const isPdf = mimetype === 'application/pdf';
    const watermark = 'Proof-mint Document';
    let buffer = fileBuffer;

    if (!isPdf) {
      const meta = await sharp(buffer).metadata();
      const fontSize = Math.floor(Math.min(meta.width, meta.height) * 0.05);

      const svg = `
  <svg width="${meta.width}" height="${meta.height}">
    <style>
      text {
        font-family: Arial, sans-serif;
        font-weight: bold;
      }
    </style>
    <rect width="100%" height="100%" fill="transparent"/>
    <text 
      x="50%" 
      y="50%" 
      font-size="${fontSize}" 
      fill="gray" 
      fill-opacity="0.25" 
      text-anchor="middle" 
      dominant-baseline="middle">
      ${watermark}
    </text>
  </svg>
`;

      buffer = await sharp(buffer)
          .ensureAlpha()
          .composite([{input: Buffer.from(svg), gravity: 'center', blend: 'over'}])
          .png()
          .toBuffer();
      mimetype = 'image/png';
    } else {
      const pdf = await PDFDocument.load(buffer);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      pdf.getPages().forEach((page) => {
        const {width, height} = page.getSize();
        const size = Math.min(width, height) * 0.1;
        page.drawText(watermark, {
          x: width / 2 - size * 2,
          y: height / 2,
          size,
          font,
          color: rgb(0, 0, 0),
          rotate: {degrees: 45},
          opacity: 0.5,
        });
      });
      buffer = await pdf.save();
      mimetype = 'application/pdf';
    }
    return {buffer, mimetype};
  } catch {
    const error = new Error('Cannot generate document preview');
    error.statusCode = 500;
    throw error;
  }
};

const documentRevoke = async (certificateId)=> {
  try {
    const getDocument = await Document.findOne({where: {id: certificateId}});
    if (!getDocument) {
      const error = new Error('There is no document related to this certificate');
      error.statusCode = 404;
      throw error;
    }
    const [updatedCount] = await Document.update(
        {status: 'expired'},
        {where: {id: certificateId}},
    );
    if (updatedCount == 0) {
      const error = new Error('Cannot revoke document');
      error.statusCode = 500;
      throw error;
    }
    return getDocument;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

module.exports = {getDocumentsByUser,
  getDocument, verifyDocuments, previewDocument, documentRevoke};
