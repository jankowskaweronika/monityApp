import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { DashboardView } from './pages/DashboardView';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PasswordResetPage } from './pages/auth/PasswordResetPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { SettingsPage } from './pages/SettingsPage';
import { SessionChecker } from './components/auth/SessionChecker';
import { useAppSelector } from './store/hooks';
import { RootState } from './store/store';

// Root layout component that includes SessionChecker
const RootLayout = () => {
  return (
    <>
      <SessionChecker />
      <Outlet />
    </>
  );
};

// Auth guard component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
};

// Public route component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  return isAuthenticated ? <Navigate to="/" /> : <>{children}</>;
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <DashboardView />,
      },
      {
        path: '/settings',
        element: (
          <AuthGuard>
            <SettingsPage />
          </AuthGuard>
        ),
      },
      {
        path: '/auth',
        children: [
          {
            path: 'login',
            element: (
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            ),
          },
          {
            path: 'register',
            element: (
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            ),
          },
          {
            path: 'reset-password',
            element: (
              <PublicRoute>
                <PasswordResetPage />
              </PublicRoute>
            ),
          },
          {
            path: 'callback',
            element: <AuthCallbackPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
  },
}); 