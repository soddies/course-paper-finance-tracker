import React, {useState} from 'react';
import '../../assets/styles/profile.css';

const ProfileModal = ({type, onClose, onSave}) => {
    const [formData, setFormData] = useState({
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const isEmail = type === 'email';
    const title = isEmail ? 'Изменить email' : 'Изменить пароль';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            let endpoint, body;

            if (isEmail) {
                if (!formData.email || !formData.email.includes('@')) {
                    throw new Error('Введите корректный email');
                }

                endpoint = '/api/profile/email';
                body = {
                    email: formData.email
                };
            } else {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('Пароли не совпадают');
                }
                if (formData.newPassword.length < 8) {
                    throw new Error('Пароль должен быть не менее 8 символов');
                }
                endpoint = '/api/profile/password';
                body = {
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword
                };
            }

            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(isEmail ? 'Email успешно изменен' : 'Пароль успешно изменен');
            } else {
                throw new Error(data.error || 'Ошибка при обновлении');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleChange = (field) => (e) => {
        setFormData(prev => ({...prev, [field]: e.target.value}));
    };

    return (
        <div className="modal-overlay-profile" onClick={onClose}>
            <div className="modal-content-profile" onClick={e => e.stopPropagation()}>
                <div className="modal-header-profile">
                    <h2>{title}</h2>
                    <button className="modal-close-profile" onClick={onClose}>✕</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className='alert alert-success'>{success}</div>}

                <form onSubmit={handleSubmit} className='profile-form-modal'>
                    {isEmail ? (
                        <div className="form-group">
                            <label>Новый email</label>
                            <input 
                                type="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                placeholder='example@mail.ru'
                                required 
                            />
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Текущий пароль</label>
                                <input 
                                    type="password"
                                    value={formData.oldPassword}
                                    onChange={handleChange('oldPassword')}
                                    placeholder='********'
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Новый пароль</label>
                                <input 
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleChange('newPassword')}
                                    placeholder='Минимум 8 символов'
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Подтвердите новый пароль</label>
                                <input  
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange('confirmPassword')}
                                    placeholder='********'
                                    required 
                                />
                            </div>
                        </>
                    )}
                    <div className="form-actions">
                        <button type='button' className='btn-cancel-modal' onClick={onClose}>
                            Отмена
                        </button>
                        <button type='submit' className='btn-submit-modal'>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;