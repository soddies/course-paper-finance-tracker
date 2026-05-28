import React, { useState } from 'react';
import '../../assets/styles/targets.css'

const AddAmountModal = ({target, onClose, onAdd}) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            alert('Введите коррктную сумму');
            return;
        }
        onAdd(target.id, parseFloat(amount));
    };

    return (
        <div className='modal-overlay-amount' onClick={onClose}>
            <div className="modal-content-amount modal-small-amount" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-amount">
                    <h2>Пополнить</h2>
                    <button className='modal-close-amount' onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className='amount-form'>
                    <div className="form-group-amount">
                        <label>Сумма пополнения</label>
                        <input 
                            type="number"
                            min='0.01'
                            step='0.01'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder='0.00'
                            autoFocus
                            required 
                        />
                    </div>

                    <div className="current-progress-amount">
                        Текущий прогресс: {parseFloat(target?.current_amount || 0).toLocaleString('ru-RU')} ₽ из {parseFloat(target?.target_amount || 0).toLocaleString('ru-RU')} ₽
                    </div>

                    <div className="form-action-amount">
                        <button type='button' className='btn-cancel-amount' onClick={onClose}>Отмена</button>
                        <button type='submit' className='btn-add-amount'>Добавить</button>
                    </div>
                </form>
            </div>
        </div> 
    );
};

export default AddAmountModal;