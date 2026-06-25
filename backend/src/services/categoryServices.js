const categoryRepository = require('../repositories/categoryRepository');

const categoryService = {
    async getCategories(userId, type) {
        return await categoryRepository.getCategories(userId, type);
    },

    async getCategoryStats(userId) {
        return await categoryRepository.getCategoryStats(userId);
    },

    async getCategoryById(id) {
        return await categoryRepository.getCategoryById(id);
    },

    async createCategory(userId, name, type, icon) {
        if (!name || name.trim() === '') {
            throw new Error('Название категории обязательно!');
        }

        const trimmedName = name.trim();

        const existingCategory = categoryRepository.getCategoryByName(trimmedName, userId);

        if (existingCategory) {
            throw new Error('Категория уже существует!');
        }

        return await categoryRepository.createCategory(userId, name.trim(), type, icon);
    },

    async deleteCategory(categoryId, userId) {

        const category = await categoryRepository.getCategoryById(categoryId, userId);

        if (!category) {
            throw new Error('Категория не найдена');
        }

        if (category.is_system) {
            throw new Error('Нельзя удалить системную категорию!');
        }

        return await categoryRepository.deleteCategory(categoryId);
    }
};

module.exports = categoryService;