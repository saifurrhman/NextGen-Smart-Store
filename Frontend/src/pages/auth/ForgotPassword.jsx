import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Mail, AlertCircle, Sparkles, ShieldQuestion, Fingerprint } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role || 'customer';

    const loginUrl = { admin: '/admin/login', seller: '/seller/login', customer: '/login' };
    const loginLink = loginUrl[role] || '/login';

    const roleBadgeMap = {
        admin: 'Secure Admin Recovery',
        seller: 'Partner Identity Restore',
        customer: 'Customer Access Recovery'
    };

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authAPI.sendOTP({ email: email.trim().toLowerCase(), purpose: 'password_reset' });
            navigate('/verify-otp', {
                state: { email: email.trim().toLowerCase(), purpose: 'password_reset', role }
            });
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                'Initialization failed. Identity could not be verified.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Recover Access</h2>
                <p className="mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Initialization of secure reset protocol</p>
            </div>

            {/* Main Card */}
            <div className="bg-white/80 backdrop-blur-xl py-7 px-8 sm:px-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2rem] border border-white/20 relative overflow-hidden group">

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-3xl bg-rose-50 p-5 border border-rose-100 flex items-center gap-4 animate-in shake duration-500">
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                            <span className="text-xs font-black text-rose-600 uppercase tracking-tight leading-relaxed">{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Verification Channel (Email)</label>
                        <div className="relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-300 group-focus-within/input:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type="email" required
                                value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                className="block w-full pl-14 pr-6 py-3.5 bg-gray-50 border border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-8 focus:ring-emerald-600/5 transition-all text-sm font-black placeholder-gray-300"
                                placeholder="IDENTIFIER@DOMAIN.COM"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] text-sm font-black text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest relative overflow-hidden group/btn"
                    >
                        {loading ? 'TRANSMITTING CODE...' : 'ISSUE RECOVERY TOKEN'}
                    </button>
                </form>

                <div className="mt-8 space-y-6 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-5 bg-white text-gray-400 font-black uppercase tracking-[0.2em]">Remembered?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to={loginLink} className="w-full inline-flex justify-center items-center gap-3 py-4.5 px-6 border border-gray-100 rounded-[2rem] bg-white text-[10px] font-black text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest group/reg">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Secure Login
                        </Link>
                    </div>


                    <div className="flex justify-center gap-6 mt-8">
                        <div className="flex items-center gap-1.5 opacity-30">
                            <Fingerprint size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Biometric Ready</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-30">
                            <ShieldQuestion size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Instant Identity</span>
                        </div>
                    </div>

                    <p className="text-center text-[8px] text-gray-300 font-black uppercase tracking-[0.3em] font-mono mt-8">
                        Recovery Protocol | 256-bit Secure
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
