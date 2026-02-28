import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState({ username: 'Admin', email: '', role: 'ADMIN' });

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userRole = localStorage.getItem('role');

        if (!token) {
            window.location.href = '/admin/login';
            return;
        }

        if (userRole !== 'SUPER_ADMIN' && userRole !== 'SUB_ADMIN' && userRole !== 'ADMIN') {
            window.location.href = '/';
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
    }, [location, navigate]);

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
            <AdminSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
                user={user}
            />

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                } ml-0`}>
                <AdminTopbar
                    pageTitle={getPageTitle()}
                    user={user}
                    onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
                />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
