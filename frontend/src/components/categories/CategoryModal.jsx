import React, { useState, useEffect } from 'react';
import { useProfanityCheck } from '../../hooks/useProfanityCheck';
import { categoryAPI } from '../../api/categories/categoriesApi';

const CategoryModal = ({ isOpen, onClose, defaultType, onCategoryAdded }) => {
    const { profanityError, checkText, clearError } = useProfanityCheck();

    const [type, setType] = useState(defaultType || 'income');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setError('');
            clearError();
            setType(defaultType || 'income');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            return;
        }

        if (!checkText(name, 'Название категории')) {
            return;
        }

        setLoading(true);

        try {
            await categoryAPI.createCategory(name.trim(), type);
            onCategoryAdded();
            setName('');
            onClose(); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        checkText(value, 'Название категории');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content small-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Добавить категорию</h3>
                    <button onClick={onClose}>✕</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                
                {profanityError && (
                    <div className="alert-category alert-error-category">
                        {profanityError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Тип категории</label>
                        <div className="type-selector">
                            <button
                                type="button"
                                className={`type-btn ${type === 'income' ? 'active income' : ''}`}
                                onClick={() => setType('income')}
                            >
                                Доход
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
                                onClick={() => setType('expense')}
                            >
                                Расход
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Название *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={handleNameChange} 
                            placeholder='Название вашей категории'
                            required
                            className={profanityError ? 'input-error' : ''} 
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="submit"
                            className='btn-primary-modal'
                            disabled={loading || !!profanityError}
                            style={{
                                opacity: (loading || profanityError) ? 0.5 : 1,
                                cursor: (loading || profanityError) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Сохранение...' : 'Добавить'}
                        </button>
                        <button
                            type="button"
                            className='btn-secondary-modal'
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

export default CategoryModal;