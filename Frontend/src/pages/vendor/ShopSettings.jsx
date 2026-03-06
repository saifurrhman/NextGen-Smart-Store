import React, { useState, useEffect } from 'react';
import {
    Store,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    Save,
    Camera,
    Loader2,
    CheckCircle2
} from 'lucide-react';

const ShopSettings = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [user, setUser] = useState(null);

    // Initial state based on logged in user or defaults
    const [formData, setFormData] = useState({
        shopName: 'Elite Tech Solutions',
        email: 'contact@elitetech.com',
        phone: '+92 300 1234567',
        address: 'Commercial Block 7, Karachi, Pakistan',
        category: 'Electronics & Gadgets',
        description: 'Providing top-tier electronic gadgets and accessories with guaranteed warranty.'
    });

    const [profileImg, setProfileImg] = useState({ file: null, preview: null });
    const [coverImg, setCoverImg] = useState({ file: null, preview: null });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        if (userData?.vendor_profile) {
            setFormData(prev => ({
                ...prev,
                shopName: userData.vendor_profile.store_name || prev.shopName,
                email: userData.email || prev.email,
                phone: userData.vendor_profile.phone || prev.phone,
                address: userData.vendor_profile.address || prev.address,
                description: userData.vendor_profile.description || prev.description
            }));
            if (userData.vendor_profile.logo) {
                setProfileImg({ file: null, preview: userData.vendor_profile.logo });
            }
            if (userData.vendor_profile.cover_image) {
                setCoverImg({ file: null, preview: userData.vendor_profile.cover_image });
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            if (type === 'profile') {
                setProfileImg({ file, preview });
            } else {
                setCoverImg({ file, preview });
            }
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">About section</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* ╔═══════ LEFT COLUMN (Profile) ═══════╗ */}
                <div className="lg:col-span-2 space-y-6">
                    {/* ─── Profile Card ─── */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            {/* Header actions */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-semibold text-gray-800">Store Profile</h3>
                            </div>

                            {/* Avatar */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-3xl font-bold mb-4 ring-4 ring-emerald-50 shadow-lg overflow-hidden relative group">
                                    {profileImg.preview ? (
                                        <img src={profileImg.preview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        formData.shopName.charAt(0)
                                    )}
                                    <label className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                                        <Camera size={18} className="text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profile')} />
                                    </label>
                                </div>

                                <h4 className="text-lg font-semibold text-gray-900">
                                    {formData.shopName}
                                </h4>
                                <p className="text-xs text-gray-500 font-medium mt-1">{formData.category}</p>

                                {/* Email */}
                                <div className="flex items-center justify-center gap-2 mt-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                                    <Mail size={14} className="text-gray-400" />
                                    <span className="text-xs text-gray-600">{formData.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Change Password Card Placeholder ─── */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 opacity-60">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-800">Security Settings</h3>
                        </div>
                        <p className="text-sm text-gray-500">Security and password management are handled from your personal Account Settings.</p>
                    </div>
                </div>

                {/* ╔═══════ RIGHT COLUMN — Store Update ═══════╗ */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-base font-semibold text-gray-800">Profile Update</h3>
                        </div>

                        {success && (
                            <div className="mb-6 flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100">
                                <CheckCircle2 size={16} /> Store settings updated successfully!
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-6">

                            {/* Cover Upload */}
                            <div className="flex items-center gap-4 mb-4">
                                <label className="w-full h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-300 hover:text-emerald-500 cursor-pointer overflow-hidden relative group transition-colors">
                                    {coverImg.preview ? (
                                        <img src={coverImg.preview} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Camera size={20} className="mb-1" />
                                            <span className="text-xs font-medium text-gray-500">Upload Cover Image</span>
                                        </>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} />
                                    {coverImg.preview && <span className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs font-medium">Change Cover</span>}
                                </label>
                            </div>

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name / Store Name</label>
                                    <input
                                        type="text"
                                        name="shopName"
                                        value={formData.shopName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name / Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm opacity-60 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all"
                                    />
                                </div>

                                {/* Description — Full width */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Biography</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white transition-all resize-none"
                                        placeholder="Enter a biography about you"
                                    />
                                </div>
                            </div>

                            {/* Save button */}
                            <div className="flex justify-start mt-6 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[#4CAF50] text-white rounded-lg font-semibold text-sm hover:bg-[#45a049] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                                    {loading ? 'Saving Update...' : 'Save Change'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopSettings;
