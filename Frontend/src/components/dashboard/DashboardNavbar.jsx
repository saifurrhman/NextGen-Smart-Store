import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const DashboardNavbar = ({ role = 'Vendor' }) => {
    return (
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-gray-500 hover:text-brand transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-functional-error rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">John Doe</p>
                        <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-brand">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;
