import React from 'react';

const InputField = ({ label, type, name, value, onChange, placeholder, required }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="input-field"
            />
        </div>
    );
};

export default InputField;