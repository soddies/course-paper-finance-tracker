import { apiClient } from "../client";

export const analyticsAPI = {
    getAnalytics: (period, month, year) => {
        const params = new URLSearchParams({
            period, month, year
        });

        return apiClient(`/analytics?${params}`);
    },
};