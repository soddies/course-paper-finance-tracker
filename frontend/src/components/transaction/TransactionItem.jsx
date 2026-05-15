import React from 'react';
import freelanceIcon from '../../assets/images/category_icon/income/freelance.svg';
import pTimeIcon from '../../assets/images/category_icon/income/part-time-job.svg';
import premiumIcon from '../../assets/images/category_icon/income/premium.svg';
import salaryIcon from '../../assets/images/category_icon/income/salary.svg';
import SocialSalaryIcon from '../../assets/images/category_icon/income/social-salary.svg';
import APIcon from '../../assets/images/category_icon/expense/amusement-park.svg';
import ClothesIcon from '../../assets/images/category_icon/expense/clothes.svg';
import ContactIcon from '../../assets/images/category_icon/expense/contact.svg';
import EducationIcon from '../../assets/images/category_icon/expense/education.svg';
import HealthIcon from '../../assets/images/category_icon/expense/health.svg';
import InternetIcon from '../../assets/images/category_icon/expense/internet.svg';
import ProductsIcon from '../../assets/images/category_icon/expense/Products.svg';
import RentHouseIcon from '../../assets/images/category_icon/expense/rental-housing.svg';
import RestaurantIcon from '../../assets/images/category_icon/expense/restaurant.svg';
import TransportIcon from '../../assets/images/category_icon/expense/transport.svg';
import UtilitiesIcon from '../../assets/images/category_icon/expense/utilities.svg';
import TrashBasketIcon from '../../assets/images/category_icon/default/trash-basket.svg';
import BatChartIcon from '../../assets/images/category_icon/default/bar-chart.svg';
import PencilIcon from '../../assets/images/category_icon/default/pencil.svg';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount, type) => {
        const formatted = new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
        const sign = type === 'income' ? '+' : '-';
        return `${sign}${formatted} ₽`;
    };

    const getCategoryIcon = (categoryName) => {
        const name = categoryName?.toString().trim();
        
        const icons = {
            'Фриланс': freelanceIcon,
            'Подработка': pTimeIcon,
            'Премия': premiumIcon,
            'Зарплата': salaryIcon,
            'Социальные выплаты': SocialSalaryIcon,
            'Развлечения': APIcon,
            'Одежда': ClothesIcon,
            'Связь': ContactIcon,
            'Образование': EducationIcon,
            'Здоровье': HealthIcon,
            'Интернет': InternetIcon,
            'Продукты': ProductsIcon,
            'Аренда жилья': RentHouseIcon,
            'Рестораны': RestaurantIcon,
            'Транспорт': TransportIcon,
            'ЖКУ': UtilitiesIcon
        };
        
        const iconSrc = icons[name] || BatChartIcon;
        return <img src={iconSrc} alt={name || 'Категория'} className="category-icon-img" />;
    };

    const isIncome = transaction.type === 'income';

    return (
        <div className="transaction-item">
            <div className={`cat-icon-box ${isIncome ? 'icon-income' : 'icon-expense'}`}>
                {getCategoryIcon(transaction.category_name)}
            </div>

            <div className="trans-info">
                <h3 className="trans-title">{transaction.category_name || 'Без категории'}</h3>
                <p className="trans-date">{formatDate(transaction.transaction_date)}</p>
                {transaction.description && (
                    <p className="trans-desc">{transaction.description}</p>
                )}
            </div>

            <div className={`trans-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
                {formatAmount(transaction.amount, transaction.type)}
            </div>

            <div className="action-buttons">
                <button
                    className="btn-icon-action"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(transaction);
                    }}
                    title="Редактировать"
                >
                    <img src={PencilIcon} alt="Редактировать" className="btn-icon-img" />
                </button>
                <button
                    className="btn-icon-action btn-delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(transaction.id);
                    }}
                    title="Удалить"
                >
                    <img src={TrashBasketIcon} alt="Удалить" className="btn-icon-img" />
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;