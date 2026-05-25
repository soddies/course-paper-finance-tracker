const pool = require('../config/database');

const getFilteredTransactionsCSV = async (userId, filters = {}) => {
    const params = [userId];
    let query = `
        select t.id, t.type, t.amount, t.description, t.transaction_date, c.name as category_name
        from transactions t
        left join categories c on t.category_id = c.id
        where t.user_id = $1
    `;
    let paramIndex = 2;

    if (filters.type && filters.type !== 'all') {
        query += ` and t.type = $${paramIndex}`;
        params.push(filters.type);
        paramIndex++;
    }

    if (filters.categoryId && filters.categoryId !== 'all') {
        query += ` and t.category_id = $${paramIndex}`;
        params.push(filters.categoryId);
        paramIndex++
    }

    if (filters.dateFrom) {
        query += ` and t.transaction_date >= $${paramIndex}`;
        params.push(filters.dateFrom);
        paramIndex++
    }

    if (filters.dateTo) {
        query += ` and t.transaction_date <= $${paramIndex}`;
        params.push(filters.dateTo);
        paramIndex++
    }

    if (filters.search) {
        query += ` and t.description ilike $${paramIndex} or c.name ilike $${paramIndex}`;
        params.push(`%${filters.search}%`);
        paramIndex++;
    }

    if (filters.sortBy && filters.sortOrder) {
        const allowedSortBy = ['transaction_date', 'amount', 'type'];
        const allowedSortOrder = ['asc', 'desc'];

        if (allowedSortBy.includes(filters.sortBy) && allowedSortOrder.includes(filters.sortOrder)) {
            query += ` order by t.${filters.sortBy} ${filters.sortOrder.toUpperCase()}`;
        } else {
            query += ` order by t.transaction_date desc`;
        }
    } else {
        query += ` order by t.transaction_date desc`;
    }

    const result = await pool.query(query, params);
    return result.rows;
};

module.exports = {
    getFilteredTransactionsCSV
};