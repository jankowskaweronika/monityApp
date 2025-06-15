import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  loginSchema, 
  registerSchema, 
  passwordResetSchema,
  type LoginFormData,
  type RegisterFormData,
  type PasswordResetFormData
} from '@/validations/authSchema';

export const useLoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  });

  return {
    form,
    formErrors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit
  };
};

export const useRegisterForm = () => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });

  return {
    form,
    formErrors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit
  };
};

export const usePasswordResetForm = () => {
  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: 'onBlur'
  });

  return {
    form,
    formErrors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit
  };
}; 