import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import '../assets/styles/auth.css'; 

const Auth = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
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
        
        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        
        if (formData.password.length < 8) {
            setError('Пароль должен быть минимум 8 символов');
            return;
        }

        console.log('Регистрация успешна!', formData);
        // navigate('/dashboard'); 
        alert('Регистрация прошла успешно! (Пока без бэкенда)');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Регистрация</h2>
                
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
                        placeholder="Придумайте пароль"
                        required
                    />

                    <InputField
                        label="Подтвердите пароль"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Повторите пароль"
                        required
                    />

                    <Button type="submit" className="submit">Зарегистрироваться</Button>
                </form>

                <p className="login-link">
                    Уже есть аккаунт? <Link to="/enter">Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default Auth;