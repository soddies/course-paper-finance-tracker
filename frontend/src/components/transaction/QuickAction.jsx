import React from 'react'
import plusIcon from '../../assets/images/plus.svg';
import minusIcon from '../../assets/images/minus.svg';

const ActionCard = ({icon, title, description, onClick}) => (
    <div className="action-card" onClick={onClick}>
        <div className={`action-icon ${icon}`}>
            {icon === 'icon-income' ? <img src={plusIcon} alt="plus" className='btn-icon'/> : <img src={minusIcon} alt="minus" className='btn-icon'/> }
        </div>
        <div className="action-text">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    </div>
);

const QuickActions = ({onAddIncome, onAddExpense}) => {
    return (
        <div className="quick-actions">
            <ActionCard 
                icon='icon-income'
                title="Добавить доход"
                description="Новая операция пополнения"
                onClick={onAddIncome}
            /> 

            <ActionCard 
                icon='icon-expense'
                title="Добавить расход"
                description="Новая операция траты"
                onClick={onAddExpense}
            />
        </div>
    );
};

export default QuickActions;