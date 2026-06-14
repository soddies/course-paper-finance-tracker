const { toAdminResponse, toUsersListResponse, toUserResponse } = require('../DTO/userDto');
const adminService = require('../services/adminService');

const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json(toUsersListResponse(users));
    } catch (error) {
        console.error('Get all users error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

const updateRole = async (req, res) => {
    try {
        const {userId} = req.params;
        const {role} = req.body;
        const adminId = req.user.userId;

        const user = await adminService.updateRole(userId, role, adminId);

        res.status(200).json({
            message: 'Роль обновлена',
            user: toAdminResponse(user)
        });
    } catch (error) {
        console.error('Update role error: ', error);
        res.status(400).json({error: error.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const adminId = req.user.userId;

        await adminService.deleteUser(userId, adminId); 

        res.status(200).json({message: 'Пользователь удален'});
    } catch (error) {
        console.error('Delete user error: ', error);
        res.status(400).json({error: error.message});
    }
};

const getSystemStats = async (req, res) => {
    try {
        const stats = await adminService.getSystemStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Get stats error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
}

const banUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const {reason} = req.body;
        const adminId = req.user.userId;

        const user = await adminService.banUser(userId, adminId, reason || null);

        res.status(200).json({
            message: 'Пользователь заблокирован',
            user: toAdminResponse(user)
        });
    } catch (error) {
        console.error('Ban user error: ', error);
        res.status(400).json({error: error.message});
    }
}

const unbanUser = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await adminService.unbanUser(userId);

        res.status(200).json({
            message: 'Пользователь разблокирован',
            user: toAdminResponse(user)
        });
    } catch (error) {
        console.error('Unban user error: ', error);
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getAllUsers, 
    updateRole,
    deleteUser,
    getSystemStats,
    banUser,
    unbanUser
};