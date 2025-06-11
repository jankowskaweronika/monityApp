import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { checkSession } from '../../store/authSlice';

export const SessionChecker = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const checkSessionTimeout = useCallback(() => {
        if (isAuthenticated) {
            dispatch(checkSession());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        // Check session every minute
        const intervalId = setInterval(checkSessionTimeout, 60000);

        return () => clearInterval(intervalId);
    }, [checkSessionTimeout]);

    return null;
};