import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import '../assets/styles/auth.css';

const Enter = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError('Заполните все поля');
            return;
        }

        console.log('Вход выполнен:', formData);
        
        const user = {
            id: Date.now(),
            email: formData.email,
            name: formData.email.split('@')[0]
        };
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Вход</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Введите ваш email"
                        required
                    />

                    <InputField
                        label="Пароль"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Введите пароль"
                        required
                    />

                    <Button type="submit" className='submit'>Войти</Button>
                </form>

                <p className="login-link">
                    Нет аккаунта? <Link to="/auth">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};

export default Enter;