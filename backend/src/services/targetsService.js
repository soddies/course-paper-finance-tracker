const targetRepository = require('../repositories/targetsRepository');

const getTargets = async (userId) => {
    return await targetRepository.getUserTargets(userId);
};

const getTargetById = async (targetId, userId) => {
    return await targetRepository.getTargetById(targetId, userId);
};

const createTarget = async (userId, data) => {
    if (data.current_amount > data.target_amount) {
        throw new Error('Текущая сумма не может превышать целевую при создании');
    }
    return await targetRepository.createTarget(userId, data);
};

const updateTarget = async (targetId, userId, updates) => {
    const existingTarget = await targetRepository.getTargetById(targetId, userId);
    if (!existingTarget) {
        throw new Error('Цель не найдена');
    }

    const newCurrent = updates.current_amount !== undefined ? Number(updates.current_amount) : Number(existingTarget.current_amount);
    const newTarget = updates.target_amount !== undefined ? Number(updates.target_amount) : Number(existingTarget.target_amount);

    if (newCurrent > newTarget) {
        throw new Error(`Текущая сумма (${newCurrent} ₽) не может превышать целевую (${newTarget} ₽)`);
    }

    if (updates.target_amount !== undefined && newTarget < newCurrent) {
        throw new Error(`Целевая сумма (${newTarget} ₽) не может быть меньше уже накопленной (${newCurrent} ₽)`);
    }

    if (newCurrent >= newTarget) {
        updates.status = 'completed';
    } else {
        if (existingTarget.status === 'completed') {
            updates.status = 'active';
        }
    }
    return await targetRepository.updateTarget(targetId, userId, updates); 
};

const addAmount = async (targetId, userId, amount) => {
    const existingTarget = await targetRepository.getTargetById(targetId, userId);
    if (!existingTarget) {
        throw new Error('Цель для добавления суммы не найдена');
    }
    return await targetRepository.addAmount(targetId, amount);
};

const deleteTarget = async (targetId, userId) => {
    const existingTarget = await targetRepository.getTargetById(targetId, userId);
    if (!existingTarget) {
        throw new Error('Цель не найдена');
    }
    return await targetRepository.deleteTarget(targetId, userId);
};

module.exports = {
    getTargets,
    getTargetById,
    createTarget,
    updateTarget,
    addAmount,
    deleteTarget
};

