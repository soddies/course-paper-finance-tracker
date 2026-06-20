import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import CategoryModal from '../components/categories/CategoryModal';
import CategoryList from '../components/categories/CategoryList';
import '../assets/styles/categories.css';
import { categoryAPI } from '../api/categories';

const Categories = () => {
    const [activeTab, setActiveTab] = useState('income');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({total: 0, myCount: 0, systemCount: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

     const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await categoryAPI.getType(activeTab);
            setCategories(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await categoryAPI.getStats();
            setStats(data);
        } catch(err) {
            console.error('Ошибка загрузки статистики: ', err);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
            return;
        }

        try {
            await categoryAPI.deleteCategory(id);
            await Promise.all([fetchCategories(), fetchStats()]);
        } catch (err) {
            console.error('Ошибка удаления: ', err);
            setError(err.message);
        }
    };

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

    if (loading && categories.length === 0) {
        return (
            <div className="category-page">
                <Header />
                <div className="categories-loading">
                    <p>Загрузка категорий...</p>
                </div>
            </div>
        );
    }

    if (error && categories.length === 0) {
        return (
            <div className="category-page">
                <Header />
                <div className="categories-error">
                    <p>{error}</p>
                    <button onClick={fetchCategories}>Повторить</button>
                </div>
            </div>
        );
    }

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
                        <span className="stat-value-cat">{loading ? '...' : stats.total}</span>
                        <span className="stat-label">Всего</span>
                    </div>
                    <div className="stat-card-cat">
                        <span className="stat-value-cat highlight">{loading ? '...' : stats.myCount}</span>
                        <span className="stat-label">Мои категории</span>
                    </div>
                    <div className="stat-card-cat">
                        <span className="stat-value-cat muted">{loading ? '...' : stats.systemCount}</span>
                        <span className="stat-label">Системные</span>
                    </div>
                </div>

                <div className="tabs">
                    <button className={`tab-btn ${activeTab === 'income' ? 'active' : ''}`} onClick={() => setActiveTab('income')} disabled={loading}>
                        Доходы
                    </button>
                    <button className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`} onClick={() => setActiveTab('expense')} disabled={loading}>
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