import React, {useState, useEffect} from 'react';
import Header from "../components/layout/Header";
import TargetModal from '../components/targets/TargetModal';
import TargetList from '../components/targets/TargetList';
import AddAmountModal from '../components/targets/AddAmountModal';
import '../assets/styles/targets.css'

const Targets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModal, setIsAddModal] = useState(false);
    const [targets, setTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingTarget, setEditingTarget] = useState(null);
    const [addingTarget, setAddingTarget] = useState(null);

    const fetchTargets = async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/api/targets', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setTargets(data);
            } else {
                const errorMessage = data.details?.[0]?.message || data.error || 'Ошибка загрузки';
                throw new Error(errorMessage);
            }
        } catch (err) {
            console.error('Fetch target error: ', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTarget = async (_, targetData) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3000/api/targets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(targetData)
            });

            const data = await response.json();
            if (!response.ok) {
                const errorMessage = data.details?.[0]?.message || data.error || 'Ошибка создания';
                throw new Error(errorMessage);
            }

            await fetchTargets();
            setIsModalOpen(false);
            setEditingTarget(null);
        } catch (err) {
            console.error('Create target error: ', err);
            setError(err.message);
            throw err;
        }
    };

    const handleUpdateTarget = async (targetId, targetData) => {
        try {
            const token = localStorage.getItem('token');

            const id = parseInt(targetId);
            const response = await fetch(`http://localhost:3000/api/targets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(targetData)
            });

            const data = await response.json();
            if (!response.ok) {
                const errorMessage = data.details?.[0]?.message || data.error || 'Ошибка обновления';
                throw new Error(errorMessage);
            }

            await fetchTargets();
            setIsModalOpen(false);
            setEditingTarget(null);
        } catch (err) {
            console.error('Update target error: ', err);
            setError(err.message);
            throw err;
        }
    };

    const handleDeleteTarget = async (targetId) => {
        if (!window.confirm('Удалить эту цель?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const id = parseInt(targetId)
            const response = await fetch(`http://localhost:3000/api/targets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) {
                const errorMessage = data.details?.[0]?.message || data.error || 'Ошибка удаления';
                throw new Error(errorMessage);
            }
            await fetchTargets();
        } catch (err) {
            console.error('Delete target error: ', err);
            setError(err.message); 
            throw err;
        }
    };

    const handleAddAmount = async (targetId, amount) => {
        try {
            const token = localStorage.getItem('token');

            const id = parseInt(targetId);
            const response = await fetch(`http://localhost:3000/api/targets/${id}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({amount})
            });

            const data = await response.json();
            if (!response.ok) {
                const errorMessage = data.details?.[0]?.message || data.error || 'Ошибка пополнения';
                throw new Error(errorMessage);
            }
            await fetchTargets();
            setIsAddModal(false);
            setAddingTarget(null);
        } catch (err) {
            console.error('Add amount error: ', err);
            setError(err.message);
            throw err;
        }
    };

    const handleTogglePause = async (target) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = target.status === 'paused' ? 'active' : 'paused';

            const response = await fetch(`http://localhost:3000/api/targets/${target.id}/toggle-pause`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify({status: newStatus})
            });

            const data = await response.json();
            if (!response.ok) {
                const errorMessage = data.details?.[0]?.message || data.error || 'Ошибка смены статуса';
                throw new Error(errorMessage);
            }

            await fetchTargets();
        } catch (err) {
            console.error('Toggle status error: ', err);
            setError(err.message);
            throw err;
        } 
    };

    useEffect(() => {
        fetchTargets();
    }, []);

    const totalSaved = targets.reduce((sum, t) => sum + parseFloat(t.current_amount || 0), 0);
    const totalTargets = targets.reduce((sum, t) => sum + parseFloat(t.target_amount || 0), 0);
    const overallProcess = totalTargets > 0 ? Math.min((totalSaved / totalTargets) * 100, 100) : 0;

    if (loading && targets.length === 0) {
        return (
            <div className="target-page">
                <Header/>
                <div className="target-loading">
                    <p>Загрузка целей...</p>
                </div>
            </div>
        );
    }

    if (error && targets.length === 0) {
        return (
            <div className="target-page">
                <Header/>
                <div className="target-error">
                    <p>{error}</p>
                    <button onClick={fetchTargets}>Повторить</button>
                </div>
            </div>
        )
    };

    return (
        <div className="target-page">
            <Header/>
            <main className="target-content">
                <div className="target-header">
                    <div>
                        <h1 className="target-title">Цели накоплений</h1>
                        <p className='target-subtitle'>Копить на важные покупки и мечты</p>
                    </div>
                    <button className='btn-add-target-main' onClick={() => {
                        setEditingTarget(null);
                        setIsModalOpen(true);
                    }}>
                        Новая цель
                    </button>
                </div>

                {targets.length > 0 && (
                    <div className="target-overview">
                        <div className="overview-card">
                            <div className="overview-label">Всего накоплено</div>
                            <div className="overview-value">{totalSaved.toLocaleString('ru-RU')} ₽</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-label">Целевая сумма</div>
                            <div className="overview-value">{totalTargets.toLocaleString('ru-RU')} ₽</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-label">Общий прогресс</div>
                            <div className="overview-value">{overallProcess.toFixed(1)}%</div>
                        </div>
                    </div>
                )}

                {targets.length === 0 ? (
                    <div className="target-empty">
                        <h2>Пока нет целей</h2>
                        <p>Создайте первую цель и начинайте путь к мечте</p>
                        <button className='btn-add-target-main btn-large' onClick={() => {
                            setEditingTarget(null);
                            setIsModalOpen(true);
                        }}>
                            Создать цель
                        </button>
                    </div>
                ) : (
                    <TargetList
                        targets={targets}
                        onEdit={(target) => {
                            setEditingTarget(target);
                            setIsModalOpen(true);
                        }}
                        onDelete={handleDeleteTarget}
                        onAddAmount={(target) => {
                            setAddingTarget(target);
                            setIsAddModal(true);
                        }}
                        onTogglePause={handleTogglePause}
                    />
                )}
            </main>

            {isModalOpen && (
                <TargetModal
                    target={editingTarget}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTarget(null);
                    }}
                    onSave={editingTarget ? handleUpdateTarget : handleCreateTarget}
                />
            )}

            {isAddModal && (
                <AddAmountModal
                    target={addingTarget}
                    onClose={() => {
                        setIsAddModal(false);
                        setAddingTarget(null);
                    }}
                    onAdd={handleAddAmount}
                />
            )}
        </div>
    );
};

export default Targets;