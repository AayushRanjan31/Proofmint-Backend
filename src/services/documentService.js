const Document = require('../models/document');
const sharp = require('sharp');
const {PDFDocument, rgb, StandardFonts} = require('pdf-lib');

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

const verifyDocuments = async (documentId) => {
  try {
    const document = await Document.findOne({
      where: {documentId},
    });
    if (!document) return null;
    return document;
  } catch {
    throw new Error('Cannot get the document');
  }
};

const previewDocument = async (fileBuffer, mimetype) => {
  const isPdf = mimetype === 'application/pdf';
  const watermark = 'Proof-mint Document';
  let buffer = fileBuffer;

  if (!isPdf) {
    const meta = await sharp(buffer).metadata();
    const fontSize = Math.floor(Math.min(meta.width, meta.height) * 0.2);
    const svg = `<svg width="${meta.width}" height="${meta.height}">
    <rect width="100%" height="100%" fill="transparent"/>
      <text 
        x="50%" 
        y="50%" 
        font-size="${fontSize}" 
        fill="black" 
        fill-opacity="1" 
        text-anchor="middle" 
        dominant-baseline="middle">
        ${watermark}
      </text>
    </svg>`;

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
      const size = Math.min(width, height) * 0.2;
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
};

module.exports = {getDocumentsByUser, getDocument, verifyDocuments, previewDocument};
