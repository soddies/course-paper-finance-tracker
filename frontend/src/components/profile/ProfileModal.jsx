import React, {useState} from 'react';
import { profileAPI } from '../../api/profile';
import '../../assets/styles/profile.css';

const ProfileModal = ({type, onClose, onSave}) => {
    const [formData, setFormData] = useState({
        email: '',
        nickname: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    const isEmail = type === 'email';
    const isNickname = type === 'nickname';
    const isPassword = type === 'password';
    const title = isEmail ? 'Изменить email' : 'Изменить пароль';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (isEmail) {
                if (!formData.email || !formData.email.includes('@')) {
                    throw new Error('Введите корректный email');
                }
            } else if (isNickname) {
                const nicknameRegex = /^[a-zA-Zа-яА-Я0-9_]+$/;
                if (!formData.nickname || formData.nickname.length < 5) {
                    throw new Error('Никнейм должен быть минимум 5 символов')
                }
                if (formData.nickname.length > 20) {
                    throw new Error('Слишком длинный никнейм');
                }
                if (!nicknameRegex.test(formData.nickname)) {
                    throw new Error('Никнейм может содержать только буквы, цифры и _');
                }
            } else {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('Пароли не совпадают');
                }
                if (formData.newPassword.length < 8) {
                    throw new Error('Пароль должен быть не менее 8 символов');
                }
            }
        } catch (err) {
            setError(err.message);
            return;
        }

        setLoading(true);

        try {
            let data;
            let successMessage;

            if (isEmail) {
                data = await profileAPI.updateEmail(formData.email);
                successMessage = 'Email успешно изменен';
            } else if (isNickname) {
                data = await profileAPI.updateNickname(formData.nickname);
                successMessage = 'Никнейм успешно изменен';
            } else if (isPassword) {
                data = await profileAPI.updatePassword(formData.oldPassword, formData.newPassword);
                successMessage = 'Пароль успешно изменен';
            }

            setSuccess(successMessage);
            onSave(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                    ) : isNickname ? (
                        <div className="form-group">
                            <label>Новый никнейм</label>
                            <input 
                                type="text"
                                value={formData.nickname}
                                onChange={handleChange('nickname')}
                                placeholder='Минимум 5 символов'
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