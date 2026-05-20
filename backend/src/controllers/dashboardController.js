const dashboardService = require('../services/dashboardService');

const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const data = await dashboardService.getSummary(userId);
        res.status(200).json(data);
    } catch (error) {
        console.error('Dashboard error: ', error);
        res.status(500).json({error: 'Ошибка загрузки данных'});
    }
};

module.exports = {getDashboardSummary};