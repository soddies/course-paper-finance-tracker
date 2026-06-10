import {useState, useEffect} from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
                setIsAdmin(userData.role === 'admin');
            } catch (err) {
                console.error('Parse user error:', err);
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }

        setIsLoading(false);
    }, []);

    return {user, isAdmin, isLoading};
};