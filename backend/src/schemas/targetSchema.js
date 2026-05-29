const {z} = require('zod');

const createTargetSchema = z.object({
    name: z.string().min(1, 'Название обязательно').max(50, 'Слишком длинное название').trim(),
    target_amount: z.number().positive('Сумма должна быть положительной'),
    current_amount: z.number().min(0, 'Текущая сумма не может быть отрицательной').default(0),
    deadline: z.string().nullable().optional(),
    icon: z.string().default('target')
});

const updateTargetSchema = z.object({
    name: z.string().min(1).max(50).trim().optional(),
    target_amount: z.number().positive().optional(),
    current_amount: z.number().min(0).optional(),
    deadline: z.string().nullable().optional(),
    icon: z.string().optional(),
    status: z.enum(['active', 'paused', 'completed']).optional()
});

const addAmountSchema = z.object({
    amount: z.number().positive('Вносимая сумма должна быть положительной')
});

module.exports = {
    createTargetSchema,
    updateTargetSchema,
    addAmountSchema
};