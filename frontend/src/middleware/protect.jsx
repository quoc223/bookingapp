// ProtectedRoutePatient.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const ProtectedRoutePatient = ({
                                   requiredRoles = ['PATIENT', 'ADMIN'],
                                   redirectPath = '/'
                               }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // Check role if roles are specified
    if (!requiredRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutePatient;
