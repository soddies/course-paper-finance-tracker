import React, { useState } from 'react';
import Header from '../components/layout/Header';
import TransactionHeader from '../components/transaction/TransactionsHeader';
import QuickActions from '../components/transaction/QuickAction';
import FilterPanel from '../components/transaction/FilterPanel';
import TransactionModal from '../components/transaction/TransactionModal';
import TransactionList from '../components/transaction/TransactionList';
import '../assets/styles/transaction.css';

const Transactions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('income');
    const [filters, setFilters] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    const openIncomeModal = () => {
        setModalType('income');
        setIsModalOpen(true);
    };

    const openExpenseModal = () => {
        setModalType('expense');
        setIsModalOpen(true);
    };

    const handleTransactionAdded = () => {
        setRefreshTrigger(prev => prev + 1);
        setIsModalOpen(false);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
            setRefreshTrigger(prev => prev + 1);
    }

    return (
        <div className="transactions-page">
            <Header/>

            <main style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 20px'}}>
                <TransactionHeader 
                    onAddIncome={openIncomeModal}
                    onAddExpense={openExpenseModal}
                />
                <QuickActions 
                    onAddIncome={openIncomeModal}
                    onAddExpense={openExpenseModal}
                />
                <FilterPanel onFilterChange={handleFilterChange}/>
                <div style={{ marginTop: '30px' }}>
                    <TransactionList
                        filters={filters}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
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

export default Transactions;