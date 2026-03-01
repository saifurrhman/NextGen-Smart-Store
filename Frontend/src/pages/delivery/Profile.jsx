import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, Star, LogOut, ChevronRight, Settings, Bell, CreditCard, Zap, Target, ShieldCheck, Heart } from 'lucide-react';
import api from '../../utils/api';

const DeliveryProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/v1/users/profile/');
            setProfile(response.data);
        } catch (error) {
            console.error("Profile fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Accessing Secure Profile...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20 lg:pb-0">
            {/* Header / Identity */}
            <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/30 transition-all flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-125 transition-transform duration-700"></div>

                <div className="relative shrink-0">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-[3.5rem] bg-emerald-600 flex items-center justify-center text-white text-5xl md:text-7xl font-black shadow-2xl shadow-emerald-200 border-8 border-white group-hover:rotate-6 transition-transform">
                        {profile?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-white text-emerald-600 p-4 rounded-3xl border-4 border-emerald-50 shadow-xl group-hover:-translate-y-2 transition-transform">
                        <ShieldCheck size={24} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-6 relative z-10">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-1 rounded-full border border-emerald-100">
                            <Star size={12} className="fill-emerald-600 text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">Specialist Agent</span>
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">{profile?.username}</h2>
                        <p className="text-sm font-bold text-gray-400 max-w-sm">Authorized Delivery Personnel since {new Date(profile?.date_joined || Date.now()).getFullYear()}. Verified Status Level 5.</p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                            <Target size={16} className="text-emerald-600" />
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Rating</p>
                                <p className="text-xs font-black text-gray-900 tracking-tight">4.95 / 5.0</p>
                            </div>
                        </div>
                        <div className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                            <Shield size={16} className="text-blue-600" />
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Clearance</p>
                                <p className="text-xs font-black text-gray-900 tracking-tight">Level 5</p>
                            </div>
                        </div>
                        <div className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3">
                            <Heart size={16} className="text-rose-600" />
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">Loyalty</p>
                                <p className="text-xs font-black text-gray-900 tracking-tight">Elite Tier</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs / Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Intel */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase px-4">Secure Credentials</h3>
                    <div className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-inner group-hover:scale-110 transition-transform">
                                <Mail size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Protocol</p>
                                <p className="text-sm font-black text-gray-900 tracking-tight">{profile?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 border border-gray-100">
                                <Phone size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Encrypted Line</p>
                                <p className="text-sm font-black text-gray-900 tracking-tight">{profile?.phone_number || 'OFF-GRID'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 border border-gray-100">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Base Coordinates</p>
                                <p className="text-sm font-black text-gray-900 tracking-tight">Sector 7-G, Central</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase px-4">Interface Options</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: CreditCard, label: 'Financial Hub', color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Secure payout configuration' },
                            { icon: Bell, label: 'Notifications', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Real-time alert preferences' },
                            { icon: Settings, label: 'Global Settings', color: 'text-purple-600', bg: 'bg-purple-50', desc: 'System-wide interface config' },
                            { icon: ShieldCheck, label: 'Identity & Security', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Auth keys & credential management' }
                        ].map((item, idx) => (
                            <button key={idx} className="group flex items-start gap-5 p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/20 transition-all text-left">
                                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center border border-white shadow shadow-gray-100 shrink-0`}>
                                    <item.icon size={20} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-[10px] font-bold text-gray-400 leading-tight">{item.desc}</p>
                                </div>
                                <ChevronRight size={16} className="ml-auto text-gray-200 group-hover:text-gray-900 transition-colors self-center" />
                            </button>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="sm:col-span-2 mt-4 py-6 bg-rose-50 text-rose-600 rounded-[3rem] font-black text-xs uppercase tracking-[0.2em] border border-rose-100 hover:bg-rose-600 hover:text-white hover:shadow-2xl hover:shadow-rose-300 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Terminate Active Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryProfile;
