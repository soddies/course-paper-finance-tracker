import { apiClient } from "../client";

export const targetsAPI = {
    getTargets: () => apiClient('/targets'),
    
    createTarget: async (targetData) => {
        try {
            return await apiClient('/targets', {
                method: 'POST',
                body: JSON.stringify(targetData),
            });
        } catch (err) {
            if (!err) {
                throw new Error('Неизвестная ошибка при создании цели');
            }

            if (err.details && Array.isArray(err.details) && err.details.length > 0) {
                const firstErrorMsg = err.details[0].message;
                if (firstErrorMsg) {
                    throw new Error(firstErrorMsg);
                }
            }
            
            throw new Error(err.message || 'Ошибка создания цели');
        }
    },
        
    updateTarget: async (targetId, targetData) => {
        try {
            return await apiClient(`/targets/${targetId}`, {
                method: 'PUT',
                body: JSON.stringify(targetData),
            });
        } catch (err) {
            if (!err) {
                throw new Error('Неизвестная ошибка при создании цели');
            }

            if (err.details && Array.isArray(err.details) && err.details.length > 0) {
                const firstErrorMsg = err.details[0].message;
                if (firstErrorMsg) {
                    throw new Error(firstErrorMsg);
                }
            }
            
            throw new Error(err.message || 'Ошибка создания цели');
        }
    },

    deleteTarget: (targetId) =>
        apiClient(`/targets/${targetId}`, {
            method: 'DELETE',
        }),
    
    addAmount: (targetId, amount) =>
        apiClient(`/targets/${targetId}/add`, {
            method: 'POST',
            body: JSON.stringify({
                amount
            }),
        }),
    
    togglePause: (targetId, newStatus) => 
        apiClient(`/targets/${targetId}/toggle-pause`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: newStatus
            }),
        }),
}