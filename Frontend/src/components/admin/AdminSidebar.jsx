import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Shield, Settings, LogOut, Store, ChevronLeft, ChevronRight, ExternalLink,
    FileText, DollarSign, Megaphone, Boxes, HeadphonesIcon,
    ChevronDown, Image, BookOpen, FolderOpen, Navigation, Search,
    TrendingUp, CreditCard, Wallet, Map, Flag, Ticket, Users, BarChart2, Truck,
    Home, Bot, AlignLeft, X, ShieldAlert, Package, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag } from 'lucide-react';

const AdminSidebar = ({ collapsed, onToggle, isMobileOpen, onMobileClose, user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/orders/all', icon: Ticket, label: 'B2C Orders' },
        { path: '/admin/bulk-orders', icon: Package, label: 'Bulk Orders' },
        { path: '/admin/products/all', icon: Store, label: 'Products' },
        { path: '/admin/product-requests', icon: MessageSquare, label: 'Add Requests' },
        { path: '/admin/products/attributes', icon: Tag, label: 'Attributes' },
        { path: '/admin/users/all', icon: Users, label: 'Users' },
        { path: '/admin/vendors/all', icon: Store, label: 'Vendors' },
        { path: '/admin/finance/revenue', icon: DollarSign, label: 'Financials' },
        { path: '/admin/marketing/campaigns', icon: Megaphone, label: 'Marketing' },
        { path: '/admin/operations/delivery/daily', icon: Boxes, label: 'Operations' },
        { path: '/admin/support/tickets/all', icon: HeadphonesIcon, label: 'Support' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const activeClass = "bg-emerald-600/10 text-emerald-600 shadow-sm border-r-4 border-emerald-600";
    const inactiveClass = "text-gray-500 hover:bg-gray-50 hover:text-emerald-600";

    const handleLogout = () => {
        localStorage.clear();
        navigate('/admin/login');
    };

    return (
        <aside className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-100 transition-all duration-300 transform 
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
            ${collapsed ? 'w-[90px]' : 'w-[266px]'}`}>

            {/* Logo Section */}
            <div className="h-[80px] flex items-center px-6 mb-4 border-b border-gray-50">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100 border-2 border-white">
                        <ShieldAlert className="text-white" size={22} strokeWidth={2.5} />
                    </div>
                    {!collapsed && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                            <h1 className="text-lg font-bold text-gray-800 tracking-tight leading-none uppercase">Admin Hub</h1>
                            <p className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase mt-0.5">Control Authority</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar pb-10">

                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group
                            ${isActive ? activeClass : inactiveClass}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0 transition-transform group-hover:scale-110" />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Area */}
            <div className="absolute bottom-6 left-0 w-full px-3">
                <button
                    onClick={onToggle}
                    className="hidden lg:flex w-full items-center justify-center py-3 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl border border-gray-100 transition-colors group mb-4"
                >
                    {collapsed ? <ChevronRight size={18} /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Collapse View</span>
                        </div>
                    )}
                </button>

                {!collapsed && (
                    <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-100 flex items-center gap-3 border-2 border-white animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 font-bold text-lg">
                            {user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1">Supervisor</p>
                            <p className="text-xs font-bold text-white truncate uppercase">{user?.username || 'Admin User'}</p>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-white/50 hover:text-white transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                )}
                {collapsed && (
                    <div className="flex justify-center">
                        <button onClick={handleLogout} className="p-3 bg-emerald-600 rounded-xl text-white border-2 border-white shadow-lg">
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default AdminSidebar;
