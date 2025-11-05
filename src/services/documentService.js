const fs = require('fs');
const path = require('path');

const Document = require('../models/document');
const sharp = require('sharp');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

const getDocumentsByUser = async (userId) => {
  try {
    return await Document.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  } catch (err) {
    const error = new Error('Failed to fetch user documents');
    error.statusCode = 500;
    throw error;
  }
};

const getDocument = async (userId) => {
  try {
    const doc = await Document.findOne({
      where: { userId },
    });
    return doc || null;
  } catch (err) {
    const error = new Error('Cannot fetch document');
    error.statusCode = 500;
    throw error;
  }
};

const verifyDocuments = async (documentId) => {
  try {
    const document = await Document.findOne({
      where: { documentId },
    });
    return document;
  } catch (err) {
    const error = new Error('Cannot get the document');
    error.statusCode = 500;
    throw error;
  }
};

// Helper: escape text for XML/SVG
function escapeForXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const previewDocument = async (fileBuffer, mimetype) => {
  try {
    const isPdf = mimetype === 'application/pdf';
    const watermark = 'Proof-mint Document';

    if (!isPdf) {
      // IMAGE branch - use sharp + SVG overlay
      const fontPath = path.join(__dirname, 'fonts', 'DejaVuSans.ttf');
      let fontBase64 = null;
      if (fs.existsSync(fontPath)) {
        try {
          fontBase64 = fs.readFileSync(fontPath).toString('base64');
        } catch (e) {
          console.error('Failed to read font file at', fontPath, e);
          fontBase64 = null;
        }
      }

      const image = sharp(fileBuffer, { animated: false });
      const meta = await image.metadata();
      const width = meta.width || 1024;
      const height = meta.height || 768;
      const MAX_DIM = 4000;

      let pipeline = image;
      if (Math.max(width, height) > MAX_DIM) {
        const scale = MAX_DIM / Math.max(width, height);
        pipeline = pipeline.resize(Math.round(width * scale), Math.round(height * scale), {
          fit: 'inside',
        });
      }

      // recompute metadata after possible resize to ensure SVG matches final size
      const resizedMeta = await pipeline.metadata();
      const finalWidth = resizedMeta.width || width;
      const finalHeight = resizedMeta.height || height;

      const fontSize = Math.max(24, Math.floor(Math.min(finalWidth, finalHeight) * 0.06));

      const fontFace = fontBase64
        ? `@font-face{font-family: 'DejaVuEmbedded'; src: url("data:font/truetype;charset=utf-8;base64,${fontBase64}") format("truetype");}`
        : '';

      // ensure watermark text is XML-escaped
      const escapedWatermark = escapeForXml(watermark);

      // SVG canvas exactly the same size as the image - avoids any tiling/repeat issues
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${finalWidth}" height="${finalHeight}" viewBox="0 0 ${finalWidth} ${finalHeight}" preserveAspectRatio="xMidYMid meet">
          <style>
            ${fontFace}
            .watermark {
              font-family: ${fontBase64 ? "'DejaVuEmbedded', 'sans-serif'" : "'sans-serif'"};
              font-weight: 700;
              font-size: ${fontSize}px;
              fill: #000000;
              fill-opacity: 0.12;
              dominant-baseline: middle;
              text-anchor: middle;
            }
          </style>
          <rect width="100%" height="100%" fill="transparent"/>
          <g transform="translate(${finalWidth / 2}, ${finalHeight / 2}) rotate(-30)">
            <text class="watermark" x="0" y="0">${escapedWatermark}</text>
          </g>
        </svg>
      `;

      // Composite SVG exactly at top-left (0,0) so it overlays once, centered by the SVG itself.
      const outBuffer = await pipeline
        .ensureAlpha()
        .composite([{ input: Buffer.from(svg), left: 0, top: 0, blend: 'over' }])
        .toFormat('png')
        .toBuffer();

      return { buffer: outBuffer, mimetype: 'image/png' };
    } else {
      // PDF branch - use pdf-lib
      const pdf = await PDFDocument.load(fileBuffer);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);

      const pages = pdf.getPages();
      pages.forEach((page) => {
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
          opacity: 0.45,
        });
      });

      const outBuffer = await pdf.save();
      return { buffer: outBuffer, mimetype: 'application/pdf' };
    }
  } catch (err) {
    console.error('previewDocument error:', err);
    const error = new Error('Cannot generate document preview');
    error.statusCode = 500;
    throw error;
  }
};

const documentRevoke = async (certificateId) => {
  try {
    const documentRecord = await Document.findOne({ where: { id: certificateId } });
    if (!documentRecord) {
      const error = new Error('There is no document related to this certificate');
      error.statusCode = 404;
      throw error;
    }

    const [updatedCount] = await Document.update(
      { status: 'expired' },
      { where: { id: certificateId } }
    );

    if (updatedCount === 0) {
      const error = new Error('Cannot revoke document');
      error.statusCode = 500;
      throw error;
    }

    return documentRecord;
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

module.exports = {
  getDocumentsByUser,
  getDocument,
  verifyDocuments,
  previewDocument,
  documentRevoke,
};
