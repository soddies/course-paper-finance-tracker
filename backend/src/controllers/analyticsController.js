const analyticsService = require('../services/analyticsService');

const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {period, month, year} = req.query;
        
        const data = await analyticsService.getAnalytics(userId, period, month, year);
        res.status(200).json(data);
    } catch (error) {
        console.error('Analytics Error: ', error);
        res.status(500).json({error: 'Ошибка при получении аналитики'});
    }
};

module.exports = {getAnalytics};