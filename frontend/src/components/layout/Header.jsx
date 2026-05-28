import React from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import '../../assets/styles/dashboard.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getUser = () => {
        const userStr =  localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/enter');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="header-logo">
                FinTrack
            </div>

            <nav className="nav-menu">
                <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                    Главная
                </Link>
                <Link to="/transactions" className={`nav-item ${isActive('/transactions') ? 'active' : ''}`}>
                    Транзакции
                </Link>
                <Link to="/categories" className={`nav-item ${isActive('/categories') ? 'active' : ''}`}>
                    Категории
                </Link>
                <Link to="/analytics" className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}>
                    Аналитика
                </Link>
                <Link to="/targets" className={`nav-item ${isActive('/targets') ? 'active' : ''}`}>
                    Цели накоплений
                </Link>
                <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
                    Профиль
                </Link>
                <button onClick={handleLogout} className='nav-item nav-logout'>
                    Выход
                </button>
            </nav>
        </header>
    );
};

export default Header;