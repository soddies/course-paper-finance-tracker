const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {authenticateToken} = require('../middleware/authMiddleware');
const {requireAdmin} = require('../middleware/adminMiddleware');

router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Получить системную статистику
 *     description: |
 *       Возвращает агрегированную статистику по всей системе:
 *       - Пользователи (всего, новых за месяц, администраторов, заблокированных)
 *       - Транзакции (всего, за сегодня, общие доходы, общие расходы)
 *       - Цели накоплений (всего, достигнутых, общая сумма накоплений)
 *       - Категории (системных, созданных пользователями)
 *       
 *       Доступно только администраторам.
 *     tags: [Admin - Статистика]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика успешно получена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: object
 *                   description: Статистика по пользователям
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Общее количество пользователей
 *                       example: 156
 *                     new_this_month:
 *                       type: integer
 *                       description: Новых пользователей за последние 30 дней
 *                       example: 12
 *                     admins:
 *                       type: integer
 *                       description: Количество администраторов
 *                       example: 2
 *                     banned:
 *                       type: integer
 *                       description: Количество заблокированных пользователей
 *                       example: 3
 *                 transactions:
 *                   type: object
 *                   description: Статистика по транзакциям
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Общее количество транзакций
 *                       example: 3420
 *                     today:
 *                       type: integer
 *                       description: Транзакций за сегодня
 *                       example: 45
 *                     total_income:
 *                       type: number
 *                       format: float
 *                       description: Сумма всех доходов
 *                       example: 12500000
 *                     total_expense:
 *                       type: number
 *                       format: float
 *                       description: Сумма всех расходов
 *                       example: 8900000
 *                 targets:
 *                   type: object
 *                   description: Статистика по целям накоплений
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Общее количество целей
 *                       example: 287
 *                     completed:
 *                       type: integer
 *                       description: Достигнутых целей
 *                       example: 34
 *                     total_saved:
 *                       type: number
 *                       format: float
 *                       description: Общая сумма накоплений
 *                       example: 5600000
 *                 categories:
 *                   type: object
 *                   description: Статистика по категориям
 *                   properties:
 *                     system:
 *                       type: integer
 *                       description: Количество системных категорий
 *                       example: 16
 *                     user_created:
 *                       type: integer
 *                       description: Категорий, созданных пользователями
 *                       example: 245
 *             examples:
 *               success:
 *                 summary: Пример успешного ответа
 *                 value:
 *                   users:
 *                     total: 156
 *                     new_this_month: 12
 *                     admins: 2
 *                     banned: 3
 *                   transactions:
 *                     total: 3420
 *                     today: 45
 *                     total_income: 12500000
 *                     total_expense: 8900000
 *                   targets:
 *                     total: 287
 *                     completed: 34
 *                     total_saved: 5600000
 *                   categories:
 *                     system: 16
 *                     user_created: 245
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               noToken:
 *                 summary: Токен отсутствует
 *                 value:
 *                   error: "Требуется авторизация"
 *               invalidToken:
 *                 summary: Невалидный токен
 *                 value:
 *                   error: "Недействительный токен"
 *               expiredToken:
 *                 summary: Токен истёк
 *                 value:
 *                   error: "Токен истёк"
 *       403:
 *         description: Доступ запрещён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               notAdmin:
 *                 summary: Пользователь не администратор
 *                 value:
 *                   error: "Доступ запрещён. Требуются права администратора"
 *               banned:
 *                 summary: Аккаунт заблокирован
 *                 value:
 *                   error: "Ваша учетная запись заблокирована администратором"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Ошибка сервера"
 */
router.get('/stats', adminController.getSystemStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Получить всех пользователей
 *     description: Возвращает список всех зарегистрированных пользователей системы. Доступно только администраторам.
 *     tags: [Admin - Пользователи]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей получен успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 summary: Успешный ответ
 *                 value:
 *                   - id: 2
 *                     email: "rimuru_tempest@gmail.com"
 *                     nickname: "rimuru_tempest"
 *                     role: "admin"
 *                     created_at: "2026-05-12T11:36:06.183Z"
 *                   - id: 6
 *                     email: "user123@gmail.com"
 *                     nickname: "rot_crot"
 *                     role: "user"
 *                     created_at: "2026-06-07T09:08:31.862Z"
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 summary: Нет токена
 *                 value:
 *                   error: "Не авторизован"
 *       403:
 *         description: Недостаточно прав
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               forbidden:
 *                 summary: Не администратор
 *                 value:
 *                   error: "Доступ запрещён. Требуются права администратора"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   patch:
 *     summary: Изменить роль пользователя
 *     description: Изменяет роль указанного пользователя (user ↔ admin). Администратор не может изменить свою собственную роль.
 *     tags: [Admin - Пользователи]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *         example: 6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleUpdateRequest'
 *           examples:
 *             makeAdmin:
 *               summary: Сделать админом
 *               value:
 *                 role: "admin"
 *             makeUser:
 *               summary: Понизить до пользователя
 *               value:
 *                 role: "user"
 *     responses:
 *       200:
 *         description: Роль успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Роль обновлена"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidRole:
 *                 summary: Недопустимая роль
 *                 value:
 *                   error: "Недопустимая роль"
 *               selfChange:
 *                 summary: Нельзя изменить свою роль
 *                 value:
 *                   error: "Нельзя изменить свою роль"
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Недостаточно прав
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 summary: Пользователь не найден
 *                 value:
 *                   error: "Пользователь не найден"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/users/:userId/role', adminController.updateRole);

/**
 * @swagger
 * /api/admin/users/{userId}/ban:
 *   post:
 *     summary: Заблокировать пользователя
 *     description: Блокирует учетную запись пользователя. Заблокированный пользователь не сможет войти в систему.
 *     tags: [Admin - Пользователи]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя для блокировки
 *         example: 6
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Причина блокировки
 *                 example: "Нарушение правил сообщества"
 *           examples:
 *             withReason:
 *               summary: С причиной
 *               value:
 *                 reason: "Нарушение правил сообщества"
 *             withoutReason:
 *               summary: Без причины
 *               value: {}
 *     responses:
 *       200:
 *         description: Пользователь заблокирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь заблокирован"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 6 }
 *                     email: { type: string, example: "user123@gmail.com" }
 *                     nickname: { type: string, example: "rot_crot" }
 *                     role: { type: string, example: "user" }
 *                     is_banned: { type: boolean, example: true }
 *                     ban_reason: { type: string, example: "Нарушение правил сообщества" }
 *                     banned_at: { type: string, format: date-time }
 *       400:
 *         description: Ошибка запроса
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               selfBan:
 *                 summary: Нельзя заблокировать себя
 *                 value:
 *                   error: "Нельзя заблокировать самого себя"
 *               alreadyBanned:
 *                 summary: Уже заблокирован
 *                 value:
 *                   error: "Пользователь уже заблокирован"
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Пользователь не найден"
 *       500:
 *         description: Ошибка сервера
 */
router.post('/users/:userId/ban', adminController.banUser);

/**
 * @swagger
 * /api/admin/users/{userId}/unban:
 *   post:
 *     summary: Разблокировать пользователя
 *     description: Снимает блокировку с учетной записи пользователя, позволяя ему снова войти в систему.
 *     tags: [Admin - Пользователи]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя для разблокировки
 *         example: 6
 *     responses:
 *       200:
 *         description: Пользователь разблокирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь разблокирован"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 6 }
 *                     email: { type: string, example: "user123@gmail.com" }
 *                     nickname: { type: string, example: "rot_crot" }
 *                     role: { type: string, example: "user" }
 *                     is_banned: { type: boolean, example: false }
 *       400:
 *         description: Ошибка запроса
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             examples:
 *               notBanned:
 *                 summary: Не заблокирован
 *                 value:
 *                   error: "Пользователь не заблокирован"
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.post('/users/:userId/unban', adminController.unbanUser);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Удалить пользователя
 *     description: Удаляет указанного пользователя из системы. Администратор не может удалить сам себя.
 *     tags: [Admin - Пользователи]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя для удаления
 *         example: 6
 *     responses:
 *       200:
 *         description: Пользователь успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Пользователь удален"
 *       400:
 *         description: Некорректный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               selfDelete:
 *                 summary: Нельзя удалить себя
 *                 value:
 *                   error: "Нельзя удалить самого себя"
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Недостаточно прав
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 summary: Пользователь не найден
 *                 value:
 *                   error: "Пользователь не найден"
 *       500:
 *         description: Ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;