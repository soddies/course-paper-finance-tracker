import React, {useState, useEffect} from 'react';
import Header from '../components/layout/Header';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileModal from '../components/profile/ProfileModal';
import '../assets/styles/profile.css';
import transactionIcon from '../assets/images/profile_icon/transaction.svg';
import categoryIcon from '../assets/images/profile_icon/category.svg';
import completedIcon from '../assets/images/profile_icon/completed.svg';
import expenseIcon from '../assets/images/profile_icon/expense.svg';
import incomeIcon from '../assets/images/profile_icon/income.svg';
import overdueIcon from '../assets/images/profile_icon/overdue.svg';
import targetIcon from '../assets/images/targets_icon/target.svg';
import { profileAPI } from '../api/profile';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
        fetchUserStats();
    }, []);

    const fetchUserData = async () => {
        try {
            const data = await profileAPI.getMe();
            setUserData(data);
        } catch (err) {
            console.error('Error fetching user data: ', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const data = await profileAPI.getStatsProfile();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats: ', err);
            setError('Ошибка загрузки статистики');
        } finally {
            setLoading(false);
        }
    };

    const handleModalSave = (updatedData) => {
        if (updatedData?.email) {
            setUserData(prev => ({...prev, email: updatedData.email}));

            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                user.email = updatedData.email;
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        if (updatedData?.nickname) {
        setUserData(prev => ({ ...prev, nickname: updatedData.nickname }));
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            user.nickname = updatedData.nickname;
            localStorage.setItem('user', JSON.stringify(user));
        }
    }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return;
        }

        return new Date(dateString).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const statCard = [
        {
            title: 'Транзакции',
            value: stats?.transactionCount || 0,
            icon: transactionIcon,
            color: 'black'
        },
        {
            title: 'Созданные категории',
            value: stats?.categoryCount || 0,
            icon: categoryIcon,
            color: 'black'
        },
        {
            title: 'Максимальный доход',
            value: `${formatCurrency(stats?.maxIncome)} ₽`,
            subtitle: '',
            icon: incomeIcon,
            color: 'black'
        },
        {
            title: 'Максимальный расход',
            value: `${formatCurrency(stats?.maxExpense)} ₽`,
            subtitle: '',
            icon: expenseIcon,
            color: 'black'
        },
        {
            title: 'Текущие цели',
            value: stats?.activeTargets || 0,
            icon: targetIcon,
            color: 'black'
        },
        {
            title: 'Выполненные цели',
            value: stats?.completedTargets || 0,
            icon: completedIcon,
            color: 'black'
        },
        {
            title: 'Просроченные цели',
            value: stats?.overdueTargets || 0,
            icon: overdueIcon,
            color: 'black'
        } 
    ];

    if (loading) {
        return (
            <div className="profile-page">
                <Header/>
                <div className="profile-loading">
                    <p>Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Header/>
            <main className="content-profile">
                <ProfileHeader onEdit={(type) => setModalType(type)}/>
                <div className="profile-info-card">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {userData?.email.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                    <div className="profile-details">
                        <div className="profile-details-item">
                            <span className="detail-label">Электронная почта:</span>
                            <span className="detail-value">{userData?.email || 'Не указано'}</span>
                        </div>
                        <div className="profile-details-item">
                            <span className="detail-label">Никнейм:</span>
                            <span className="detail-value">{userData?.nickname || 'Не указано'}</span>
                        </div>
                        <div className="profile-details-item">
                            <span className="detail-label">Дата регистрации:</span>
                            <span className="detail-value">{formatDate(userData?.createdAt) || 'Неизвестно'}</span>
                        </div>
                    </div>
                </div>

                <div className="stats-grid-profile">
                    {statCard.map((card, index) => (
                        <div key={index} className={`stat-card-profile stat-card-${card.color}`}>
                            <div className="stat-card-icon">
                                <img src={card.icon}/>
                            </div>
                            <div className="stat-card-content">
                                <div className="stat-card-title">
                                    {card.title}
                                </div>
                                <div className="stat-card-value">
                                    {card.value}
                                </div>
                                {card.subtitle && (
                                    <div className="stat-card-subtitle">
                                        {card.subtitle}
                                    </div>
                                )}
                            </div>
                        </div>  
                    ))}
                </div>
            </main>

            {modalType && (
                <ProfileModal
                    type={modalType}
                    onClose={() => setModalType(null)}
                    onSave={handleModalSave}
                />
            )}
        </div>
    );
};

export default Profile;