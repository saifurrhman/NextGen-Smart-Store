import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search, Bell, Moon, Sun, Menu, X, Settings,
    User, LogOut, ChevronDown, Check, ShoppingBag, RotateCcw,
    LayoutGrid, ShieldCheck, Zap, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTopbar = ({ pageTitle, user, onMobileToggle, onToggleSidebar }) => {
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

    // Fetch real data for notifications
    useEffect(() => {
        const fetchRealData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const ordersRes = await axios.get('http://127.0.0.1:8000/api/v1/orders/', config);
                const refundsRes = await axios.get('http://127.0.0.1:8000/api/v1/orders/refunds/', config);

                const recentOrders = (ordersRes.data?.results || ordersRes.data || [])
                    .slice(0, 3)
                    .map(order => ({
                        id: `order-${order.id}`,
                        title: 'Operational Logic',
                        desc: `Asset #${order.order_id || order.id} deployed by ${order.customer_name || 'System'}`,
                        time: order.created_at ? new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
                        unread: true,
                        type: 'order',
                        icon: ShoppingBag
                    }));

                const recentRefunds = (refundsRes.data?.results || refundsRes.data || [])
                    .slice(0, 2)
                    .map(refund => ({
                        id: `refund-${refund.id}`,
                        title: 'Protocol Reversion',
                        desc: `Refund sequence for #${refund.order_id || refund.id}`,
                        time: refund.created_at ? new Date(refund.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
                        unread: true,
                        type: 'refund',
                        icon: RotateCcw
                    }));

                const combined = [...recentOrders, ...recentRefunds].sort((a, b) => b.id.localeCompare(a.id));

                if (combined.length === 0) {
                    setNotifications([
                        { id: 1, title: 'System Online', desc: 'Secure connection established.', time: 'Just now', unread: false, icon: Check }
                    ]);
                } else {
                    setNotifications(combined);
                }
            } catch (error) {
                setNotifications([
                    { id: 1, title: 'Neural Sync Active', desc: 'Admin authority verified.', time: 'Now', unread: false, icon: Zap }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchRealData();
    }, []);

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
        navigate('/admin/login');
    };

    return (
        <header className="h-[80px] bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 px-6 flex items-center justify-between shadow-sm">

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
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Admin Ops Panel</p>
                    </div>
                </div>
            </div>

            {/* Middle Section: Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8 group">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search logs, agents, or authority protocols..."
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2.5 pl-12 pr-4 text-xs font-medium focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-3">
                {/* System Actions */}
                <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-gray-100">
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                            className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400 hover:text-emerald-600'}`}
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-[380px] bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                                >
                                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                        <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em]">Operational Stream</h3>
                                        <span className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest">{unreadCount} Critical</span>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.map((n) => (
                                            <div key={n.id} className="p-4 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group flex items-start gap-4 mb-1">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                                    {n.icon ? <n.icon size={16} strokeWidth={2.5} /> : <Zap size={16} strokeWidth={2.5} />}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <p className="text-[10px] font-bold text-gray-900 uppercase tracking-widest truncate">{n.title}</p>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap">{n.time}</span>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-gray-500 leading-tight uppercase tracking-tight">{n.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3">
                                        <button onClick={() => navigate('/admin/orders/all')} className="w-full py-3 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-gray-200">
                                            Access Management Terminal
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-emerald-600 rounded-xl transition-all"
                    >
                        {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>

                {/* Supervisor Identity */}
                <div className="flex items-center gap-3 pl-2 group cursor-pointer relative py-2" ref={profileRef} onClick={() => setShowProfile(!showProfile)}>
                    <div className="flex flex-col items-end text-right hidden sm:flex">
                        <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">{user?.username || 'Supervisor'}</p>
                        <div className="flex items-center gap-1">
                            <Rocket size={10} className="text-emerald-600" />
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Verified Auth</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-emerald-100 border-2 border-white transition-transform group-hover:scale-105">
                            {initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-lg border-2 border-white"></div>
                    </div>
                    <ChevronDown size={14} className={`text-gray-300 group-hover:text-emerald-500 transition-all ${showProfile ? 'rotate-180' : ''}`} />

                    <AnimatePresence>
                        {showProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 overflow-hidden"
                            >
                                <div className="p-4 border-b border-gray-50 flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                                        {initials}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-gray-800 uppercase tracking-tight truncate">{user?.username || 'Supervisor'}</p>
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Master Admin</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <button onClick={() => navigate('/admin/profile')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                        <User size={14} /> Profile File
                                    </button>
                                    <button onClick={() => navigate('/admin/settings')} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                        <Settings size={14} /> Global Control
                                    </button>
                                    <div className="h-px bg-gray-50 my-1 mx-2" />
                                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                        <LogOut size={14} /> Disconnect
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
