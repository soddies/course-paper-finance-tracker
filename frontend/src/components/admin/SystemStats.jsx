import React, {useState, useEffect} from 'react';
import { adminAPI } from '../../api/admin';
import '../../assets/styles/admin.css';

const SystemStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminAPI.getStatsAdmin();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="stats-empty-state">
                <p className='empty-state-text'>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stats-empty-state">
                <p className='empty-state-text'>{error}</p>
                <button onClick={fetchStats} className="btn-retry-centered">Повторить</button>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const formatMoney = (amount) => {
        return parseFloat(amount).toLocaleString('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }) + '₽';
    };

    return (
        <div className="system-stats">
            <div className="stats-section">
                <h2 className="stat-section-title">
                    Пользователи
                </h2>
                <div className="stat-grid-admin">
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.users.total}</div>
                        <div className="stat-label-admin">Всего пользователей</div>
                    </div>
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.users.new_this_month}</div>
                        <div className="stat-label-admin">Новых за месяц</div>
                    </div>
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.users.admins}</div>
                        <div className="stat-label-admin">Администраторов</div>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <h2 className="stat-section-title">
                    Транзакции
                </h2>
                <div className="stat-grid-admin">
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.transactions.total}</div>
                        <div className="stat-label-admin">Всего транзакций</div>
                    </div>
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.transactions.today}</div>
                        <div className="stat-label-admin">Сделанных сегодня</div>
                    </div>
                    <div className="stat-card-admin">
                        <div className="stat-value-income">{formatMoney(stats.transactions.total_income)}</div>
                        <div className="stat-label-income">Общие доходы</div>
                    </div>
                    <div className="stat-card-admin">
                        <div className="stat-value-expense">{formatMoney(stats.transactions.total_expense)}</div>
                        <div className="stat-label-expense">Общие расходы</div>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <h2 className="stat-section-title">
                    Категории
                </h2>
                <div className="stat-grid-admin">
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.categories.system}</div>
                        <div className="stat-label-admin">Системных</div>
                    </div>
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.categories.user_created}</div>
                        <div className="stat-label-admin">Создано пользователями</div>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <h2 className="stat-section-title">
                    Цели
                </h2>
                <div className="stat-grid-admin">
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.targets.total}</div>
                        <div className="stat-label-admin">Всего целей</div>
                    </div>
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{stats.targets.completed}</div>
                        <div className="stat-label-admin">Выполненных</div>
                    </div>
                    <div className="stat-card-admin">
                        <div className="stat-value-admin">{formatMoney(stats.targets.total_saved)}</div>
                        <div className="stat-label-admin">Всего накоплено</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemStats;