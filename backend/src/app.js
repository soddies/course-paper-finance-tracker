const express = require('express');
const cors = require('cors');
const authRouter = require('./routers/authRoutes')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/health', (req, res) => {
    res.json({status: 'OK'});
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});

module.exports = app;