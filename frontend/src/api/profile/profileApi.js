import { apiClient } from "../client";

export const profileAPI = {
    getStatsProfile: () => apiClient('/profile/stats'),
    getMe: () => apiClient('/auth/me'),
    updateEmail: async (email) => {
        try {
            return await apiClient('/profile/email', {
                method: 'PATCH',
                body: JSON.stringify({email}),
            });
        } catch (err) {
            if (err.details?.[0]?.message) {
                throw new Error(err.details[0].message);
            }
            throw err;
        }
    },

    updateNickname: async (nickname) => {
        try {
            return await apiClient('/profile/nickname', {
                method: 'PATCH',
                body: JSON.stringify({nickname}),
            });
        } catch (err) {
            if (err.details?.[0]?.message) {
                throw new Error(err.details[0].message);
            }
            throw err;
        }
    },

    updatePassword: async (oldPassword, newPassword) => {
        try {
            return await apiClient('/profile/password', {
                method: 'PATCH',
                body: JSON.stringify({oldPassword, newPassword}),
            });
        } catch (err) {
            if (err.details?.[0]?.message) {
                throw new Error(err.details[0].message);
            }
            throw err;
        }
    },
};

