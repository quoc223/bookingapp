// ProtectedRouteDoctor.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const ProtectedRouteDoctor = ({
                                  requiredRoles = ['DOCTOR'],
                                  redirectPath = '/doctor/login'
                              }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Not authenticated
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // Check role if roles are specified
    if (!requiredRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRouteDoctor;
