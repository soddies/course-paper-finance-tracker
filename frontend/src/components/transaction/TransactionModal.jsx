import React, {useState, useEffect} from 'react'

const TransactionModal = ({isOpen, onClose, type}) => {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        date: new Date().toISOString().slice(0, 16),
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.addEventListener('keydown', handleEsc); 
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Вы не авторизованы. Попробуйте войти снова');
            }

            let categoryId = null;

            if (formData.category && !isNaN(formData.category)) {
                categoryId = parseInt(formData.category);
            }

            const payload = {
                type: type,
                amount: parseFloat(formData.amount),
                categoryId: categoryId,
                description: formData.description,
                transactionDate: formData.date
            };

            const response = await fetch('http://localhost:3000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            setFormData({
                category: '',
                amount: '',
                date: new Date().toISOString().slice(0, 16),
                description: ''
            });
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
                        {type === 'income' ? 'Добавить доход' : 'Добавить расход'}
                    </h2>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {error && <div style={{color: 'red', marginBottom: '15px'}}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="transaction-form-group">
                        <label className="transaction-label">Категория *</label>
                        <select 
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className='transaction-select'
                            required
                        >
                            <option value="" disabled>Выберите категорию</option>
                            <option value="salary">Зарплата</option>
                            <option value="freelance">Фриланс</option>
                            <option value="food">Еда</option>
                            <option value="transport">Транспорт</option>
                        </select>
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
                            placeholder='Например: обед в спаре...'
                            className="transaction-textarea" 
                        ></textarea>
                        <span className='hint-text'>Необязательно</span>
                    </div>  

                    <div className="modal-action" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                        <button type="submit" className='btn-submit' disabled={loading} style={{opacity: loading ? 0.7 : 1}}>
                            {loading ? "Сохранение..." : "Добавить транзакцию"}
                        </button>
                        <button type="button" className='btn-cancel' onClick={onClose} disabled={loading}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;