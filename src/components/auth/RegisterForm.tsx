import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FormField } from './FormField';
import { Link } from 'react-router-dom';

interface RegisterFormProps {
    onSubmit: (data: { fullName: string; email: string; password: string }) => Promise<void>;
}

interface ValidationErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

interface PasswordRequirement {
    regex: RegExp;
    message: string;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
    { regex: /.{8,}/, message: 'At least 8 characters long' },
    { regex: /[A-Z]/, message: 'One uppercase letter' },
    { regex: /[a-z]/, message: 'One lowercase letter' },
    { regex: /[0-9]/, message: 'One number' },
    { regex: /[@$!%*?&]/, message: 'One special character (@$!%*?&)' }
];

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordRequirements, setPasswordRequirements] = useState<boolean[]>(
        new Array(PASSWORD_REQUIREMENTS.length).fill(false)
    );

    const validatePassword = (password: string) => {
        return PASSWORD_REQUIREMENTS.map(req => req.regex.test(password));
    };

    const validateField = (name: keyof typeof formData, value: string) => {
        const errors: ValidationErrors = { ...validationErrors };

        switch (name) {
            case 'fullName':
                if (value.trim().length < 2) {
                    errors.fullName = 'Full name must be at least 2 characters long';
                } else {
                    delete errors.fullName;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.email = 'Please enter a valid email address';
                } else {
                    delete errors.email;
                }
                break;

            case 'password':
                const requirements = validatePassword(value);
                setPasswordRequirements(requirements);
                if (!requirements.every(Boolean)) {
                    errors.password = 'Password does not meet all requirements';
                } else {
                    delete errors.password;
                }
                // Check confirmation match whenever password changes
                if (formData.confirmPassword && value !== formData.confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
                } else {
                    delete errors.confirmPassword;
                }
                break;

            case 'confirmPassword':
                if (value !== formData.password) {
                    errors.confirmPassword = 'Passwords do not match';
                } else {
                    delete errors.confirmPassword;
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
            const { confirmPassword, ...submitData } = formData;
            await onSubmit(submitData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                label="Full Name"
                type="text"
                name="fullName"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={handleFieldChange}
                error={validationErrors.fullName}
            />

            <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleFieldChange}
                error={validationErrors.email}
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
                />
                <FormField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleFieldChange}
                    error={validationErrors.confirmPassword}
                />
                <div className="text-xs space-y-1.5">
                    <p className="text-muted-foreground">Password requirements:</p>
                    <ul className="space-y-1">
                        {PASSWORD_REQUIREMENTS.map((req, index) => (
                            <li
                                key={req.message}
                                className={`flex items-center gap-1.5 ${passwordRequirements[index]
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-muted-foreground'
                                    }`}
                            >
                                <span className="text-xs">
                                    {passwordRequirements[index] ? '✓' : '○'}
                                </span>
                                {req.message}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {error && (
                <div
                    className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                    data-test-id="register-error-message"
                >
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading || Object.keys(validationErrors).length > 0}
            >
                {isLoading ? 'Creating account...' : 'Create account with Email'}
            </Button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                </div>
            </div>


            <div className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link
                    to="/auth/login"
                    className="text-primary hover:underline underline-offset-4"
                >
                    Sign in
                </Link>
            </div>
        </form>
    );
};