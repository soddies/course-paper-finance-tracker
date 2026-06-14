const pool = require('../config/database');

const getUserById = async (userId) => {
    const result = await pool.query(
        `select id, email, nickname, role, is_banned, ban_reason, banned_at from users where id = $1`, [userId]
    );
    return result.rows[0];
}

const getAllUsers = async () => {
    const result = await pool.query(
        `select id, email, nickname, role, is_banned, ban_reason, banned_at, created_at from users order by created_at desc`
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

const banUser = async (userId, adminId, reason = null) => {
    const result = await pool.query(
        `update users set is_banned = true,
        ban_reason = $1,
        banned_at = now(),
        banned_by = $2 where id = $3 returning id, email, nickname, role, is_banned, ban_reason, banned_at`, [reason, adminId, userId]
    );
    return result.rows[0];
}

const unbanUser = async (userId) => {
    const result = await pool.query(
        `update users set is_banned = false, 
        ban_reason = null,
        banned_at = null,
        banned_by = null where id = $1 returning id, email, nickname, role, is_banned`, [userId]
    );
    return result.rows[0];
}

const getSystemStats = async () => {
    const usersStats = await pool.query(
        `select count(*)::int as total, count(*) filter (where created_at > now() - interval '30 days')::int as new_this_month,
        count(*) filter (where role = 'admin')::int as admins from users`
    );

    const transactionsStats = await pool.query(
        `select count(*)::int as total,
        count(*) filter (where transaction_date >= current_date)::int as today,
        coalesce(sum(case when type = 'income' then amount else 0 end), 0)::float as total_income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0)::float as total_expense from transactions`
    );

    const targetsStats = await pool.query(
        `select count(*)::int as total, count(*) filter (where status = 'completed')::int as completed,
        coalesce(sum(current_amount), 0)::float as total_saved from targets`
    );

    const categoriesStats = await pool.query(
        `select count(*) filter (where is_system = true)::int as system, count(*) filter (where is_system = false)::int as user_created from categories`
    );

    return {
        users: usersStats.rows[0],
        transactions: transactionsStats.rows[0],
        targets: targetsStats.rows[0],
        categories: categoriesStats.rows[0]
    };
};

module.exports = {
    getUserById,
    getAllUsers,
    updateRole,
    deleteUser,
    getSystemStats,
    banUser,
    unbanUser
};