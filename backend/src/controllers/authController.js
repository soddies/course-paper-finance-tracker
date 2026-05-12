const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'Email и пароль обязательны!'});
        }

        if (password.length < 8) {
            return res.status(400).json({error: 'Пароль должен быть не менее 8 символов!'});
        }
        
        const user = await authService.registerUser(email, password);

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

        if (!email || !password) {
            return res.status(400).json({error: 'Email и пароль обязательны!'});
        }

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

module.exports = {
    register,
    login
};