const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {authenticateToken} = require('../middleware/authMiddleware');
const {requireAdmin} = require('../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/users', adminController.getAllUsers);
router.patch('/users/:userId/role', adminController.updateRole);
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;