import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    History,
    User,
    LogOut,
    Truck,
    Shield,
    Star,
    ChevronRight,
    X
} from 'lucide-react';

const DeliverySidebar = ({ collapsed, onToggle, isMobileOpen, onMobileClose, user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navLinks = [
        { path: '/delivery/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/delivery/tasks', icon: Package, label: 'Active Tasks' },
        { path: '/delivery/history', icon: History, label: 'Service History' },
        { path: '/delivery/profile', icon: User, label: 'Personal Profile' },
    ];

    const renderLink = (link) => {
        const isActive = location.pathname === link.path;

        return (
            <li key={link.path}>
                <NavLink
                    to={link.path}
                    title={collapsed ? link.label : ''}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-600'
                        }`}
                >
                    <link.icon
                        size={18}
                        className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-500'}
                    />
                    {!collapsed && <span>{link.label}</span>}
                </NavLink>
            </li>
        );
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen z-50 flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${collapsed ? 'w-[90px]' : 'w-[266px]'}`}
        >
            {/* Logo */}
            <div className="h-20 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                        D
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-bold text-gray-800 tracking-tight">Delivery</span>
                    )}
                </div>
                <button
                    onClick={onMobileClose}
                    className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {!collapsed && (
                    <p className="text-[10px] font-bold text-gray-400 px-4 mb-3 uppercase tracking-widest">Console</p>
                )}
                <ul className="space-y-1">
                    {navLinks.map(renderLink)}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 space-y-4 bg-white mt-auto border-t border-gray-50">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2'}`}>
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center text-emerald-600 font-bold">
                        {(user?.username || 'S').charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.username || 'Specialist'}</p>
                            <p className="text-[11px] font-medium text-gray-500 truncate">Delivery Partner</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            onClick={handleLogout}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default DeliverySidebar;
