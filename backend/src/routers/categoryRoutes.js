const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/stats', categoryController.getCategoryStats);
router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;