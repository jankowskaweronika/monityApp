import React from 'react';
import { Button } from '../ui/button';
import { useAppDispatch } from '../../store/hooks';
import { setError } from '../../store/authSlice';
import { supabase } from '../../db/supabase.client';
import { Provider } from '@supabase/supabase-js';

interface SocialAuthButtonsProps {
    isLoading?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ isLoading }) => {
    const dispatch = useAppDispatch();

    const handleSocialLogin = async (provider: Provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                dispatch(setError(error.message));
                throw error;
            }
        } catch (err) {
            console.error('Social auth error:', err);
        }
    };

    return (
        <div className="space-y-3">
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                <span>Continue with Google</span>
            </Button>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#039be5" d="M24 5a19 19 0 1 0 0 38 19 19 0 1 0 0-38z" />
                    <path fill="#fff" d="M26.572 29.036h4.917l.772-4.995h-5.69v-2.73c0-2.075.678-3.915 2.619-3.915h3.119v-4.359c-.548-.074-1.707-.236-3.897-.236-4.573 0-7.254 2.415-7.254 7.917v3.323h-4.701v4.995h4.701v13.729c.931.14 1.874.235 2.842.235.875 0 1.729-.08 2.572-.194v-13.77z" />
                </svg>
                <span>Continue with Facebook</span>
            </Button>
        </div>
    );
};