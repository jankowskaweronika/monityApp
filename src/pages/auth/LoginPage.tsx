import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../db/supabase.client';
import { useAppDispatch } from '../../store/hooks';
import { setError, setUser } from '../../store/authSlice';

interface LocationState {
    message?: string;
}

export const LoginPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { message } = (location.state as LocationState) || {};

    const handleLogin = async (data: { email: string; password: string }) => {
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                dispatch(setError(error.message));
                throw error;
            }

            if (authData.user) {
                dispatch(setUser(authData.user));
                navigate('/');
            }
        } catch (err) {
            throw err;
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your account"
        >
            {message && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-sm text-center">
                    {message}
                </div>
            )}
            <LoginForm onSubmit={handleLogin} />
        </AuthLayout>
    );
};