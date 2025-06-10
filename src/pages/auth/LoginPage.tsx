import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../db/supabase.client';

interface LocationState {
    message?: string;
}

export const LoginPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { message } = (location.state as LocationState) || {};

    const handleLogin = async (data: { email: string; password: string }) => {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            throw error;
        }

        if (authData.user) {
            // Login successful, redirect to dashboard
            navigate('/dashboard');
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