const { z } = require('zod');

const updateEmailSchema = z.object({
    email: z.string().email('Некорректный формат email').max(100, 'Слишком длинный email').min(5, 'Email слишком короткий')
});

const updateNicknameSchema = z.object({
    nickname: z.string().min(5, 'Никнейм должен быть минимум 5 символов').max(20, 'Никнейм должен быть максимум 20 символов').regex(/^[a-zA-Zа-яА-Я0-9_]+$/, 'Никнейм может содержать только буквы, цифры и _')
});

const updatePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: z.string().min(8, 'Пароль должен быть не менее 8 символов').max(50, 'Пароль слишком длинный')
});

module.exports = {
    updateEmailSchema,
    updateNicknameSchema,
    updatePasswordSchema
};