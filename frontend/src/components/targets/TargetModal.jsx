import React, {useState, useEffect} from 'react';
import { useProfanityCheck } from '../../hooks/useProfanityCheck';
import carIcon from '../../assets/images/targets_icon/car.svg';
import giftIcon from '../../assets/images/targets_icon/gift.svg';
import houseIcon from '../../assets/images/targets_icon/house.svg';
import laptopIcon from '../../assets/images/targets_icon/laptop.svg';
import phoneIcon from '../../assets/images/targets_icon/phone.svg';
import planeIcon from '../../assets/images/targets_icon/plane.svg';
import targetIcon from '../../assets/images/targets_icon/target.svg';
import travelIcon from '../../assets/images/targets_icon/travel.svg';
import watchIcon from '../../assets/images/targets_icon/watch.svg';
import '../../assets/styles/targets.css'

const targetIcons = {
    car: carIcon,
    gift: giftIcon,
    house: houseIcon,
    laptop: laptopIcon,
    phone: phoneIcon,
    plane: planeIcon,
    target: targetIcon,
    travel: travelIcon,
    watch: watchIcon,
};

const TargetModal = ({target, onClose, onSave}) => {
    const {profanityError, checkText, clearError} = useProfanityCheck();

    const [formData, setFormData] = useState({
        name: '',
        target_amount: '',
        current_amount: '',
        deadline: '',
        icon: 'target'
    });

    const [error, setError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        setError('');
        clearError();
        if (target) {
            setFormData({
                name: target.name || '',
                target_amount: target.targetAmount || '',
                current_amount: target.currentAmount || '',
                deadline: target.deadline ? target.deadline.split('T')[0] : '',
                icon: target.icon || 'target'
            });
            if (target.name) {
                checkText(target.name, 'Название цели');
            } else {
                clearError();
            }
        } else {
            setFormData(prev => ({
                ...prev,
                deadline: today
            }));
            clearError();
        }
    }, [target]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!checkText(formData.name, 'Название цели')) {
            return;
        }

        if (!formData.name.trim() || !formData.target_amount) {
            setError('Заполните обязательные поля!');
            return;
        }

        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0,0,0,0);

            if (deadlineDate < today) {
                setError('Дедлайн не может быть в прошлом! Выберите будущую дату');
                return;
            }
        }

        const payload = {
            name: formData.name.trim(),
            target_amount: parseFloat(formData.target_amount),
            current_amount: parseFloat(formData.current_amount) || 0,
            deadline: formData.deadline || null,
            icon: formData.icon || 'target'
        };
        
        try {
            await onSave(target ? target.id : null, payload); 
            onClose();
        } catch (err) {
            setError(err.message || 'Ошибка при сохранении');
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setFormData({...formData, name: value});
        checkText(value, 'Название цели');
    }

    const iconKeys = Object.keys(targetIcons);

    return (
        <div className="modal-overlay-target" onClick={onClose}>
            <div className="modal-content-target" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-target">
                    <h2>{target ? 'Редактировать цель' : 'Новая цель'}</h2>
                    <button className="modal-close-target" onClick={onClose}>✕</button>
                </div>

                {error && (
                    <div className="alert-target alert-error-target">
                        {error}
                    </div>
                )}

                {profanityError && (
                    <div className="alert-target alert-error-target">
                        {profanityError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='target-form'>
                    <div className="form-group-target">
                        <label>Название цели *</label>
                        <input 
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            placeholder='Например: квартира в центре Москвы'
                            required 
                            className={profanityError ? 'input-error' : ''}
                        />
                    </div>

                    <div className="form-row-target">
                        <div className="form-group-target">
                            <label>Целевая сумма *</label>
                            <input 
                                type="text"
                                value={formData.target_amount}
                                onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                                placeholder='0.00'
                                required 
                            />
                        </div>
                        <div className="form-group-target">
                            <label>Текущая сумма</label>
                            <input 
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.current_amount}
                                onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                                placeholder="0.00"
                                max={formData.target_amount || undefined}
                            />
                        </div>
                    </div>

                    <div className="form-group-target">
                        <label>Дедлайн</label>
                        <input 
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                            min={today}
                        />
                    </div>

                    <div className="form-group-target">
                        <label>Иконка</label>
                        <div className="icon-picker">
                            {iconKeys.map((iconKey) => {
                                const iconSrc = targetIcons[iconKey];
                                return (
                                    <button 
                                        key={iconKey} 
                                        type='button' 
                                        className={`icon-option ${formData.icon === iconKey ? 'selected' : ''}`} 
                                        onClick={() => setFormData({...formData, icon: iconKey})}>
                                            <img src={iconSrc} className='icon-svg-target' />
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="form-action-target">
                        <button type='button' className='btn-cancel-target' onClick={onClose}>Отмена</button>
                        <button type='submit' className='btn-submit-target' disabled={!!profanityError}>{target ? 'Сохранить' : 'Создать'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TargetModal;
