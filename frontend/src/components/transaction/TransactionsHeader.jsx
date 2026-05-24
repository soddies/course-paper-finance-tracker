import React, { useState } from 'react'
import exportIcon from '../../assets/images/transaction_icon/export.svg'
import csvIcon from '../../assets/images/transaction_icon/file-csv.svg'
import pdfIcon from '../../assets/images/transaction_icon/file-pdf.svg'    

const TransactionHeader = ({filters = {}}) => {
    const [isOpen, setOpen] = useState(false);

    const handleExport = async (format) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Нет токена');
            }

            const params = new URLSearchParams();
            if (filters.type) {
                params.append('type', filters.type);
            }
            if (filters.categoryId) {
                params.append('categoryId', filters.categoryId);
            }
            if (filters.dateFrom) {
                params.append('dateFrom', filters.dateFrom);
            }
            if (filters.dateTo) {
                params.append('dateTo', filters.dateTo);
            }
            if (filters.sortBy) {
                params.append('sortBy', filters.sortBy);
            }
            if (filters.sortOrder) {
                params.append('sortOrder', filters.sortOrder);
            }

            const url = `http://localhost:3000/api/transactions/export/${format}?${params}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка экспорта');
            }

            const blob = await response.blob();
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
                            <button className='dropdown-option' onClick={() => handleExport('csv-all')}>
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