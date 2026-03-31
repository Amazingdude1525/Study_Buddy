import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './services/auth';
import { ThemeProvider } from './services/theme';
import LoginPage from './components/Auth/LoginPage';
import OnboardingWizard from './components/Auth/OnboardingWizard';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import FocusRoom from './components/Dashboard/FocusRoom';
import SubjectsRoom from './components/Dashboard/SubjectsRoom';
import MusicRoom from './components/Dashboard/MusicRoom';
import DeveloperProfile from './components/DeveloperProfile';
import AdminDashboard from './components/Admin/AdminDashboard';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (token && user && !user.onboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (!user?.is_admin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { token, user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          token 
            ? (user?.onboarded ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />) 
            : <LoginPage />
        }
      />
      <Route
        path="/onboarding"
        element={!token ? <Navigate to="/login" replace /> : <OnboardingWizard />}
      />
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/focus" element={<FocusRoom />} />
        <Route path="/subjects" element={<SubjectsRoom />} />
        <Route path="/music" element={<MusicRoom />} />
        <Route path="/about" element={<DeveloperProfile />} />
      </Route>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

const App = () => (
  <GoogleOAuthProvider clientId="313350298549-e51tt0cqiq2j8rnld5frgi7naemlqqct.apps.googleusercontent.com">
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);

export default App;
