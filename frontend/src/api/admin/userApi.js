import { apiClient } from "../client";

export const adminAPI = {
    getStatsAdmin: () => apiClient('/admin/stats'),
    getUsers: () => apiClient('/admin/users'),
 
    changeRoleUser: (userId, newRole) =>
        apiClient(`/admin/users/${userId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({
                role: newRole
            }),
        }),

    banUser: (userId, reason) => 
        apiClient(`/admin/users/${userId}/ban`, {
            method: 'POST',
            body: JSON.stringify({
                reason: reason || null
            }),
        }),

    unBanUser: (userId) =>
        apiClient(`/admin/users/${userId}/unban`, {
            method: 'POST'
        }),

    deleteUser: (userId) => 
        apiClient(`/admin/users/${userId}`, {
            method: 'DELETE'
        }),
}