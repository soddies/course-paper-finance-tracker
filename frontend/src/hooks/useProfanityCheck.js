import { useState, useCallback } from 'react';
import { containsProfanity } from '../utils/profanityFilter';

export const useProfanityCheck = () => {
    const [profanityError, setProfanityError] = useState('');

    const checkText = useCallback((text, fieldName = 'Текст') => {
        if (!text || text.trim() === '') {
            setProfanityError('');
            return true;
        }
        
        if (containsProfanity(text)) {
            setProfanityError(`${fieldName} содержит недопустимые слова`);
            return false;
        }
        
        setProfanityError('');
        return true;
    }, []);

    const clearError = useCallback(() => {
        setProfanityError('');
    }, []);

    return { profanityError, checkText, clearError };
};