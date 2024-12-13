import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const ProtectedRouteAdmin = ({
                            allowedRoles = [],
                            redirectPath = '/doc'
                        }) => {
    const { isAuthenticated, user, isLoading } = useAuth("ADMIN");

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Not authenticated
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // Check role if roles are specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRouteAdmin;
