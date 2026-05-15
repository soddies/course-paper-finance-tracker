const pool = require('../config/database')

const createTransaction = async (userId, type, amount, categoryId, description, transactionDate) => {
    const result = await pool.query(
        `insert into transactions (user_id, type, amount, category_id, description, transaction_date)
        values ($1, $2, $3, $4, $5, $6)
        returning *`,
        [userId, type, amount, categoryId || null, description, transactionDate || new Date()]
    );
    return result.rows[0];
};

const getUserTransactions = async (userId, filters = {}) => {
    let query = 'select t.*, c.name as category_name, c.icon as category_icon from transactions t left join categories c on t.category_id = c.id where t.user_id = $1';
    const params = [userId];
    let paramCount = 1;

    if (filters.type) {
        paramCount++;
        query += ` and t.type = $${paramCount}`;
        params.push(filters.type);
    }

    if (filters.categoryId) {
        paramCount++;
        query += ` and t.category_id = $${paramCount}`;
        params.push(filters.categoryId);
    }

    if (filters.dateFrom) {
        paramCount++;
        query += ` and t.transaction_date >= $${paramCount}`;
        params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
        paramCount++;
        query += ` and t.transaction_date <= $${paramCount}`;
        params.push(filters.dateTo);
    }

    query += ` order by t.transaction_date desc`;

    if (filters.limit) {
        paramCount++;
        query += ` limit $${paramCount}`;
        params.push(filters.limit);
    }

    if (filters.offset) {
        paramCount++;
        query += ` offset $${paramCount}`;
        params.push(filters.offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
};

const getTransactionsId = async (transactionId, userId) => {
    const result = await pool.query(
        'select * from transactions whre id = $1 and user_id = $2',
        [transactionId, userId]
    );
    return result.rows[0];    
};

const updateTransaction = async (transactionId, userId, updates) => {
    const {type, amount, categoryId, description, transactionDate} = updates;

    const result = await pool.query(
        `update transactions
        set type = coalesce($1, type),
            amount = coalesce($2, amount),
            category_id = coalesce($3, category_id),
            description = coalesce($4, description),
            transaction_date = coalesce($5, transaction_date)
        where id = $6 and user_id = $7
        returning *`,
        [type, amount, categoryId, description, transactionDate, transactionId, userId]
    );
    return result.rows[0];
};

const deleteTransaction = async (transactionId, userId) => {
    await pool.query(
        'delete from transactions where id = $1 and user_id = $2',
        [transactionId, userId]
    );
};

module.exports = {
    createTransaction,
    getUserTransactions,
    getTransactionsId,
    updateTransaction,
    deleteTransaction
};