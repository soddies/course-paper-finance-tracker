exports.up = (pgm) => {
    pgm.createTable('users', {
        id: { 
            type: 'serial', 
            primaryKey: true 
        },
        email: { 
            type: 'varchar(100)', 
            notNull: true, 
            unique: true 
        },
        nickname: { 
            type: 'varchar(20)', 
            unique: true 
        },
        password_hash: { 
            type: 'varchar(255)', 
            notNull: true 
        },
        role: { 
            type: 'varchar(10)', 
            default: 'user', 
            notNull: true,
            check: "role IN ('user', 'admin')"
        },
        is_banned: { 
            type: 'boolean', 
            default: false 
        },
        ban_reason: { 
            type: 'text' 
        },
        banned_at: { 
            type: 'timestamp' 
        },
        banned_by: { 
            type: 'integer', 
            references: 'users(id)' 
        },
        created_at: { 
            type: 'timestamp', 
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    });

    pgm.createTable('categories', {
        id: { 
            type: 'serial', 
            primaryKey: true 
        },
        name: { 
            type: 'varchar(50)', 
            notNull: true 
        },
        type: { 
            type: 'varchar(10)', 
            notNull: true,
            check: "type IN ('income', 'expense')"
        },
        icon: { 
            type: 'varchar(50)' 
        },
        is_system: { 
            type: 'boolean', 
            default: false 
        },
        user_id: { 
            type: 'integer', 
            references: 'users(id)', 
            onDelete: 'CASCADE' 
        },
        created_at: { 
            type: 'timestamp', 
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    });

    pgm.createTable('targets', {
        id: { 
            type: 'serial', 
            primaryKey: true 
        },
        user_id: { 
            type: 'integer', 
            notNull: true, 
            references: 'users(id)', 
            onDelete: 'CASCADE' 
        },
        name: { 
            type: 'varchar(100)', 
            notNull: true
        },
        target_amount: { 
            type: 'numeric(12, 2)', 
            notNull: true, 
            check: 'target_amount > 0' 
        },
        current_amount: { 
            type: 'numeric(12, 2)', 
            default: 0, 
            check: 'current_amount >= 0' 
        },
        deadline: { 
            type: 'date' 
        },
        icon: {
            type: 'varchar(50)', 
            default: 'target' 
        },
        status: { 
            type: 'varchar(10)', 
            default: 'active',
            check: "status IN ('active', 'paused', 'completed')"
        },
        created_at: { 
            type: 'timestamp', 
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    });

    pgm.createTable('transactions', {
        id: { 
            type: 'serial', 
            primaryKey: true 
        },
        user_id: { 
            type: 'integer', 
            notNull: true, 
            references: 'users(id)', 
            onDelete: 'CASCADE' 
        },
        type: { 
            type: 'varchar(10)', 
            notNull: true,
            check: "type IN ('income', 'expense')"
        },
        amount: { 
            type: 'numeric(12, 2)', 
            notNull: true, 
            check: 'amount > 0' 
        },
        category_id: { 
            type: 'integer', 
            references: 'categories(id)', 
            onDelete: 'SET NULL' 
        },
        target_id: { 
            type: 'integer', 
            references: 'targets(id)',
            onDelete: 'SET NULL' 
        },
        description: { 
            type: 'text'
        },
        transaction_date: { 
            type: 'timestamp', 
            default: pgm.func('CURRENT_TIMESTAMP')  
        },
        created_at: { 
            type: 'timestamp', 
            default: pgm.func('CURRENT_TIMESTAMP') 
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('transactions');
    pgm.dropTable('targets');
    pgm.dropTable('categories');
    pgm.dropTable('users');
};