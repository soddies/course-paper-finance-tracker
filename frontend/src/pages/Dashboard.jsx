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
            setLoading(true);
            setError('');

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
            
        } catch (err) {
            console.error('Dashboard fetch error: ', err);
            setError(err.message);
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

    if (loading) {
        return (
            <div className="dashboard-page">
                <Header/>
                <div className="dashboard-loading">
                    <p>Загрузка данных...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <Header />
                <div className="dashboard-error">
                    <p>{error}</p>
                    <button onClick={fetchDashboardData}>Повторить</button>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const totalBalance = dashboardData?.totalBalance || 0;
    const monthlyIncome = dashboardData?.monthlyIncome || 0;
    const monthlyExpense = dashboardData?.monthlyExpense || 0;

    const todayData = {
        income: dashboardData?.todayIncome || 0,
        expense: dashboardData?.todayExpense || 0,
        balance: dashboardData?.todayBalance || 0,
        count: dashboardData?.todayCount || 0
    };

    const weekData = {
        income: dashboardData?.weekIncome || 0,
        expense: dashboardData?.weekExpense || 0,
        balance: dashboardData?.weekBalance || 0,
        count: dashboardData?.weekCount || 0
    };

    const monthData = {
        income: dashboardData?.monthlyIncome || 0,
        expense: dashboardData?.monthlyExpense || 0,
        balance: dashboardData?.monthlyBalance || 0,
        count: dashboardData?.monthlyCount || 0
    };

    return (
        <div className="dashboard-page">
            <Header/>

            <main className="dashboard-content">
                <section className="welcome-section">
                    <h1 className="welcome-title">Здравствуйте, {user.nickname || user.email.split('@')[0]}</h1>
                    <p className="welcome-subtitle">
                        Текущая дата: {new Date().toLocaleDateString('ru-RU')}</p>
                </section>

                <BalanceCard 
                    balance={totalBalance}
                    income={monthlyIncome}
                    expense={monthlyExpense}
                    onAddIncome={openIncomeModal}
                    onAddExpense={openExpenseModal}
                    disabled={loading}
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