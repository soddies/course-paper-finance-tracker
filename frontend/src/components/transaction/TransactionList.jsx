import React, { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import TransactionItem from './TransactionItem';
import { transactionAPI } from '../../api/transactions';

const TransactionList = ({ filters = {}, refreshTrigger, setLoading }) => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, [filters, refreshTrigger]);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const data = await transactionAPI.getTransactions(filters);
            setTransactions(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            if (setLoading) {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
            return;
        }

        try {
            await transactionAPI.deleteTransaction(id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
            alert('Ошибка при удалении: ' + err.message);
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTransaction(null);
    };

    const handleTransactionUpdated = () => {
        fetchTransactions();
        handleCloseEditModal();
    };

    if (loading) {
        return (
            <div className="transactions-loading">
                <p>Загрузка транзакций...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transactions-error">
                <p>{error}</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        const hasActiveFilters = Object.keys(filters).length > 0;
        return (
            <div className="transactions-empty">
                <h3>{hasActiveFilters ? "Ничего не найдено" : "Транзакций пока нет"}</h3>
                <p>{hasActiveFilters ? "Попробуйте изменить параметры поиска или сбросить фильтры" : "Добавьте первую операцию, чтобы увидеть её здесь"}</p>
            </div>
        );
    }

    return (
        <>
            <div className="transaction-list-container">
                {transactions.map(transaction => (
                    <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {isEditModalOpen && editingTransaction && (
                <TransactionModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    type={editingTransaction.type}
                    transaction={editingTransaction}
                    onTransactionUpdate={handleTransactionUpdated}
                />
            )}
        </>
    );
};

export default TransactionList;