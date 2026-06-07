const profileRepository = require('../repositories/profileRepository');
const authRepository = require('../repositories/authRepository');
const bcrypt = require('bcryptjs');

const getUserStats = async (userId) => {
    const stats = await profileRepository.getUserStats(userId);

    if (!stats) {
        return null;
    }

    return {
        transactionCount: parseInt(stats.transaction_count) || 0,
        categoryCount: parseInt(stats.category_count) || 0,
        maxIncome: parseFloat(stats.max_income) || 0,
        maxExpense: parseFloat(stats.max_expense) || 0,
        activeTargets: parseInt(stats.active_targets) || 0,
        completedTargets: parseInt(stats.completed_targets) || 0,
        overdueTargets: parseInt(stats.overdue_targets) || 0
    };
};

const updateEmail = async (userId, newEmail) => {
    const existing = await profileRepository.findUserByEmail(newEmail);
    if (existing && existing.id !== userId) {
        throw new Error('Этот email уже используется');
    }
    return await profileRepository.updateUserEmail(userId, newEmail);
}

const updatePassword = async (userId, oldPassword, newPassword) => {
    const user = await profileRepository.getUserById(userId);
    if (!user) {
        throw new Error('Пользователь не найден');
    }

    const isValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isValid) {
        throw new Error('Неверный текущий пароль');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    return await profileRepository.updateUserPassword(userId, passwordHash);
}

const updateNickname = async (userId, nickname) => {
    const existingNickname = await authRepository.searchByNickname(nickname);
    if (existingNickname && existingNickname.id !== userId) {
        throw new Error('Пользователь с таким ником уже есть');
    }

    return await profileRepository.updateNicknameUser(userId, nickname);
}

module.exports = {
    getUserStats,
    updateEmail,
    updatePassword,
    updateNickname
};