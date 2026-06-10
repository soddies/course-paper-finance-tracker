const pool = require('../config/database');

const getUserById = async (userId) => {
    const result = await pool.query(
        `select id, email, nickname, role from users where id = $1`, [userId]
    );
    return result.rows[0];
}

const getAllUsers = async () => {
    const result = await pool.query(
        `select id, email, nickname, role, created_at from users order by created_at desc`
    );
    return result.rows;
}

const updateRole = async (userId, role) => {
    const result = await pool.query(
        `update users set role = $1 where id = $2 returning id, email, nickname, role`, [role, userId]
    );
    return result.rows[0];
}

const deleteUser = async (userId) => {
    const result = await pool.query(
        `delete from users where id = $1 returning id`, [userId]
    );
    return result.rows.length > 0;
}

module.exports = {
    getUserById,
    getAllUsers,
    updateRole,
    deleteUser
};