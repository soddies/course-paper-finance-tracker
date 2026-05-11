import React, {useState, useEffect} from 'react'

const TransactionModal = ({isOpen, onClose, type}) => {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        date: new Date().toISOString().slice(0, 16),
        description: ''
    });

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.addEventListener('keydown', handleEsc); 
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // пока заглушка, потом сделаю логику сохранения и добавления в список транзакций
        console.log(`Новая транзакция (${type}): `, formData);
        onClose();
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

                    <div className="modal-action">
                        <button type="submit" className='btn-submit'>Добавить транзакцию</button>
                        <button type="button" className='btn-cancel' onClick={onClose}>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;