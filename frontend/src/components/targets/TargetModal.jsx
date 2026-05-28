import React, {useState, useEffect} from 'react';
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
    const [formData, setFormData] = useState({
        name: '',
        target_amount: '',
        current_amount: '',
        deadline: '',
        icon: 'target'
    });

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (target) {
            setFormData({
                name: target.name || '',
                target_amount: target.target_amount || '',
                current_amount: target.current_amount || '',
                deadline: target.deadline ? target.deadline.split('T')[0] : '',
                icon: target.icon || 'target'
            });
        } else {
            setFormData(prev => ({
                ...prev,
                deadline: today
            }));
        }
    }, [target]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.target_amount) {
            alert('Заполните обязательные поля!');
            return;
        }

        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0,0,0,0);

            if (deadlineDate < today) {
                alert('Дедлайн не может быть в прошлом! Выбирите будущую дату');
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
        
        onSave(target ? target.id : null, payload); 
    };

    const iconKeys = Object.keys(targetIcons);

    return (
        <div className="modal-overlay-target" onClick={onClose}>
            <div className="modal-content-target" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-target">
                    <h2>{target ? 'Редактировать цель' : 'Новая цель'}</h2>
                    <button className="modal-close-target" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className='target-form'>
                    <div className="form-group-target">
                        <label>Название цели *</label>
                        <input 
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder='Например: квартира в центре Москвы'
                            required 
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
                            {iconKeys.map((iconKeys) => {
                                const iconSrc = targetIcons[iconKeys];
                                return (
                                    <button 
                                        key={iconKeys} 
                                        type='button' 
                                        className={`icon-option ${formData.icon === iconKeys ? 'selected' : ''}`} 
                                        onClick={() => setFormData({...formData, icon: iconKeys})}>
                                            <img src={iconSrc} className='icon-svg-target' />
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="form-action-target">
                        <button type='button' className='btn-cancel-target' onClick={onClose}>Отмена</button>
                        <button type='submit' className='btn-submit-target'>{target ? 'Сохранить' : 'Создать'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TargetModal;
