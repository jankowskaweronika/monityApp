import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    className,
    type = "text",
    ...props
}) => {
    const id = props.id || props.name;

    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </div>
    );
};