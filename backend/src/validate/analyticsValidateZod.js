const {z} = require('zod');

const analyticsQuerySchema = z.object({
    period: z.enum(['month', 'year']).default('month'),

    month: z.preprocess(
        val => {
            if (val === undefined || val === null) {
                return new Date().getMonth();
            }
            return parseInt(val, 10);
        },
        z.number().int().min(0).max(11).optional()
    ).optional(),

    year: z.preprocess(
        val => {
            if (val === undefined || val === null) {
                return new Date().getFullYear();
            }
            return parseInt(val, 10);
        },
        z.number().int().min(2000).max(2100).optional()
    ).optional()
});

module.exports = {
    analyticsQuerySchema
};