const {z} = require('zod');

const registerSchema = z.object({
    email: z.string().email('Некорректный формат email').max(100, 'Слишком длинный email'),
    password: z.string().min(8, 'Пароль должен быть не менее 8 символов').max(50, 'Пароль слишком длинный')
});

const loginSchema = z.object({
    email: z.string().email('Некорректный формат email'),
    password: z.string().min(1, 'Пароль обязателен')
});

module.exports = {
    registerSchema,
    loginSchema
};

