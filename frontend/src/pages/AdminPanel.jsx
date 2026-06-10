import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Header from '../components/layout/Header';
import {useAuth} from '../hooks/useAuth';
import '../assets/styles/admin.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const {isAdmin, isLoading} = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            setError('');

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`  
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки пользователей');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Изменить роль пользователя на ${newRole}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({role: newRole})
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка изменения роли');
            }

            await fetchUsers();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleDeleteUser = async (userId, userEmail) => {
        if (!window.confirm(`Удалить пользователя ${userEmail}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка удаления');
            }

            await fetchUsers();
        } catch (err) {
            setError(err.message);
            throw err;
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

    if (loading) {
        return (
            <div className="admin-page">
                <Header />
                <div className="admin-loading">
                    <p>Загрузка пользователей...</p>
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
                    <p className="admin-subtitle">Управление пользователями</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

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
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.nickname}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className='action-cells'>
                                        {user.role !== 'admin' ? (
                                            <button className='btn-action-admin btn-promote' onClick={() => handleRoleChange(user.id, 'admin')}>
                                                Сделать админом
                                            </button>
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
            </main>
        </div>
   );
};

export default AdminPanel;