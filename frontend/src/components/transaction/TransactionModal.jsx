import React, {useState, useEffect} from 'react'

const TransactionModal = ({isOpen, onClose, type, transaction, onTransactionUpdate}) => {
    const isEditing = !!transaction;

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

    useEffect(() => {
        if (!isOpen) return;

        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`http://localhost:3000/api/categories?type=${type}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (response.ok) {
                    setCategories(data.categories || []);
                }
            } catch (err) {
                console.error('Ошибка загрузки категорий: ', err);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [isOpen, type]);

    useEffect(() => {
        if (isEditing && transaction) {
            setFormData({
                category: transaction.category_id || '',
                amount: transaction.amount || '',
                date: transaction.transaction_date ? new Date(transaction.transaction_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                description: transaction.description || ''
            });
        } else if (!isEditing) {
            setFormData({
                category: '',
                amount: '',
                date: new Date().toISOString().slice(0, 16),
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
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Вы не авторизованы');
            }

            const payload = {
                type: type,
                amount: parseFloat(formData.amount),
                categoryId: formData.category ? parseInt(formData.category) : null,
                description: formData.description,
                transactionDate: new Date(formData.date).toISOString()
            };

            let url = 'http://localhost:3000/api/transactions';
            let method = 'POST';

            if (isEditing) {
                url = `http://localhost:3000/api/transactions/${transaction.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка');
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
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className='modal-title'>
                        {isEditing ? `Редактировать ${type === 'income' ? 'доход' : 'расход'}` 
                        : `Добавить ${type === 'income' ? 'доход' : 'расход'} `}
                    </h2>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {error && <div style={{color: '#0b0e14', marginBottom: '15px'}}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="transaction-form-group">
                        <label className="transaction-label">Категория *</label>
                        {loadingCategories ? (
                            <p style={{color: '#999'}}>Загрузка категорий...</p>
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
                            className="transaction-textarea" 
                        ></textarea>
                        <span className='hint-text'>Необязательно</span>
                    </div>  

                    <div className="modal-action" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                        <button type="submit" className='btn-submit' disabled={loading || loadingCategories} style={{opacity: (loading || loadingCategories) ? 0.7 : 1}}>
                            {loading ? "Сохранение..." : (isEditing ? 'Обновить' : 'Добавить транзакцию')}
                        </button>
                        <button type="button" className='btn-cancel' onClick={onClose} disabled={loading}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;