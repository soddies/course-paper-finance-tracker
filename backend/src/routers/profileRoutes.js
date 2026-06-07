const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const {authenticateToken} = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');
const { updateEmailSchema, updateNicknameSchema, updatePasswordSchema } = require('../schemas/profileSchema');

router.use(authenticateToken);

router.get('/stats', profileController.getUserStats);
router.patch('/email', validateRequest(updateEmailSchema), profileController.updateEmail);
router.patch('/password', validateRequest(updatePasswordSchema), profileController.updatePassword);
router.patch('/nickname', validateRequest(updateNicknameSchema), profileController.updateNickname);
module.exports = router;