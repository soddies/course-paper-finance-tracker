import React from 'react'
import Header from '../components/layout/Header';
import TransactionHeader from '../components/transaction/TransactionsHeader';
import QuickActions from '../components/transaction/QuickAction';
import FilterPanel from '../components/transaction/FilterPanel';
import '../assets/styles/transaction.css';

const Transactions = () => {
    return (
        <div className="transactions-page">
            <Header/>

            <main style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 20px'}}>
                <TransactionHeader />
                <QuickActions />
                <FilterPanel />
                {/*Здесь будет таблица транзакций*/}
                <div style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    padding: '40px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <p style={{ color: '#7f8c8d'}}>Список транзакций появится здесь</p>
                </div>
            </main>
        </div>
    );
};

export default Transactions;