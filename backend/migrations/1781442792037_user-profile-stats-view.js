exports.up = (pgm) => {
    pgm.createView('user_profile_stats', {
        replace: true
    }, `
        SELECT 
            u.id AS user_id,
            COUNT(t.id) AS total_transactions,
            COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
            COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expense,
            COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) - 
            COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS balance,
            COUNT(DISTINCT tr.id) AS active_targets,
            COUNT(DISTINCT CASE WHEN tr.status = 'completed' THEN tr.id END) AS completed_targets
        FROM users u
        LEFT JOIN transactions t ON u.id = t.user_id
        LEFT JOIN targets tr ON u.id = tr.user_id
        GROUP BY u.id
    `);
};

exports.down = (pgm) => {
    pgm.dropView('user_profile_stats');
};