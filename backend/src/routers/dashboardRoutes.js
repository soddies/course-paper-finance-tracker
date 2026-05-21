const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API для получения данных в дашборд   
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardSummary:
 *       type: object
 *       properties:
 *         totalBalance:
 *           type: number
 *           format: float
 *           description: Общий баланс за все время
 *           example: 15300.00
 *         monthlyIncome:
 *           type: number
 *           format: float
 *           description: Доходы за текущий месяц
 *           example: 12000.00
 *         monthlyExpense:
 *           type: number
 *           format: float
 *           description: Расходы за текущий месяц
 *           example: 5000.00
 *         monthlyBalance:
 *           type: number
 *           format: float
 *           description: Баланс за текущий месяц
 *           example: 7000.00
 *         transactionCount:
 *           type: integer
 *           description: Количество операций за текущий месяц
 *           example: 11
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Получить сводку для дашборда (баланс, доходы/расходы за месяц)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные дашборда успешно получены
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummary'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
router.get('/summary', dashboardController.getDashboardSummary);

module.exports = router;