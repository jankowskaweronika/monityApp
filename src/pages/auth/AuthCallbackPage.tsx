import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../db/supabase.client';
import { useAppDispatch } from '../../store/hooks';
import { setError, setUser } from '../../store/authSlice';

export const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    dispatch(setError(error.message));
                    navigate('/auth/login');
                    return;
                }

                if (session?.user) {
                    dispatch(setUser(session.user));
                    navigate('/');
                } else {
                    navigate('/auth/login');
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                dispatch(setError('Authentication failed'));
                navigate('/auth/login');
            }
        };

        handleCallback();
    }, [navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-center">
                <p className="text-lg text-muted-foreground">Completing authentication...</p>
            </div>
        </div>
    );
};