const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({error: 'Требуется авторизация'});
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        const user = await authRepository.getUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({error: 'Пользователь не найден'});
        }

        if (user.is_banned) {
            return res.status(403).json({
                error: 'Ваша учетная запись заблокирована администратором',
                reason: user.ban_reason
            });
        }

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({error: 'Токен истек'});
        }
        return res.status(403).json({error: 'Недействительный токен'});
    }
};

module.exports = {authenticateToken};