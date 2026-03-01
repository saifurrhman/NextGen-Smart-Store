import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Lock, Mail, AlertCircle, Building2, Eye, EyeOff, ArrowRight, Zap, BarChart3, Rocket } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const VendorRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            await authAPI.register({
                ...formData,
                role: 'VENDOR'
            });
            navigate('/vendor/login', { state: { message: 'Operational Account Requested! Please log in to complete setup.' } });
        } catch (err) {
            setError(err.response?.data?.detail || "Onboarding failed. Please review your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Enterprise Join</h2>
                <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Connect your supply chain to the future</p>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-xl py-7 px-8 sm:px-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2rem] border border-white/20 relative overflow-hidden group">
                {/* No decorative inner div for cleaner look */}

                <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-3xl bg-rose-50 p-5 border border-rose-100 flex items-center gap-4 animate-in shake duration-500">
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                            <span className="text-xs font-black text-rose-600 uppercase tracking-tight leading-relaxed">{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Business Name</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Building2 className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                name="username" type="text" required
                                onChange={handleChange}
                                className="block w-full pl-14 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="BUSINESS ENTITY"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Official Email</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                name="email" type="email" required
                                onChange={handleChange}
                                className="block w-full pl-14 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="ENTITY@EMAIL.COM"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Secure Key</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                name="password" type={showPassword ? 'text' : 'password'} required
                                onChange={handleChange}
                                className="block w-full pl-14 pr-14 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-emerald-600 transition-colors">
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Verify Key</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                name="confirmPassword" type={showPassword ? 'text' : 'password'} required
                                onChange={handleChange}
                                className="block w-full pl-14 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest relative overflow-hidden group/btn"
                    >
                        {loading ? 'PROCESSING APPLICATION...' : 'REGISTER PARTNER ACCOUNT'}
                    </button>
                </form>

                <div className="mt-8 space-y-6 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-5 bg-white text-gray-400 font-black uppercase tracking-[0.2em]">Already A Partner?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to="/vendor/login" className="w-full inline-flex justify-center items-center gap-3 py-4.5 px-6 border border-gray-100 rounded-[2rem] bg-white text-[10px] font-black text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest group/reg">
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            Operational Portal Login
                        </Link>
                    </div>

                    <p className="text-center text-[8px] text-gray-300 font-black uppercase tracking-[0.3em] font-mono mt-8">
                        Operational Readiness | Verified Partnership
                    </p>

                    <div className="flex justify-center gap-6 mt-8">
                        <div className="flex items-center gap-1.5 opacity-30">
                            <BarChart3 size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Global Outreach</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-30">
                            <Rocket size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Instant Scale</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorRegister;
