const express = require('express');
const {
  getAllUser,
  deleteUser,
  getAllDocument,
  deleteDocument,
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.router();

router.get('/', authMiddleware, roleMiddleware('admin'), getAllUser);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);
router.get(
    '/all/documents',
    authMiddleware,
    roleMiddleware('admin'),
    getAllDocument,
);
router.delete(
    '/delete/document',
    authMiddleware,
    roleMiddleware('admin'),
    deleteDocument,
);

module.exports = router;
