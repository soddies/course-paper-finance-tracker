const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Аналитика доходов и расходов (графики и статистика)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DailyStat:
 *       type: object
 *       properties:
 *         label:
 *           type: string
 *           description: Метка периода (день или месяц)
 *           example: "1"
 *         income:
 *           type: number
 *           format: float
 *           description: Сумма доходов за период
 *           example: 5000.00
 *         expense:
 *           type: number
 *           format: float
 *           description: Сумма расходов за период
 *           example: 3200.50
 *     AnalyticsResponse:
 *       type: object
 *       properties:
 *         totalIncome:
 *           type: number
 *           format: float
 *           description: Общий доход за выбранный период
 *           example: 45000.00
 *         totalExpense:
 *           type: number
 *           format: float
 *           description: Общий расход за выбранный период
 *           example: 29579.50
 *         balance:
 *           type: number
 *           format: float
 *           description: Баланс (доходы минус расходы)
 *           example: 15420.50
 *         incomeCount:
 *           type: integer
 *           description: Количество операций дохода
 *           example: 5
 *         expenseCount:
 *           type: integer
 *           description: Количество операций расхода
 *           example: 12
 *         avgExpensePerDay:
 *           type: number
 *           format: float
 *           description: Средний расход в день
 *           example: 985.98
 *         dailyStats:
 *           type: array
 *           description: Детальная статистика по дням/месяцам для графика
 *           items:
 *             $ref: '#/components/schemas/DailyStat'
 */

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Получить аналитику за указанный период
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [month, year]
 *           default: month
 *         description: Тип периода (месяц или год)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 11
 *         description: Номер месяца (0-11). Используется, если period=month. По умолчанию текущий.
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Год. Используется, если period=year или month. По умолчанию текущий.
 *     responses:
 *       200:
 *         description: Данные аналитики успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       400:
 *         description: Ошибка в параметрах запроса
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
router.get('/', analyticsController.getAnalytics);

module.exports = router;