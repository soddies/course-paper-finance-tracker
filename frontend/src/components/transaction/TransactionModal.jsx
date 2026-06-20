import React, { useState, useEffect } from 'react';
import { useProfanityCheck } from '../../hooks/useProfanityCheck';
import { categoriesFilterAPI } from '../../api/categories/categoriesFilterApi';
import { transactionAPI } from '../../api/transactions';

const TransactionModal = ({ isOpen, onClose, type, transaction, onTransactionUpdate }) => {
    const isEditing = !!transaction;

    const { profanityError, checkText, clearError } = useProfanityCheck();

    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        date: new Date().toISOString().slice(0, 16),
        description: ''
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formatForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (!isOpen) return;

        const fetchCategories = async () => {
            try {
                const data = await categoriesFilterAPI.getTypeCategories(type);
                setCategories(data);
            } catch (err) {
                console.error('Ошибка загрузки категорий: ', err);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [isOpen, type]);

    useEffect(() => {
        setError('');
        clearError();
        
        if (isEditing && transaction) {
            setFormData({
                category: transaction.category_id || '',
                amount: transaction.amount || '',
                date: transaction.transaction_date 
                    ? formatForInput(transaction.transaction_date) 
                    : formatForInput(new Date().toISOString()),
                description: transaction.description || ''
            });
            if (transaction.description) {
                checkText(transaction.description, 'Описание');
            }
        } else if (!isEditing) {
            setFormData({
                category: '',
                amount: '',
                date: formatForInput(new Date().toISOString()),
                description: ''
            });
        }
    }, [isEditing, transaction, isOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!checkText(formData.description, 'Описание')) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                type: type,
                amount: parseFloat(formData.amount),
                categoryId: formData.category ? parseInt(formData.category) : null,
                description: formData.description,
                transactionDate: new Date(formData.date).toISOString()
            };

            if (isEditing) {
                await transactionAPI.updateTransaction(transaction.id, payload);
            } else {
                await transactionAPI.createTransaction(payload);
            }

            if (onTransactionUpdate) {
                onTransactionUpdate();
            }

            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'description') {
            checkText(value, 'Описание');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className='modal-title'>
                        {isEditing ? `Редактировать ${type === 'income' ? 'доход' : 'расход'}`
                            : `Добавить ${type === 'income' ? 'доход' : 'расход'}`}
                    </h2>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {profanityError && (
                    <div className="alert alert-error">
                        {profanityError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="transaction-form-group">
                        <label className="transaction-label">Категория *</label>
                        {loadingCategories ? (
                            <p style={{ color: '#999' }}>Загрузка категорий...</p>
                        ) : (
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className='transaction-select'
                                required
                            >
                                <option value="" disabled>Выберите категорию</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="transaction-form-group">
                        <label className="transaction-label">Сумма *</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className='transaction-input'
                            required
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className="transaction-form-group">
                        <label className="transaction-label">Дата и время *</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className='transaction-input'
                            required
                        />
                    </div>

                    <div className="transaction-form-group">
                        <label className="transaction-label">Описание</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder='Например: чаевые или обед в спаре...'
                            className={`transaction-textarea ${profanityError ? 'input-error' : ''}`}
                        ></textarea>
                        <span className="hint-text">
                            Необязательно
                        </span>
                    </div>

                    <div className="modal-action" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                            type="submit"
                            className='btn-submit'
                            disabled={loading || loadingCategories}
                            style={{opacity: (loading || loadingCategories) ? 0.7 : 1}}>
                        
                            {loading ? "Сохранение..." : (isEditing ? 'Обновить' : 'Добавить транзакцию')}

                        </button>
                        <button
                            type="button"
                            className='btn-cancel'
                            onClick={onClose}
                            disabled={loading}
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;