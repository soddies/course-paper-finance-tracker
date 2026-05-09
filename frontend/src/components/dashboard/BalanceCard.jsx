import React from 'react';

const BalanceCard = ({balance = 0, income=0, expense = 0}) => {
    return (
        <div className="balance-card">
            <div className="balance-header">Текущий баланс</div>
            <h1 className='balance-amount'>{balance.toFixed(2)} ₽</h1>

            <div className="balance-summary">
                <div className="summary-item">
                    <h4>Доходы</h4>
                    <p className='income-text'>+{income.toFixed(2)} ₽</p>
                </div>
                <div className="summary-item">
                    <h4>Расходы</h4>
                    <p className='expense-text'>-{expense.toFixed(2)} ₽</p>
                </div>
            </div>

            <div className="balance-actions">
                <button className="action-btn btn-income">
                    <span>+</span> Доход
                </button>
                <button className="action-btn btn-expense">
                    <span>-</span> Расход
                </button>
            </div>
        </div>
    );
};

export default BalanceCard;