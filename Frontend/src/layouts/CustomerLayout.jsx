import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const CustomerLayout = () => {
    const location = useLocation();
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    const userRole = localStorage.getItem('user_role') || localStorage.getItem('role');

    // Not logged in → redirect to customer login
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Logged in as wrong role (admin/seller) → redirect to their respective login
    if (userRole && userRole !== 'customer' && userRole !== 'user') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default CustomerLayout;
