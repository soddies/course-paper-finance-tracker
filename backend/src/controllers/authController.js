const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const {email, nickname, password} = req.body;
        
        const user = await authService.registerUser(email, nickname, password);

        res.status(201).json({
            message: 'Регистрация успешна',
            user
        });
    } catch (error) {
        console.log(`Ошибка регистрации: ${error}`);
        res.status(400).json({error: error.message});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const result = await authService.loginUser(email, password);

        res.status(200).json({
            message: 'Вход выполнен успешно',
            ...result
        });
    } catch (error) {
        console.log(`Ошибка входа: ${error}`);
        res.status(401).json({error: error.message});
    }
};

const getMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await authService.getUserById(userId);

        if (!user) {
            return res.status(404).json({error: 'Пользователь не найден'});
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            createdAt: user.created_at
        });
    } catch (error) {
        console.error('Get me error', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

module.exports = {
    register,
    login,
    getMe
};