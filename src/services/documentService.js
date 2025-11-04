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

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const previewDocument = async (fileBuffer, mimetype) => {
  try {
    const isPdf = mimetype === 'application/pdf';
    const watermark = 'Proof-mint Document';
    let buffer = fileBuffer;

    if (!isPdf) {
      const fontPath = path.join(__dirname, 'fonts', 'DejaVuSans.ttf');
      if (!fs.existsSync(fontPath)) {
        console.warn('Font not found at', fontPath, '— SVG may fallback and show boxes.');
      }
      const fontBase64 = fs.existsSync(fontPath)
        ? fs.readFileSync(fontPath).toString('base64')
        : null;

      const meta = await sharp(buffer).metadata();
      const fontSize = Math.floor(Math.min(meta.width || 800, meta.height || 800) * 0.05);
      const fontFace = fontBase64
        ? `@font-face{font-family: "DejaVuEmbedded"; src: url("data:font/truetype;charset=utf-8;base64,${fontBase64}") format("truetype");}`
        : '';
      
      const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}">
    <style>
      ${fontFace}
      text {
        font-family: ${fontBase64 ? "'DejaVuEmbedded'" : "'sans-serif'"};
        font-weight: bold;
      }
    </style>
    <rect width="100%" height="100%" fill="transparent"/>
    <text 
      x="50%" 
      y="50%" 
      font-size="${fontSize}" 
      fill="gray" 
      fill-opacity="0.5" 
      text-anchor="middle" 
      dominant-baseline="middle">
      ${watermark}
    </text>
  </svg>
`;

      buffer = await sharp(buffer)
          .ensureAlpha()
          .composite([{ input: Buffer.from(svg), gravity: 'center', blend: 'over' }])
          .png()
          .toBuffer();
      mimetype = 'image/png';
    } else {
      const pdf = await PDFDocument.load(buffer);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);

      pdf.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) * 0.05;
        const textWidth = font.widthOfTextAtSize(watermark, fontSize);
        const textHeight = fontSize;
        page.drawText(watermark, {
          x: (width - textWidth) / 2,
          y: (height - textHeight) / 2,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
          opacity: 0.5,
        });
      });

      buffer = await pdf.save();
      mimetype = 'application/pdf';
    }
    return { buffer, mimetype };
  } catch (err) {
    console.error('previewDocument error:', err);
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
