import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import CategoryModal from '../components/categories/CategoryModal';
import CategoryList from '../components/categories/CategoryList';
import '../assets/styles/categories.css';

const Categories = () => {
    const [activeTab, setActiveTab] = useState('income');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({total: 0, myCount: 0, systemCount: 0});
    const [loading, setLoading] = useState(true);

     const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/categories?type=${activeTab}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });

            const data = await response.json();
            if (response.ok) {
                setCategories(data.categories);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:3000/api/categories/stats', {
                headers: {'Authorization': `Bearer ${token}`}
            });

            const data = await response.json();
            if (response.ok) {
                setStats(data.stats);
            }
        } catch(err) {
            console.error('Ошибка загрузки статистики: ', err);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка удаления категории');
            };

            fetchCategories();
            fetchStats();
        } catch (err) {
            console.error('Ошибка удаления: ', err);
            alert('Ошибка удаления категории: ', err.message);
        }
    }

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [activeTab]);

    const handleCategoryAdded = () => {
        fetchCategories();
        fetchStats();
        setIsModalOpen(false);
    };

    return (
        <div className="category-page">
            <Header/>
            <main className="categories-content">
                <div className="categories-header">
                    <div>
                        <h1>Категории</h1>
                        <p>Управляйте категориями доходов и расходов</p>
                    </div>
                    <button className='btn-primary' onClick={() => setIsModalOpen(true)}>Добавить категорию</button>
                </div>

                <div className="stats-cards">
                    <div className="stat-card-cat">
                        <span className="stat-value-cat">{stats.total}</span>
                        <span className="stat-label">Всего</span>
                    </div>
                    <div className="stat-card-cat">
                        <span className="stat-value-cat highlight">{stats.myCount}</span>
                        <span className="stat-label">Мои категории</span>
                    </div>
                    <div className="stat-card-cat">
                        <span className="stat-value-cat muted">{stats.systemCount}</span>
                        <span className="stat-label">Системные</span>
                    </div>
                </div>

                <div className="tabs">
                    <button className={`tab-btn ${activeTab === 'income' ? 'active' : ''}`} onClick={() => setActiveTab('income')}>
                        Доходы
                    </button>
                    <button className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`} onClick={() => setActiveTab('expense')}>
                        Расходы
                    </button>
                </div>
                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <CategoryList
                        categories={categories}
                        onDelete={handleDeleteCategory}
                    />
                )}
            </main>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultType={activeTab}
                onCategoryAdded={handleCategoryAdded}
            />
        </div>
    );
};

export default Categories;