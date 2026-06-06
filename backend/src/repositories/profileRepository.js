const pool = require('../config/database');

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `select id, email from users where email = $1`, [email.toLowerCase()]
    );
    return result.rows[0];
};

const updateUserEmail = async (userId, email) => {
    const result = await pool.query(
        `update users set email = $1 where id = $2 returning email`, [email.toLowerCase(), userId]
    );
    return result.rows[0];
};

const updateUserPassword = async (userId, passwordHash) => {
    await pool.query(
        `update users set password_hash = $1 where id = $2`, [passwordHash, userId]
    );
    return true;
};

const getUserById = async (userId) => {
    const result = await pool.query(
        `select id, email, password_hash, created_at from users where id = $1`,
        [userId]
    );
    return result.rows[0];
}

const getUserStats = async (userId) => {
    const result = await pool.query(
        `select * from user_profile_stats where user_id = $1`,
        [userId]
    );
    return result.rows[0];
};

module.exports = {
    getUserStats,
    findUserByEmail,
    updateUserEmail,
    updateUserPassword,
    getUserById
};