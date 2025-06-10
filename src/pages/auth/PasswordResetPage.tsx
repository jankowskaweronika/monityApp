import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { PasswordResetForm } from '../../components/auth/PasswordResetForm';

export const PasswordResetPage: React.FC = () => {
    const handlePasswordReset = async (email: string) => {
        // Password reset logic will be implemented later
        console.log('Password reset requested for:', email);
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