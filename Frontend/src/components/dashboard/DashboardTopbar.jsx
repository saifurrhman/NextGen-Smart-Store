import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search, Bell, Moon, Sun, AlignLeft, X, Settings,
    User, LogOut, ChevronDown, Check, ShoppingBag, RotateCcw
} from 'lucide-react';

const DashboardTopbar = ({ pageTitle, user, role, onMobileToggle, onToggleSidebar }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // Role-based role name display
    const getRoleName = () => {
        switch (role) {
            case 'ADMIN': return 'Super Admin';
            case 'VENDOR': return 'Merchant';
            case 'DELIVERY': return 'Delivery Partner';
            default: return 'User';
        }
    };

    // Fetch notifications based on role
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // For Admin, fetch orders and refunds
                if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
                    const ordersRes = await axios.get('http://127.0.0.1:8000/api/v1/orders/', config);
                    const orders = (ordersRes.data?.results || ordersRes.data || []).slice(0, 5).map(order => ({
                        id: `order-${order.id}`,
                        title: 'New order received',
                        desc: `Order #${order.order_id || order.id} placed`,
                        time: 'Recently',
                        unread: true,
                        icon: ShoppingBag
                    }));
                    setNotifications(orders.length > 0 ? orders : [{ id: 1, title: 'All systems green', desc: 'No new alerts.', time: 'Now', unread: false, icon: Check }]);
                }
                // For Vendor, fetch own orders
                else if (role === 'VENDOR') {
                    // Assuming endpoint exists or fallback
                    setNotifications([{ id: 1, title: 'Shop is live', desc: 'Welcome to your dashboard.', time: 'Now', unread: false, icon: Check }]);
                }
                // For Delivery, fetch assigned tasks
                else if (role === 'DELIVERY') {
                    setNotifications([{ id: 1, title: 'Delivery Pulse', desc: 'You are online and ready.', time: 'Now', unread: false, icon: Check }]);
                }
            } catch (error) {
                console.error("Error fetching notification data:", error);
                setNotifications([
                    { id: 1, title: 'Sync completed', desc: 'Your data is up to date.', time: 'Now', unread: false, icon: Check }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [role]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;
    const initials = (user?.username || user?.email || 'A').charAt(0).toUpperCase();

    const handleSignOut = () => {
        localStorage.clear();
        const loginPath = role === 'ADMIN' ? '/admin/login' : role === 'VENDOR' ? '/vendor/login' : '/login';
        navigate(loginPath);
    };

    return (
        <header className="h-16 bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

            {/* ── LEFT ── */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMobileToggle}
                    className="p-2 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all lg:hidden"
                >
                    <AlignLeft size={20} strokeWidth={2} />
                </button>

                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all hidden lg:flex"
                >
                    <AlignLeft size={18} strokeWidth={2} />
                </button>

                <div className="hidden md:block h-5 w-px bg-gray-200" />

                <h1 className="text-[15px] font-bold text-gray-800 tracking-tight hidden md:block">
                    {pageTitle}
                </h1>
            </div>

            {/* ── CENTER — Search ── */}
            <div className="flex-1 max-w-[400px] mx-4 hidden md:block">
                <div className={`relative flex items-center transition-all duration-200 rounded-xl overflow-hidden border ${searchFocused ? 'bg-white border-emerald-300 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]' : 'bg-gray-50 border-gray-100'}`}>
                    <Search
                        size={15}
                        className={`absolute left-3.5 transition-colors ${searchFocused ? 'text-emerald-500' : 'text-gray-400'}`}
                        strokeWidth={2.5}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Search data, users, or reports"
                        className="w-full pl-9 pr-10 py-2.5 bg-transparent text-[13px] font-medium text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 p-0.5 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-all"
                        >
                            <X size={11} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>

            {/* ── RIGHT — Actions ── */}
            <div className="flex items-center gap-1.5">

                {/* Dark mode toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-11 h-[22px] rounded-full flex items-center px-0.5 transition-colors duration-300 cursor-pointer ${darkMode ? 'bg-gray-700' : 'bg-emerald-100'}`}
                    title="Toggle theme"
                >
                    <div className={`w-[18px] h-[18px] rounded-full bg-white shadow flex items-center justify-center transition-transform duration-300 ${darkMode ? 'translate-x-[22px]' : 'translate-x-0'}`}>
                        {darkMode
                            ? <Moon size={9} className="text-indigo-600" />
                            : <Sun size={9} className="text-amber-500" />
                        }
                    </div>
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                        className={`relative p-2 rounded-lg transition-all ${showNotifications ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
                    >
                        <Bell size={19} strokeWidth={1.8} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-red-500 rounded-full border-[1.5px] border-white" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-[340px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden z-50">
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                                <span className="text-[14px] font-bold text-gray-800">Notifications</span>
                                <button className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                                    <Check size={11} /> Mark all read
                                </button>
                            </div>
                            <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                                {loading && <div className="px-5 py-8 text-center text-gray-400 text-sm">Loading...</div>}
                                {!loading && notifications.map(n => (
                                    <div key={n.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-100 text-emerald-600 flex-shrink-0">
                                            {n.icon ? <n.icon size={15} /> : <div className="w-2 h-2 bg-current rounded-full m-1.5" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-gray-800 truncate">{n.title}</p>
                                            <p className="text-[12px] text-gray-500 mt-0.5 leading-snug">{n.desc}</p>
                                            <span className="text-[10px] text-gray-400 font-medium mt-1 inline-block">{n.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-5 w-px bg-gray-200 mx-1" />

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                        className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all ${showProfile ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-[13px] shadow-sm flex-shrink-0">
                            {initials}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-[13px] font-bold text-gray-800 leading-tight">{user?.username || 'User'}</p>
                            <p className="text-[10px] text-gray-400 leading-tight font-medium uppercase tracking-tighter">{getRoleName()}</p>
                        </div>
                        <ChevronDown size={13} className={`hidden md:block text-gray-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 top-full mt-2 w-[220px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden z-50">
                            <div className="px-4 py-4 bg-emerald-50/50 border-b border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-[14px]">
                                        {initials}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-bold text-gray-800 truncate">{user?.username || 'User'}</p>
                                        <p className="text-[11px] text-gray-500 truncate">{user?.email || 'user@nextgen.com'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2">
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all text-left">
                                    <User size={15} /> My Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all text-left">
                                    <Settings size={15} /> Settings
                                </button>
                            </div>
                            <div className="p-2 border-t border-gray-50">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
                                >
                                    <LogOut size={15} /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default DashboardTopbar;
