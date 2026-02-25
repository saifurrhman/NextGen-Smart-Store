import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Shield, Settings, LogOut, Store, ChevronLeft, ChevronRight, ExternalLink,
    FileText, DollarSign, Megaphone, Boxes, HeadphonesIcon,
    ChevronDown, Image, BookOpen, FolderOpen, Navigation, Search
} from 'lucide-react';

/* ─── Content sub-sections ─── */
const contentSubLinks = [
    {
        group: 'Banners', icon: Image,
        items: [
            { path: '/admin/content/banners/hero-sliders', label: 'Hero Sliders' },
            { path: '/admin/content/banners/promotional', label: 'Promotional' },
            { path: '/admin/content/banners/category', label: 'Category Banners' },
            { path: '/admin/content/banners/create', label: 'Create Banner' },
        ],
    },
    {
        group: 'Blog', icon: BookOpen,
        items: [
            { path: '/admin/content/blog/posts', label: 'All Posts' },
            { path: '/admin/content/blog/create', label: 'Create Post' },
            { path: '/admin/content/blog/categories', label: 'Categories' },
            { path: '/admin/content/blog/comments', label: 'Comments' },
        ],
    },
    {
        group: 'Media', icon: FolderOpen,
        items: [
            { path: '/admin/content/media/library', label: 'Media Library' },
            { path: '/admin/content/media/upload', label: 'Upload Media' },
            { path: '/admin/content/media/images', label: 'Image Manager' },
            { path: '/admin/content/media/videos', label: 'Video Manager' },
        ],
    },
    {
        group: 'Pages', icon: FileText,
        items: [
            { path: '/admin/content/pages/homepage', label: 'Homepage' },
            { path: '/admin/content/pages/about', label: 'About Us' },
            { path: '/admin/content/pages/contact', label: 'Contact Us' },
            { path: '/admin/content/pages/faq', label: 'FAQ' },
            { path: '/admin/content/pages/privacy', label: 'Privacy Policy' },
            { path: '/admin/content/pages/terms', label: 'Terms & Conditions' },
            { path: '/admin/content/pages/returns', label: 'Return Policy' },
        ],
    },
    {
        group: 'Navigation', icon: Navigation,
        items: [
            { path: '/admin/content/navigation/header', label: 'Header Menu' },
            { path: '/admin/content/navigation/footer', label: 'Footer Menu' },
            { path: '/admin/content/navigation/mobile', label: 'Mobile Menu' },
        ],
    },
    {
        group: 'SEO', icon: Search,
        items: [
            { path: '/admin/content/seo/meta-tags', label: 'Meta Tags' },
            { path: '/admin/content/seo/sitemap', label: 'Sitemap' },
            { path: '/admin/content/seo/urls', label: 'URL Manager' },
        ],
    },
];

const topLinks = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

const deptLinks = [
    { path: '/admin/finance', icon: DollarSign, label: 'Finance' },
    { path: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
    { path: '/admin/operations', icon: Boxes, label: 'Operations' },
    { path: '/admin/support', icon: HeadphonesIcon, label: 'Support' },
];

const adminLinks = [
    { path: '/admin/profile', icon: Shield, label: 'Admin role' },
    { path: '/admin/control-authority', icon: Settings, label: 'Control Authority' },
];

const AdminSidebar = ({ collapsed, onToggle, user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [contentOpen, setContentOpen] = useState(location.pathname.startsWith('/admin/content'));
    const [openGroup, setOpenGroup] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const isContentActive = location.pathname.startsWith('/admin/content');

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
                    {/* Content — expandable */}
                    <li>
                        <button
                            onClick={() => {
                                if (collapsed) {
                                    navigate('/admin/content');
                                } else {
                                    setContentOpen(!contentOpen);
                                }
                            }}
                            title={collapsed ? 'Content' : ''}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isContentActive
                                ? 'bg-brand text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-brand-dark'
                                }`}
                        >
                            <FileText
                                size={20}
                                className={isContentActive ? 'text-white' : 'text-gray-400 group-hover:text-brand'}
                            />
                            {!collapsed && (
                                <>
                                    <span className="flex-1 text-left">Content</span>
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-200 ${contentOpen ? 'rotate-180' : ''} ${isContentActive ? 'text-white/70' : 'text-gray-400'}`}
                                    />
                                </>
                            )}
                        </button>

                        {/* Content sub-groups */}
                        {!collapsed && contentOpen && (
                            <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                                {contentSubLinks.map((group) => {
                                    const Icon = group.icon;
                                    const isGroupOpen = openGroup === group.group;
                                    const groupActive = group.items.some(i => location.pathname === i.path);

                                    return (
                                        <div key={group.group}>
                                            <button
                                                onClick={() => setOpenGroup(isGroupOpen ? '' : group.group)}
                                                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${groupActive ? 'text-brand' : 'text-gray-500 hover:text-brand-dark hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Icon size={15} className={groupActive ? 'text-brand' : 'text-gray-400'} />
                                                <span className="flex-1 text-left">{group.group}</span>
                                                <ChevronDown
                                                    size={12}
                                                    className={`transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''} text-gray-400`}
                                                />
                                            </button>
                                            {isGroupOpen && (
                                                <ul className="ml-5 mt-0.5 space-y-0.5">
                                                    {group.items.map((item) => {
                                                        const active = location.pathname === item.path;
                                                        return (
                                                            <li key={item.path}>
                                                                <NavLink
                                                                    to={item.path}
                                                                    className={`block px-2.5 py-1.5 rounded-md text-[12.5px] transition-colors ${active
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
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </li>

                    {/* Other departments */}
                    {deptLinks.map(renderLink)}
                </ul>

                {/* Admin */}
                {!collapsed && (
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-1 mt-4">Admin</p>
                )}
                {collapsed && <div className="border-t border-gray-100 mx-2 mb-2" />}
                <ul className="space-y-0.5">
                    {adminLinks.map(renderLink)}
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
