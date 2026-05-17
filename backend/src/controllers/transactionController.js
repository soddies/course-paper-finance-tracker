const transactionService = require('../services/transactionService');

const createTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {type, amount, categoryId, description, transactionDate} = req.body;

        if (!type || !amount) {
            return res.status(400).json({error: 'Тип и сумма обязательны'});
        }

        if (type !== 'income' && type !== 'expense') {
            return res.status(400).json({error: 'Тип должен быть income или expense'});
        }
        
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({error: 'Сумма должна быть положительной'});
        }

        const transactions = await transactionService.createTransaction(
            userId,
            type, 
            parseFloat(amount),
            categoryId,
            description,
            transactionDate ? new Date(transactionDate) : new Date()
        );

        res.status(201).json({
            message: 'Транзакция создана',
            transactions
        });
    } catch (error) {
        console.error('Create transaction error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};


const getTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            type, 
            categoryId,
            search, 
            dateFrom, 
            dateTo,
            sortBy,
            sortOrder, 
            limit, 
            offset
        } = req.query;

        const filters = {
            type,
            categoryId: categoryId ? parseInt(categoryId) : undefined,
            search,
            dateFrom,
            dateTo,
            sortBy: sortBy || 'date',
            sortOrder: sortOrder || 'desc',
            limit: limit ? parseInt(limit) : 50,
            offset: offset ? parseInt(offset) : 0
        };

        const transactions = await transactionService.getUserTransactions(userId, filters);

        res.status(200).json({
            count: transactions.length,
            transactions
        });
    } catch (error) {
        console.error('Get transaction error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

const getTransactionById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;

        const transaction = await transactionService.getTransactionsById(parseInt(id), userId);

        if (!transaction) {
            return res.status(404).json({error: 'Транзакция не найдена'});
        }

        res.status(200).json({transaction});
    } catch (error) {
        console.error('Get transaction error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

const updateTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;
        const {type, amount, categoryId, description, transactionDate} = req.body;

        const transaction = await transactionService.updateTransaction(
            parseInt(id),
            userId,
            {
                type,
                amount: amount ? parseFloat(amount) : undefined,
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                description,
                transactionDate: transactionDate ? new Date(transactionDate) : undefined

            }
        );

        if (!transaction) {
            return res.status(404).json({error: "Транзакция не найдена"});
        }

        res.status(200).json({
            message: 'Транзакция обновлена',
            transaction
        });
    } catch (error) {
        console.error('Update transaction error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};


const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {id} = req.params;

        await transactionService.deleteTransaction(parseInt(id), userId);

        res.status(200).json({message: 'Транзакция удалена'});
    } catch (error) {
        console.error('Delete transaction error: ', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById, // получение транзакции по id
    updateTransaction,
    deleteTransaction
}