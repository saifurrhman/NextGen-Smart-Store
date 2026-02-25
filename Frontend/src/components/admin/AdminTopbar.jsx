import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, User, Menu } from 'lucide-react';

const AdminTopbar = ({ pageTitle = 'Dashboard', user, onToggleSidebar }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
            {/* Left — Page Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-dark transition-colors lg:hidden"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-lg font-bold text-brand-dark">{pageTitle}</h1>
            </div>

            {/* Center — Search */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search data, users, or reports"
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
                    />
                    <Search
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                    />
                </div>
            </div>

            {/* Right — Notification, Theme, Avatar */}
            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <button className="relative p-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-brand-dark transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-functional-error rounded-full ring-2 ring-white" />
                </button>

                {/* Theme toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-brand-dark transition-colors"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* User Avatar */}
                <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 hover:ring-brand/30 transition-all">
                    {(user?.username || 'A').charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
