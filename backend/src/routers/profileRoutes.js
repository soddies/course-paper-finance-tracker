const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/stats', profileController.getUserStats);
router.patch('/email', profileController.updateEmail);
router.patch('/password', profileController.updatePassword);

module.exports = router;