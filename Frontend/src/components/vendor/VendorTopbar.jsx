import React from 'react';
import { Search, Bell, Menu, User, Settings, LogOut, Moon, Sun, ChevronDown, Rocket } from 'lucide-react';

const VendorTopbar = ({ pageTitle, user, onToggleSidebar, onMobileToggle }) => {

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300">
            {/* Left Section: Title & Mobile Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileToggle}
                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-emerald-600 rounded-xl lg:hidden transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight leading-none uppercase">{pageTitle}</h2>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Live Ops Panel</p>
                    </div>
                </div>
            </div>

            {/* Middle Section: Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8 group">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search products, orders, or analytics..."
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-12 pr-4 text-xs font-medium focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-3">
                {/* System Actions */}
                <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-gray-100">
                    <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-emerald-600 rounded-xl transition-all relative">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2.5 bg-gray-50 text-gray-400 hover:text-emerald-600 rounded-xl transition-all">
                        <Moon size={18} />
                    </button>
                </div>

                {/* Merchant Identity */}
                <div className="flex items-center gap-3 pl-2 group cursor-pointer relative py-2">
                    <div className="flex flex-col items-end text-right hidden sm:flex">
                        <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">{user?.username || 'Vendor'}</p>
                        <div className="flex items-center gap-1">
                            <Rocket size={10} className="text-emerald-600" />
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Verified</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-emerald-100 border-2 border-white transition-transform group-hover:scale-105">
                            {user?.username?.charAt(0).toUpperCase() || 'V'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-lg border-2 border-white"></div>
                    </div>
                    <ChevronDown size={14} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />

                    {/* Simple Dropdown simulation (UI only for now) */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                            <User size={14} /> Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                            <Settings size={14} /> Settings
                        </button>
                        <div className="h-px bg-gray-50 my-1 mx-2" />
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default VendorTopbar;
