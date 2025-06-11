import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../db/supabase.client';
import { useAppDispatch } from '../../store/hooks';
import { setError } from '../../store/authSlice';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleRegister = async (data: { fullName: string; email: string; password: string }) => {
        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                    }
                }
            });

            if (error) {
                dispatch(setError(error.message));
                throw error;
            }

            if (authData.user) {
                navigate('/auth/login', {
                    state: {
                        message: 'Registration successful! Please check your email to verify your account.'
                    }
                });
            }
        } catch (err) {
            throw err;
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Enter your details to get started"
        >
            <RegisterForm onSubmit={handleRegister} />
        </AuthLayout>
    );
};