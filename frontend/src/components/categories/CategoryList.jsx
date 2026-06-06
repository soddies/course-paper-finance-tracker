import React from 'react'
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
import DefaultIcon from '../../assets/images/category_icon/default/folder.svg';
import TrashBasketIcon from '../../assets/images/category_icon/default/trash-basket.svg';
import targetIcon from '../../assets/images/category_icon/expense/target.svg';

const CategoryItem = ({category, onDelete}) => {
    const getIcon = (iconName) => {
        const icons = {
            'freelance': <img src={freelanceIcon} alt="" className="system-icon"/>,
            'part-time-job': <img src={pTimeIcon} alt="" className="system-icon"/>,
            'premium': <img src={premiumIcon} alt="" className="system-icon"/>,
            'salary': <img src={salaryIcon} alt="" className="system-icon"/>,
            'social-salary': <img src={SocialSalaryIcon} alt="" className="system-icon"/>,
            'amusement-park': <img src={APIcon} alt="" className="system-icon"/>,
            'clothes': <img src={ClothesIcon} alt="" className="system-icon"/>,
            'contact': <img src={ContactIcon} alt="" className="system-icon"/>,
            'education': <img src={EducationIcon} alt="" className="system-icon"/>,
            'health': <img src={HealthIcon} alt="" className="system-icon"/>,
            'internet': <img src={InternetIcon} alt="" className="system-icon"/>,
            'products': <img src={ProductsIcon} alt="" className="system-icon"/>,
            'rental-housing': <img src={RentHouseIcon} alt="" className="system-icon"/>,
            'restaurant': <img src={RestaurantIcon} alt="" className="system-icon"/>,
            'transport':<img src={TransportIcon} alt="" className="system-icon"/>,
            'utilities': <img src={UtilitiesIcon} alt="" className="system-icon"/>,
            'target': <img src={targetIcon} alt="" className='system-icon'/>
        };

        return icons[iconName] || <img src={DefaultIcon} alt="" className="system-icon"/>
    };

    return (
    <div className="category-item">
        <div className="cat-icon-box icon-expense"> 
            {getIcon(category.icon)}
        </div>
        <div className="cat-info">
            <h3>{category.name}</h3>
            {category.is_system ? 
                <span className='badge-system'>Системная</span> : 
                <span className='badge-system'>Ваша категория</span>
            }
        </div>
        {!category.is_system && (
            <button className='btn-delete-small' onClick={() => onDelete(category.id)}>
                <img src={TrashBasketIcon} alt="" className="system-icon"/>
            </button>
        )}
    </div>
);
};

const CategoryList = ({categories, onDelete}) => {
    if (!categories || categories.length === 0) {
        return <div className="empty-list">Нет категорий в этой вкладке</div>;
    }

    return (
        <div className="category-list">
            {categories.map(cat => (
                <CategoryItem key={cat.id} category={cat} onDelete={onDelete}/>
            ))}
        </div>
    );
};

export default CategoryList;