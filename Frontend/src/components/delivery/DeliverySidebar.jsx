import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    History,
    User,
    LogOut,
    Truck,
    Shield,
    Star,
    ChevronRight
} from 'lucide-react';

const DeliverySidebar = ({ user }) => {
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

    return (
        <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 z-50 hidden lg:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Logo Section */}
            <div className="h-24 flex items-center px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 border border-emerald-500/20">
                        <Truck size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tighter leading-none">NEXTGEN</h1>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1.5 opacity-80">Delivery OS</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">Operations Console</p>
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
                            flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 translate-x-1'
                                : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'
                            }
                        `}
                    >
                        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-tight">
                            <link.icon size={20} className={({ isActive }) => isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'} />
                            <span>{link.label}</span>
                        </div>
                        <ChevronRight size={16} className={`transition-transform duration-300 ${({ isActive }) => isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-6 bg-gray-50/50 mt-auto border-t border-gray-100/50">
                <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-100">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-900 truncate tracking-tight">{user?.username}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Star size={10} className="fill-emerald-600 text-emerald-600" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">4.9 Specialist</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 group border border-rose-100"
                    >
                        <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        Terminate Session
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DeliverySidebar;
