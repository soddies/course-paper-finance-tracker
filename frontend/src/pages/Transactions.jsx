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
    const [loading, setIsLoading] = useState(true);
    
    const openIncomeModal = () => {
        setModalType('income');
        setIsModalOpen(true);
    };

    const openExpenseModal = () => {
        setModalType('expense');
        setIsModalOpen(true);
    };

    const handleTransactionAdded = () => {
        setIsLoading(true);
        setRefreshTrigger(prev => prev + 1);
        setIsModalOpen(false);
    };

    const handleFilterChange = (newFilters) => {
        setIsLoading(true);
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

                    <div style={{opacity : loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto'}}>
                        <FilterPanel onFilterChange={handleFilterChange}/>
                    </div>

                <div style={{ marginTop: '30px' }}>
                    <TransactionList
                        filters={filters}
                        refreshTrigger={refreshTrigger}
                        setLoading={setIsLoading}
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