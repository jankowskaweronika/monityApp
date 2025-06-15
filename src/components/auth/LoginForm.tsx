import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { BaseForm } from '../forms/BaseForm';
import { FormInput } from '../forms/FormInput';
import { useLoginForm } from '@/hooks/useAuthForm';
import type { LoginFormData } from '@/validations/authSchema';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const { form, formErrors, isSubmitting, handleSubmit } = useLoginForm();

    const handleFormSubmit = async (data: LoginFormData) => {
        try {
            await onSubmit(data);
        } catch (error) {
            form.setError('root', {
                type: 'manual',
                message: error instanceof Error ? error.message : 'An error occurred during login'
            });
        }
    };

    return (
        <BaseForm
            form={form}
            onSubmit={handleFormSubmit}
            className="space-y-4"
        >
            <FormInput
                label="Email"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                data-testid="login-email-input"
            />

            <div className="space-y-2">
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    data-testid="login-password-input"
                />

                <div className="flex justify-end">
                    <Link
                        to="/auth/reset-password"
                        className="text-sm text-primary hover:underline underline-offset-4"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </div>

            {formErrors.root && (
                <div
                    className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                    data-testid="login-error-message"
                >
                    {formErrors.root.message}
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                data-testid="login-submit-button"
            >
                {isSubmitting ? 'Signing in...' : 'Sign in with Email'}
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                </div>
            </div>

            <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link
                    to="/auth/register"
                    className="text-primary hover:underline underline-offset-4"
                >
                    Sign up
                </Link>
            </div>
        </BaseForm>
    );
};