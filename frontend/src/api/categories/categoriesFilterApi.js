import {apiClient} from '../client';

export const categoriesFilterAPI = {
    getFilterCategories: () => apiClient('/categories/filters').then(data => data.categories || []),
    getTypeCategories: (type) => apiClient(`/categories?type=${type}`).then(data => data.categories || []),
}