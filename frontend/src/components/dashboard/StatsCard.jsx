import React from 'react';
import calendarIcon from '../../assets/images/calender.svg';
import diagramIcon from '../../assets/images/diagram.svg';
import graphicIcon from '../../assets/images/diagram2.svg';

const StatCard = ({icon, title, period, income, expense, balance, count}) => {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <img src={icon} alt="" className="stat-icon"/>
                <h3 className="stat-title">{title}</h3>
            </div>

            <div className="stat-row">
                <span className="stat-label">Доходы</span>
                <span className='stat-value income'>+{income.toFixed(2)} ₽</span>
            </div>

            <div className="stat-row">
                <span className="stat-label">Расходы</span>
                <span className='stat-value expense'>-{expense.toFixed(2)} ₽</span>
            </div>

            <div className="stat-row">
                <span className="stat-label">Баланс {period.toLowerCase()}</span>
                <span className='stat-value balance'>{balance.toFixed(2)} ₽</span>
            </div>

            <div className="stat-footer">
                Операций: {count}
            </div>
        </div>
    );
};

const StatsCards = ({todayData, weekData, monthData}) => {
    return (
        <div className="stats-grid">
            <StatCard 
                icon={calendarIcon}
                title="Сегодня"
                period="дня"
                {...todayData}
            />

            <StatCard 
                icon={diagramIcon}
                title="Эта неделя"
                period="недели"
                {...weekData}
            />

            <StatCard 
                icon={graphicIcon}
                title="Этот месяц"
                period="месяца"
                {...monthData}
            />
        </div>
    );
};

export default StatsCards;