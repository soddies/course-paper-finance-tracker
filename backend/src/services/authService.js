const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

const registerUser = async (email, password) => {
    const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1', // проверка на существование пользователя
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error('Пользователь с таким Email уже есть!');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, passwordHash]
    );
    return result.rows[0];
};

const loginUser = async (email, password) => {
    const result = await pool.query(
        'SELECT id, email, password_hash FROM users WHERE email = $1',
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error('Неверный Email или пароль');
    }

    const user = result.rows[0];

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