import React, { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import TransactionItem from './TransactionItem';

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
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Нет токена авторизации');
            }

            const queryParams = new URLSearchParams();
            if (filters.type && filters.type !== 'all') {
                queryParams.append('type', filters.type);
            }
            
            if (filters.categoryId && filters.categoryId !== 'all') {
                queryParams.append('categoryId', filters.categoryId);
            } 

            if (filters.search) {
                queryParams.append('search', filters.search);
            }

            if (filters.dateFrom) {
                queryParams.append('dateFrom', filters.dateFrom);
            }

            if (filters.dateTo) {
                queryParams.append('dateTo', filters.dateTo);
            }

            if (filters.sortBy) {
                queryParams.append('sortBy', filters.sortBy);
            }

            if (filters.sortOrder) {
                queryParams.append('sortOrder', filters.sortOrder);
            }

            const response = await fetch(
                `http://localhost:3000/api/transactions?${queryParams}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка загрузки');
            }

            const transactionsArray = Array.isArray(data) ? data : (data.transactions || []);
            setTransactions(transactionsArray);
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
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка удаления');
            }

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
                <p>{hasActiveFilters ? "Попробуйте изменить парамтры поиска или сбросить фильтры" : "Добавьте первую операцию, чтобы увидеть её здесь"}</p>
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