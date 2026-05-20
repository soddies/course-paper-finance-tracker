const { registerSchema, loginSchema } = require('../models/authModel');
const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const validated = registerSchema.parse(req.body); 
        
        const user = await authService.registerUser(validated.email, validated.password);

        res.status(201).json({
            message: 'Регистрация успешна',
            user
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Слишком длинный email или пароль',
                details: error.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        console.log(`Ошибка регистрации: ${error}`);
        res.status(400).json({error: error.message});
    }
};

const login = async (req, res) => {
    try {
        const validated = loginSchema.parse(req.body); 

        const result = await authService.loginUser(validated.email, validated.password);

        res.status(200).json({
            message: 'Вход выполнен успешно',
            ...result
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Такой пользователь не найден',
                details: error.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        console.log(`Ошибка входа: ${error}`);
        res.status(401).json({error: error.message});
    }
};

module.exports = {
    register,
    login
};