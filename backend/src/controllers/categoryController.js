const categoryService = require('../services/categoryServices');
const {createCategorySchema, filterCategoriesSchema, categoryIdSchema} = require('../models/categoryModel');

const getCategories = async (req, res) => {
    try {
        const {type} = filterCategoriesSchema.parse(req.query);

        const userId = req.user.userId;
        const categories = await categoryService.getCategories(userId, type);

        const stats = {
            total: categories.length,
            myCount: categories.filter(c => !c.is_system).length,
            systemCount: categories.filter(c => c.is_system).length
        };
        res.status(200).json({categories, stats});
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Ошибка в параметрах запроса',
                details: error.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        console.error(error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

const getCategoryStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const stats = await categoryService.getCategoryStats(userId);

        res.status(200).json({stats});
    } catch (error) {
        console.error('Controller error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
}

const createCategory = async (req, res) => {
    try {
        const validated = createCategorySchema.parse(req.body);
        const userId = req.user.userId;

        const category = await categoryService.createCategory(
            userId,
            validated.name,
            validated.type,
            validated.icon
        );

        res.status(201).json({message: 'Категория создана', category});
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Ошибка валидации',
                details: error.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        console.error('Create category error: ', error);
        res.status(400).json({error: error.message || 'Ошибка при создании'});
    }
};

const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {id} = categoryIdSchema.parse(req.params);
        
        await categoryService.deleteCategory(parseInt(id), userId);
        res.status(200).json({message: 'Категория удалена'});
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Неверный формат ID',
                details: error.issues.map(e => e.message)
            });
        }
        console.error('Delete category error: ', error);
        res.status(400).json({error: error.message || 'Ошибка при удалении'});
    }
};

const getCategoriesFilter = async (req, res) => {
    try {
        const userId = req.user.userId;
        const categories = await categoryService.getCategories(userId);

        res.json({categories});
    } catch (error) {
        console.error('Error fetching caterogies: ', error);
        res.status(500).json({error: 'Ошибка загрузки категорий'})
    }
}

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    getCategoryStats,
    getCategoriesFilter
};