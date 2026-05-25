const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {createCategorySchema, filterCategoriesSchema, categoryIdSchema} = require('../validate/categoryValidateZod');
const {validateRequest} = require('../middleware/validateMiddleware');
const {authenticateToken} = require('../middleware/authMiddleware');

router.use(authenticateToken);


/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Управление категориями доходов и расходов + получение категорий для фильтров в транзакциях
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Продукты
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           example: expense
 *         icon:
 *           type: string
 *           nullable: true
 *           example: shopping-cart.svg
 *         is_system:
 *           type: boolean
 *           description: Является ли категория системной (предустановленной)
 *           example: false
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           example: Кафе
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           example: expense
 *         icon:
 *           type: string
 *           nullable: true
 *           example: coffee.svg
 *     CategoryStats:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Общее количество категорий
 *           example: 25
 *         myCount:
 *           type: integer
 *           description: Количество пользовательских категорий
 *           example: 10
 *         systemCount:
 *           type: integer
 *           description: Количество системных категорий
 *           example: 15
 */

/**
 * @swagger
 * /api/categories/stats:
 *   get:
 *     summary: Получить статистику по категориям (всего, свои, системные)
 *     tags: [Categories]
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
 *                 stats:
 *                   $ref: '#/components/schemas/CategoryStats'
 *       401:
 *         description: Не авторизован
 */
router.get('/stats', categoryController.getCategoryStats);

/**
 * @swagger
 * /api/categories/filters:
 *   get:
 *     summary: Получить список категорий для фильтрации
 *     tags: [Categories]
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
router.get('/filters', categoryController.getCategoriesFilter);


/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Получить список категорий пользователя
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Фильтр по типу (доходы или расходы)
 *     responses:
 *       200:
 *         description: Список категорий
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
 */
router.get('/', validateRequest(filterCategoriesSchema, 'query'), categoryController.getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Создать новую категорию
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Категория создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */
router.post('/', validateRequest(createCategorySchema, 'body'), categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Удалить категорию
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID категории
 *     responses:
 *       200:
 *         description: Категория удалена
 *       403:
 *         description: Нельзя удалить системную категорию
 *       404:
 *         description: Категория не найдена
 *       401:
 *         description: Не авторизован
 */
router.delete('/:id', validateRequest(categoryIdSchema, 'params'), categoryController.deleteCategory);

module.exports = router;