import React from 'react';
import { useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { BaseForm } from '../forms/BaseForm';
import { FormInput } from '../forms/FormInput';
import { useRegisterForm } from '@/hooks/useAuthForm';
import type { RegisterFormData } from '@/validations/authSchema';

interface RegisterFormProps {
    onSubmit: (data: Omit<RegisterFormData, 'confirmPassword'>) => Promise<void>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
    const { form, formErrors, isSubmitting, handleSubmit } = useRegisterForm();
    const password = useWatch({ control: form.control, name: 'password' });

    const handleFormSubmit = async (data: RegisterFormData) => {
        try {
            const { confirmPassword, ...submitData } = data;
            await onSubmit(submitData);
        } catch (error) {
            form.setError('root', {
                type: 'manual',
                message: error instanceof Error ? error.message : 'An error occurred during registration'
            });
        }
    };

    const getPasswordRequirementClass = (requirement: (password: string) => boolean) => {
        return password && requirement(password)
            ? 'text-green-600 dark:text-green-400'
            : 'text-muted-foreground';
    };

    return (
        <div className="space-y-4">
            <BaseForm form={form} onSubmit={handleFormSubmit}>
                <FormInput
                    name="fullName"
                    label="Full Name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    data-testid="register-fullname-input"
                />
                <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    data-testid="register-email-input"
                />
                <div className="space-y-2">
                    <FormInput
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        data-testid="register-password-input"
                    />
                    <FormInput
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        data-testid="register-confirm-password-input"
                    />
                    <div className="text-xs space-y-1.5">
                        <p className="text-muted-foreground">Password requirements:</p>
                        <ul className="space-y-1">
                            <li className={`flex items-center gap-1.5 ${getPasswordRequirementClass(p => p.length >= 8)}`}>
                                <span className="text-xs">{password && password.length >= 8 ? '✓' : '○'}</span>
                                At least 8 characters long
                            </li>
                            <li className={`flex items-center gap-1.5 ${getPasswordRequirementClass(p => /[A-Z]/.test(p))}`}>
                                <span className="text-xs">{password && /[A-Z]/.test(password) ? '✓' : '○'}</span>
                                One uppercase letter
                            </li>
                            <li className={`flex items-center gap-1.5 ${getPasswordRequirementClass(p => /[a-z]/.test(p))}`}>
                                <span className="text-xs">{password && /[a-z]/.test(password) ? '✓' : '○'}</span>
                                One lowercase letter
                            </li>
                            <li className={`flex items-center gap-1.5 ${getPasswordRequirementClass(p => /[0-9]/.test(p))}`}>
                                <span className="text-xs">{password && /[0-9]/.test(password) ? '✓' : '○'}</span>
                                One number
                            </li>
                            <li className={`flex items-center gap-1.5 ${getPasswordRequirementClass(p => /[@$!%*?&]/.test(p))}`}>
                                <span className="text-xs">{password && /[@$!%*?&]/.test(password) ? '✓' : '○'}</span>
                                One special character (@$!%*?&)
                            </li>
                        </ul>
                    </div>
                </div>
                {formErrors.root && (
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive" data-testid="register-error-message">
                        {formErrors.root.message}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    data-testid="register-submit-button"
                >
                    {isSubmitting ? 'Creating account...' : 'Create account with Email'}
                </button>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t" />
                    </div>
                </div>
                <div className="text-sm text-center text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-primary hover:underline underline-offset-4">
                        Sign in
                    </Link>
                </div>
            </BaseForm>
        </div>
    );
};