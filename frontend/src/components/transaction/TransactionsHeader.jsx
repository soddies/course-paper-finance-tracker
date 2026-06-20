import React, { useState } from 'react'
import exportIcon from '../../assets/images/transaction_icon/export.svg'
import csvIcon from '../../assets/images/transaction_icon/file-csv.svg'
import pdfIcon from '../../assets/images/transaction_icon/file-pdf.svg'    
import { transactionAPI } from '../../api/transactions';

const TransactionHeader = ({filters = {}}) => {
    const [isOpen, setOpen] = useState(false);

    const handleExport = async (format) => {
        try {
            const blob = await transactionAPI.exportTransaction(format, filters);
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `transactions_${new Date().toISOString().slice(0, 10)}.${format}`
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Export error: ', err);
            alert('Не удалось экспортировать');
        }
        setOpen(false);
    };

    return (
        <div className="page-header">
            <h1 className="page-title">Транзакции</h1>
            <div className="header-buttons">
                <div className="dropdown">
                    <button className="btn-action btn-export_transaction" onClick={() => setOpen(!isOpen)}>
                        <img src={exportIcon} alt="plus" className='btn-icon'/>
                            Экспортировать...
                    </button>

                    {isOpen && (
                        <div className="dropdown-menu">
                            <button className='dropdown-option' onClick={() => handleExport('csv')}>
                                <img src={csvIcon} alt="csv" className='btn-icon'/>
                                В CSV
                            </button>

                            <button className='dropdown-option' onClick={() => handleExport('pdf')}>
                                <img src={pdfIcon} alt="pdf" className='btn-icon'/>
                                В PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionHeader;   