import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { PasswordResetForm } from '../../components/auth/PasswordResetForm';
import { supabase } from '../../db/supabase.client';
import { useAppDispatch } from '../../store/hooks';
import { setError } from '../../store/authSlice';

export const PasswordResetPage: React.FC = () => {
    const dispatch = useAppDispatch();

    const handlePasswordReset = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-confirmation`,
            });

            if (error) {
                dispatch(setError(error.message));
                throw error;
            }
        } catch (err) {
            throw err;
        }
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email and we'll send you instructions to reset your password"
        >
            <PasswordResetForm onSubmit={handlePasswordReset} />
        </AuthLayout>
    );
};