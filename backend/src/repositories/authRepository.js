const pool = require('../config/database');

const searchByEmail = async (email) => {
    const result = await pool.query(
        'select id, email, password_hash from users where email = $1',
        [email]
    );
    return result.rows[0];
}

const createUser = async (email, passwordHash) => {
    const result = await pool.query(
        'insert into users (email, password_hash) values ($1, $2) returning id, email',
        [email, passwordHash]
    );
    return result.rows[0];
}

const getUserById = async (userId) => {
    const result = await pool.query(
        `select id, email, created_at from users where id = $1`,
        [userId]
    );
    return result.rows[0];
}

module.exports = {
    searchByEmail,
    createUser,
    getUserById
};