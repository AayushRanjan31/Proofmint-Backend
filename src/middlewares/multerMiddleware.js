const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {fileSize: 15 * 1024 * 1024},
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image (jpg, jpeg, png) and PDF files are allowed'), false);
    }
  },
});

module.exports = upload;
