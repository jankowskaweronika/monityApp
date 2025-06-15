import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .email('Nieprawidłowy adres email')
    .min(1, 'Email jest wymagany'),
  password: z.string()
    .min(1, 'Hasło jest wymagane')
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, 'Imię i nazwisko musi mieć minimum 2 znaki')
    .max(100, 'Imię i nazwisko jest za długie'),
  email: z.string()
    .email('Nieprawidłowy adres email')
    .min(1, 'Email jest wymagany'),
  password: z.string()
    .min(8, 'Hasło musi mieć minimum 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
    .regex(/[a-z]/, 'Hasło musi zawierać małą literę')
    .regex(/[0-9]/, 'Hasło musi zawierać cyfrę')
    .regex(/[@$!%*?&]/, 'Hasło musi zawierać znak specjalny (@$!%*?&)'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hasła nie są identyczne',
  path: ['confirmPassword']
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const passwordResetSchema = z.object({
  email: z.string()
    .email('Nieprawidłowy adres email')
    .min(1, 'Email jest wymagany')
});

export type PasswordResetFormData = z.infer<typeof passwordResetSchema>; 