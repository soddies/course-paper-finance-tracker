import {apiClient} from '../client';

export const loginUser = async (email, password) => {
    const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        }),
    });

    if (data.error === 'Ваша учетная запись заблокирована администратором') {
        throw new Error('Ваша учетная запись заблокирована администратором');
    }

    return data;
};