const categoryService = require('../services/categoryServices');

const getCategories = async (req, res) => {
    try {
        const {type} = req.query;
        const userId = req.user.userId;

        const categories = await categoryService.getCategories(userId, type);

        const stats = {
            total: categories.length,
            myCount: categories.filter(c => !c.is_system).length,
            systemCount: categories.filter(c => c.is_system).length
        };
        res.status(200).json({categories, stats});
    } catch (error) {
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
        const {name, type, icon} = req.body;
        const userId = req.user.userId;

        const category = await categoryService.createCategory(userId, name, type, icon);

        res.status(201).json({message: 'Категория создана', category});
    } catch (error) {
        console.error('Create category error: ', error);
        res.status(400).json({error: error.message || 'Ошибка при создании'});
    }
};

const deleteCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;
        
        await categoryService.deleteCategory(parseInt(id), userId);
        res.status(200).json({message: 'Категория удалена'});
    } catch (error) {
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