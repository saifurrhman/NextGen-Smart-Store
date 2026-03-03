import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { Home, Package, History, User, LogOut, Truck, AlignLeft, X } from 'lucide-react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardTopbar from '../components/dashboard/DashboardTopbar';

const DeliveryLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
    }, [location]);

    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        const titles = {
            'dashboard': 'Dashboard',
            'tasks': 'Active Tasks',
            'history': 'Service History',
            'profile': 'Personal Profile',
        };
        return titles[path] || 'Delivery Portal';
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar Overlay for Mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <DashboardSidebar
                role="DELIVERY"
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
                user={user}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[90px]' : 'lg:ml-[266px]'
                } ml-0 overflow-y-auto`}>

                <DashboardTopbar
                    pageTitle={getPageTitle()}
                    user={user}
                    role="DELIVERY"
                    onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
                />

                {/* Content Outlet */}
                <main className="flex-1 p-4 md:p-8 lg:p-10 bg-gray-50/20">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-40 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)] lg:hidden">
                    <div className="flex justify-around items-center max-w-lg mx-auto py-3">
                        <NavLink
                            to="/delivery/dashboard"
                            className={({ isActive }) => `flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'bg-emerald-50 shadow-inner' : ''}`}>
                                        <Home size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/delivery/tasks"
                            className={({ isActive }) => `flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'bg-emerald-50 shadow-inner' : ''}`}>
                                        <Package size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Tasks</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/delivery/history"
                            className={({ isActive }) => `flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'bg-emerald-50 shadow-inner' : ''}`}>
                                        <History size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">History</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/delivery/profile"
                            className={({ isActive }) => `flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'bg-emerald-50 shadow-inner' : ''}`}>
                                        <User size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
                                </>
                            )}
                        </NavLink>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default DeliveryLayout;
