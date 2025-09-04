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
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and image files are allowed'), false);
    }
  },
});

module.exports = upload;
