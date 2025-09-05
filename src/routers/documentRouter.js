const express = require('express');
const router = express.Router();
const {getUserDocsController, getADocument, verifyDocument} = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');


// Get all docs for logged-in user
router.get('/', authMiddleware, getUserDocsController);
router.get('/:id', authMiddleware, getADocument);
router.post('/verify', verifyDocument);

module.exports = router;
