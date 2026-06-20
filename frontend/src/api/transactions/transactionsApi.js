import { apiClient } from "../client";

export const transactionAPI = {
    getTransactions: (filters = {}) => {
        const queryParams = new URLSearchParams();
        
        if (filters.type && filters.type !== 'all') {
            queryParams.append('type', filters.type);
        }
        if (filters.categoryId && filters.categoryId !== 'all') {
            queryParams.append('categoryId', filters.categoryId);
        }
        if (filters.search) {
            queryParams.append('search', filters.search);
        }
        if (filters.dateFrom) {
            queryParams.append('dateFrom', filters.dateFrom);
        }
        if (filters.dateTo) {
            queryParams.append('dateTo', filters.dateTo);
        }
        if (filters.sortBy) {
            queryParams.append('sortBy', filters.sortBy);
        }
        if (filters.sortOrder) {
            queryParams.append('sortOrder', filters.sortOrder);
        }

        const queryString = queryParams.toString();
        return apiClient(`/transactions${queryString ? `?${queryString}` : ''}`).then(data => Array.isArray(data) ? data : (data.transactions || []));
    },

    createTransaction: async (transactionData) => {
        try {
            return await apiClient('/transactions', {
                method: 'POST',
                body: JSON.stringify(transactionData),
            });
        } catch (err) {
            if (err.details?.[0]?.message) {
                throw new Error(err.details[0].message);
            }
            throw err;
        }
    },

    updateTransaction: async (id, transactionData) => {
        try {
            return await apiClient(`/transactions/${id}`, {
                method: 'PUT',
                body: JSON.stringify(transactionData),
            });
        } catch (err) {
            if (err.details?.[0]?.message) {
                throw new Error(err.details[0].message);
            }
            throw err;
        }
    },

    deleteTransaction: async (id) => 
        apiClient(`/transactions/${id}`, {
            method: 'DELETE'
        }),

    exportTransaction: async (format, filters = {}) => {
        const token = localStorage.getItem('token');

        const params = new URLSearchParams();
        if (filters.search) {
            params.append('search', filters.search);
        }
        if (filters.type) {
            params.append('type', filters.type);
        }
        if (filters.categoryId) {
            params.append('categoryId', filters.categoryId);
        }
        if (filters.dateFrom) {
            params.append('dateFrom', filters.dateFrom);
        }   
        if (filters.dateTo) {
            params.append('dateTo', filters.dateTo);
        }
        if (filters.sortBy) {
            params.append('sortBy', filters.sortBy);
        }
        if (filters.sortOrder) {
            params.append('sortOrder', filters.sortOrder);
        }

        const url = `http://localhost:3000/api/export/${format}?${params}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Ошибка экспорта');
        }

        return response.blob();
    }
}