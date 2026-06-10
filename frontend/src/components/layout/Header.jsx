import React from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/dashboard.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {isAdmin, isLoading} = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('token');
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
                {isAdmin && (
                    <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        Админ-панель
                    </Link>
                )}
                <button onClick={handleLogout} className='nav-item nav-logout'>
                    Выход
                </button>
            </nav>
        </header>
    );
};

export default Header;