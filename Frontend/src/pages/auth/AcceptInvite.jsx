import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Check, Loader2, AlertCircle, Store, User } from 'lucide-react';
import { invitationsAPI } from '../../services/api';

const AcceptInvite = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [invite, setInvite] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [form, setForm] = useState({
        name: '',
        password: '',
        confirm_password: '',
    });

    useEffect(() => {
        verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            const res = await invitationsAPI.verify(token);
            setInvite(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid or expired invitation link.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.name.trim()) {
            setError('Please enter your full name.');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (form.password !== form.confirm_password) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await invitationsAPI.accept(token, {
                name: form.name,
                password: form.password,
                confirm_password: form.confirm_password,
            });
            // Store tokens and redirect to admin
            localStorage.setItem('authToken', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setSuccess(true);
            setTimeout(() => navigate('/admin/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to accept invitation.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="animate-spin text-brand mx-auto" size={40} />
                    <p className="mt-4 text-gray-500">Verifying invitation...</p>
                </div>
            </div>
        );
    }

    if (!invite && error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Invitation</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="px-6 py-2.5 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome Aboard!</h2>
                    <p className="text-gray-500 mb-2">
                        You've been added to the <strong>{invite.department_label}</strong> department.
                    </p>
                    <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Store className="text-brand" size={28} />
                        <span className="text-2xl font-bold text-brand-dark">
                            NextGen<span className="text-brand">Store</span>
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm">Admin Department Invitation</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand to-brand-dark p-6 text-center text-white">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
                            <Shield size={28} />
                        </div>
                        <h2 className="text-lg font-bold">You're Invited!</h2>
                        <p className="text-sm text-white/80 mt-1">
                            Join the <strong>{invite.department_label}</strong> department
                        </p>
                        <p className="text-xs text-white/60 mt-1">Invited by {invite.invited_by}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={invite.email}
                                disabled
                                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Set Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="Min 8 characters"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Re-enter password"
                                    value={form.confirm_password}
                                    onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:bg-white transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-brand text-white rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                            {submitting ? 'Setting up...' : 'Accept & Join'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AcceptInvite;
