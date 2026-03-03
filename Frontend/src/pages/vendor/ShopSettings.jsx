import React, { useState, useEffect } from 'react';
import {
    Store,
    Mail,
    Phone,
    MapPin,
    Clock,
    Shield,
    Edit3,
    Save,
    X,
    ChevronRight,
    Lock,
    Globe,
    Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShopSettings = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
    }, []);

    const [formData, setFormData] = useState({
        shopName: 'Elite Tech Solutions',
        email: 'contact@elitetech.com',
        phone: '+92 300 1234567',
        address: 'Commercial Block 7, Karachi, Pakistan',
        category: 'Electronics & Gadgets',
        status: 'Active'
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setIsEditing(false);
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Merchant Identity Header */}
            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
                {/* Banner Placeholder */}
                <div className="h-48 bg-gradient-to-r from-emerald-600 to-teal-700 relative">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                    <button className="absolute top-6 right-6 p-2.5 bg-white/20 hover:bg-white/40 text-white rounded-xl backdrop-blur-md transition-all border border-white/20">
                        <Camera size={18} />
                    </button>
                </div>

                <div className="px-8 pb-8 flex flex-col items-center sm:items-start text-center sm:text-left relative">
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center p-2 border-4 border-white">
                            <div className="w-full h-full bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-inner uppercase tracking-tighter">
                                {formData.shopName.charAt(0)}
                            </div>
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-white text-emerald-600 rounded-xl shadow-lg border border-gray-100 hover:scale-110 transition-transform">
                            <Camera size={14} />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-1 justify-center sm:justify-start">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{formData.shopName}</h1>
                                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">Verified Merchant</div>
                            </div>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">{formData.category}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                        >
                            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                            {isEditing ? 'Cancel Sync' : 'Configure Identity'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Intelligence */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <Globe size={14} className="text-emerald-500" />
                        Infrastructure Info
                    </h3>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none" />

                        <div className="flex items-start gap-5">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100"><Mail size={20} /></div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Email Protocol</p>
                                <p className="text-sm font-bold text-gray-800 truncate">{formData.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100"><Phone size={20} /></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Contact Line</p>
                                <p className="text-sm font-bold text-gray-800 tracking-tight">{formData.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 pt-4 border-t border-gray-50">
                            <div className="p-3 bg-gray-50 text-gray-500 rounded-2xl border border-gray-100"><MapPin size={20} /></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Global Anchor</p>
                                <p className="text-sm font-bold text-gray-800 leading-snug">{formData.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Hub */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <Lock size={14} className="text-emerald-500" />
                        Management Controls
                    </h3>
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.form
                                    key="edit-form"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handleUpdate}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                                            <input
                                                type="text"
                                                value={formData.shopName}
                                                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sector Class</label>
                                            <input
                                                type="text"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">HQ Address</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-8">
                                        <button
                                            disabled={submitting}
                                            type="submit"
                                            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
                                        >
                                            {submitting ? 'Processing Audit...' : 'Commit Changes'}
                                            <Save size={16} />
                                        </button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="view-grid"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {[
                                        { label: 'Cloud Security', title: 'Two-Factor Hub', desc: 'Secure merchant authentication protocols', icon: Lock, color: 'text-blue-500 bg-blue-50' },
                                        { label: 'Operational Sync', title: 'Schedule Matrix', desc: 'Manage global storefront uptime', icon: Clock, color: 'text-emerald-500 bg-emerald-50' },
                                        { label: 'Financial Intel', title: 'Gateway Access', desc: 'Configure payment & payout anchors', icon: Shield, color: 'text-purple-500 bg-purple-50' },
                                        { label: 'Identity Hub', title: 'Key Rotation', desc: 'Manage administrative credentials', icon: Lock, color: 'text-rose-500 bg-rose-50' },
                                    ].map((item, i) => (
                                        <button key={i} className="flex flex-col text-left p-6 bg-gray-50 hover:bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl transition-all group shadow-sm hover:shadow-lg hover:shadow-emerald-50">
                                            <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-4 border border-white group-hover:scale-110 transition-transform`}>
                                                <item.icon size={18} />
                                            </div>
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">{item.label}</p>
                                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tight mb-2 flex items-center justify-between">
                                                {item.title}
                                                <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
                                            </h4>
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopSettings;
