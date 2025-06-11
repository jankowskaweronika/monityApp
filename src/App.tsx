import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardView } from './pages/DashboardView';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PasswordResetPage } from './pages/auth/PasswordResetPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { SessionChecker } from './components/auth/SessionChecker';
import { useEffect } from 'react';
import { supabase } from './db/supabase.client';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setUser } from './store/authSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const setupAuth = async () => {
      // Check current auth state
      const { data: { session } } = await supabase.auth.getSession();
      dispatch(setUser(session?.user || null));

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        dispatch(setUser(session?.user || null));
      });

      return () => subscription.unsubscribe();
    };

    setupAuth();
  }, [dispatch]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <SessionChecker />
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/auth/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/auth/register"
          element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
        />
        <Route
          path="/auth/reset-password"
          element={isAuthenticated ? <Navigate to="/" /> : <PasswordResetPage />}
        />
        <Route
          path="/auth/callback"
          element={<AuthCallbackPage />}
        />

        {/* Dashboard Route - accessible to everyone */}
        <Route
          path="/"
          element={<DashboardView />}
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;