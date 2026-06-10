const adminRepository = require('../repositories/adminRepository');

const getAllUsers = async (req, res) => {
    try {
        const users = await adminRepository.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Get all users error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

const updateRole = async (req, res) => {
    try {
        const {userId} = req.params;
        const {role} = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({error: 'Недопустимая роль'});
        }

        if (parseInt(userId) === req.user.userId) {
            return res.status(400).json({error: 'Нельзя изменить свою роль'});
        }

        const user = await adminRepository.updateRole(userId, role);

        if (!user) {
            return res.status(400).json({error: 'Пользователь не найден'});
        }

        res.status(200).json({
            message: 'Роль обновлена',
            user
        });
    } catch (error) {
        console.error('Update role error: ', error);
        res.status(400).json({error: error.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params;

        if (parseInt(userId) === req.user.userId) {
            return res.status(400).json({error: 'Нельзя удалить самого себя'});
        }

        const deleted = await adminRepository.deleteUser(userId);

        if (!deleted) {
            return res.status(400).json({error: 'Пользователь не найден'});
        }

        res.status(200).json({message: 'Пользователь удален'});
    } catch (error) {
        console.error('Delete user error: ', error);
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    getAllUsers, 
    updateRole,
    deleteUser
};