import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff, Building2, BarChart3, Rocket, Package } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';
import AuthField from '../../components/auth/AuthField';

const VendorLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authAPI.login(formData);
            const { access, refresh, user, role: backendRole } = response.data;
            const role = (backendRole || user?.role || 'customer').toUpperCase();

            localStorage.setItem('authToken', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', role);

            // Smart Redirection based on role
            const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN'].includes(role);
            const isVendor = ['VENDOR', 'SELLER'].includes(role);
            const isDelivery = role === 'DELIVERY';

            if (isAdmin) {
                navigate('/admin/dashboard');
            } else if (isVendor) {
                navigate('/vendor/dashboard');
            } else if (isDelivery) {
                navigate('/delivery/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Portal access failed. Please verify your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Vendor Portal</h2>
                <p className="mt-1 text-xs font-semibold text-gray-400 uppercase tracking-widest leading-relaxed">Sign in to your business dashboard</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 p-3.5">
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-tight">{error}</span>
                        </div>
                    )}

                    <AuthField
                        label="Email / Username"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="business@example.com"
                        icon={Mail}
                    />

                    <AuthField
                        label="Password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        icon={Lock}
                        passwordToggle
                        showPw={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                        forgotPasswordLink="/forgot-password"
                        forgotPasswordState={{ role: 'vendor' }}
                    />

                    <button type="submit" disabled={loading}
                        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? 'Authenticating...' : (
                            <>
                                <Store size={18} strokeWidth={2.5} />
                                <span>Sign In</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 flex flex-col gap-4">
                    <div className="relative flex items-center">
                        <div className="flex-1 border-t border-gray-100" />
                        <span className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">New Partner?</span>
                        <div className="flex-1 border-t border-gray-100" />
                    </div>
                    <Link to="/vendor/register" className="w-full flex justify-center items-center gap-2 py-3 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-gray-100 text-xs font-black text-gray-700 uppercase tracking-widest transition-all group">
                        <Store size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        Request Partner Account
                    </Link>
                    <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-30"><BarChart3 size={11} /><span className="text-[9px] font-black uppercase tracking-tight">Global Outreach</span></div>
                        <div className="flex items-center gap-1.5 opacity-30"><Rocket size={11} /><span className="text-[9px] font-black uppercase tracking-tight">Instant Scale</span></div>
                    </div>
                    <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-widest">Enterprise Grade Security | 4096-bit RSA</p>
                </div>
            </div>
        </div>
    );
};

export default VendorLogin;
