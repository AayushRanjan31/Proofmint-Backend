const express = require('express');
const router = express.Router();
const {getUserDocsController, getADocument} = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');


// Get all docs for logged-in user
router.get('/', authMiddleware, getUserDocsController);
router.get('/:id', authMiddleware, getADocument);

module.exports = router;
