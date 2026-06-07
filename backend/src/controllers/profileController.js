const profileService = require('../services/profileService');

const getUserStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const stats = await profileService.getUserStats(userId);
        res.status(200).json(stats);
    } catch (error) {
        console.error('Get user stats error: ', error);
        return res.status(500).json({error: 'Ошибка сервера'});
    }
};

const updateEmail = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {email} = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({error: 'Некорректный email'});
        }

        const updatedUser = await profileService.updateEmail(userId, email);
        res.status(200).json({email: updatedUser.email});
    } catch (error) {
        console.error('Update email error: ', error);
        res.status(400).json({error: error.message});
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {oldPassword, newPassword} = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({error: 'Заполните все поля'});
        }

        await profileService.updatePassword(userId, oldPassword, newPassword);
        res.status(200).json({message: 'Пароль успешно изменен'});
    } catch (error) {
        console.error('Update password error: ', error);
        res.status(400).json({error: error.message});
    }
};

const updateNickname = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {nickname} = req.body;

        const user = await profileService.updateNickname(userId, nickname);
        res.status(200).json(user);
    } catch (error) {
        console.error('Update nickname error: ', error);
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    getUserStats,
    updateEmail,
    updatePassword,
    updateNickname
};