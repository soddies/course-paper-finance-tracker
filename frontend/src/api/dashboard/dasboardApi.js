import {apiClient} from '../client';

export const dashboardAPI = {
    getSummary: () => apiClient('/dashboard/summary'),
}