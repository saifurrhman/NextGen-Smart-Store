import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Building2, ArrowRight, BarChart3, Rocket, User, Store, MapPin, Phone } from 'lucide-react';
import { authAPI } from '../../services/api';
import AuthField from '../../components/auth/AuthField';

const VendorRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        businessAddress: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ✅ FIXED: handleChange updates formData correctly
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (formData.password.length < 8) {
            setError('Security warning: Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            // ✅ FIXED: Use OTP flow like other register forms
            await authAPI.sendOTP({
                email: formData.email.trim().toLowerCase(),
                purpose: 'register',
            });
            navigate('/vendor/register/verify-otp', {
                state: {
                    email: formData.email.trim().toLowerCase(),
                    purpose: 'register',
                    role: 'vendor',
                    formData: {
                        username: formData.username,
                        email: formData.email.trim().toLowerCase(),
                        password: formData.password,
                        first_name: formData.businessName,
                        address: formData.businessAddress,
                        phone: formData.phone,
                        role: 'VENDOR',
                    },
                }
            });
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                err.response?.data?.email?.[0] ||
                'Onboarding failed. Please review your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Vendor Partner Join</h2>
                <p className="mt-1 text-xs font-semibold text-gray-400 uppercase tracking-widest leading-relaxed">Join our global retail partner network</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 p-3.5">
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-tight">{error}</span>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AuthField label="Username" name="username" placeholder="vendor_alias" icon={User} required value={formData.username} onChange={handleChange} />
                        <AuthField label="Business Email" name="email" type="email" placeholder="vendor@business.com" icon={Mail} required value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1">
                        <AuthField label="Business Name" name="businessName" placeholder="NextGen Retail Ltd." icon={Store} required value={formData.businessName} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AuthField label="Business Address" name="businessAddress" placeholder="City, Country" icon={MapPin} required value={formData.businessAddress} onChange={handleChange} />
                        <AuthField label="Phone Number" name="phone" placeholder="+123 4567 890" icon={Phone} required value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AuthField label="Password" name="password" placeholder="8+ characters" icon={Lock} required value={formData.password} onChange={handleChange}
                            passwordToggle showPw={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                        <AuthField label="Confirm Password" name="confirmPassword" placeholder="Repeat password" icon={Lock} required value={formData.confirmPassword} onChange={handleChange}
                            passwordToggle showPw={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? 'Processing...' : (
                            <>
                                <Store size={18} strokeWidth={2.5} />
                                <span>Register Account</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-5 flex flex-col gap-3">
                    <div className="relative flex items-center">
                        <div className="flex-1 border-t border-gray-100" />
                        <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Already A Partner?</span>
                        <div className="flex-1 border-t border-gray-100" />
                    </div>
                    <Link to="/vendor/login" className="w-full flex justify-center items-center gap-2 py-3 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-gray-100 text-xs font-black text-gray-700 uppercase tracking-widest transition-all group">
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        Operational Portal Login
                    </Link>
                    <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-30"><BarChart3 size={11} /><span className="text-[9px] font-black uppercase tracking-tight">Global Outreach</span></div>
                        <div className="flex items-center gap-1.5 opacity-30"><Rocket size={11} /><span className="text-[9px] font-black uppercase tracking-tight">Instant Scale</span></div>
                    </div>
                    <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-widest">Operational Readiness | Verified Partnership</p>
                </div>
            </div>
        </div>
    );
};

export default VendorRegister;
