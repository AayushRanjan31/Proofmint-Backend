const express = require('express');
const {getAllUser, deleteUser} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), getAllUser);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;
