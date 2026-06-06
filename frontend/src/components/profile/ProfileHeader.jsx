import React, {useState} from 'react';
import '../../assets/styles/profile.css'

const ProfileHeader = ({onEdit}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSelect = (type) => {
        onEdit(type);
        setDropdownOpen(false);
    };

    return (
        <div className="profile-header">
            <div>
                <h1 className='profile-title'>Профиль</h1>
                <p className="profile-subtitle">Изменение и просмотр данных</p>
            </div>
            <div className="profile-actions">
                <button className='btn-edit-profile' onClick={() => setDropdownOpen(!dropdownOpen)} aria-expanded={dropdownOpen} aria-haspopup="true">
                    Изменить данные
                </button>
                {dropdownOpen && (
                    <div className="dropdown-menu-profile">
                        <button className="dropdown-item-profile" onClick={() => handleSelect('email')}>
                            Изменить email
                        </button>
                        <button className="dropdown-item-profile" onClick={() => handleSelect('password')}>
                            Изменить пароль
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;