import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Shield, Settings, LogOut, Store, ChevronLeft, ChevronRight, ExternalLink,
    FileText, DollarSign, Megaphone, Boxes, HeadphonesIcon,
    ChevronDown, Image, BookOpen, FolderOpen, Navigation, Search,
    TrendingUp, CreditCard, Wallet, Map, Flag, Ticket, Users, BarChart2, Truck,
    Home, Bot, AlignLeft, X, Package, History, User, Star, ShoppingBag, MessageSquare
} from 'lucide-react';

/* ─── Role-Based Links Definition ─── */

const getNavLinks = (role) => {
    switch (role) {
        case 'ADMIN':
        case 'SUPER_ADMIN':
            return {
                topLinks: [
                    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                ],
                subLinks: [
                    {
                        group: 'Orders', icon: Ticket, items: [
                            { path: '/admin/orders/all', label: 'Order Management' },
                            { path: '/admin/users/customers', label: 'Customers' },
                            { path: '/admin/finance/transactions', label: 'Transactions' },
                            { path: '/admin/orders/details', label: 'Order Details' },
                            { path: '/admin/orders/reports', label: 'Order Reports' },
                            { path: '/admin/orders/refunds', label: 'Refunds & Returns' },
                        ]
                    },
                    {
                        group: 'Products', icon: Store, items: [
                            { path: '/admin/products/all', label: 'All Products' },
                            { path: '/admin/products/add', label: 'Add Product' },
                            { path: '/admin/product-requests', label: 'Vendor Requests' },
                            { path: '/admin/products/categories', label: 'Categories' },
                            { path: '/admin/products/attributes', label: 'Attributes' },
                            { path: '/admin/products/import', label: 'Bulk Import' },
                        ]
                    },
                    {
                        group: 'B2B Wholesale', icon: Package, items: [
                            { path: '/admin/bulk-orders', label: 'Bulk Orders' },
                        ]
                    },
                    {
                        group: 'Users & Vendors', icon: Users, items: [
                            { path: '/admin/users/all', label: 'All Users' },
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
                            { path: '/admin/operations/delivery/daily', label: 'Daily Operations' },
                            { path: '/admin/operations/delivery/tracking', label: 'Shipment Tracking' },
                            { path: '/admin/operations/delivery/team', label: 'Delivery Team' },
                            { path: '/admin/operations/delivery/assign', label: 'Assign Orders' },
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
                        group: 'AI & Automation', icon: Bot, items: [
                            { path: '/admin/ai/dashboard', label: 'AI Control Center' },
                            { path: '/admin/ai/chatbot', label: 'Chatbot Builder' },
                            { path: '/admin/ai/integrations', label: 'API & Connections' },
                        ]
                    },
                    {
                        group: 'Analytics & Settings', icon: BarChart2, items: [
                            { path: '/admin/analytics/sales', label: 'Sales Analytics' },
                            { path: '/admin/analytics/products', label: 'Product Performance' },
                            { path: '/admin/settings', label: 'Platform Settings' },
                            { path: '/admin/settings/payment', label: 'Payment Gateways' },
                            { path: '/admin/settings/tax', label: 'Tax Configuration' },
                            { path: '/admin/control-authority', label: 'Control Authority' },
                        ]
                    }
                ],
                adminLinks: [
                    { path: '/admin/profile', icon: Shield, label: 'Admin role' },
                    { path: '/admin/control-authority', icon: Settings, label: 'Control Authority' },
                ],
                footerLabel: 'Your Shop',
                footerUrl: '/'
            };
        case 'VENDOR':
            return {
                topLinks: [
                    { path: '/vendor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                    { path: '/vendor/wholesale-catalog', icon: Store, label: 'Wholesale Catalog' },
                    { path: '/vendor/bulk-orders', icon: Package, label: 'My Bulk Orders' },
                    { path: '/vendor/products', icon: ShoppingBag, label: 'My Inventory' },
                    { path: '/vendor/request-product', icon: MessageSquare, label: 'Product Request' },
                    { path: '/vendor/earnings', icon: Wallet, label: 'My Earnings' },
                    { path: '/vendor/reviews', icon: MessageSquare, label: 'Shop Reviews' },
                    { path: '/vendor/settings', icon: Settings, label: 'Shop Settings' },
                ],
                subLinks: [],
                adminLinks: [],
                footerLabel: 'View Store',
                footerUrl: '/shop'
            };
        case 'DELIVERY':
            return {
                topLinks: [
                    { path: '/delivery/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                    { path: '/delivery/tasks', icon: Package, label: 'Active Tasks' },
                    { path: '/delivery/history', icon: History, label: 'Service History' },
                    { path: '/delivery/profile', icon: User, label: 'Personal Profile' },
                ],
                subLinks: [],
                adminLinks: [],
                footerLabel: 'Support',
                footerUrl: '/support'
            };
        default:
            return { topLinks: [], subLinks: [], adminLinks: [] };
    }
};

const DashboardSidebar = ({ role, collapsed, onToggle, isMobileOpen, onMobileClose, user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [openGroup, setOpenGroup] = useState('');

    const { topLinks, subLinks, adminLinks, footerLabel, footerUrl } = getNavLinks(role);

    const handleLogout = () => {
        const currentRole = localStorage.getItem('role')?.toUpperCase() || role;
        localStorage.clear();

        if (currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN') {
            navigate('/admin/login');
        } else if (currentRole === 'VENDOR') {
            navigate('/vendor/login');
        } else if (currentRole === 'DELIVERY') {
            navigate('/delivery/login');
        } else {
            navigate('/login');
        }
    };

    const renderLink = (link) => {
        const isActive =
            location.pathname === link.path ||
            (link.path !== '/admin/dashboard' && link.path !== '/vendor/dashboard' && link.path !== '/delivery/dashboard' && location.pathname.startsWith(link.path));

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

    const logoLabel = role === 'ADMIN' ? 'Admin' : role === 'VENDOR' ? 'Vendor' : 'Delivery';
    const logoChar = role.charAt(0).toUpperCase();

    return (
        <aside
            className={`fixed left-0 top-0 h-screen z-50 flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${collapsed ? 'w-[90px]' : 'w-[266px]'}`}
        >
            {/* ─── Logo ─── */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-transparent shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                        {logoChar}
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-800 tracking-tight leading-none uppercase">NextGen</span>
                            <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase mt-0.5">{logoLabel} Hub</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={onMobileClose}
                    className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            </div>

            {/* ─── Nav ─── */}
            <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-6 sidebar-scrollbar">

                {/* Main menu */}
                <div>
                    {!collapsed && (
                        <p className="text-xs font-medium text-gray-400 px-4 mb-3">Main menu</p>
                    )}
                    <ul className="space-y-1">
                        {topLinks.map(renderLink)}
                    </ul>
                </div>

                {/* Departments / Groups (if any) */}
                {subLinks.length > 0 && (
                    <div>
                        {!collapsed && (
                            <p className="text-xs font-medium text-gray-400 px-4 mb-3">Departments</p>
                        )}
                        {collapsed && <div className="border-t border-gray-100 mx-2 mb-2" />}

                        <ul className="space-y-1">
                            {subLinks.map((group) => {
                                const Icon = group.icon;
                                const groupActive = group.items.some(i => location.pathname === i.path) || location.pathname === group.path;
                                const isGroupOpen = openGroup === group.group || (!openGroup && groupActive);

                                return (
                                    <li key={group.group}>
                                        <button
                                            onClick={() => {
                                                if (group.path && location.pathname !== group.path && group.items.length === 0) {
                                                    navigate(group.path);
                                                    setOpenGroup(group.group);
                                                } else {
                                                    setOpenGroup(isGroupOpen ? '' : group.group);
                                                }
                                            }}
                                            title={collapsed ? group.group : ''}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${groupActive
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-600'
                                                }`}
                                        >
                                            <Icon size={18} className={groupActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-500'} />
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
                                            <ul className="ml-5 mt-1 space-y-0.5 border-l-2 border-emerald-50 pl-2">
                                                {group.items.map((item) => {
                                                    const active = location.pathname === item.path;
                                                    return (
                                                        <li key={item.path}>
                                                            <NavLink
                                                                to={item.path}
                                                                className={`block px-3 py-1.5 rounded-md text-[13px] transition-colors ${active
                                                                    ? 'text-emerald-600 font-bold bg-emerald-50'
                                                                    : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-50'
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
                    </div>
                )}

                {/* Admin Specific Links */}
                {adminLinks.length > 0 && (
                    <div>
                        {!collapsed && (
                            <p className="text-xs font-medium text-gray-400 px-4 mb-3">Settings</p>
                        )}
                        {collapsed && <div className="border-t border-gray-100 mx-2 mb-2" />}
                        <ul className="space-y-1">
                            {adminLinks.map(renderLink)}
                        </ul>
                    </div>
                )}

            </nav>

            {/* ─── Footer ─── */}
            <div className="p-4 space-y-4 bg-white mt-auto border-t border-gray-50">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2'}`}>
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center text-emerald-600 font-bold">
                        {(user?.username || user?.email || 'A').charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.username || 'User'}</p>
                            <p className="text-[11px] font-medium text-gray-500 truncate">{user?.email || 'user@nextgen.com'}</p>
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

                {!collapsed && footerLabel && (
                    <a
                        href={footerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-4 py-2.5 text-sm font-bold text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm bg-white"
                    >
                        <div className="flex items-center gap-2">
                            <Store size={16} className="text-emerald-500" />
                            <span>{footerLabel}</span>
                        </div>
                        <ExternalLink size={14} className="text-gray-400" />
                    </a>
                )}

                {collapsed && (
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center p-3 bg-emerald-500 text-white rounded-xl shadow-lg border-2 border-white hover:bg-emerald-600 transition-colors mx-auto"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default DashboardSidebar;
