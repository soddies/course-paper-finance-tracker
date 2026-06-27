const pool = require('../config/database');

const getCategories = async (userId, type) => {
    let query = 'select * from categories where (is_system = true or user_id = $1)';
    const params = [userId];

    if (type) {
        query += ` and type = $2`;
        params.push(type);
    }

    query += ' order by is_system desc, name asc';

    const result = await pool.query(query, params);
    return result.rows;
};

const getCategoryStats = async (userId) => {
    const result = await pool.query(
        'select * from categories where is_system = true or user_id = $1',
        [userId]
    );

    const allCategories = result.rows;
    const total = allCategories.length;
    const myCount = allCategories.filter(c => !c.is_system).length;
    const systemCount = allCategories.filter(c => c.is_system).length;

    return {
        total,
        myCount,
        systemCount
    };
};

const createCategory = async (userId, name, type, icon) => {
    const result = await pool.query(
        'insert into categories (user_id, name, type, icon, is_system) values ($1, $2, $3, $4, false) returning *',
        [userId, name, type, icon || null]
    );
    return result.rows[0];
};

const getCategoryById = async (id, userId) => {
    const result = await pool.query(
        'select * from categories where id = $1 and (user_id = $2 or is_system = true)',
        [id, userId]
    );
    return result.rows[0];
} 

const getSystemCategoryByName = async (name) => {
    const result = await pool.query(
        `select id from categories where name = $1 and is_system = true limit 1`, [name]
    );
    return result.rows[0];
}

const deleteCategory = async (id) => {
    await pool.query('delete from categories where id = $1', [id]);
}

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    getCategoryStats,
    getCategoryById,
    getCategoryByName,
    getSystemCategoryByName
}