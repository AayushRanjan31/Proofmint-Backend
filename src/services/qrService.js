const generateQRCode = require('../utils/qrGenerateCode');
const stampDocument = async (docId) => {
  const qrCode = await generateQRCode(docId);
  return qrCode;
};
module.exports = stampDocument;
