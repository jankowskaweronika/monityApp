import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

interface BaseFormProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function BaseForm<T extends Record<string, any>>({
  form,
  onSubmit,
  children,
  className
}: BaseFormProps<T>) {
  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling can be added here if needed
      console.error('Form submission error:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
} 