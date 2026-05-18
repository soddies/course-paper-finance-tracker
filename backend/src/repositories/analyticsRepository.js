const pool = require('../config/database');

const getTotals = async (userId, startDate, endDate) => {
    const query = `
        SELECT 
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
            COUNT(CASE WHEN type = 'income' THEN 1 END) as income_count,
            COUNT(CASE WHEN type = 'expense' THEN 1 END) as expense_count
        FROM transactions 
        WHERE user_id = $1 
            AND transaction_date >= $2 
            AND transaction_date <= $3
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows[0];
};

const getPeriodStats = async (userId, startDate, endDate, timeUnit) => {
    const query = `
        SELECT 
            EXTRACT(${timeUnit} FROM transaction_date) as period_unit,
            type,
            SUM(amount) as amount
        FROM transactions 
        WHERE user_id = $1 
            AND transaction_date >= $2 
            AND transaction_date <= $3
        GROUP BY period_unit, type
        ORDER BY period_unit
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
};

module.exports = {
    getTotals,
    getPeriodStats
};