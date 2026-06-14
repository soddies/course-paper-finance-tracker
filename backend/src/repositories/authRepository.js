const pool = require('../config/database');

const searchByEmail = async (email) => {
    const result = await pool.query(
        'select id, email, password_hash, nickname, role, is_banned, ban_reason from users where email = $1',
        [email]
    );
    return result.rows[0];
}

const searchByNickname = async (nickname) => {
    const result = await pool.query(
        `select id, nickname from users where nickname = $1`, [nickname]
    );
    return result.rows[0];
}

const createUser = async (email, nickname, passwordHash) => {
    const result = await pool.query(
        'insert into users (email, nickname, password_hash) values ($1, $2, $3) returning id, email, nickname',
        [email, nickname, passwordHash]
    );
    return result.rows[0];
}

const getUserById = async (userId) => {
    const result = await pool.query(
        `select id, email, nickname, created_at, role, is_banned, ban_reason, created_at from users where id = $1`,
        [userId]
    );
    return result.rows[0];
}

module.exports = {
    searchByEmail,
    createUser,
    searchByNickname,
    getUserById
};