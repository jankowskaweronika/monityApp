import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardView } from './pages/DashboardView';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PasswordResetPage } from './pages/auth/PasswordResetPage';

const App = () => {
  // This will be replaced with actual auth state check later
  const isAuthenticated = false;

  return (
    <BrowserRouter>
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

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <DashboardView /> : <Navigate to="/auth/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;