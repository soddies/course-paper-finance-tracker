const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authRepository = require('../repositories/authRepository');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const registerUser = async (email, password) => {
    
    const existingUser = await authRepository.searchByEmail(email);

    if (existingUser) {
        throw new Error('Пользователь с таким Email уже есть!');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return await authRepository.createUser(email, passwordHash);
};

const loginUser = async (email, password) => {
    const user = await authRepository.searchByEmail(email);

    if (!user) {
        throw new Error('Неверный логин или пароль');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
        throw new Error('Неверный Email или пароль');
    }

    const token = jwt.sign(
        {userId: user.id, email: user.email},
        JWT_SECRET,
        {expiresIn: '7d'}
    );

    return {
        user: {id: user.id, email: user.email},
        token
    };
};

module.exports = {
    registerUser,
    loginUser
};