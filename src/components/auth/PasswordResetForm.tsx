import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FormField } from './FormField';
import { Link } from 'react-router-dom';
import { Card } from '../ui/card';
import { CheckCircle2 } from 'lucide-react';

interface PasswordResetFormProps {
    onSubmit: (email: string) => Promise<void>;
}

interface ValidationErrors {
    email?: string;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const validateEmail = (value: string) => {
        const errors: ValidationErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            errors.email = 'Please enter a valid email address';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            return;
        }

        setIsLoading(true);

        try {
            await onSubmit(email);
            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <Card className="p-6 text-center space-y-4">
                <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                    <h3 className="text-lg font-semibold">Check your email</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        We've sent password reset instructions to <strong>{email}</strong>.
                        Please check your inbox and follow the link provided.
                    </p>
                </div>

                <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the email?{' '}
                        <button
                            type="button"
                            onClick={() => setIsSuccess(false)}
                            className="text-primary hover:underline underline-offset-4"
                        >
                            Click here to try again
                        </button>
                    </p>
                </div>

                <div className="pt-2">
                    <Link
                        to="/auth/login"
                        className="text-sm text-primary hover:underline underline-offset-4"
                    >
                        Back to login
                    </Link>
                </div>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={handleEmailChange}
                error={validationErrors.email}
                autoComplete="email"
            />

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
                {isLoading ? 'Sending instructions...' : 'Send reset instructions'}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
                Remember your password?{' '}
                <Link
                    to="/auth/login"
                    className="text-primary hover:underline underline-offset-4"
                >
                    Back to login
                </Link>
            </div>
        </form>
    );
};