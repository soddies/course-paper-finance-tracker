import { apiClient } from "../client";

export const categoryAPI = {
    getType: (type) => 
        apiClient(`/categories?type=${type}`).then(data => data.categories),

    getStats: () => 
        apiClient('/categories/stats').then(data => data.stats),

    createCategory: async (name, type) => {
        try {
            return await apiClient('/categories', {
                method: 'POST',
                body: JSON.stringify({ name, type }),
            });
        } catch (err) {
            if (!err) {
                throw new Error('Неизвестная ошибка при создании категории');
            }

            if (err.details && Array.isArray(err.details) && err.details.length > 0) {
                const firstErrorMsg = err.details[0].message;
                if (firstErrorMsg) {
                    throw new Error(firstErrorMsg);
                }
            }
            
            throw new Error(err.message || 'Ошибка создания категории');
        }
    },

    deleteCategory: (categoryId) => 
        apiClient(`/categories/${categoryId}`, {
            method: 'DELETE'
        }),
};