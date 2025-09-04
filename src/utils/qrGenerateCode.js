const QRCode = require('qrcode');

const generateQRCode = async (docId) => {
  const verifyUrl = `https://proofmint.com/verify?docId=${docId}`;
  return await QRCode.toDataURL(verifyUrl, {errorCorrectionLevel: 'H'});
};

module.exports = generateQRCode;
