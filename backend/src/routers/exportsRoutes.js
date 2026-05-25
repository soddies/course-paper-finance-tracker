const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportsController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Exports
 *   description: Экспорт данных в различные форматы (PDF, CSV)
 */

/**
 * @swagger
 * /api/export/pdf:
 *   get:
 *     summary: Экспортировать транзакции в PDF
 *     tags: [Exports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense, all]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: PDF файл
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Не авторизован
 */
router.get('/pdf', exportController.exportPDF);

/**
 * @swagger
 * /api/export/csv:
 *   get:
 *     summary: Экспортировать транзакции в CSV
 *     tags: [Exports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV файл
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       401:
 *         description: Не авторизован
 */
router.get('/csv', exportController.exportCSV)

module.exports = router;