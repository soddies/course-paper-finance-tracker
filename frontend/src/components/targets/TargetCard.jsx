import React from 'react';
import carIcon from '../../assets/images/targets_icon/car.svg';
import giftIcon from '../../assets/images/targets_icon/gift.svg';
import houseIcon from '../../assets/images/targets_icon/house.svg';
import laptopIcon from '../../assets/images/targets_icon/laptop.svg';
import phoneIcon from '../../assets/images/targets_icon/phone.svg';
import planeIcon from '../../assets/images/targets_icon/plane.svg';
import targetIcon from '../../assets/images/targets_icon/target.svg';
import travelIcon from '../../assets/images/targets_icon/travel.svg';
import watchIcon from '../../assets/images/targets_icon/watch.svg';
import plusIcon from '../../assets/images/transaction_icon/plus.svg';
import editIcon from '../../assets/images/category_icon/default/pencil.svg';
import trashIcon from '../../assets/images/category_icon/default/trash-basket.svg';
import playIcon from '../../assets/images/targets_icon/play.svg';
import pauseIcon from '../../assets/images/targets_icon/pause.svg';
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

const TargetCard = ({target, onEdit, onDelete, onAddAmount, onTogglePause}) => {
    const rawProgress = target.current_amount > 0 ? (parseFloat(target.current_amount) / parseFloat(target.target_amount)) * 100 : 0;
    const displayProgress = Math.min(rawProgress, 100);
    const isCompleted = rawProgress >= 100;
    const isPaused = target.status === 'paused';
    const daysLeft = target.deadline ? Math.ceil((new Date(target.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
    const iconSrc = targetIcons[target.icon] || targetIcons.target;

    return (
        <div className={`target-card ${isCompleted ? 'completed' : ''}`}>
            <div className='target-header'>
                <div className="target-icon">
                    <img src={iconSrc} alt={target.name} className='target-icon-svg'/>
                </div>
                <div className="target-info">
                    <h3 className="target-name">{target.name}</h3>
                    {target.deadline && (
                        <span className={`target-deadline ${daysLeft < 0 ? 'overdue' : daysLeft < 7 ? 'urgent' : ''}`}>
                            {daysLeft < 0 ? `Просрочено` : daysLeft === 0 ? 'Сегодня' : `Осталось ${daysLeft} дней`}
                        </span>
                    )}
                </div>
                <div className="target-actions">
                    <button className={`btn-icon-target ${isPaused ? 'btn-resume-target' : 'btn-pause-target'}`}
                    onClick={() => onTogglePause(target)} title={target.status === 'paused' ? 'Возобновить' : 'Приостановить'}>
                        <img src={isPaused ? playIcon : pauseIcon} alt={isPaused ? 'Возобновить' : 'Пауза'} />
                    </button>
                    {!isPaused && (
                        <button className='btn-icon-target btn-add-target' onClick={() => onAddAmount(target)} title='Пополнить'>
                            <img src={plusIcon} className='target-plus-svg'/>
                        </button>
                    )}
                    {!isPaused && (
                        <button className='btn-icon-target btn-edit-target' onClick={() => onEdit(target)} title='Редактировать цель'>
                            <img src={editIcon} className='target-edit-svg'/>
                        </button>
                    )}
                    <button className='btn-icon-target btn-delete-target' onClick={() => onDelete(target.id)} title='Удалить цель'>
                        <img src={trashIcon} className='target-trash-svg'/>
                    </button>
                </div>
            </div>

            <div className="target-progress">
                <div className="progress-bar">
                    <div className={`progress-fill ${isCompleted ? 'completed' : ''}`} style={{width: `${displayProgress}%`}}/>
                </div>
                <div className="progress-stats">
                    <span className="current">{parseFloat(target.current_amount).toLocaleString('ru-RU')} ₽</span>
                    <span className="target">из {parseFloat(target.target_amount).toLocaleString('ru-RU')} ₽</span>
                    <span className="percentage">{displayProgress.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
};

export default TargetCard