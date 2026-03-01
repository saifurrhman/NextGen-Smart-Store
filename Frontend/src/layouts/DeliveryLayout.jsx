import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Package, History, User, LogOut, Truck } from 'lucide-react';
import DeliverySidebar from '../components/delivery/DeliverySidebar';

const DeliveryLayout = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Desktop Sidebar */}
            <DeliverySidebar user={user} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-[280px] w-full min-w-0 transition-all duration-300">
                {/* Mobile Topbar */}
                <header className="bg-emerald-600 text-white p-5 sticky top-0 z-30 shadow-lg lg:hidden">
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl border border-white/30 backdrop-blur-sm shadow-inner">
                                <Truck size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-black tracking-tighter leading-none">NEXTGEN</h1>
                                <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest leading-none mt-1">Delivery OS</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 active:scale-90"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Content Outlet */}
                <main className="flex-1 p-4 md:p-8 lg:p-12 pb-32 lg:pb-12 bg-gray-50/30">
                    <Outlet />
                </main>

                {/* Mobile Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-40 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)] lg:hidden">
                    <div className="flex justify-around items-center max-w-lg mx-auto py-3">
                        <NavLink
                            to="/delivery/dashboard"
                            className={({ isActive }) => `flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'bg-emerald-50 shadow-inner' : ''}`}>
                                        <Home size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/delivery/tasks"
                            className={({ isActive }) => `flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'bg-emerald-50 shadow-inner' : ''}`}>
                                        <Package size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Tasks</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/delivery/history"
                            className={({ isActive }) => `flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'bg-emerald-50 shadow-inner' : ''}`}>
                                        <History size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">History</span>
                                </>
                            )}
                        </NavLink>

                        <NavLink
                            to="/delivery/profile"
                            className={({ isActive }) => `flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-2xl transition-all group-active:scale-90 ${isActive ? 'bg-emerald-50 shadow-inner' : ''}`}>
                                        <User size={22} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
                                </>
                            )}
                        </NavLink>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default DeliveryLayout;
