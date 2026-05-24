const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const categoryService = require('../services/categoryServices');
const pdfService = require('../services/pdfService');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

/**
 * @swagger
 * /api/transactions/filters/categories:
 *   get:
 *     summary: Получить категории для фильтрации транзакций
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список категорий успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
router.get('/filters/categories', async (req, res) => {
    try {
        const categories = await categoryService.getCategories(req.user.userId);
        res.json({categories});
    } catch (error) {
        console.error('Error fetching categories: ', error);
        res.status(500).json({error: 'Ошибка загрузки категорий'})
    }
});

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Управление транзакциями (доходы и расходы)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           example: expense
 *         amount:
 *           type: number
 *           format: float
 *           example: 1500.50
 *         description:
 *           type: string
 *           example: Обед в кафе
 *         category_id:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         category_name:
 *           type: string
 *           nullable: true
 *           example: Еда
 *         transaction_date:
 *           type: string
 *           format: date-time
 *           example: 2026-05-21T14:30:00.000Z
 *         created_at:
 *           type: string
 *           format: date-time
 *     TransactionInput:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *       properties:
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           example: expense
 *         amount:
 *           type: number
 *           format: float
 *           example: 1500.50
 *         categoryId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         description:
 *           type: string
 *           example: Обед в кафе
 *         transactionDate:
 *           type: string
 *           format: date-time
 *           example: 2026-05-21T14:30:00.000Z
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Создать новую транзакцию
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: Транзакция создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */
router.post('/', transactionController.createTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Получить список транзакций с фильтрами
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense, all]
 *         description: Тип транзакции
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Количество записей
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Смещение
 *     responses:
 *       200:
 *         description: Список транзакций
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
router.get('/', transactionController.getTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Получить транзакцию по ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID транзакции
 *     responses:
 *       200:
 *         description: Транзакция найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Транзакция не найдена
 *       401:
 *         description: Не авторизован
 */
router.get('/:id', transactionController.getTransactionById);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Обновить транзакцию
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       200:
 *         description: Транзакция обновлена
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Транзакция не найдена
 */
router.put('/:id', transactionController.updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Удалить транзакцию
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Транзакция удалена
 *       404:
 *         description: Транзакция не найдена
 */
router.delete('/:id', transactionController.deleteTransaction);

/**
 * @swagger
 * /api/transactions/export/pdf:
 *   get:
 *     summary: Экспортировать транзакции в PDF
 *     tags: [Transactions]
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
router.get('/export/pdf', async (req, res) => {
    try {
        const userId = req.user.userId;
        const filters = {
            search: req.query.search,
            type: req.query.type,
            categoryId: req.query.categoryId,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const doc = await pdfService.generateTransactionPDF(userId, filters);

        const filename = `transactions_${new Date().toISOString().slice(0, 10)}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);
    } catch (error) {
        console.error('PDF export error: ', error);
        res.status(500).json({error: 'Ошибка генерации PDF'});
    }
});

module.exports = router;