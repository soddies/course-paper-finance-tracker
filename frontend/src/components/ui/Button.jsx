import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
    const finalClass = className || 'btn-primary';
    
    return (
        <button
            type={type}
            onClick={onClick}
            className={finalClass}
        >
            {children}
        </button>
    );
};

export default Button;