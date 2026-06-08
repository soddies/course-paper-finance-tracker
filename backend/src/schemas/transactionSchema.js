const {z} = require('zod');
const {containsProfanity} = require('../utils/profanityFilter');

const createTransactionSchema = z.object({
    type: z.enum(['income', 'expense'], {
        error: 'Тип должен быть income или expense'
    }),
    
    amount: z.union([
        z.string().regex(/^\d+\.?\d*$/, 'Сумма должна быть числом!'),
        z.number().positive('Сумма должна быть больше 0')
    ]).transform(val => parseFloat(val)),

    categoryId: z.union([z.string().regex(/^\d+$/).transform(val => parseInt(val)),
        z.number().int().positive(),
        z.null(),
        z.undefined()
    ]).optional().nullable(),

    description: z.string().max(500, 'Описание слишком длинное').optional()
        .refine(
            (val) => !containsProfanity(val), {
                message: 'Описание содержит недопустимые слова'
            } 
        ),

    transactionDate: z.union([
        z.string().datetime({message: 'Неверный формат даты'}),
        z.date()
    ]).optional().nullable()
});

const updateTransactionSchema = createTransactionSchema.partial();

const filterTransactionsSchema = z.object({
    type: z.enum(['income', 'expense', 'all']).optional().nullable().default('all'),
    categoryId: z.string().optional().nullable().default('all'),
    search: z.string().optional().nullable().default(''),
    dateFrom: z.string().date().optional().nullable(),
    dateTo: z.string().date().optional().nullable(),
    sortBy: z.enum(['date', 'amount', 'category']).default('date'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    limit: z.preprocess(
        val => {
            if (!val || val === '' || val === 'undefined' || val === 'null') return 50;
            const num = parseInt(val, 10);
            return isNaN(num) ? 50 : num;
        },
        z.number().int().positive().max(100).default(50)
    ),
    offset: z.preprocess(
        val => {
            if (!val || val === '' || val === 'undefined' || val === 'null') return 0;
            const num = parseInt(val, 10);
            return isNaN(num) ? 0 : num;
        },
        z.number().int().nonnegative().default(0)
    )
});

const transactionIdSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(val => parseInt(val))
});

module.exports = {
    createTransactionSchema,
    updateTransactionSchema,
    filterTransactionsSchema,
    transactionIdSchema
};