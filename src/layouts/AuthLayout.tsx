import React from 'react';
import { Card } from '../components/ui/card';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
            <Card className="w-full max-w-md p-8">
                <div className="space-y-2 text-center mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>
                {children}
            </Card>
        </div>
    );
};