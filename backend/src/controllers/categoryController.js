const categoryService = require('../services/categoryServices');

const getCategories = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {type} =  req.query;

        const categories = await categoryService.getCategories(userId, type);

        const total = categories.length;
        const myCount = categories.filter(c => !c.is_system).length;
        const systemCount = categories.filter(c => c.is_system).length;
        
        res.status(200).json({
            categories,
            stats: {total, myCount, systemCount}
        });
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
        const userId = req.user.userId;
        const {name, type, icon} = req.body;

        if (!name || !type) {
            return res.status(400).json({error: 'Название и тип обязательны'});
        }

        if (type !== 'income' && type !== 'expense') {
            return res.status(400).json({error: 'Неверный тип категории'});
        }

        const category = await categoryService.createCategory(userId, name, type, icon);
        res.status(201).json({message: 'Категория создана', category});
    } catch (error) {
        console.error('Create category error: ', error);
        res.status(500).json({error: 'Ошибка при создании'});
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
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    getCategoryStats
};