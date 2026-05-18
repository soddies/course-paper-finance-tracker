const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/authRoutes')
const transactionRoutes = require('./routers/transactionRoutes');
const categoryRoutes = require('./routers/categoryRoutes');
const analyticsRouter = require('./routers/analyticsRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/analytics', analyticsRouter);

app.get('/health', (req, res) => {
    res.json({status: 'OK'});
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});

module.exports = app;