const validateRegister = (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email и пароль обязательны'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Некорректный формат email'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            error: 'Пароль должен быть минимум 8 символов!'
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Email и пароль обязательны'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Некорректный формат email'
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            error: 'Неверный email или пароль'
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin
};