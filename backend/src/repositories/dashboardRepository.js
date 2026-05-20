const pool = require('../config/database');

const getTotalBalance = async (userId) => {
    const query = `
        select coalesce(sum(case when type = 'income' then amount else 0 end), 0) - 
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as balance 
        from transactions
        where user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return parseFloat(result.rows[0].balance || 0);
}

const getPeriodStats = async (userId, startDate, endDate) => {
    const query = `
        select coalesce(sum(case when type = 'income' then amount else 0 end), 0) as income,
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense
        from transactions
        where user_id = $1
        and transaction_date >= $2
        and transaction_date < $3
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);
    return {
        income: parseFloat(result.rows[0].income || 0),
        expense: parseFloat(result.rows[0].expense || 0)
    };
}

const getTransactionCount = async (userId, startDate, endDate) => {
    const query = `
        select count(*) as count
        from transactions
        where user_id = $1
        and transaction_date >= $2
        and transaction_date < $3
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);
    return parseInt(result.rows[0].count || 0);
}

module.exports = {
    getTotalBalance,
    getPeriodStats,
    getTransactionCount
};