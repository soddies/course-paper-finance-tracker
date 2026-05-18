const transactionRepository = require('../repositories/transactionRepository');

const transactionService = {
    async createTransaction(userId, type, amount, categoryId, description, transactionDate) {
        if (amount <= 0) {
            throw new Error('Сумма должна быть положительной!');
        }

        if (type !== 'income' && type !== 'expense') {
            throw new Error('Неверный тип транзакции');
        }

        return await transactionRepository.createTransaction(userId, type, amount, categoryId, description, transactionDate);
    },

    async getUserTransactions(userId, filters) {
        return await transactionRepository.getUserTransactions(userId, filters);
    },

    async getTransactionsById(id, userId) {
        return await transactionRepository.getTransactionsById(id, userId);
    },

    async updateTransaction(id, userId, updates) {
        if (updates.amount && updates.amount <= 0) {
            throw new Error('Сумма должна быть положительной');
        }

        return await transactionRepository.updateTransaction(id, userId, updates);
    },

    async deleteTransaction(id, userId) {
        return await transactionRepository.deleteTransaction(id, userId);
    }
};

module.exports = transactionService;