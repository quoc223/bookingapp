import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth.js'; // Đảm bảo đường dẫn này chính xác

const ProtectedRoute = ({ redirectPath = '/login-dashboard' }) => {
  const { isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    // Consider displaying a loading indicator
    return <div>Loading...</div>;
  }

  if (error) {
    // Handle errors appropriately
    console.error('Authentication error:', error);
    return <Navigate to={redirectPath} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
