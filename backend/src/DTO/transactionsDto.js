const toTransactionResponse = (transaction) => {
    if (!transaction) {
        return null;
    }

    return {
        id: transaction.id,
        type: transaction.type,
        amount: parseFloat(transaction.amount),
        description: transaction.description || null,
        categoryId: transaction.category_id,
        categoryName: transaction.category_name || null,
        categoryIcon: transaction.category_icon || null,
        targetId: transaction.target_id || null,
        targetName: transaction.target_name || null,
        transactionDate: transaction.transaction_date
    };
};

const toTransactionListResponse = (transaction) => {
    if (!transaction || !Array.isArray(transaction)) {
        return [];
    }

    return transaction.map(toTransactionResponse);  
};

module.exports = {
    toTransactionResponse,
    toTransactionListResponse
};