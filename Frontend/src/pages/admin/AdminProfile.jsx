import React, { useState, useEffect } from 'react';
import {
    Edit, Share2, Copy, Eye, EyeOff, Upload, Trash2, Save, HelpCircle, Check, Loader2, AlertCircle
} from 'lucide-react';
import { profileAPI } from '../../services/api';

const AdminProfile = () => {
    // ─── State ───
    const [isEditing, setIsEditing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [pwError, setPwError] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [profileForm, setProfileForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        location: '',
        bio: '',
    });

    // ─── Load profile from API ───
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await profileAPI.getProfile();
            const data = response.data;
            setProfileForm({
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                email: data.email || '',
                phone: data.phone_number || '',
                dateOfBirth: '',
                location: data.address || '',
                bio: '',
            });
            // Keep localStorage in sync
            localStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
            // Fallback: read from localStorage if API fails
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                setProfileForm({
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || '',
                    email: userData.email || '',
                    phone: userData.phone_number || '',
                    dateOfBirth: '',
                    location: userData.address || '',
                    bio: '',
                });
            } catch (e) { /* ignore */ }
        } finally {
            setLoading(false);
        }
    };

    const copyEmail = () => {
        navigator.clipboard.writeText(profileForm.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ─── Auto-clear messages ───
    useEffect(() => {
        if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 4000); return () => clearTimeout(t); }
    }, [successMsg]);
    useEffect(() => {
        if (errorMsg) { const t = setTimeout(() => setErrorMsg(''), 5000); return () => clearTimeout(t); }
    }, [errorMsg]);
    useEffect(() => {
        if (pwSuccess) { const t = setTimeout(() => setPwSuccess(''), 4000); return () => clearTimeout(t); }
    }, [pwSuccess]);
    useEffect(() => {
        if (pwError) { const t = setTimeout(() => setPwError(''), 5000); return () => clearTimeout(t); }
    }, [pwError]);

    // ─── Change Password (API) ───
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPwError('');
        setPwSuccess('');

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPwError('All password fields are required.');
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            setPwError('New password must be at least 8 characters.');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPwError('New passwords do not match.');
            return;
        }

        setChangingPassword(true);
        try {
            await profileAPI.changePassword({
                current_password: passwordForm.currentPassword,
                new_password: passwordForm.newPassword,
                confirm_password: passwordForm.confirmPassword,
            });
            setPwSuccess('Password changed successfully!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPwError(err.response?.data?.error || 'Failed to change password.');
        } finally {
            setChangingPassword(false);
        }
    };

    // ─── Save Profile (API) ───
    const handleProfileSave = async () => {
        setErrorMsg('');
        setSuccessMsg('');
        setSaving(true);
        try {
            const response = await profileAPI.updateProfile({
                first_name: profileForm.firstName,
                last_name: profileForm.lastName,
                phone_number: profileForm.phone,
                address: profileForm.location,
                username: profileForm.firstName || profileForm.email.split('@')[0],
            });
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(response.data));
            setSuccessMsg('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const initials = (profileForm.firstName?.charAt(0) || '') +
        (profileForm.lastName?.charAt(0) || '') ||
        (profileForm.email?.charAt(0)?.toUpperCase() || 'A');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-brand" size={32} />
                <span className="ml-3 text-gray-500">Loading profile...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <h2 className="text-xl font-semibold text-brand-dark">About section</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* ╔═══════ LEFT COLUMN ═══════╗ */}
                <div className="lg:col-span-2 space-y-6">
                    {/* ─── Profile Card ─── */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6">
                            {/* Header actions */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-base font-semibold text-brand-dark">Profile</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-brand transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-brand transition-colors">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Avatar */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-2xl font-bold mb-4 ring-4 ring-brand-accent shadow-lg">
                                    {initials}
                                </div>

                                <h4 className="text-lg font-semibold text-brand-dark">
                                    {profileForm.firstName || profileForm.lastName
                                        ? `${profileForm.firstName} ${profileForm.lastName}`.trim()
                                        : 'Admin User'}
                                </h4>

                                {/* Email with copy */}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-500">{profileForm.email}</span>
                                    <button
                                        onClick={copyEmail}
                                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-brand transition-colors"
                                        title="Copy email"
                                    >
                                        {copied ? <Check size={14} className="text-functional-success" /> : <Copy size={14} />}
                                    </button>
                                </div>

                                {/* Social links placeholder */}
                                <p className="text-xs text-gray-400 mt-4">Linked with Social media</p>
                                <div className="flex items-center gap-2 mt-2">
                                    {['G', 'f', 'X'].map((s, i) => (
                                        <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50 text-xs text-gray-500">
                                            <span className="font-bold">{s}</span>
                                            <span className="text-brand text-[10px]">@Linked</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-brand hover:text-brand transition-colors">
                                    <span className="text-lg leading-none">+</span> Social media
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Change Password Card ─── */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-semibold text-brand-dark">Change Password</h3>
                            <a href="#" className="flex items-center gap-1 text-xs text-brand hover:underline">
                                Need help <HelpCircle size={12} />
                            </a>
                        </div>

                        {/* Password messages */}
                        {pwSuccess && (
                            <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                                <Check size={16} /> {pwSuccess}
                            </div>
                        )}
                        {pwError && (
                            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                <AlertCircle size={16} /> {pwError}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPw ? 'text' : 'password'}
                                        placeholder="Enter password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <a href="/forgot-password" className="text-xs text-brand hover:underline mt-1 inline-block">
                                    Forgot Current Password? Click here
                                </a>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPw ? 'text' : 'password'}
                                        placeholder="Enter password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPw(!showNewPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Re-enter Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPw ? 'text' : 'password'}
                                        placeholder="Enter password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="w-full py-3 bg-brand text-white rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {changingPassword && <Loader2 size={16} className="animate-spin" />}
                                {changingPassword ? 'Saving...' : 'Save Change'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ╔═══════ RIGHT COLUMN — Profile Update ═══════╗ */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-base font-semibold text-brand-dark">Profile Update</h3>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${isEditing
                                    ? 'border-brand text-brand bg-brand-accent/20'
                                    : 'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
                                    }`}
                            >
                                <Edit size={14} /> {isEditing ? 'Editing' : 'Edit'}
                            </button>
                        </div>

                        {/* Success / Error messages */}
                        {successMsg && (
                            <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                                <Check size={16} /> {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                <AlertCircle size={16} /> {errorMsg}
                            </div>
                        )}

                        {/* Avatar upload */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                                {initials}
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors flex items-center gap-1.5">
                                    <Upload size={14} /> Upload New
                                </button>
                                <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:border-red-300 hover:text-red-500 transition-colors flex items-center gap-1.5">
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                <input
                                    type="text"
                                    value={profileForm.firstName}
                                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="First name"
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                <input
                                    type="text"
                                    value={profileForm.lastName}
                                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="Last name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                                <input
                                    type="email"
                                    value={profileForm.email}
                                    disabled
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm opacity-60 cursor-not-allowed"
                                    placeholder="Email"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="Phone number"
                                />
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                                <input
                                    type="date"
                                    value={profileForm.dateOfBirth}
                                    onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Location — Full width */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                <input
                                    type="text"
                                    value={profileForm.location}
                                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="Address"
                                />
                            </div>

                            {/* Biography — Full width */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Biography</label>
                                <textarea
                                    rows={4}
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                                    placeholder="Enter a biography about you"
                                />
                            </div>
                        </div>

                        {/* Save button */}
                        {isEditing && (
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleProfileSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
