const {z} = require('zod');
const { containsProfanity } = require('../utils/profanityFilter');

const registerSchema = z.object({
    email: z.string().email('Некорректный формат email').max(100, 'Слишком длинный email'),
    nickname: z.string().min(5, 'Ник должен быть минимум 5 символов').max(20, 'Слишком длинный ник').regex(/^[a-zA-Zа-яА-Я0-9_]+$/, 'Никнейм может содержать только буквы, цифры и _')
        .refine((val, ctx) => {
            if (containsProfanity(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Никнейм содержит недопустимые слова'
                });
                return false;
            }
            return true;
        }),
    password: z.string()
        .min(8, 'Пароль должен быть не менее 8 символов')
        .max(50, 'Пароль слишком длинный')
});

const loginSchema = z.object({
    email: z.string().email('Некорректный формат email'),
    password: z.string().min(1, 'Пароль обязателен')
});

module.exports = {
    registerSchema,
    loginSchema
};

