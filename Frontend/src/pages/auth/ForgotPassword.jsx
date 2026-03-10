import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, AlertCircle, ArrowRight, ShieldCheck, Fingerprint, ShieldAlert, User, ArrowLeft, ShieldQuestion } from 'lucide-react';
import AuthField from '../../components/auth/AuthField';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = location.state || { role: 'customer' };

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loginLink = role === 'admin' ? '/admin/login' :
        role === 'vendor' ? '/vendor/login' :
            role === 'delivery' ? '/delivery/login' : '/customer/login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authAPI.forgotPassword({ email: email.trim().toLowerCase() });
            navigate('/verify-otp', {
                state: {
                    email: email.trim().toLowerCase(),
                    purpose: 'password_reset',
                    role: role
                }
            });
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Protocol failure. Verification signal could not be transmitted.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase leading-none">Reset Password</h2>
                <p className="mt-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center">We will send a code to your email</p>
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

                    <AuthField
                        label="Email Address"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        icon={Mail}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-500/20 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                    >
                        {loading ? 'Sending...' : 'Send Reset Code'}
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
                        <Link to={loginLink} className="w-full inline-flex justify-center items-center gap-3 py-3.5 px-6 border border-gray-100 rounded-[2rem] bg-white text-[10px] font-black text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest group/reg">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return to Secure Portal
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
