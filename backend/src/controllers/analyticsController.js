const { analyticsQuerySchema } = require('../models/analyticsModel');
const analyticsService = require('../services/analyticsService');

const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId;

        const validated = analyticsQuerySchema.parse(req.query);
        
        const data = await analyticsService.getAnalytics(userId, validated.period, validated.month, validated.year);
        res.status(200).json(data);
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Ошибка валидации',
                details: error.issues.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        console.error('Analytics Error: ', error);
        res.status(500).json({error: 'Ошибка при получении аналитики'});
    }
};

module.exports = {getAnalytics};