const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/stats', profileController.getUserStats);

module.exports = router;