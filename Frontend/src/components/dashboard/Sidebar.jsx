import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Store, X } from 'lucide-react';

const Sidebar = ({ role = 'vendor' }) => {
    const location = useLocation();

    // Define routes based on role
    const vendorLinks = [
        { path: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/vendor/products', icon: Package, label: 'My Products' },
        { path: '/vendor/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/vendor/settings', icon: Settings, label: 'Settings' },
    ];

    const adminLinks = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { path: '/admin/vendors', icon: Store, label: 'Vendors' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/products', icon: Package, label: 'All Products' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'All Orders' },
        { path: '/admin/settings', icon: Settings, label: 'Platform Settings' },
    ];

    const links = role === 'admin' ? adminLinks : vendorLinks;

    return (
        <aside className="w-64 bg-brand-dark text-white flex flex-col h-screen fixed left-0 top-0 z-30 shadow-xl transition-all duration-300">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-white/10">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Store className="text-brand" size={24} />
                    <span>NextGen<span className="text-brand">Store</span></span>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-brand text-white shadow-md'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <link.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                            <span className="font-medium">{link.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Profile / Logout Area */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={() => console.log("Logout")}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-white/5 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
