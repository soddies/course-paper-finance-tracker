const targetService = require('../services/targetsService');
const {toTargetResponse, toTargetListResponse} = require('../DTO/targetDto');

const getTargets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const targets = await targetService.getTargets(userId);
        res.status(200).json(toTargetListResponse(targets));
    } catch (error) {
        console.error('Get targets error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

const createTarget = async (req, res) => {
    try {
        const userId = req.user.userId;
        const targetData = req.body;

        const newTarget = await targetService.createTarget(userId, targetData);
        res.status(201).json(toTargetResponse(newTarget));
    } catch (error) {
        console.error('Create target error: ', error);
        res.status(500).json({error: error.message});
    }
};

const updateTarget = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId;
        const updates = req.body;

        const targetId = parseInt(id);
        const updatedTarget = await targetService.updateTarget(targetId, userId, updates);
        res.status(200).json(toTargetResponse(updatedTarget));
    } catch (error) {
        console.error('Update target error: ', error);
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({error: 'Цель не найдена'});
        }
        res.status(400).json({error: error.message});
    }
};

const addAmount = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId;
        const {amount} = req.body;

        const updatedTarget = await targetService.addAmount(parseInt(id), userId, amount);
        if (!updatedTarget) {
            return res.status(404).json({error: 'Цель не найдена'});
        }
        res.status(200).json(toTargetResponse(updatedTarget));
    } catch (error) {
        console.error('Add amount error: ', error);
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({error: 'Цель не найдена'});
        }
        res.status(400).json({error: error.message});
    }
};

const togglePause = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId;
        const {status} = req.body;

        const targetId = parseInt(id);

        if (!status || !['active', 'paused'].includes(status)) {
            return res.status(400).json({error: 'Некорретный статус'});
        }

        const updatedTarget = await targetService.updateTarget(targetId, userId, {status});
        if (!updatedTarget) {
            return res.status(404).json({error: 'Цель не найдена'});
        }

        res.status(200).json(toTargetResponse(updatedTarget));
    } catch (error) {
        console.error('Toggle pause error: ', error);
        res.status(400).json({error: error.message});
    }
}

const deleteTarget = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId;

        const delTarget = await targetService.deleteTarget(parseInt(id), userId);
        res.status(200).json(delTarget);
    } catch (error) {
        console.error('Delete target error: ', error);
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({error: 'Цель не найдена'});
        }
        res.status(400).json({error: error.message});
    }
};

module.exports = {
    getTargets,
    createTarget,
    updateTarget,
    addAmount,
    togglePause,
    deleteTarget
};

