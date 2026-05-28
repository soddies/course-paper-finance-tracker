const pool = require('../config/database');

const getUserTargets = async (userId) => {
    const result = await pool.query(
        `select * from targets where user_id = $1
        order by created_at desc`, [userId]
    );
    return result.rows;
};

const getTargetById = async (targetId, userId) => {
    const result = await pool.query(
        `select * from targets where id = $1 and user_id = $2`,
        [targetId, userId]
    );
    return result.rows;
};

const createTarget = async (userId, {name, target_amount, current_amount, deadline, icon}) => {
    const result = await pool.query(
        `insert into targets (user_id, name, target_amount, current_amount, deadline, icon)
        values ($1, $2, $3, $4, $5, $6)
        returning *`,
        [userId, name, target_amount, current_amount, deadline || null, icon]
    );
    return result.rows[0];
};

const updateTarget = async (targetId, userId, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((fields, i) => `${fields} = $${i+1}`).join(', ');
    values.push(targetId);
    values.push(userId);

    const result = await pool.query(
        `update targets set ${setClause} where id = $${values.length - 1} and user_id = $${values.length} returning *`,
        values
    );
    return result.rows[0];
};

const addAmount = async (targetId, amount) => {
    const result = await pool.query(
        `update targets 
        set current_amount = current_amount + $1
        where id = $2
        returning *`,
        [amount, targetId]
    );
    return result.rows[0];
};

const deleteTarget = async (targetId, userId) => {
    const result = await pool.query(
        `delete from targets where id = $1 and user_id = $2
        returning id`,
        [targetId, userId]
    );
    return result.rows.length > 0;
};

module.exports = {
    getUserTargets,
    getTargetById,
    createTarget,
    updateTarget,
    addAmount,
    deleteTarget
};