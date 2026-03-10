import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';

const VendorLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState({ username: 'Merchant', email: '', role: 'VENDOR' });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userRole = localStorage.getItem('role');

        if (!token) {
            navigate('/vendor/login');
            return;
        }

        const normalizedRole = userRole?.toUpperCase();
        const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN'].includes(normalizedRole);
        const isVendor = ['VENDOR', 'SELLER'].includes(normalizedRole);

        if (!isVendor && !isAdmin) {
            navigate('/');
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
            'dashboard': 'Vendor Dashboard',
            'products': 'My Inventory',
            'add-product': 'Add New Product',
            'edit-product': 'Edit Product',
            'orders': 'Manage Orders',
            'earnings': 'My Earnings',
            'payouts': 'Payout Requests',
            'reviews': 'Shop Reviews',
            'settings': 'Shop Settings',
            'analytics': 'Sales Analytics',
        };
        return titles[path] || 'Vendor Hub';
    };

    return (
        <div className="flex min-h-screen bg-neutral-50">
            {/* Sidebar Overlay for Mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <DashboardSidebar
                role="VENDOR"
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
                user={user}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 
                ${sidebarCollapsed ? 'lg:ml-[90px]' : 'lg:ml-[266px]'} 
                ml-0 overflow-y-auto`}>

                <DashboardTopbar
                    pageTitle={getPageTitle()}
                    user={user}
                    role="VENDOR"
                    onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
                />

                <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default VendorLayout;
