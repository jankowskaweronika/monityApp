import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FormField } from './FormField';
import { Link } from 'react-router-dom';

interface LoginFormProps {
    onSubmit: (data: { email: string; password: string }) => Promise<void>;
}

interface ValidationErrors {
    email?: string;
    password?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const validateField = (name: keyof typeof formData, value: string) => {
        const errors: ValidationErrors = { ...validationErrors };

        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.email = 'Please enter a valid email address';
                } else {
                    delete errors.email;
                }
                break;

            case 'password':
                if (value.length < 1) {
                    errors.password = 'Password is required';
                } else {
                    delete errors.password;
                }
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name as keyof typeof formData, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const isValid = Object.keys(formData).every(key =>
            validateField(key as keyof typeof formData, formData[key as keyof typeof formData])
        );

        if (!isValid) {
            return;
        }

        setIsLoading(true);

        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleFieldChange}
                error={validationErrors.email}
                autoComplete="email"
            />

            <div className="space-y-2">
                <FormField
                    label="Password"
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleFieldChange}
                    error={validationErrors.password}
                    autoComplete="current-password"
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

            {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading || Object.keys(validationErrors).length > 0}
            >
                {isLoading ? 'Signing in...' : 'Sign in with Email'}
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
        </form>
    );
};