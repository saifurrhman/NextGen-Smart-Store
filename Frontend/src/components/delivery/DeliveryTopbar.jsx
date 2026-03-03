import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search, Bell, Moon, Sun, AlignLeft, X, Settings,
    User, LogOut, ChevronDown, Check, Package, Clock
} from 'lucide-react';

const DeliveryTopbar = ({ pageTitle, user, onMobileToggle, onToggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'System Active', desc: 'Delivery OS is running live sync.', time: 'Now', unread: false, icon: Check }
    ]);

    const notifRef = useRef(null);
    const profileRef = useRef(null);

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
    const initials = (user?.username || 'S').charAt(0).toUpperCase();

    const handleSignOut = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

            {/* ── LEFT ── */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMobileToggle}
                    className="p-2 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all lg:hidden"
                >
                    <AlignLeft size={20} strokeWidth={2} />
                </button>

                {/* Desktop collapse toggle */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all hidden lg:flex"
                >
                    <AlignLeft size={18} strokeWidth={2} />
                </button>

                {/* Divider */}
                <div className="hidden md:block h-5 w-px bg-gray-200" />

                {/* Page title */}
                <h1 className="text-[15px] font-bold text-gray-800 tracking-tight hidden md:block">
                    {pageTitle || 'Delivery Portal'}
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
                        placeholder="Search tasks, orders, or history"
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

                {/* Mobile search icon */}
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all md:hidden">
                    <Search size={18} />
                </button>

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

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-[300px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden z-50">
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px] font-bold text-gray-800">Notifications</span>
                                </div>
                                <button className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700">
                                    Clear all
                                </button>
                            </div>
                            <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                                {notifications.map(n => (
                                    <div key={n.id} className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                                            <n.icon size={15} />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-semibold text-gray-800">{n.title}</p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">{n.desc}</p>
                                            <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="h-5 w-px bg-gray-200 mx-1" />

                {/* User Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${showProfile ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-[13px] shadow-sm">
                            {initials}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.username || 'Specialist'}</p>
                            <p className="text-[9px] text-gray-400 leading-tight font-medium uppercase tracking-wider">Expert</p>
                        </div>
                        <ChevronDown size={12} className={`text-gray-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <div className="absolute right-0 top-full mt-2 w-[180px] bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden z-50">
                            <div className="p-2">
                                <button
                                    onClick={() => { navigate('/delivery/profile'); setShowProfile(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-all text-left"
                                >
                                    <User size={14} /> My Profile
                                </button>
                                <button
                                    onClick={() => { navigate('/delivery/history'); setShowProfile(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-all text-left"
                                >
                                    <Package size={14} /> My Tasks
                                </button>
                            </div>
                            <div className="p-2 border-t border-gray-50">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
                                >
                                    <LogOut size={14} /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default DeliveryTopbar;
