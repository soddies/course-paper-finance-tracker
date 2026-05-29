const {z} = require("zod");

const createCategorySchema = z.object({
    name: z.string().min(1, 'Название категории обязательно').max(50, 'Название не более 50 симвлов').trim(),
    type: z.enum(['income', 'expense'], {
        error: 'Тип должен быть income или expense'
    }),
    icon: z.string().optional().nullable()
});

const filterCategoriesSchema = z.object({
    type: z.enum(['income', 'expense', 'all']).optional(),
});

const categoryIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID должен быть числом').transform(val => parseInt(val))
});

module.exports = {
    createCategorySchema,
    filterCategoriesSchema,
    categoryIdSchema
};