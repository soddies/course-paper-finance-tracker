const targetRepository = require('../repositories/targetsRepository');

const getTargets = async (userId) => {
    return await targetRepository.getUserTargets(userId);
};

const getTargetsById = async (targetId, userId) => {
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

    if (updates.current_amount !== undefined) {
        const newCurrent = Number(updates.current_amount);
        const targetAmount = Number(existingTarget.target_amount);
        
        if (newCurrent > targetAmount) {
            throw new Error(`Текущая сумма (${newCurrent} ₽) не может превышать целевую (${targetAmount} ₽)`);
        }
    }

    if (updates.target_amount !== undefined) {
        const newTarget = Number(updates.target_amount);
        const current = Number(existingTarget.current_amount);
        
        if (newTarget < current) {
            throw new Error(`Целевая сумма (${newTarget} ₽) не может быть меньше уже накопленной (${current} ₽)`);
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
    getTargetsById,
    createTarget,
    updateTarget,
    addAmount,
    deleteTarget
};

