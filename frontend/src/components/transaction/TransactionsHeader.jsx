import React, { useState } from 'react'
import exportIcon from '../../assets/images/export.svg'
import csvIcon from '../../assets/images/file-csv.svg'
import pdfIcon from '../../assets/images/file-pdf.svg'    

const TransactionHeader = () => {
    const [isOpen, setOpen] = useState(false);

    const handleExport = (format) => {
        console.log(`Экспорт в ${format}`);
        setOpen(false);
    };

    return (
        <div className="page-header">
            <h1 className="page-title">Транзакции</h1>
            <div className="action-buttons">
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

                            <button className='dropdown-option' onClick={() => handleExport('pdf-all')}>
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