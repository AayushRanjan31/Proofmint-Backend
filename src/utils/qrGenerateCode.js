const QRCode = require('qrcode');
const config = require('../config/config');
const generateQRCode = async (docId) => {
  const verifyUrl = `${config.qrBase}docId=${docId}`;
  return await QRCode.toDataURL(verifyUrl, {errorCorrectionLevel: 'H'});
};

module.exports = generateQRCode;
