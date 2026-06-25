import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/layout/Header';
import {useAuth} from '../hooks/useAuth';
import SystemStats from '../components/admin/SystemStats';
import {adminAPI} from '../api/admin';
import '../assets/styles/admin.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const {isAdmin, isLoading} = useAuth();
    const [activeTab, setActiveTab] = useState('stats');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [actionError, setActionError] = useState(''); 

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (!isAdmin) {
            navigate('/dashboard');
            return;
        }
        fetchUsers();
    }, [isAdmin, navigate, isLoading]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setFetchError('');
            setActionError('');
            const data = await adminAPI.getUsers();
            setUsers(data);
        } catch (err) {
            setFetchError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Изменить роль пользователя на ${newRole}?`)) {
            return;
        }
        try {
            await adminAPI.changeRoleUser(userId, newRole);
            await fetchUsers();
        } catch (err) {
            setActionError(err.message);
        }
    };

    const handleBanUser = async (userId, userEmail) => {
        const reason = window.prompt(
            `Заблокировать пользователя ${userEmail}?\n\nУкажите причину блокировки (необязательно): `
        );

        if (reason === null) {
            return;
        }

        try {
            await adminAPI.banUser(userId, reason);
            await fetchUsers();
        } catch (err) {
            setActionError(err.message);
        }
    };

    const handleUnbanUser = async (userId, userEmail) => {
        if (!window.confirm(`Разблокировать пользователя ${userEmail}`)) {
            return;
        }

        try {
            await adminAPI.unBanUser(userId);
            await fetchUsers();
        } catch (err) {
            setActionError(err.message);
        }
    };

    const handleDeleteUser = async (userId, userEmail) => {
        if (!window.confirm(`Удалить пользователя ${userEmail}?`)) {
            return;
        }

        try {
            await adminAPI.deleteUser(userId);
            await fetchUsers();
        } catch (err) {
            setActionError(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="admin-page">
                <Header />
                <div className="admin-loading">
                    <p>Проверка прав...</p>
                </div>
            </div>
        );
    }

   return (
        <div className="admin-page">
            <Header/>
            <main className="admin-content">
                <div className="admin-header">
                    <h1>Панель администратора</h1>
                    <p className="admin-subtitle">Управление системой</p>
                </div>

                <div className="admin-tabs">
                    <button className={`admin-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
                        Статистика
                    </button>
                    <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        Пользователи
                    </button>
                </div>

                {actionError && (
                    <div className="alert alert-error">
                        {actionError}
                    </div>
                )}

                {activeTab === 'stats' && <SystemStats/>}

                {activeTab === 'users' && (
                    <>
                        {loading ? (
                            <div className="stats-empty-state">
                                <p className='empty-state-text'>Загрузка пользователей...</p>
                            </div>
                        ) : fetchError ? (
                            <div className='stats-empty-state'>
                                <p className="empty-state-text">{fetchError}</p>
                                <button onClick={fetchUsers} className='btn-retry-centered'>Повторить</button>
                            </div>
                        ) : (
                            <div className="users-table-container">
                                <table className='users-table'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Email</th>
                                            <th>Никнейм</th>
                                            <th>Роль</th>
                                            <th>Дата регистрации</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id} className={user.is_banned ? 'banned-row' : ''}>
                                                <td>{user.id}</td>
                                                <td>{user.email}
                                                    {user.isBanned && (
                                                        <span className="banned-badge" title={user.banReason || 'Заблокирован'}>
                                                            ✕
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{user.nickname}</td>
                                                <td>
                                                    <span className={`role-badge role-${user.role}`}>
                                                        {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                                                </td>
                                                <td className='action-cells'>
                                                    {user.isBanned ? (
                                                        <button className="btn-action-admin btn-unban" onClick={() => handleUnbanUser(user.id, user.email)} title="Разблокировать">
                                                            Разблокировать
                                                        </button>
                                                    ) : (
                                                        <button className="btn-action-admin btn-ban" onClick={() => handleBanUser(user.id, user.email)} title="Заблокировать">
                                                            Заблокировать
                                                        </button>
                                                    )}
                                                    {user.role !== 'admin' ? (
                                                        user.isBanned ? null : (
                                                        <button className='btn-action-admin btn-promote' onClick={() => handleRoleChange(user.id, 'admin')}>
                                                            В админы
                                                        </button>
                                                        )
                                                    ) : (
                                                        <button className='btn-action-admin btn-demote' onClick={() => handleRoleChange(user.id, 'user')}>
                                                            Понизить
                                                        </button>
                                                    )}
                                                    <button className='btn-action-admin btn-delete-user' onClick={() => handleDeleteUser(user.id, user.email)}>
                                                        Удалить
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
   );
};

export default AdminPanel;