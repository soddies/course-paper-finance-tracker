require('dotenv').config();
const { Pool } = require('pg');

console.log('DATABASE_URL:', process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
    const pool = new Pool({
        connectionString: String(process.env.DATABASE_URL)
    });

    pool.connect()
        .then(() => console.log('Подключение успешно!'))
        .catch(err => console.log(`Ошибка подключения: ${err.message}`));

    module.exports = pool;
} else {
    console.log('DATABASE_URL не найден, используем отдельные параметры');
    
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME || 'FinanceTrackerDB',
        user: process.env.DB_USER || 'postgres',
        password: String(process.env.DB_PASSWORD)
    });

    pool.connect()
        .then(() => console.log('Подключение успешно!'))
        .catch(err => console.log(`Ошибка подключения: ${err.message}`));

    module.exports = pool;
}