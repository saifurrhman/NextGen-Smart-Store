import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Shield, Settings, LogOut, Store, ChevronLeft, ChevronRight, ExternalLink,
    FileText, DollarSign, Megaphone, Boxes, HeadphonesIcon,
    ChevronDown, Image, BookOpen, FolderOpen, Navigation, Search,
    TrendingUp, CreditCard, Wallet, Map, Flag, Ticket, Users, BarChart2, Truck
} from 'lucide-react';


/* ─── Super Admin sub-sections ─── */
const superAdminSubLinks = [
    {
        group: 'Orders', icon: Ticket, items: [
            { path: '/admin/orders/all', label: 'All Orders' },
            { path: '/admin/orders/details', label: 'Order Details' },
            { path: '/admin/orders/reports', label: 'Order Reports' },
            { path: '/admin/orders/refunds', label: 'Refunds & Returns' },
        ]
    },
    {
        group: 'Products', icon: Store, items: [
            { path: '/admin/products/all', label: 'All Products' },
            { path: '/admin/products/add', label: 'Add Product' },
            { path: '/admin/products/categories', label: 'Categories' },
            { path: '/admin/products/attributes', label: 'Attributes' },
            { path: '/admin/products/import', label: 'Bulk Import' },
        ]
    },
    {
        group: 'Users & Vendors', icon: Users, items: [
            { path: '/admin/users/all', label: 'All Users' },
            { path: '/admin/users/customers', label: 'Customers' },
            { path: '/admin/vendors/all', label: 'All Vendors' },
            { path: '/admin/vendors/approval', label: 'Vendor Approval' },
            { path: '/admin/vendors/payouts', label: 'Vendor Payouts' },
        ]
    },
    {
        group: 'Content', path: '/admin/content', icon: BookOpen, items: [
            { path: '/admin/content/banners/hero-sliders', label: 'Banners' },
            { path: '/admin/content/blog/posts', label: 'Blog' },
            { path: '/admin/content/media/library', label: 'Media' },
            { path: '/admin/content/pages/homepage', label: 'Pages' },
        ]
    },
    {
        group: 'Finance', path: '/admin/finance', icon: DollarSign, items: [
            { path: '/admin/finance/revenue', label: 'Revenue' },
            { path: '/admin/finance/reports', label: 'Reports' },
            { path: '/admin/finance/transactions', label: 'Transactions' },
            { path: '/admin/finance/tax', label: 'Tax' },
        ]
    },
    {
        group: 'Marketing', path: '/admin/marketing', icon: Megaphone, items: [
            { path: '/admin/marketing/campaigns', label: 'Campaigns' },
            { path: '/admin/marketing/promotions', label: 'Promotions' },
            { path: '/admin/marketing/coupons', label: 'Coupons' },
            { path: '/admin/marketing/ads', label: 'Ads' },
        ]
    },
    {
        group: 'Operations', path: '/admin/operations', icon: Boxes, items: [
            { path: '/admin/operations/delivery/daily', label: 'Delivery' },
            { path: '/admin/operations/analytics/vendors', label: 'Vendor Support' },
        ]
    },
    {
        group: 'Support', path: '/admin/support', icon: HeadphonesIcon, items: [
            { path: '/admin/support/tickets/all', label: 'Tickets' },
            { path: '/admin/support/kb/articles', label: 'Knowledge Base' },
            { path: '/admin/support/chat/active', label: 'Live Chat' },
        ]
    },
    {
        group: 'Analytics & Settings', icon: BarChart2, items: [
            { path: '/admin/analytics/sales', label: 'Sales Analytics' },
            { path: '/admin/analytics/products', label: 'Product Performance' },
            { path: '/admin/settings/payment', label: 'Payment Gateways' },
            { path: '/admin/settings/tax', label: 'Tax Configuration' },
            { path: '/admin/control-authority', label: 'Control Authority' },
        ]
    }
];

const topLinks = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

const deptLinks = [];

const adminLinks = [
    { path: '/admin/profile', icon: Shield, label: 'Admin role' },
    { path: '/admin/control-authority', icon: Settings, label: 'Control Authority' },
];

const AdminSidebar = ({ collapsed, onToggle, user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Super Admin state removed as all links are now top-level departments

    const [openGroup, setOpenGroup] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };


    const renderLink = (link) => {
        const isActive =
            location.pathname === link.path ||
            (link.path !== '/admin/dashboard' && location.pathname.startsWith(link.path));

        return (
            <li key={link.path}>
                <NavLink
                    to={link.path}
                    title={collapsed ? link.label : ''}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                        }`}
                >
                    <link.icon
                        size={20}
                        className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand'}
                    />
                    {!collapsed && <span>{link.label}</span>}
                </NavLink>
            </li>
        );
    };



    return (
        <aside
            className={`fixed left-0 top-0 h-screen z-30 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* ─── Logo ─── */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                {!collapsed && (
                    <div className="flex items-center gap-2 font-bold text-xl text-brand-dark">
                        <Store className="text-brand" size={22} />
                        <span>
                            NextGen<span className="text-brand">Store</span>
                        </span>
                    </div>
                )}
                {collapsed && <Store className="text-brand mx-auto" size={22} />}
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-dark transition-colors"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* ─── Nav ─── */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 sidebar-scrollbar">

                {/* Main */}
                {!collapsed && (
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-1">Main menu</p>
                )}
                <ul className="space-y-0.5">
                    {topLinks.map(renderLink)}
                </ul>

                {/* Departments */}
                {!collapsed && (
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-1 mt-4">Departments</p>
                )}
                {collapsed && <div className="border-t border-gray-100 mx-2 mb-2" />}

                <ul className="space-y-0.5">
                    {superAdminSubLinks.map((group) => {
                        const Icon = group.icon;
                        const isGroupOpen = openGroup === group.group || (!openGroup && group.items.some(i => location.pathname === i.path)) || location.pathname === group.path;
                        const groupActive = group.items.some(i => location.pathname === i.path) || location.pathname === group.path;

                        return (
                            <li key={group.group}>
                                <button
                                    onClick={() => {
                                        if (group.path && location.pathname !== group.path) {
                                            navigate(group.path);
                                            setOpenGroup(group.group);
                                        } else {
                                            setOpenGroup(isGroupOpen ? '' : group.group);
                                        }
                                    }}
                                    title={collapsed ? group.group : ''}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group-btn ${groupActive
                                        ? 'bg-brand text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                                        }`}
                                >
                                    <Icon size={20} className={groupActive ? 'text-white' : 'text-gray-400 group-hover:text-brand'} />
                                    {!collapsed && (
                                        <>
                                            <span className="flex-1 text-left">{group.group}</span>
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''} ${groupActive ? 'text-white/70' : 'text-gray-400'}`}
                                            />
                                        </>
                                    )}
                                </button>

                                {!collapsed && isGroupOpen && (
                                    <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                                        {group.items.map((item) => {
                                            const active = location.pathname === item.path;
                                            return (
                                                <li key={item.path}>
                                                    <NavLink
                                                        to={item.path}
                                                        className={`block px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${active
                                                            ? 'text-brand font-semibold bg-brand/5'
                                                            : 'text-gray-500 hover:text-brand-dark hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </NavLink>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* ─── Footer ─── */}
            <div className="border-t border-gray-100 p-3 space-y-2">
                <div
                    className={`flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''
                        }`}
                    onClick={() => navigate('/admin/profile')}
                >
                    <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(user?.username || user?.email || 'A').charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-brand-dark truncate">
                                {user?.username || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {user?.email || 'admin@store.com'}
                            </p>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLogout();
                            }}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    )}
                </div>

                {!collapsed && (
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-brand font-medium rounded-lg hover:bg-brand-accent/30 transition-colors"
                    >
                        <Store size={16} />
                        <span>Your Shop</span>
                        <ExternalLink size={12} className="ml-auto text-gray-400" />
                    </a>
                )}
            </div>
        </aside>
    );
};

export default AdminSidebar;
