import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, AlignLeft } from 'lucide-react';

const AdminTopbar = ({ pageTitle = 'Dashboard', onToggleSidebar, onMobileToggle }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="h-20 bg-white flex items-center justify-between px-8 sticky top-0 z-20">
            {/* Left — Page Title */}
            <div className="flex items-center gap-4 lg:w-1/4">
                <button
                    onClick={onMobileToggle}
                    className="p-2.5 rounded-xl bg-[#f0f9f4] text-emerald-600 border border-emerald-50 hover:bg-emerald-500 hover:text-white transition-all lg:hidden shadow-sm shadow-emerald-100"
                >
                    <AlignLeft size={20} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">{pageTitle}</h1>
            </div>

            {/* Center — Search */}
            <div className="flex-1 max-w-[480px] hidden md:block mx-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search data, users, or reports"
                        className="w-full pl-6 pr-12 py-2.5 bg-[#f8f9fa] border border-transparent rounded-full text-[13px] font-medium text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:bg-white transition-all shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Search
                            className="text-gray-400"
                            size={16}
                        />
                    </div>
                </div>
            </div>

            {/* Right — Notification, Theme, Avatar */}
            <div className="flex items-center justify-end gap-3 md:gap-6 lg:w-1/4">

                {/* Notification bell */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell size={20} strokeWidth={1.5} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                </button>

                {/* Theme toggle (Switch Style) */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-14 h-7 rounded-full flex items-center px-1 transition-colors cursor-pointer ${darkMode ? 'bg-gray-700' : 'bg-[#eaf5ed]'}`}
                >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}>
                        {darkMode ? <Moon size={12} className="text-gray-700" /> : <Sun size={12} className="text-gray-400" />}
                    </div>
                </button>

                {/* User Avatar Only */}
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-500/30 transition-all ml-2">
                    <img
                        src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=eaf4f0"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
