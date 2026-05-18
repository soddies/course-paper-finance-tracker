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
    const {
        type,
        categoryId,
        search,
        dateFrom,
        dateTo,
        sortBy = 'date',
        sortOrder = 'desc',
        limit = 50,
        offset = 0
    } = filters;

    let query = `
        select t.id, t.type, t.amount, t.description, t.transaction_date, t.category_id, c.name as category_name, c.icon as category_icon from transactions t
        left join categories c on c.id = t.category_id where t.user_id = $1
    `;
    const queryParams = [userId];
    let paramIndex = 2;

    if (type && type !== 'all') {
        query += ` and t.type = $${paramIndex}`;
        queryParams.push(type);
        paramIndex++;
    }

    if (categoryId && categoryId !== 'all') {
        query += ` and t.category_id = $${paramIndex}`;
        queryParams.push(categoryId);
        paramIndex++;
    }

    if (search && search.trim()) {
        query += `and (t.description ilike $${paramIndex} or c.name ilike $${paramIndex})`;
        queryParams.push(`%${search.trim()}%`);
        paramIndex++;
    }

    if (dateFrom) {
        query += ` and t.transaction_date >= $${paramIndex}`;
        queryParams.push(new Date(dateFrom));
        paramIndex++;
    }

    if (dateTo) {
        const dateToEnd = new Date(dateTo);
        dateToEnd.setHours(23, 59, 59, 999);
        query += ` and t.transaction_date <= $${paramIndex}`;
        queryParams.push(dateToEnd);
        paramIndex++;
    }

    const validSortField = {
        'date': 't.transaction_date',
        'amount': 't.amount',
        'category': 'c.name'
    };

    const sortField = validSortField[sortBy] || 't.transaction_date';
    const order = sortOrder === 'asc' ? 'asc' : 'desc';

    query += ` order by ${sortField} ${order}`;

    query += ` limit $${paramIndex} offset $${paramIndex + 1}`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, queryParams);
    return result.rows;
};

const getTransactionsById = async (transactionId, userId) => {
    const result = await pool.query(
        'select * from transactions whеre id = $1 and user_id = $2',
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
    getTransactionsById,
    updateTransaction,
    deleteTransaction
};