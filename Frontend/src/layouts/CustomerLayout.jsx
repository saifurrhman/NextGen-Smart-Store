import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

const CustomerLayout = () => {
    const location = useLocation();
    const token = localStorage.getItem('authToken');
    const normalizedRole = (localStorage.getItem('role') || localStorage.getItem('user_role'))?.toUpperCase();

    // Not logged in → redirect to customer login
    if (!token) {
        return <Navigate to="/customer/login" state={{ from: location }} replace />;
    }

    // Role-based protection: Redirect non-customers to their own portals
    const isCustomer = !normalizedRole || normalizedRole === 'CUSTOMER' || normalizedRole === 'USER';
    if (!isCustomer) {
        const dashboardMap = {
            'ADMIN': '/admin/dashboard',
            'SUPER_ADMIN': '/admin/dashboard',
            'SUPERADMIN': '/admin/dashboard',
            'SUB_ADMIN': '/admin/dashboard',
            'SUBADMIN': '/admin/dashboard',
            'VENDOR': '/vendor/dashboard',
            'SELLER': '/vendor/dashboard',
            'DELIVERY': '/delivery/dashboard'
        };
        return <Navigate to={dashboardMap[normalizedRole] || '/'} replace />;
    }

    return <Outlet />;
};

export default CustomerLayout;
