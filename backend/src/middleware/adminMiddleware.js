const adminRepository = require('../repositories/adminRepository');

const requireAdmin = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        
        const user = await adminRepository.getUserById(userId);
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Доступ запрещён. Требуются права администратора' 
            });
        }
        
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { requireAdmin };