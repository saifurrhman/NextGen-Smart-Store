import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, AlertCircle, Eye, EyeOff, Sparkles, CheckCircle2, ShieldAlert, Fingerprint } from 'lucide-react';
import logoDark from '../../assets/Next Gen Smart Store (Dark ).png';
import { authAPI } from '../../services/api';
import AuthField from '../../components/auth/AuthField';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Verification failed. Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Security warning: Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            await authAPI.resetPassword({ email, new_password: password, confirm_password: confirmPassword });
            setDone(true);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Protocol failure. Reset could not be completed.');
        } finally {
            setLoading(false);
        }
    };

    const role = location.state?.role || 'customer';
    const loginLink = role === 'admin' ? '/admin/login' :
        role === 'vendor' ? '/vendor/login' :
            role === 'delivery' ? '/delivery/login' : '/customer/login';

    if (done) {
        return (
            <div className="w-full animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-8">
                        <img src={logoDark} alt="NextGen Logo" className="h-20 w-auto object-contain" />
                    </div>
                    <div className="inline-flex items-center gap-2 bg-emerald-600/5 px-4 py-1.5 rounded-full border border-emerald-600/10 mb-4">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Success</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight leading-none uppercase">Password Updated</h2>
                    <p className="mt-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center">Your account is now secure</p>
                </div>

                <div className="bg-white py-12 px-8 sm:px-12 shadow-2xl shadow-emerald-600/10 rounded-[3.5rem] border border-gray-100 relative overflow-hidden text-center">
                    <div className="flex justify-center mb-8">
                        <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center animate-bounce">
                            <ShieldAlert className="h-12 w-12 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest leading-relaxed mb-10">
                        Your password has been changed successfully. You can now log in with your new credentials.
                    </p>
                    <Link
                        to={loginLink}
                        className="w-full flex justify-center items-center gap-3 py-5 px-6 rounded-[2rem] shadow-xl shadow-emerald-600/20 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-8 focus:ring-emerald-600/10 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-[0.2em]"
                    >
                        Return to Login Portal
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight uppercase leading-none">New Password</h2>
                <p className="mt-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Set a strong password for your account</p>
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
                        label="New Password"
                        name="password"
                        required
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(''); }}
                        placeholder="8+ characters"
                        icon={Lock}
                        passwordToggle
                        showPw={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                    />

                    <AuthField
                        label="Confirm New Password"
                        name="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                        placeholder="Repeat new password"
                        icon={Lock}
                        passwordToggle
                        showPw={showConfirm}
                        onToggle={() => setShowConfirm(!showConfirm)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-emerald-500/20 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <div className="mt-8 space-y-6 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-[10px]">
                            <span className="px-5 bg-white text-gray-400 font-black uppercase tracking-[0.2em]">Security Status</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-30">
                            <Fingerprint size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Biometric Lock</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-30">
                            <ShieldAlert size={12} className="text-gray-900" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Hardware Vault</span>
                        </div>
                    </div>


                    <p className="text-center text-[8px] text-gray-300 font-black uppercase tracking-[0.3em] font-mono mt-8">
                        Operational Integrity Protocol | AES-256
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
