const transactionRepository = require('../repositories/transactionRepository');
const targetRepository = require('../repositories/targetsRepository');

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

    async deleteTransaction(transactionId, userId) {
        const transaction = await transactionRepository.getTransactionById(transactionId, userId);
        if (!transaction) {
            throw new Error('Транзакция не найдена');
        }

        if (transaction.target_id) {
            const target = await targetRepository.getTargetById(transaction.target_id, userId);

            if (target) {
                const currentAmount = Number(target.current_amount);
                const targetAmount = Number(target.target_amount);
                const deleteAmount = Number(transaction.amount);
                const newTotal = Math.max(0, currentAmount - deleteAmount);

                const updates = {
                    current_amount: newTotal
                };

                if (target.status === 'completed' && newTotal < targetAmount) {
                    updates.status = 'active';
                }

                await targetRepository.updateTarget(transaction.target_id, userId, updates);
            }
        }

        await transactionRepository.deleteTransaction(transactionId, userId);

        return true;
    }
};

module.exports = transactionService;