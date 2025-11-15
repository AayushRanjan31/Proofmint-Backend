const express = require('express');
const router = express.router();
const upload = require('../middlewares/multerMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const {uploadFile, uploadStamp} = require('../controllers/uploadController');

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.post('/stamps', authMiddleware, upload.single('file'), uploadStamp);

module.exports = router;
