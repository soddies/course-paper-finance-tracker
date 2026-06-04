const express = require('express');
const router = express.Router();
const targetController = require('../controllers/targetsController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');
const { createTargetSchema, updateTargetSchema, addAmountSchema } = require('../schemas/targetSchema');

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Targets
 *   description: Управление целями накопления
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Target:
 *       type: object
 *       required:
 *         - name
 *         - target_amount
 *         - user_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор цели
 *           example: 5
 *         user_id:
 *           type: integer
 *           description: ID пользователя, которому принадлежит цель
 *           example: 2
 *         name:
 *           type: string
 *           description: Название цели
 *           example: Квартира в центре
 *         target_amount:
 *           type: number
 *           format: float
 *           description: Целевая сумма накоплений
 *           example: 1500000
 *         current_amount:
 *           type: number
 *           format: float
 *           description: Текущая накопленная сумма
 *           example: 450000
 *         deadline:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Желаемая дата достижения цели
 *           example: 2028-12-31T23:59:59.000Z
 *         icon:
 *           type: string
 *           description: Ключ иконки для отображения
 *           enum: [car, gift, house, laptop, phone, plane, target, travel, watch]
 *           example: house
 *         status:
 *           type: string
 *           description: Статус цели
 *           enum: [active, paused, completed]
 *           default: active
 *           example: active
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2026-05-27T15:14:52.044Z
 *     
 *     TargetInput:
 *       type: object
 *       required:
 *         - name
 *         - target_amount
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           example: Новый автомобиль
 *         target_amount:
 *           type: number
 *           minimum: 0.01
 *           example: 2000000
 *         current_amount:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 0
 *         deadline:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2030-01-01
 *         icon:
 *           type: string
 *           enum: [car, gift, house, laptop, phone, plane, target, travel, watch]
 *           default: target
 *           example: car
 *         status:
 *           type: string
 *           enum: [active, paused, completed]
 *           default: active
 *     
 *     AddAmountInput:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Сумма для пополнения
 *           example: 5000
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 *           example: Цель не найдена
 */

/**
 * @swagger
 * /api/targets:
 *   get:
 *     summary: Получить список всех целей пользователя
 *     tags: [Targets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список целей получен успешно
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Target'
 *       401:
 *         description: Неавторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Ошибка сервера
 */
router.get('/', targetController.getTargets);

/**
 * @swagger
 * /api/targets:
 *   post:
 *     summary: Создать новую цель накопления
 *     tags: [Targets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TargetInput'
 *     responses:
 *       201:
 *         description: Цель успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Target'
 *       400:
 *         description: Ошибка валидации данных
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неавторизован
 *       500:
 *         description: Ошибка сервера
 */
router.post('/', validateRequest(createTargetSchema), targetController.createTarget);

/**
 * @swagger
 * /api/targets/{id}/add:
 *   post:
 *     summary: Пополнить сумму цели
 *     tags: [Targets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID цели для пополнения
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddAmountInput'
 *     responses:
 *       200:
 *         description: Сумма успешно добавлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Target'
 *       400:
 *         description: Ошибка валидации или превышение лимита
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неавторизован
 *       404:
 *         description: Цель не найдена
 */
router.post('/:id/add', validateRequest(addAmountSchema), targetController.addAmount);

/**
 * @swagger
 * /api/targets/{id}:
 *   put:
 *     summary: Обновить данные цели
 *     tags: [Targets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID цели для обновления
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TargetInput'
 *     responses:
 *       200:
 *         description: Цель успешно обновлена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Target'
 *       400:
 *         description: Ошибка валидации или логическая ошибка (напр., сумма > цели)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Неавторизован
 *       404:
 *         description: Цель не найдена
 */
router.put('/:id', validateRequest(updateTargetSchema), targetController.updateTarget);

/**
 * @swagger
 * /api/targets/{id}/toggle-pause:
 *   patch:
 *     summary: Переключить статус паузы цели
 *     tags: [Targets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID цели
 *     responses:
 *       200:
 *         description: Статус успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Target'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Неавторизован
 *       404:
 *         description: Цель не найдена
 */
router.patch('/:id/toggle-pause', targetController.togglePause);

/**
 * @swagger
 * /api/targets/{id}:
 *   delete:
 *     summary: Удалить цель
 *     tags: [Targets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID цели для удаления
 *     responses:
 *       200:
 *         description: Цель успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Цель удалена
 *       401:
 *         description: Неавторизован
 *       404:
 *         description: Цель не найдена
 */
router.delete('/:id', targetController.deleteTarget);

module.exports = router;