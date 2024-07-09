// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
    roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
    const { isAuthenticated, user, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const userHasRequiredRole = user && roles.some(role => JSON.stringify(user).includes(role));

    if (!isAuthenticated || !userHasRequiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;