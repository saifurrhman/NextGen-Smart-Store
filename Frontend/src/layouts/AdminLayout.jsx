import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState({ username: 'Admin', email: '', role: 'ADMIN' });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userRole = localStorage.getItem('role');
        const userObjStr = localStorage.getItem('user');

        if (!token) {
            navigate('/admin/login');
            return;
        }

        // Try to get role from 'role' or nested in 'user' object
        let currentRole = userRole;
        if (!currentRole || currentRole === 'UNDEFINED' || currentRole === 'null') {
            try {
                const userData = JSON.parse(userObjStr || '{}');
                currentRole = userData.role || userData.user_role;
            } catch (e) { }
        }

        const normalizedRole = currentRole?.toString().trim().toUpperCase();
        const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN'];
        const isAdmin = ADMIN_ROLES.includes(normalizedRole);

        console.log('[AdminLayout] Security Check:', { role: normalizedRole, isAdmin });

        if (!isAdmin) {
            console.warn('[AdminLayout] Unauthorized access attempt by:', normalizedRole);
            // ONLY redirect if we are SURE it's not an admin. 
            // If role is somehow missing but token exists, we stay (safer than bouncing to vendor)
            if (normalizedRole) {
                if (['VENDOR', 'SELLER'].includes(normalizedRole)) {
                    navigate('/vendor/dashboard');
                } else if (normalizedRole === 'DELIVERY') {
                    navigate('/delivery/dashboard');
                } else {
                    navigate('/');
                }
            }
            return;
        }

        // Load user data
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData.username || userData.email) {
                setUser(userData);
            }
        } catch (e) {
            // ignore parse errors
        }
        // Close mobile sidebar on navigation
        setIsMobileOpen(false);
    }, [location.pathname, navigate]);

    // Get current page title from path
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        const titles = {
            'dashboard': 'Dashboard',
            'profile': 'Admin Profile',
            'orders': 'Order Management',
            'customers': 'Customers',
            'coupons': 'Coupon Codes',
            'categories': 'Categories',
            'transactions': 'Transactions',
            'brands': 'Brands',
            'products': 'Product List',
            'add-product': 'Add Product',
            'product-media': 'Product Media',
            'reviews': 'Product Reviews',
            'admin-role': 'Admin Role',
            'control-authority': 'Control Authority',
            'vendors': 'Vendors',
            'users': 'Users',
            'settings': 'Platform Settings',
        };
        return titles[path] || 'Admin Panel';
    };

    return (
        <div className="flex min-h-screen bg-bg-page">
            {/* Sidebar Overlay for Mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <DashboardSidebar
                role="ADMIN"
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
                user={user}
            />

            {/* Main Content */}
            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[90px]' : 'lg:ml-[266px]'
                } ml-0 overflow-y-auto`}>
                <DashboardTopbar
                    pageTitle={getPageTitle()}
                    user={user}
                    role="ADMIN"
                    onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
                />
                <main className="flex-1 p-3 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
