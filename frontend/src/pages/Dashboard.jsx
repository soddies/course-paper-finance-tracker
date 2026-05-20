import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BalanceCard from '../components/dashboard/BalanceCard';
import StatsCards from '../components/dashboard/StatsCard';
import TransactionModal from '../components/transaction/TransactionModal';
import '../assets/styles/dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('income');

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/enter');
        }

        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Нет токена авторизации');
            }

            const response = await fetch('http://localhost:3000/api/dashboard/summary', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка загрузки');
            }

            const data = await response.json();
            setDashboardData(data);
            setError('');
        } catch (err) {
            console.error('Dashboard fetch error: ', err);
        } finally {
            setLoading(false);
        }
    };

    const getUser = () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    const user = getUser();

    const openIncomeModal = () => {
        setModalType('income');
        setIsModalOpen(true);
    };

    const openExpenseModal = () => {
        setModalType('expense');
        setIsModalOpen(true);
    };

    const handleTransactionAdded = () => {
        fetchDashboardData();
        setIsModalOpen(false);
    };

    const formattingMoney = (amount) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 2,
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <Header/>
                <div className="dashboard-loading">
                    Загрузка данных...
                </div>
            </div>
        );
    }

    const totalBalance = dashboardData?.totalBalance || 0;
    const monthlyIncome = dashboardData?.monthlyIncome || 0;
    const monthlyExpense = dashboardData?.monthlyExpense || 0;
    const transactionsCount = dashboardData?.transactionCount || 0;

    const todayData = {
        income: 0,
        expense: 0,
        balance: 0,
        count: 0
    }; // будет сделано отдельно

    const weekData = {
        income: 0,
        expense: 0,
        balance: 0,
        count: 0
    }; // будет сделано отдельно

    const monthData = {
        income: monthlyIncome,
        expense: monthlyExpense,
        balance: monthlyIncome - monthlyExpense,
        count: transactionsCount
    };

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-page">
            <Header/>

            <main className="dashboard-content">
                <section className="welcome-section">
                    <h1 className="welcome-title">Добро пожаловать!</h1>
                    <p className="welcome-subtitle">
                        Сегодня {new Date().toLocaleDateString('ru-RU')} • {user.email}
                    </p>
                </section>

                <BalanceCard 
                    balance={totalBalance}
                    income={monthlyIncome}
                    expense={monthlyExpense}
                    onAddIncome={openIncomeModal}
                    onAddExpense={openExpenseModal}
                />

                <StatsCards
                    todayData={todayData}
                    weekData={weekData}
                    monthData={monthData}
                />
            </main>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                onTransactionUpdate={handleTransactionAdded}
            />
        </div>
    );
};

export default Dashboard;