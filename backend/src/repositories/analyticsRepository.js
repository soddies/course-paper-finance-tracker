const pool = require('../config/database');

const getTotals = async (userId, startDate, endDate) => {
    const query = `
        select coalesce(sum(case when type = 'income' then amount else 0 end), 0) as total_income,
            coalesce(sum(case when type = 'expense' then amount else 0 end), 0) as total_expense,
            count(case when type = 'income' then 1 end) as income_count,
            count(case when type = 'expense' then 1 end) as expense_count
        from transactions 
        where user_id = $1 
            AND transaction_date >= $2 
            AND transaction_date <= $3
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows[0];
};

const getPeriodStats = async (userId, startDate, endDate, timeUnit) => {
    const query = `
        select 
            extract(${timeUnit} from transaction_date) as period_unit,
            type,
            sum(amount) as amount
        from transactions 
        where user_id = $1 
            and transaction_date >= $2 
            and transaction_date <= $3
        group by period_unit, type
        order by period_unit
    `;

    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
};

module.exports = {
    getTotals,
    getPeriodStats
};