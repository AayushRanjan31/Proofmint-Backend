const express = require('express');
const router = express.Router();
const {getUserDocsController, getADocument, verifyDocument, revokeDocument} = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


// Get all docs for logged-in user
router.get('/', authMiddleware, getUserDocsController);
router.get('/:id', authMiddleware, getADocument);
router.post('/verify', verifyDocument);
router.put('/revoke', authMiddleware, roleMiddleware('admin'), revokeDocument);

module.exports = router;
