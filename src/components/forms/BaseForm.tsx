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
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
} 