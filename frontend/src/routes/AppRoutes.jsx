import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Home from '../pages/home'
import Staking from '../pages/staking';
import EmailVerify from '../pages/EmailVerify';
import { useAuth } from '../context/AuthContext';

// Loading component
const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center bg-[#0A0E15]">
    <div className="text-[#00E8FF] text-xl">Loading...</div>
  </div>
);

// Protected route wrapper - requires authentication
const ProtectedRoute = ({ children, requireVerified = true }) => {
  const { isAuthenticated, isEmailVerified, loading, initialized } = useAuth();
  
  if (!initialized || loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  // If email verification is required but user isn't verified
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return children;
};

// Public routes - only accessible if NOT logged in
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  
  if (!initialized || loading) {
    return <LoadingScreen />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// Auth routes - only accessible if logged in, but don't require verification
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  
  if (!initialized || loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      
      {/* Auth Routes - Requires login but not email verification */}
      <Route
        path="/verify-email"
        element={
          <AuthRoute>
            <EmailVerify />
          </AuthRoute>
        }
      />
      
      {/* Protected Routes - Requires both login and email verification */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path='/staking'
        element={
          <ProtectedRoute>
            <Staking />
          </ProtectedRoute>
        }
      />
      
      {/* Default routes */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default AppRoutes;