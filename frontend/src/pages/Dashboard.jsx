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

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/enter');
        }
    }, [navigate]);

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

    const todayData = {
        income: 0,
        expense: 0,
        balance: 0,
        count: 0
    };

    const weekData = {
        income: 0,
        expense: 0,
        balance: 0,
        count: 0
    };

    const monthData = {
        income: 0,
        expense: 0,
        balance: 0,
        count: 0
    };

    const totalBalance = monthData.income - monthData.expense;

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
                    income={monthData.income}
                    expense={monthData.expense}
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
            />
        </div>
    );
};

export default Dashboard;