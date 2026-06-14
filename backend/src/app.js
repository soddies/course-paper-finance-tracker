require('dotenv').config({ 
    path: __dirname + '/../.env' 
});
const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');

const authRouter = require('./routers/authRoutes');
const transactionRoutes = require('./routers/transactionRoutes');
const categoryRoutes = require('./routers/categoryRoutes');
const analyticsRouter = require('./routers/analyticsRoutes');
const dashboardRouter = require('./routers/dashboardRoutes');
const exportRouter = require('./routers/exportsRoutes');
const targetsRouter = require('./routers/targetsRoutes');
const profileRouter = require('./routers/profileRoutes');
const adminRouter = require('./routers/adminRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/export/', exportRouter);
app.use('/api/targets', targetsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/admin', adminRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

const runMigration = () => {
    try {
        console.log('Применение миграций БД...');
        
        execSync('npx node-pg-migrate up', {
            cwd: __dirname + '/..',  
            stdio: 'inherit',     
            env: {
                ...process.env,
                DATABASE_URL: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
            }
        });
        
        console.log('Миграции успешно применены');
    } catch (error) {
        console.error('Ошибка миграций:', error.message);
        process.exit(1);
    }
};

const startServer = async () => {
    runMigration();
    
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порте ${PORT}`);
    });
};

startServer();

module.exports = app;