const transactionService = require('../services/transactionService');
const {toTransactionResponse, toTransactionListResponse} = require('../DTO/transactionsDto');
 
const createTransaction = async (req, res) => {
    try {
        const {type, amount, categoryId, description, transactionDate} = req.body;
        const userId = req.user.userId;

        const transaction = await transactionService.createTransaction(userId, type, amount, categoryId, description, transactionDate ? new Date(transactionDate) : new Date());

        res.status(201).json({
            message: 'Транзакция создана',
            transaction: toTransactionResponse(transaction)
        });
    } catch (error) {
        console.error('Create transaction error: ', error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
};

const getTransactions = async (req, res) => {
    try {
        const filters = req.query;
        const userId = req.user.userId;

        const transactions = await transactionService.getUserTransactions(userId, filters);

        res.status(200).json({
            count: transactions.length,
            transactions: toTransactionListResponse(transactions)
        });
    } catch (error) {
        console.error('Get transaction error: ', error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
};

const getTransactionById = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId;
        const transaction = await transactionService.getTransactionsById(id, userId);

        if (!transaction) {
            return res.status(404).json({message: "Транзакция не найдена"});
        }
        res.status(200).json({
            transaction: toTransactionResponse(transaction)
        });
    } catch (error) {
        console.error('Get transactions by ID error: ', error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
};

const updateTransaction = async (req, res) => {
    try {
        const {id} = req.params;
        const {type, amount, categoryId, description, transactionDate} = req.body;
        const userId = req.user.userId;

        const transaction = await transactionService.updateTransaction(
            id,
            userId,
            {
                type,
                amount,
                categoryId,
                description,
                transactionDate: transactionDate ? new Date(transactionDate) : undefined
            }
        );

        if (!transaction) {
            return res.status(400).json({error: 'Транзакция не найдена'});
        }

        res.status(200).json({
            message: 'Транзакция обновлена',
            transaction: toTransactionResponse(transaction)
        });
    } catch (error) {
        console.error('Update error message: ', error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.userId;

        await transactionService.deleteTransaction(id, userId);

        res.status(200).json({message: 'Транзакция удалена'});
    } catch (error) {
        console.error('Delete error message: ', error);
        res.status(500).json({message: 'Ошибка сервера'});
    }
};



module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
}