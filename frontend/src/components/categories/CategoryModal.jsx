import React, {useState} from 'react';

const CategoryModal = ({isOpen, onClose, defaultType, onCategoryAdded}) => {
    const [type, setType] = useState(defaultType || 'income');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handlerSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({name, type})
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            onCategoryAdded();
            setName('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content small-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Добавить категорию</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handlerSubmit}>
                    <div className="form-group">
                        <label>Тип категории</label>
                        <div className="type-selector">
                            <button type="button" className={`type-btn ${type === 'income' ? 'active income' : ''}`} onClick={() => setType('income')}>
                                Доход
                            </button>
                            <button type="button" className={`type-btn ${type === 'expense' ? 'active expense' : ''}`} onClick={() => setType('expense')}>
                                Расход
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Название *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder='Название вашей категории' required/>
                    </div>
                    {error && <div className='error-msg'>{error}</div>}

                    <div className="modal-actions">
                        <button type="submit" className='btn-primary-modal' disabled={loading}>
                            {loading ? 'Сохранение...' : 'Добавить'}
                        </button>
                        <button type="button" className='btn-secondary-modal' onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;