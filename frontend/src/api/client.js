const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && {
                'Authorization': `Bearer ${token}`
            }),
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            let errorData = null;
            try {
                errorData = await response.json();
            } catch (e) {
                throw new Error(`Ошибка сети: ${response.status}`);
            }

            const errorMessage = errorData?.error || errorData?.message || `Ошибка ${response.status}`;
            
            const error = new Error(errorMessage);
            error.status = response.status;
            
            if (errorData?.details) {
                error.details = errorData.details;
            }
            
            throw error; 
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            throw new Error('Нет соединения с сервером');
        }
        throw err;
    }
}