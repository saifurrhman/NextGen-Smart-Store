import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, Star, LogOut, ChevronRight, Settings, Bell, CreditCard, Zap, Target, ShieldCheck, Heart } from 'lucide-react';
import api from '../../utils/api';

const DeliveryProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Profile Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        address: ''
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('users/profile/');
            setProfile(response.data);
            setFormData({
                username: response.data.username || '',
                email: response.data.email || '',
                phone_number: response.data.phone_number || '',
                address: response.data.address || ''
            });
        } catch (error) {
            console.error("Profile fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await api.patch('users/profile/', formData);
            setProfile(response.data);
            setIsEditing(false);
            alert("Profile security updated successfully.");
        } catch (error) {
            alert(error.response?.data?.detail || "Update failed. Check your data.");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new_password !== passwordData.confirm_password) {
            alert("New passwords do not match.");
            return;
        }
        setSubmitting(true);
        try {
            await api.post('users/change-password/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setIsChangingPassword(false);
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
            alert("Cryptic key (password) rotated successfully.");
        } catch (error) {
            alert(error.response?.data?.detail || "Password change failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">Accessing Secure Profile...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-10">
            {/* Header / Identity */}
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-30"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative z-10">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-3xl md:text-5xl font-bold shadow-xl shadow-emerald-100 border-4 border-white">
                            {profile?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white text-emerald-600 p-2 rounded-lg border border-emerald-50 shadow-lg">
                            <ShieldCheck size={18} strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 mb-2">
                                <Star size={10} className="fill-emerald-600 text-emerald-600" />
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest font-mono">Specialist Agent</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight uppercase leading-none">{profile?.username}</h2>
                            <p className="text-sm text-gray-500">Authorized Specialist • ID: {profile?.id?.substring(0, 8) || 'DEL-AUTH'}</p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {[
                                { icon: Target, label: 'Performance', val: profile?.performance || '5.00', color: 'text-emerald-600' },
                                { icon: Shield, label: 'Clearance', val: profile?.clearance || 'Level 1', color: 'text-blue-600' },
                                { icon: Heart, label: 'Tier', val: profile?.tier || 'Standard', color: 'text-rose-600' }
                            ].map((stat, i) => (
                                <div key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                                    <stat.icon size={14} className={stat.color} />
                                    <div>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">{stat.label}</p>
                                        <p className="text-xs font-bold text-gray-800 tracking-tight">{stat.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs / Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Intel */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Contact Details</h3>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
                                <Mail size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Email Address</p>
                                <p className="text-sm font-bold text-gray-800 truncate">{profile?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                                <p className="text-sm font-bold text-gray-800">{profile?.phone_number || 'NOT PROVIDED'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Service Address</p>
                                <p className="text-sm font-bold text-gray-800">{profile?.address || 'Pakistan'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="w-full py-2.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-gray-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all active:scale-95"
                        >
                            {isEditing ? 'Cancel Editing' : 'Update Profile'}
                        </button>
                    </div>
                </div>

                {/* System Settings / Forms */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Account Settings</h3>
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
                        {isEditing ? (
                            <form onSubmit={handleProfileUpdate} className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-200 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-200 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            type="text"
                                            value={formData.phone_number}
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-200 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address</label>
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-200 transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className="w-full py-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
                                </button>
                            </form>
                        ) : isChangingPassword ? (
                            <form onSubmit={handlePasswordChange} className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Enter existing password"
                                            value={passwordData.old_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-200 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Min 8 characters"
                                                value={passwordData.new_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-200 transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                            <input
                                                type="password"
                                                placeholder="Repeat new password"
                                                value={passwordData.confirm_password}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-200 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsChangingPassword(false)}
                                        className="flex-1 py-3.5 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all"
                                    >
                                        Cancel Change
                                    </button>
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="flex-[2] py-3.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? 'Updating Password...' : 'Save New Password'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="group flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/50 transition-all text-left"
                                >
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100">
                                        <Settings size={18} />
                                    </div>
                                    <div className="space-y-0.5 flex-1">
                                        <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Update Profile</p>
                                        <p className="text-[10px] text-gray-400 font-bold tracking-tight">Modify authorized identity details</p>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 transition-colors self-center" />
                                </button>

                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="group flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all text-left"
                                >
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
                                        <Shield size={18} />
                                    </div>
                                    <div className="space-y-0.5 flex-1">
                                        <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Change Password</p>
                                        <p className="text-[10px] text-gray-400 font-bold tracking-tight">Update your secure access password</p>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors self-center" />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="md:col-span-2 mt-4 py-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-rose-100 hover:bg-rose-600 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryProfile;
