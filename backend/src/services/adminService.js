const adminRepository = require('../repositories/adminRepository');

const getAllUsers = async () => {
    return await adminRepository.getAllUsers();
};

const getUserById = async (userId) => {
    return await adminRepository.getUserById(userId);
};

const updateRole = async (userId, newRole, adminId) => {
    if (!['user', 'admin'].includes(newRole)) {
        throw new Error('Недопустимая роль');
    }

    if (parseInt(userId) === adminId) {
        throw new Error('Нельзя изменить роль самого себя');
    }

    const user = await adminRepository.getUserById(userId);
    if (!user) {
        throw new Error('Пользователь не найден');
    }

    return await adminRepository.updateRole(userId, newRole);
};

const deleteUser = async (userId, adminId) => {
    if (parseInt(userId) === adminId) {
        throw new Error('Нельзя удалить самого себя');
    }

    const deleted = await adminRepository.getUserById(userId);

    if (!deleted) {
        throw new Error('Не удалось удалить пользователя');
    }

    return true;
};

const banUser = async (userId, adminId, reason = null) => {
    if (parseInt(userId) === adminId) {
        throw new Error('Нельзя заблокировать самого себя');
    }

    const user = await adminRepository.getUserById(userId);

    if (!user) {
        throw new Error('Пользователь не найден');
    }

    if (user.is_banned) {
        throw new Error('Пользователь уже заблокирован');
    }

    return await adminRepository.banUser(userId, adminId, reason);
};

const unbanUser = async (userId) => {
    const user = await adminRepository.getUserById(userId);
    if (!user) {
        throw new Error('Пользователь не найден');
    }

    if (!user.is_banned) {
        throw new Error('Пользователь не заблокирован');
    }

    return await adminRepository.unbanUser(userId);
 };

 const getSystemStats = async () => {
    return await adminRepository.getSystemStats();
 };

 module.exports = {
    getAllUsers,
    getUserById,
    updateRole,
    deleteUser,
    banUser,
    unbanUser,
    getSystemStats
 };