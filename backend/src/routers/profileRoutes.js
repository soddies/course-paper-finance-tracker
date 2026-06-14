const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const {authenticateToken} = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');
const { updateEmailSchema, updateNicknameSchema, updatePasswordSchema } = require('../schemas/profileSchema');

router.use(authenticateToken);

/**
 * @swagger
 * /api/profile/stats:
 *   get:
 *     summary: Получить статистику пользователя
 *     description: Возвращает статистику по транзакциям, балансу и целям текущего пользователя.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика получена успешно
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileStats'
 *             examples:
 *               success:
 *                 summary: Пример ответа
 *                 value:
 *                   totalTransactions: 156
 *                   totalIncome: 250000
 *                   totalExpense: 180000
 *                   balance: 70000
 *                   activeTargets: 3
 *                   completedTargets: 1
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   error: "Не авторизован"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', profileController.getUserStats);

/**
 * @swagger
 * /api/profile/email:
 *   patch:
 *     summary: Изменить email
 *     description: Обновляет email текущего пользователя. Email должен быть уникальным и корректного формата.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmailRequest'
 *           examples:
 *             validEmail:
 *               summary: Корректный email
 *               value:
 *                 email: "new_email@gmail.com"
 *             invalidEmail:
 *               summary: Некорректный email
 *               value:
 *                 email: "not-an-email"
 *     responses:
 *       200:
 *         description: Email успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: "Email успешно обновлён"
 *       400:
 *         description: Ошибка валидации или email уже занят
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalidFormat:
 *                 summary: Некорректный формат
 *                 value:
 *                   error: "Ошибка валидации"
 *                   details:
 *                     - field: "email"
 *                       message: "Некорректный формат email"
 *               tooShort:
 *                 summary: Слишком короткий
 *                 value:
 *                   error: "Ошибка валидации"
 *                   details:
 *                     - field: "email"
 *                       message: "Email слишком короткий"
 *               alreadyExists:
 *                 summary: Email уже занят
 *                 value:
 *                   error: "Пользователь с таким Email уже существует"
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/email', validateRequest(updateEmailSchema), profileController.updateEmail);

/**
 * @swagger
 * /api/profile/nickname:
 *   patch:
 *     summary: Изменить никнейм
 *     description: Обновляет никнейм текущего пользователя. Никнейм должен быть уникальным, от 5 до 20 символов, содержать только буквы, цифры и _.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNicknameRequest'
 *           examples:
 *             validNickname:
 *               summary: Корректный никнейм
 *               value:
 *                 nickname: "new_nickname_123"
 *             invalidChars:
 *               summary: Недопустимые символы
 *               value:
 *                 nickname: "bad nickname!"
 *             profanity:
 *               summary: Содержит мат
 *               value:
 *                 nickname: "badword123"
 *     responses:
 *       200:
 *         description: Никнейм успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: "Никнейм успешно обновлён"
 *       400:
 *         description: Ошибка валидации или никнейм уже занят
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               tooShort:
 *                 summary: Слишком короткий
 *                 value:
 *                   error: "Ошибка валидации"
 *                   details:
 *                     - field: "nickname"
 *                       message: "Никнейм должен быть минимум 5 символов"
 *               tooLong:
 *                 summary: Слишком длинный
 *                 value:
 *                   error: "Ошибка валидации"
 *                   details:
 *                     - field: "nickname"
 *                       message: "Никнейм должен быть максимум 20 символов"
 *               invalidChars:
 *                 summary: Недопустимые символы
 *                 value:
 *                   error: "Ошибка валидации"
 *                   details:
 *                     - field: "nickname"
 *                       message: "Никнейм может содержать только буквы, цифры и _"
 *               profanity:
 *                 summary: Содержит недопустимые слова
 *                 value:
 *                   error: "Ошибка валидации"
 *                   details:
 *                     - field: "nickname"
 *                       message: "Никнейм содержит недопустимые слова"
 *               alreadyExists:
 *                 summary: Никнейм уже занят
 *                 value:
 *                   error: "Пользователь с таким ником уже существует"
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/password', validateRequest(updatePasswordSchema), profileController.updatePassword);

/**
 * @swagger
 * /api/profile/password:
 *   patch:
 *     summary: Изменить пароль
 *     description: Обновляет пароль текущего пользователя. Требует ввода текущего пароля для подтверждения.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *           examples:
 *             validPassword:
 *               summary: Корректные пароли
 *               value:
 *                 oldPassword: "OldPassword123!"
 *                 newPassword: "NewPassword456!"
 *             wrongOldPassword:
 *               summary: Неверный старый пароль
 *               value:
 *                 oldPassword: "WrongPassword!"
 *                 newPassword: "NewPassword456!"
 *             tooShort:
 *               summary: Новый пароль слишком короткий
 *               value:
 *                 oldPassword: "OldPassword123!"
 *                 newPassword: "short"
 *     responses:
 *       200:
 *         description: Пароль успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               success:
 *                 value:
 *                   message: "Пароль успешно обновлён"
 *       400:
 *         description: Ошибка валидации или неверный старый пароль
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               wrongPassword:
 *                 summary: Неверный текущий пароль
 *                 value:
 *                   error: "Неверный текущий пароль"
 *               tooShort:
 *                 summary: Новый пароль слишком короткий
 *                 value:
 *                   error: "Ошибка валидации"
 *                   details:
 *                     - field: "newPassword"
 *                       message: "Пароль должен быть не менее 8 символов"
 *               tooLong:
 *                 summary: Новый пароль слишком длинный
 *                 value:
 *                   error: "Ошибка валидации"
 *                   details:
 *                     - field: "newPassword"
 *                       message: "Пароль слишком длинный"
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/nickname', validateRequest(updateNicknameSchema), profileController.updateNickname);
module.exports = router;