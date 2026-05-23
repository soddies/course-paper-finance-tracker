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
        coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as expense,
        count(*) as count
        from transactions
        where user_id = $1
        and transaction_date >= $2
        and transaction_date < $3
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);
    return {
        income: parseFloat(result.rows[0].income || 0),
        expense: parseFloat(result.rows[0].expense || 0),
        count: parseInt(result.rows[0].count || 0)
    };
}

const getTodayStats = async (userId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return getPeriodStats(userId, startOfDay, endOfDay);   
}

const getWeekStats = async (userId) => {
    const now = new Date();
    const startOfWeek = new Date(now);

    const dayOfWeek = now.getDay();

    const diff = dayOfWeek === 0 ? -6 : (1 - dayOfWeek);

    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return getPeriodStats(userId, startOfWeek, endOfWeek);
}

const getMonthStats = async (userId) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return getPeriodStats(userId, startOfMonth, startOfNextMonth);
}

module.exports = {
    getTotalBalance,
    getPeriodStats,
    getWeekStats,
    getTodayStats,
    getMonthStats
};